import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Product,
  ProductVariant,
  CartItem,
  Order,
  OrderItem,
  UserAccount,
  Coupon,
  CarouselSlide,
  StoreSettings,
  StockMovement,
  OrderStatus,
  PaymentMethodType,
  PaymentStatus,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialOrders,
  initialUsers,
  initialCoupons,
  initialSlides,
  initialStoreSettings,
  initialStockMovements,
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface StoreContextType {
  // Navigation & UI state
  activeTab: 'store' | 'admin' | 'checkout' | 'product-detail' | 'order-success';
  setActiveTab: (tab: 'store' | 'admin' | 'checkout' | 'product-detail' | 'order-success') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;

  // Products & Variants
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateVariantStock: (variantId: string, newStock: number, reason?: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  updateCartQuantity: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    division: string;
    district: string;
    notes?: string;
    payment_method: PaymentMethodType;
    sender_number?: string;
    transaction_id?: string;
    honeypot?: string;
  }) => { success: boolean; error?: string; order?: Order };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;

  // Users & Auth
  currentUser: UserAccount | null;
  users: UserAccount[];
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  register: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateUserRole: (userId: string, role: 'customer' | 'admin') => void;
  updateUserStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') => void;

  // Coupons
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usage_count'>) => void;
  deleteCoupon: (id: string) => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Carousel Slides
  slides: CarouselSlide[];
  updateSlide: (id: string, updates: Partial<CarouselSlide>) => void;
  addSlide: (slide: Omit<CarouselSlide, 'id'>) => void;
  deleteSlide: (id: string) => void;

  // Stock Movements
  stockMovements: StockMovement[];

  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  sortBy: 'latest' | 'price-low' | 'price-high' | 'popular';
  setSortBy: (sort: 'latest' | 'price-low' | 'price-high' | 'popular') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'store' | 'admin' | 'checkout' | 'product-detail' | 'order-success'>('store');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'price-low' | 'price-high' | 'popular'>('latest');

  // Core Data loaded from localStorage or seeded
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('stylenest_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('stylenest_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('stylenest_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('stylenest_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('stylenest_currentUser');
    return saved ? JSON.parse(saved) : initialUsers[2]; // Default to admin for full review capabilities
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('stylenest_cart');
    if (saved) return JSON.parse(saved);
    // Seed initial cart matching screenshot:
    // Floral Printed Kurti (M, Green, 1250), Casual Shirt (L, Beige, 1450), Wide Leg Pants (M, Black, 1800)
    return [
      {
        cart_id: 'var-kurti-m-green',
        product_id: 'prod-kurti',
        variant_id: 'var-kurti-m-green',
        product_name: 'Floral Printed Kurti',
        category_name: 'Women',
        size: 'M',
        color: 'Green',
        color_code: '#173B32',
        regular_price: 1650,
        price: 1250,
        image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        max_stock: 18,
      },
      {
        cart_id: 'var-shirt-l-beige',
        product_id: 'prod-casual-shirt',
        variant_id: 'var-shirt-l-beige',
        product_name: 'Casual Shirt',
        category_name: 'Men',
        size: 'L',
        color: 'Beige',
        color_code: '#D7C49C',
        regular_price: 1650,
        price: 1450,
        image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        max_stock: 5,
      },
      {
        cart_id: 'var-pants-m-black',
        product_id: 'prod-wide-leg-pants',
        variant_id: 'var-pants-m-black',
        product_name: 'Wide Leg Pants',
        category_name: 'Women',
        size: 'M',
        color: 'Black',
        color_code: '#292824',
        regular_price: 2100,
        price: 1800,
        image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        max_stock: 25,
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('stylenest_wishlist');
    return saved ? JSON.parse(saved) : ['prod-kurti', 'prod-casual-shirt'];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('stylenest_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    const saved = localStorage.getItem('stylenest_slides');
    return saved ? JSON.parse(saved) : initialSlides;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('stylenest_settings');
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('stylenest_stock_movements');
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('stylenest_categories', JSON.stringify(categories));
  }, [categories]);

  // Fetch from Supabase on mount if configured
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const loadSupabaseData = async () => {
      try {
        // 1. Categories
        const { data: catData, error: catErr } = await client
          .from('categories')
          .select('*')
          .order('order_index', { ascending: true });
        if (!catErr && catData && catData.length > 0) {
          setCategories(catData as any);
        }

        // 2. Products with variants
        const { data: prodData, error: prodErr } = await client
          .from('products')
          .select('*, product_variants(*)');
        if (!prodErr && prodData && prodData.length > 0) {
          const formattedProducts: Product[] = prodData.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            description: p.description,
            category_id: p.category_id,
            category_name:
              (catData || categories).find((c: any) => c.id === p.category_id)?.name || 'General',
            regular_price: Number(p.regular_price),
            sale_price: Number(p.sale_price),
            rating: Number(p.rating || 5.0),
            reviews_count: Number(p.reviews_count || 0),
            is_new: Boolean(p.is_new),
            is_featured: Boolean(p.is_featured),
            is_sale: Boolean(p.is_sale),
            is_published: Boolean(p.is_published),
            images: p.images || [],
            variants: (p.product_variants || []).map((v: any) => ({
              id: v.id,
              product_id: v.product_id,
              size: v.size,
              color: v.color,
              color_code: v.color_code || '#173B32',
              regular_price: Number(v.regular_price),
              sale_price: Number(v.sale_price),
              stock: Number(v.stock),
              sku: v.sku,
              image_url: v.image_url,
              is_active: Boolean(v.is_active),
            })),
            created_at: p.created_at,
          }));
          setProducts(formattedProducts);
        }

        // 3. Slides
        const { data: slideData, error: slideErr } = await client
          .from('carousel_slides')
          .select('*')
          .order('order_index', { ascending: true });
        if (!slideErr && slideData && slideData.length > 0) {
          setSlides(slideData as any);
        }

        // 4. Settings
        const { data: settingData, error: settingErr } = await client
          .from('store_settings')
          .select('*')
          .eq('id', 'primary')
          .maybeSingle();
        if (!settingErr && settingData) {
          setSettings(settingData as any);
        }

        // 5. Orders
        const { data: ordData, error: ordErr } = await client
          .from('orders')
          .select('*, order_items(*)');
        if (!ordErr && ordData && ordData.length > 0) {
          const formattedOrders: Order[] = ordData.map((o: any) => ({
            ...o,
            items: o.order_items || [],
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.warn('Supabase fetch notice, using fallback state:', err);
      }
    };

    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('stylenest_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stylenest_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('stylenest_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('stylenest_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('stylenest_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('stylenest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('stylenest_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('stylenest_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('stylenest_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('stylenest_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart operations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1): boolean => {
    if (!variant || variant.stock <= 0) {
      showToast('Selected variation is currently out of stock.');
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.variant_id === variant.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > variant.stock) {
          showToast(`Cannot add more. Available stock: ${variant.stock}`);
          return prev;
        }
        return prev.map((item) =>
          item.variant_id === variant.id ? { ...item, quantity: nextQty } : item
        );
      } else {
        const newItem: CartItem = {
          cart_id: variant.id,
          product_id: product.id,
          variant_id: variant.id,
          product_name: product.name,
          category_name: product.category_name,
          size: variant.size,
          color: variant.color,
          color_code: variant.color_code,
          regular_price: variant.regular_price,
          price: variant.sale_price,
          image_url: variant.image_url || product.images[0] || '',
          quantity,
          max_stock: variant.stock,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${product.name} (${variant.size}, ${variant.color}) to cart`);
    setIsCartOpen(true);
    return true;
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cart_id === cartId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > item.max_stock) {
              showToast(`Only ${item.max_stock} available in stock`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cart_id !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed item from your wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved item to your wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Category management
  const addCategory = (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast('Category created successfully.');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    showToast('Category updated.');
  };

  const deleteCategory = (id: string): boolean => {
    // Check if products exist in category
    const hasProducts = products.some((p) => p.category_id === id);
    if (hasProducts) {
      showToast('Cannot delete category: products are assigned to it.');
      return false;
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    showToast('Category deleted.');
    return true;
  };

  // Product management
  const addProduct = (productData: Omit<Product, 'id' | 'created_at'>) => {
    // Validate uniqueness of slug and name
    if (products.some((p) => p.name.toLowerCase() === productData.name.toLowerCase())) {
      showToast('A product with this name already exists.');
      return;
    }

    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast('Product added successfully.');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed.');
  };

  const updateVariantStock = (variantId: string, newStock: number, reason = 'manual_audit') => {
    if (newStock < 0) {
      showToast('Stock quantity cannot be negative.');
      return;
    }

    let updatedProdName = '';
    let updatedVariantSize = '';
    let updatedVariantColor = '';
    let prevStock = 0;
    let prodId = '';

    setProducts((prev) =>
      prev.map((prod) => {
        const variantIndex = prod.variants.findIndex((v) => v.id === variantId);
        if (variantIndex !== -1) {
          prodId = prod.id;
          updatedProdName = prod.name;
          const targetVariant = prod.variants[variantIndex];
          prevStock = targetVariant.stock;
          updatedVariantSize = targetVariant.size;
          updatedVariantColor = targetVariant.color;

          const updatedVariants = [...prod.variants];
          updatedVariants[variantIndex] = {
            ...targetVariant,
            stock: newStock,
          };
          return {
            ...prod,
            variants: updatedVariants,
          };
        }
        return prod;
      })
    );

    // Record stock movement
    const movement: StockMovement = {
      id: `sm-${Date.now()}`,
      product_id: prodId,
      product_name: updatedProdName,
      size: updatedVariantSize,
      color: updatedVariantColor,
      previous_stock: prevStock,
      new_stock: newStock,
      change: newStock - prevStock,
      reason: reason as any,
      admin_name: currentUser?.name || 'Admin',
      created_at: new Date().toISOString(),
    };
    setStockMovements((prev) => [movement, ...prev]);
    const client = supabase;
    if (isSupabaseConfigured && client) {
      void client.from('product_variants').update({ stock: newStock }).eq('id', variantId);
    }
    showToast(`Stock updated to ${newStock}`);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.is_active);
    if (!found) {
      return { success: false, message: 'Invalid or inactive promo code.' };
    }
    if (cartSubtotal < found.min_spend) {
      return {
        success: false,
        message: `Minimum order of ৳ ${found.min_spend} required for code ${found.code}.`,
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usage_count'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cp-${Date.now()}`,
      usage_count: 0,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    showToast('Coupon created.');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon deleted.');
  };

  // Orders & Anti-fake check
  const placeOrder = (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    division: string;
    district: string;
    notes?: string;
    payment_method: PaymentMethodType;
    sender_number?: string;
    transaction_id?: string;
    honeypot?: string;
  }): { success: boolean; error?: string; order?: Order } => {
    // 1. Honeypot anti-bot check
    if (orderData.honeypot && orderData.honeypot.trim() !== '') {
      console.warn('Bot detected via honeypot input.');
      return { success: false, error: 'Submission rejected.' };
    }

    // 2. Validate Bangladesh phone number
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    const phoneClean = orderData.customer_phone.replace(/[\s-]/g, '');
    if (!bdPhoneRegex.test(phoneClean)) {
      return {
        success: false,
        error: 'Please enter a valid Bangladesh phone number (e.g. 017XXXXXXXX).',
      };
    }

    // 3. Validate name and address
    if (!orderData.customer_name || orderData.customer_name.trim().length < 3) {
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!orderData.delivery_address || orderData.delivery_address.trim().length < 10) {
      return {
        success: false,
        error: 'Please enter a detailed delivery address (House/Road/Area).',
      };
    }

    // 4. Validate cart not empty
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    // 5. Stock validation & duplicate variant checks
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.product_id);
      const variant = prod?.variants.find((v) => v.id === item.variant_id);
      if (!variant) {
        return { success: false, error: `Product variant not found for ${item.product_name}.` };
      }
      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.product_name} (${item.size}, ${item.color}). Only ${variant.stock} left.`,
        };
      }
    }

    // 6. Manual payment validation
    if (orderData.payment_method !== 'cod') {
      if (!orderData.sender_number || !orderData.transaction_id) {
        return {
          success: false,
          error: `Please provide both sender number and transaction reference for ${orderData.payment_method.toUpperCase()}.`,
        };
      }
    }

    // 7. Anti-fake order risk evaluation
    let isFlagged = false;
    const fakeReasons: string[] = [];

    // Check recent duplicate orders with same phone within last 10 minutes
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentDuplicate = orders.find(
      (o) =>
        o.customer_phone.replace(/[\s-]/g, '') === phoneClean &&
        new Date(o.created_at).getTime() > tenMinutesAgo
    );
    if (recentDuplicate) {
      isFlagged = true;
      fakeReasons.push('Rapid multiple orders from same phone within 10 minutes');
    }

    // Suspiciously high quantity
    if (cartCount > 15) {
      isFlagged = true;
      fakeReasons.push('Unusually high item quantity');
    }

    // Calculate shipping fee
    const isInsideDhaka =
      orderData.division.toLowerCase().includes('dhaka') &&
      orderData.district.toLowerCase().includes('dhaka');
    const standardFee = isInsideDhaka
      ? settings.inside_dhaka_shipping
      : settings.outside_dhaka_shipping;
    const finalShippingFee = cartSubtotal >= settings.free_shipping_threshold ? 0 : standardFee;

    // Calculate discount
    let discountAmount = 0;
    if (activeCoupon) {
      if (activeCoupon.discount_type === 'percentage') {
        discountAmount = Math.round((cartSubtotal * activeCoupon.discount_value) / 100);
      } else {
        discountAmount = activeCoupon.discount_value;
      }
    }

    const total = cartSubtotal - discountAmount + finalShippingFee;
    const nextOrderNum = `#${1000 + orders.length + 1}`;
    const orderId = `ord-${Date.now()}`;

    const orderItems: OrderItem[] = cart.map((item, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    }));

    const newOrder: Order = {
      id: orderId,
      order_number: nextOrderNum,
      customer_id: currentUser?.id,
      customer_name: orderData.customer_name.trim(),
      customer_email: orderData.customer_email.trim(),
      customer_phone: phoneClean,
      delivery_address: orderData.delivery_address.trim(),
      division: orderData.division,
      district: orderData.district,
      notes: orderData.notes?.trim(),
      shipping_fee: finalShippingFee,
      subtotal: cartSubtotal,
      discount: discountAmount,
      total,
      payment_method: orderData.payment_method,
      payment_status: 'pending',
      order_status: 'Pending',
      sender_number: orderData.sender_number,
      transaction_id: orderData.transaction_id,
      is_flagged_fake: isFlagged,
      fake_risk_reasons: fakeReasons,
      items: orderItems,
      created_at: new Date().toISOString(),
    };

    // 8. Decrement stock atomically
    setProducts((prev) =>
      prev.map((prod) => {
        let changed = false;
        const updatedVariants = prod.variants.map((v) => {
          const cartItem = cart.find((ci) => ci.variant_id === v.id);
          if (cartItem) {
            changed = true;
            return {
              ...v,
              stock: Math.max(0, v.stock - cartItem.quantity),
            };
          }
          return v;
        });
        return changed ? { ...prod, variants: updatedVariants } : prod;
      })
    );

    // Record stock movements
    cart.forEach((item) => {
      const movement: StockMovement = {
        id: `sm-${Date.now()}-${item.variant_id}`,
        product_id: item.product_id,
        product_name: item.product_name,
        size: item.size,
        color: item.color,
        previous_stock: item.max_stock,
        new_stock: Math.max(0, item.max_stock - item.quantity),
        change: -item.quantity,
        reason: 'sale',
        admin_name: `System (Order ${nextOrderNum})`,
        created_at: new Date().toISOString(),
      };
      setStockMovements((prev) => [movement, ...prev]);
    });

    // Save order locally
    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);

    // Sync order to Supabase if configured
    const client = supabase;
    if (isSupabaseConfigured && client) {
      void (async () => {
        try {
          await client.from('orders').insert({
            id: newOrder.id,
            order_number: newOrder.order_number,
            customer_name: newOrder.customer_name,
            customer_email: newOrder.customer_email,
            customer_phone: newOrder.customer_phone,
            delivery_address: newOrder.delivery_address,
            division: newOrder.division,
            district: newOrder.district,
            notes: newOrder.notes,
            shipping_fee: newOrder.shipping_fee,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            total: newOrder.total,
            payment_method: newOrder.payment_method,
            payment_status: newOrder.payment_status,
            order_status: newOrder.order_status,
            sender_number: newOrder.sender_number,
            transaction_id: newOrder.transaction_id,
            is_flagged_fake: newOrder.is_flagged_fake,
            fake_risk_reasons: newOrder.fake_risk_reasons,
          });

          await client.from('order_items').insert(
            orderItems.map((oi) => ({
              id: oi.id,
              order_id: oi.order_id,
              product_id: oi.product_id,
              variant_id: oi.variant_id,
              product_name: oi.product_name,
              size: oi.size,
              color: oi.color,
              price: oi.price,
              quantity: oi.quantity,
              image_url: oi.image_url,
            }))
          );
        } catch (err) {
          console.error('Failed to sync order to Supabase:', err);
        }
      })();
    }
    clearCart();
    setActiveCoupon(null);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#173B32', '#C9684B', '#FAF5ED', '#D7C49C'],
      });
    } catch (e) {
      // Confetti fallback
    }

    setActiveTab('order-success');
    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o))
    );
    const client = supabase;
    if (isSupabaseConfigured && client) {
      void client.from('orders').update({ order_status: status }).eq('id', orderId);
    }
    showToast(`Order status updated to ${status}`);
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payment_status: status, updated_at: new Date().toISOString() } : o))
    );
    const client = supabase;
    if (isSupabaseConfigured && client) {
      void client.from('orders').update({ payment_status: status }).eq('id', orderId);
    }
    showToast(`Payment status updated to ${status}`);
  };

  // Auth & User Management
  const login = (email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.name}!`);
      setIsAuthModalOpen(false);
      return true;
    }

    // Auto-create customer profile if first time
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email.toLowerCase(),
      role,
      status: 'active',
      orders_count: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created. Welcome, ${newUser.name}!`);
    setIsAuthModalOpen(false);
    return true;
  };

  const register = (name: string, email: string, phone: string): boolean => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      showToast('An account with this email already exists.');
      return false;
    }
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'customer',
      status: 'active',
      orders_count: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to StyleNest, ${newUser.name}!`);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.');
    if (activeTab === 'admin') {
      setActiveTab('store');
    }
  };

  const updateUserRole = (userId: string, role: 'customer' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    showToast(`User role updated to ${role}`);
  };

  const updateUserStatus = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    showToast(`User status updated to ${status}`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved successfully.');
  };

  // Slides
  const updateSlide = (id: string, updates: Partial<CarouselSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Banner slide updated.');
  };

  const addSlide = (slideData: Omit<CarouselSlide, 'id'>) => {
    const newSlide: CarouselSlide = {
      ...slideData,
      id: `slide-${Date.now()}`,
    };
    setSlides((prev) => [...prev, newSlide]);
    showToast('Banner slide added.');
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    showToast('Slide removed.');
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        lastCompletedOrder,
        setLastCompletedOrder,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toastMessage,
        showToast,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateVariantStock,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,

        wishlist,
        toggleWishlist,
        isWishlisted,

        orders,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,

        currentUser,
        users,
        login,
        register,
        logout,
        updateUserRole,
        updateUserStatus,

        coupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,

        settings,
        updateSettings,

        slides,
        updateSlide,
        addSlide,
        deleteSlide,

        stockMovements,

        searchQuery,
        setSearchQuery,
        selectedCategorySlug,
        setSelectedCategorySlug,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
