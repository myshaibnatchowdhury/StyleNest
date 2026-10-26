export type Role = 'customer' | 'admin';
export type AccountStatus = 'active' | 'inactive' | 'suspended';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethodType = 'cod' | 'bkash' | 'nagad' | 'rocket';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  product_count: number;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string; // 'S', 'M', 'L', 'XL', 'Free Size'
  color: string; // 'Green', 'Beige', 'Black', 'Mint', 'Maroon'
  color_code?: string; // hex code for swatch
  regular_price: number;
  sale_price: number;
  stock: number;
  sku: string;
  image_url?: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category_id: string;
  category_name: string;
  regular_price: number;
  sale_price: number;
  rating: number;
  reviews_count: number;
  is_new: boolean;
  is_featured: boolean;
  is_sale: boolean;
  is_published: boolean;
  images: string[];
  variants: ProductVariant[];
  created_at: string;
}

export interface CartItem {
  cart_id: string; // variant_id
  product_id: string;
  variant_id: string;
  product_name: string;
  category_name: string;
  size: string;
  color: string;
  color_code?: string;
  regular_price: number;
  price: number;
  image_url: string;
  quantity: number;
  max_stock: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. #1001
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  division: string;
  district: string;
  notes?: string;
  shipping_fee: number;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: PaymentMethodType;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  sender_number?: string;
  transaction_id?: string;
  is_flagged_fake?: boolean;
  fake_risk_reasons?: string[];
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: AccountStatus;
  orders_count: number;
  total_spent: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend: number;
  is_active: boolean;
  expiry_date: string;
  usage_count: number;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  announcement_bar_text: string;
  announcement_bar_active: boolean;
  phone: string;
  email: string;
  address: string;
  free_shipping_threshold: number;
  inside_dhaka_shipping: number;
  outside_dhaka_shipping: number;
  
  // Payment methods
  cod_active: boolean;
  
  bkash_active: boolean;
  bkash_number: string;
  bkash_type: 'Merchant' | 'Personal';
  bkash_instructions: string;
  
  nagad_active: boolean;
  nagad_number: string;
  nagad_type: 'Merchant' | 'Personal';
  nagad_instructions: string;
  
  rocket_active: boolean;
  rocket_number: string;
  rocket_type: 'Merchant' | 'Personal';
  rocket_instructions: string;

  // Socials
  facebook_url: string;
  instagram_url: string;
  pinterest_url: string;
  youtube_url: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  previous_stock: number;
  new_stock: number;
  change: number;
  reason: 'restock' | 'sale' | 'return' | 'manual_audit' | 'damage';
  admin_name: string;
  created_at: string;
}
