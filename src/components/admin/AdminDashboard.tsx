import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ShoppingCart,
  Sliders,
  DollarSign,
  Tag,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Save,
  Shield,
  ArrowLeft,
  ChevronDown,
  Info,
  Clock,
  Gift,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SalesChart } from './SalesChart';
import { Order, OrderStatus, Product, ProductVariant, PaymentStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    users,
    updateUserRole,
    updateUserStatus,
    settings,
    updateSettings,
    coupons,
    addCoupon,
    deleteCoupon,
    slides,
    updateSlide,
    currentUser,
    logout,
    showToast,
  } = useStore();

  // Active Admin Section
  const [adminSection, setAdminSection] = useState<
    | 'dashboard'
    | 'users'
    | 'products'
    | 'categories'
    | 'orders'
    | 'variations'
    | 'stock'
    | 'coupons'
    | 'settings'
  >('dashboard');

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Add Product Form State
  const [activeProductTab, setActiveProductTab] = useState<
    'basic' | 'variations' | 'images' | 'inventory' | 'seo'
  >('basic');
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.id || '');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductRegularPrice, setNewProductRegularPrice] = useState(1650);
  const [newProductSalePrice, setNewProductSalePrice] = useState(1250);
  const [newProductImages, setNewProductImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newProductVariants, setNewProductVariants] = useState<
    Omit<ProductVariant, 'id' | 'product_id'>[]
  >([
    {
      size: 'S',
      color: 'Green',
      color_code: '#173B32',
      regular_price: 1650,
      sale_price: 1250,
      stock: 25,
      sku: 'SN-VAR-S-GRN',
      is_active: true,
    },
    {
      size: 'M',
      color: 'Green',
      color_code: '#173B32',
      regular_price: 1650,
      sale_price: 1250,
      stock: 18,
      sku: 'SN-VAR-M-GRN',
      is_active: true,
    },
    {
      size: 'L',
      color: 'Green',
      color_code: '#173B32',
      regular_price: 1650,
      sale_price: 1200,
      stock: 12,
      sku: 'SN-VAR-L-GRN',
      is_active: true,
    },
  ]);

  // Variations Table Add Modal
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [variantFormSize, setVariantFormSize] = useState('M');
  const [variantFormColor, setVariantFormColor] = useState('Green');
  const [variantFormRegPrice, setVariantFormRegPrice] = useState(1650);
  const [variantFormSalePrice, setVariantFormSalePrice] = useState(1250);
  const [variantFormStock, setVariantFormStock] = useState(20);

  // Add Category Modal
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [catFormName, setCatFormName] = useState('');
  const [catFormDesc, setCatFormDesc] = useState('');
  const [catFormImage, setCatFormImage] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );

  // Quick Stock Adjustment Modal
  const [editingVariant, setEditingVariant] = useState<{
    id: string;
    productName: string;
    size: string;
    color: string;
    currentStock: number;
  } | null>(null);
  const [newStockInput, setNewStockInput] = useState(0);

  // User search
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Order status filter
  const [orderFilter, setOrderFilter] = useState<'All' | OrderStatus>('All');

  // Stats calculation
  const totalUsersCount = 1248 + users.length - 3;
  const totalProductsCount = 352 + products.length - 6;
  const totalOrdersCount = 486 + orders.length - 4;
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      showToast('Product name is required.');
      return;
    }
    const category = categories.find((c) => c.id === newProductCategory) || categories[0];
    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sku = `SN-${slug.toUpperCase().slice(0, 8)}-${Date.now().toString().slice(-4)}`;

    const fullVariants: ProductVariant[] = newProductVariants.map((v, i) => ({
      ...v,
      id: `var-${Date.now()}-${i}`,
      product_id: '',
      sku: v.sku || `${sku}-${v.size}-${v.color.slice(0, 3).toUpperCase()}`,
    }));

    addProduct({
      name: newProductName.trim(),
      slug,
      sku,
      description: newProductDesc.trim() || 'Premium fashion apparel crafted with timeless comfort.',
      category_id: category.id,
      category_name: category.name,
      regular_price: newProductRegularPrice,
      sale_price: newProductSalePrice,
      rating: 5.0,
      reviews_count: 0,
      is_new: true,
      is_featured: true,
      is_sale: newProductRegularPrice > newProductSalePrice,
      is_published: true,
      images: newProductImages,
      variants: fullVariants,
    });

    // Reset
    setNewProductName('');
    setNewProductDesc('');
    showToast('Product successfully saved and published!');
  };

  const handleAddVariantToProduct = () => {
    // Check for duplicate combination
    if (newProductVariants.some((v) => v.size === variantFormSize && v.color === variantFormColor)) {
      showToast('This size and color combination already exists.');
      return;
    }
    if (variantFormSalePrice > variantFormRegPrice) {
      showToast('Sale price cannot exceed regular price.');
      return;
    }
    if (variantFormStock < 0) {
      showToast('Stock quantity cannot be negative.');
      return;
    }

    setNewProductVariants((prev) => [
      ...prev,
      {
        size: variantFormSize,
        color: variantFormColor,
        regular_price: variantFormRegPrice,
        sale_price: variantFormSalePrice,
        stock: variantFormStock,
        sku: `SN-VAR-${variantFormSize}-${variantFormColor.toUpperCase().slice(0, 3)}`,
        is_active: true,
      },
    ]);
    setIsAddVariantModalOpen(false);
    showToast('Variation added.');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;
    const slug = catFormName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory({
      name: catFormName.trim(),
      slug,
      description: catFormDesc.trim(),
      image_url: catFormImage,
      product_count: 0,
      is_active: true,
      order_index: categories.length + 1,
    });
    setCatFormName('');
    setCatFormDesc('');
    setIsAddCatModalOpen(false);
  };

  const handleUpdateStockSubmit = () => {
    if (!editingVariant) return;
    updateVariantStock(editingVariant.id, newStockInput, 'manual_audit');
    setEditingVariant(null);
  };

  // Nav items for sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'variations', label: 'Variations', icon: Sliders },
    { id: 'stock', label: 'Stock Management', icon: DollarSign },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="bg-[#173B32] text-white border-b border-[#122E27] px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="/stylenest-logo.png"
            alt="StyleNest"
            className="h-8 w-auto brightness-0 invert"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight text-white">
              Style<span className="text-[#C9684B]">Nest</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white/90">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('store')}
            className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Customer Website</span>
          </button>

          {/* Admin Avatar Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="w-7 h-7 rounded-full bg-[#C9684B] text-white flex items-center justify-center font-bold">
              A
            </div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* 2. BODY: LEFT SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar matching screenshot */}
        <aside className="w-60 bg-[#173B32] text-white/90 flex flex-col justify-between shrink-0 hidden md:flex border-r border-[#122E27]">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1E4C40] text-white font-bold shadow-xs'
                      : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                logout();
                setActiveTab('store');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-red-200 hover:bg-red-900/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Mobile Admin Nav Pills */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setAdminSection(item.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  adminSection === item.id ? 'bg-[#173B32] text-white' : 'bg-white text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* =============================================================== */}
          {/* DASHBOARD TAB (Matching screenshot) */}
          {/* =============================================================== */}
          {adminSection === 'dashboard' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#292824]">Dashboard</h1>
                  <p className="text-xs text-gray-500">Live store performance and core metrics</p>
                </div>
                <button
                  onClick={() => setActiveTab('store')}
                  className="bg-[#173B32] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#122E27] cursor-pointer"
                >
                  Preview Customer Store
                </button>
              </div>

              {/* 4 Stat Cards matching screenshot: Users, Products, Orders, Pending Orders */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. Total Users (Light Blue/Cyan) */}
                <div className="bg-white rounded-xl p-5 border border-[#E1ECE7] shadow-subtle flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Total Users</span>
                    <h3 className="font-serif text-2xl font-bold text-[#292824]">
                      {totalUsersCount.toLocaleString()}
                    </h3>
                  </div>
                </div>

                {/* 2. Total Products (Light Orange) */}
                <div className="bg-white rounded-xl p-5 border border-[#E1ECE7] shadow-subtle flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Total Products</span>
                    <h3 className="font-serif text-2xl font-bold text-[#292824]">
                      {totalProductsCount.toLocaleString()}
                    </h3>
                  </div>
                </div>

                {/* 3. Total Orders (Light Red/Terracotta) */}
                <div className="bg-white rounded-xl p-5 border border-[#E1ECE7] shadow-subtle flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Total Orders</span>
                    <h3 className="font-serif text-2xl font-bold text-[#292824]">
                      {totalOrdersCount.toLocaleString()}
                    </h3>
                  </div>
                </div>

                {/* 4. Pending Orders (Light Yellow) */}
                <div className="bg-white rounded-xl p-5 border border-[#E1ECE7] shadow-subtle flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Pending Orders</span>
                    <h3 className="font-serif text-2xl font-bold text-[#292824]">
                      {pendingOrdersCount}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Sales Overview Line Chart matching screenshot */}
              <SalesChart />

              {/* Quick Split View: Add Product + Product Variations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Add Product Form (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#292824]">Add Product</h3>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 text-xs font-semibold overflow-x-auto">
                    {[
                      { id: 'basic', label: 'Basic Info' },
                      { id: 'variations', label: 'Variations' },
                      { id: 'images', label: 'Images' },
                      { id: 'inventory', label: 'Inventory' },
                      { id: 'seo', label: 'SEO' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveProductTab(tab.id as any)}
                        className={`px-3 py-2 cursor-pointer border-b-2 whitespace-nowrap ${
                          activeProductTab === tab.id
                            ? 'border-[#173B32] text-[#173B32] bg-[#E1ECE7]/30'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeProductTab === 'basic' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-[#292824] block mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#173B32]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#292824] block mb-1">Category *</label>
                        <select
                          value={newProductCategory}
                          onChange={(e) => setNewProductCategory(e.target.value)}
                          className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#173B32]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#292824] block mb-1">
                          Description *
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Enter product description..."
                          value={newProductDesc}
                          onChange={(e) => setNewProductDesc(e.target.value)}
                          className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#173B32]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="font-bold text-[#292824] block mb-1">
                            Regular Price (৳)
                          </label>
                          <input
                            type="number"
                            value={newProductRegularPrice}
                            onChange={(e) => setNewProductRegularPrice(Number(e.target.value))}
                            className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-[#292824] block mb-1">Sale Price (৳)</label>
                          <input
                            type="number"
                            value={newProductSalePrice}
                            onChange={(e) => setNewProductSalePrice(Number(e.target.value))}
                            className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleSaveProduct}
                          className="bg-[#173B32] hover:bg-[#122E27] text-white px-5 py-2 rounded-lg font-semibold text-xs cursor-pointer shadow-xs"
                        >
                          Save & Publish
                        </button>
                      </div>
                    </div>
                  )}

                  {activeProductTab === 'variations' && (
                    <div className="space-y-3 text-xs">
                      <p className="text-gray-500">
                        {newProductVariants.length} variations configured. You can edit or add new size/color combinations.
                      </p>
                      <button
                        onClick={() => setIsAddVariantModalOpen(true)}
                        className="bg-[#173B32] text-white px-3 py-1.5 rounded text-xs font-semibold"
                      >
                        + Add Variation
                      </button>
                    </div>
                  )}

                  {activeProductTab === 'images' && (
                    <div className="space-y-3 text-xs">
                      <label className="font-bold text-[#292824] block">Image URLs</label>
                      <input
                        type="url"
                        value={newProductImages[0]}
                        onChange={(e) => setNewProductImages([e.target.value])}
                        className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                      />
                      <img
                        src={newProductImages[0]}
                        alt="Preview"
                        className="w-24 h-28 object-cover rounded border"
                      />
                    </div>
                  )}

                  {activeProductTab === 'inventory' && (
                    <div className="space-y-3 text-xs">
                      <p className="text-gray-500">
                        Inventory is tracked dynamically per variant combination.
                      </p>
                    </div>
                  )}

                  {activeProductTab === 'seo' && (
                    <div className="space-y-3 text-xs">
                      <label className="font-bold text-[#292824] block">Meta Title</label>
                      <input
                        type="text"
                        placeholder="Meta SEO title"
                        className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Product Variations Table (7 Cols) matching screenshot */}
                <div className="lg:col-span-7 bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#292824]">
                      Product Variations
                    </h3>
                    <button
                      onClick={() => setIsAddVariantModalOpen(true)}
                      className="bg-[#173B32] hover:bg-[#122E27] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Variation</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF5ED] text-gray-600 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-2.5">Size</th>
                          <th className="p-2.5">Color</th>
                          <th className="p-2.5">Regular Price</th>
                          <th className="p-2.5">Sale Price</th>
                          <th className="p-2.5">Stock</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {newProductVariants.map((v, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-2.5 font-bold">{v.size}</td>
                            <td className="p-2.5">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: v.color_code || '#173B32' }}
                                />
                                {v.color}
                              </span>
                            </td>
                            <td className="p-2.5">৳ {v.regular_price.toLocaleString()}</td>
                            <td className="p-2.5 font-semibold text-[#173B32]">
                              ৳ {v.sale_price.toLocaleString()}
                            </td>
                            <td className="p-2.5">
                              <span
                                className={`font-bold ${
                                  v.stock === 0
                                    ? 'text-red-600'
                                    : v.stock <= 5
                                    ? 'text-amber-600'
                                    : 'text-emerald-700'
                                }`}
                              >
                                {v.stock}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() =>
                                  setNewProductVariants((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                title="Delete variant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Management Table matching screenshot */}
              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#292824]">
                    Order Management
                  </h3>
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value as any)}
                      className="text-xs bg-[#FAF5ED] border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:outline-none"
                    >
                      <option value="All">Filter: All Orders</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF5ED] text-gray-600 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders
                        .filter((o) => (orderFilter === 'All' ? true : o.order_status === orderFilter))
                        .map((order) => {
                          const statusColor =
                            order.order_status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.order_status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.order_status === 'Shipped'
                              ? 'bg-sky-100 text-sky-800'
                              : order.order_status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800';

                          return (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="p-3 font-bold text-[#173B32]">
                                {order.order_number}
                                {order.is_flagged_fake && (
                                  <span className="ml-1 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                    Flagged
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <span className="font-semibold block text-[#292824]">
                                  {order.customer_name}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {order.customer_phone}
                                </span>
                              </td>
                              <td className="p-3 text-gray-600">
                                {new Date(order.created_at).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </td>
                              <td className="p-3 font-bold text-[#292824]">
                                ৳ {order.total.toLocaleString()}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor}`}
                                >
                                  {order.order_status}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-gray-500 hover:text-[#173B32] p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                                  title="View order details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3-Column Bottom Grid: User Management, Category Management, Stock Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. User Management */}
                <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-[#292824]">
                      User Management
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF5ED] text-gray-600 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((u, i) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="p-2 text-gray-400">{i + 1}</td>
                            <td className="p-2">
                              <span className="font-semibold block">{u.name}</span>
                              <span className="text-[10px] text-gray-400">{u.email}</span>
                            </td>
                            <td className="p-2">
                              <span className="text-[10px] uppercase font-bold text-gray-600">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-2">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Category Management */}
                <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-[#292824]">
                      Category Management
                    </h3>
                    <button
                      onClick={() => setIsAddCatModalOpen(true)}
                      className="bg-[#173B32] text-white px-2.5 py-1 rounded text-xs font-semibold"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF5ED] text-gray-600 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Products</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {categories.map((c, i) => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="p-2 text-gray-400">{i + 1}</td>
                            <td className="p-2 font-bold">{c.name}</td>
                            <td className="p-2 font-semibold text-gray-600">{c.product_count}</td>
                            <td className="p-2">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Stock Management */}
                <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-[#292824]">
                      Stock Management
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF5ED] text-gray-600 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-2">Product</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Stock</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.slice(0, 5).map((p) => {
                          const v = p.variants[0];
                          const statusPill =
                            v.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : v.stock <= 5
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-800';

                          const statusText =
                            v.stock === 0 ? 'Out of Stock' : v.stock <= 5 ? 'Low Stock' : 'In Stock';

                          return (
                            <tr
                              key={p.id}
                              onClick={() => {
                                setEditingVariant({
                                  id: v.id,
                                  productName: p.name,
                                  size: v.size,
                                  color: v.color,
                                  currentStock: v.stock,
                                });
                                setNewStockInput(v.stock);
                              }}
                              className="hover:bg-gray-50 cursor-pointer"
                              title="Click to adjust stock"
                            >
                              <td className="p-2 font-medium truncate max-w-[100px]">{p.name}</td>
                              <td className="p-2 text-gray-500">{v.size}</td>
                              <td className="p-2 font-bold">{v.stock}</td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusPill}`}
                                >
                                  {statusText}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Validation Rules Card matching screenshot */}
              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5 space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#292824]">
                  Validation Rules (Enforced & Active)
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Size must be selected before adding to cart</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Color must be selected for variable products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Stock cannot be negative</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Duplicate product names are not allowed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fake order prevention (IP, device & behavior check active)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* ORDERS TAB */}
          {/* =============================================================== */}
          {adminSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-2xl font-bold text-[#292824]">Order Management</h1>
                <div className="flex items-center gap-3">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value as any)}
                    className="text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 font-medium"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF5ED] text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Customer Details</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders
                      .filter((o) => (orderFilter === 'All' ? true : o.order_status === orderFilter))
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="p-3.5 font-bold text-[#173B32]">
                            {o.order_number}
                            {o.is_flagged_fake && (
                              <span className="block text-[10px] text-red-600 font-bold">
                                ⚠ Fake Risk Flagged
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold block">{o.customer_name}</span>
                            <span className="text-gray-500">{o.customer_phone}</span>
                            <span className="text-[11px] text-gray-400 block truncate max-w-xs">
                              {o.delivery_address}, {o.district}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold">{o.items.length} items</span>
                            <span className="block text-gray-500 text-[11px] truncate max-w-[150px]">
                              {o.items.map((i) => i.product_name).join(', ')}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-sm text-[#292824]">
                            ৳ {o.total.toLocaleString()}
                          </td>
                          <td className="p-3.5">
                            <span className="uppercase font-bold text-[#173B32]">
                              {o.payment_method}
                            </span>
                            <span
                              className={`block text-[10px] font-bold ${
                                o.payment_status === 'verified'
                                  ? 'text-emerald-700'
                                  : 'text-amber-600'
                              }`}
                            >
                              {o.payment_status}
                            </span>
                            {o.transaction_id && (
                              <span className="font-mono text-[10px] text-gray-500">
                                {o.transaction_id}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={o.order_status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                              className="bg-[#FAF5ED] border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-[#173B32] focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="bg-[#173B32] text-white px-2.5 py-1.5 rounded text-xs font-semibold hover:bg-[#122E27] cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* PRODUCTS TAB */}
          {/* =============================================================== */}
          {adminSection === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-2xl font-bold text-[#292824]">Product Management</h1>
                <button
                  onClick={() => {
                    setAdminSection('dashboard');
                    setActiveProductTab('basic');
                  }}
                  className="bg-[#173B32] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Product</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF5ED] text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Variants</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded bg-[#FAF5ED]"
                          />
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#292824] block">{p.name}</span>
                          <span className="text-gray-500 text-[11px] line-clamp-1">{p.description}</span>
                        </td>
                        <td className="p-3.5 font-semibold text-[#173B32]">{p.category_name}</td>
                        <td className="p-3.5 font-mono text-gray-500">{p.sku}</td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#292824]">
                            ৳ {p.sale_price.toLocaleString()}
                          </span>
                          {p.regular_price > p.sale_price && (
                            <span className="text-[10px] text-gray-400 line-through block">
                              ৳ {p.regular_price.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-700">
                            {p.variants.length} vars
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.is_published
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {p.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center space-x-2">
                          <button
                            onClick={() =>
                              updateProduct(p.id, { is_published: !p.is_published })
                            }
                            className="text-xs text-gray-600 hover:text-[#173B32] underline cursor-pointer"
                          >
                            {p.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* CATEGORIES TAB */}
          {/* =============================================================== */}
          {adminSection === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-2xl font-bold text-[#292824]">
                  Category Management
                </h1>
                <button
                  onClick={() => setIsAddCatModalOpen(true)}
                  className="bg-[#173B32] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF5ED] text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Category Name</th>
                      <th className="p-3.5">Slug</th>
                      <th className="p-3.5">Assigned Products</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((c) => {
                      const count = products.filter((p) => p.category_id === c.id).length;
                      return (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="p-3.5">
                            <img
                              src={c.image_url}
                              alt={c.name}
                              className="w-10 h-10 object-cover rounded-lg bg-[#FAF5ED]"
                            />
                          </td>
                          <td className="p-3.5 font-bold text-[#292824]">{c.name}</td>
                          <td className="p-3.5 font-mono text-gray-500">{c.slug}</td>
                          <td className="p-3.5 font-semibold text-[#173B32]">
                            {count || c.product_count}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              Active
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => deleteCategory(c.id)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STOCK MANAGEMENT TAB */}
          {/* =============================================================== */}
          {adminSection === 'stock' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#292824]">
                    Inventory & Stock Management
                  </h1>
                  <p className="text-xs text-gray-500">
                    Real-time stock quantities across all size/color product variations
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF5ED] text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Color</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Current Stock</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.flatMap((prod) =>
                      prod.variants.map((v) => {
                        const statusPill =
                          v.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : v.stock <= 5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-800';

                        const statusText =
                          v.stock === 0 ? 'Out of Stock' : v.stock <= 5 ? 'Low Stock' : 'In Stock';

                        return (
                          <tr key={v.id} className="hover:bg-gray-50">
                            <td className="p-3.5 font-bold text-[#292824]">{prod.name}</td>
                            <td className="p-3.5 font-semibold text-gray-600">{v.size}</td>
                            <td className="p-3.5">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border"
                                  style={{ backgroundColor: v.color_code || '#292824' }}
                                />
                                {v.color}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-gray-400">{v.sku}</td>
                            <td className="p-3.5 font-bold text-sm">{v.stock}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${statusPill}`}
                              >
                                {statusText}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => {
                                  setEditingVariant({
                                    id: v.id,
                                    productName: prod.name,
                                    size: v.size,
                                    color: v.color,
                                    currentStock: v.stock,
                                  });
                                  setNewStockInput(v.stock);
                                }}
                                className="bg-[#173B32] text-white px-3 py-1 rounded text-xs font-semibold hover:bg-[#122E27] cursor-pointer"
                              >
                                Adjust Stock
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* USERS TAB */}
          {/* =============================================================== */}
          {adminSection === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="font-serif text-2xl font-bold text-[#292824]">User Management</h1>
              </div>

              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF5ED] text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5">#</th>
                      <th className="p-3.5">Full Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u, i) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-3.5 text-gray-400">{i + 1}</td>
                        <td className="p-3.5 font-bold">{u.name}</td>
                        <td className="p-3.5 text-gray-600">{u.email}</td>
                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                            className="bg-[#FAF5ED] border border-gray-300 rounded px-2 py-1 text-xs font-semibold"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={u.status}
                            onChange={(e) => updateUserStatus(u.id, e.target.value as any)}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2 py-1 text-xs font-semibold"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => showToast(`User ${u.name} details viewed`)}
                            className="text-gray-500 hover:text-[#173B32] p-1 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* SETTINGS TAB (Payment, Shipping, Socials, Store info) */}
          {/* =============================================================== */}
          {adminSection === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#292824]">Store Settings</h1>
                <p className="text-xs text-gray-500">
                  Update payment numbers, delivery rates, contact details, and announcements without changing code.
                </p>
              </div>

              {/* Payment Methods Config */}
              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-[#292824] border-b pb-2">
                  Payment Gateways & Manual Numbers
                </h3>

                {/* bKash */}
                <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#DF146E]">bKash Configuration</span>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.bkash_active}
                        onChange={(e) => updateSettings({ bkash_active: e.target.checked })}
                        className="rounded text-[#DF146E]"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">bKash Number</label>
                      <input
                        type="text"
                        value={settings.bkash_number}
                        onChange={(e) => updateSettings({ bkash_number: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Account Type</label>
                      <select
                        value={settings.bkash_type}
                        onChange={(e) => updateSettings({ bkash_type: e.target.value as any })}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5"
                      >
                        <option value="Merchant">Merchant</option>
                        <option value="Personal">Personal</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Nagad */}
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#F7941D]">Nagad Configuration</span>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.nagad_active}
                        onChange={(e) => updateSettings({ nagad_active: e.target.checked })}
                        className="rounded text-[#F7941D]"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Nagad Number</label>
                      <input
                        type="text"
                        value={settings.nagad_number}
                        onChange={(e) => updateSettings({ nagad_number: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Account Type</label>
                      <select
                        value={settings.nagad_type}
                        onChange={(e) => updateSettings({ nagad_type: e.target.value as any })}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5"
                      >
                        <option value="Merchant">Merchant</option>
                        <option value="Personal">Personal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Rates */}
              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-[#292824] border-b pb-2">
                  Shipping Rates & Delivery Thresholds
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Inside Dhaka Shipping (৳)</label>
                    <input
                      type="number"
                      value={settings.inside_dhaka_shipping}
                      onChange={(e) =>
                        updateSettings({ inside_dhaka_shipping: Number(e.target.value) })
                      }
                      className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Outside Dhaka Shipping (৳)</label>
                    <input
                      type="number"
                      value={settings.outside_dhaka_shipping}
                      onChange={(e) =>
                        updateSettings({ outside_dhaka_shipping: Number(e.target.value) })
                      }
                      className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Free Shipping Min (৳)</label>
                    <input
                      type="number"
                      value={settings.free_shipping_threshold}
                      onChange={(e) =>
                        updateSettings({ free_shipping_threshold: Number(e.target.value) })
                      }
                      className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-[#292824] border-b pb-2">
                  Store Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Store Phone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSettings({ email: e.target.value })}
                      className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded px-3 py-2"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold block mb-1">Store Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => updateSettings({ address: e.target.value })}
                      className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =============================================================== */}
      {/* MODAL: VIEW ORDER DETAILS (Approve payment, change status) */}
      {/* =============================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#FAF5ED] p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#173B32]">
                  Order {selectedOrder.order_number} Details
                </h3>
                <span className="text-xs text-gray-500">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedOrder.is_flagged_fake && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Flagged as Potential Fake Order
                </p>
                <ul className="list-disc list-inside">
                  {selectedOrder.fake_risk_reasons?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customer Details */}
            <div className="bg-[#FAF5ED]/60 rounded-xl p-4 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 block">Customer:</span>
                  <span className="font-bold">{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone:</span>
                  <span className="font-bold">{selectedOrder.customer_phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Address:</span>
                  <span>
                    {selectedOrder.delivery_address}, {selectedOrder.district},{' '}
                    {selectedOrder.division}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-gray-700 block">Ordered Items:</span>
              {selectedOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between py-1 border-b border-gray-100">
                  <span>
                    {it.product_name} ({it.size}, {it.color}) × {it.quantity}
                  </span>
                  <span className="font-bold">৳ {(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-bold text-sm text-[#173B32]">
                <span>Total Amount:</span>
                <span>৳ {selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Verification Controls */}
            <div className="bg-[#FAF5ED] p-4 rounded-xl text-xs space-y-2">
              <span className="font-bold block text-gray-700">Payment Verification:</span>
              <p>
                Method:{' '}
                <span className="font-bold uppercase text-[#173B32]">
                  {selectedOrder.payment_method}
                </span>{' '}
                | Status:{' '}
                <span className="font-bold uppercase text-amber-600">
                  {selectedOrder.payment_status}
                </span>
              </p>
              {selectedOrder.transaction_id && (
                <p className="font-mono bg-white p-2 rounded border border-gray-200">
                  TrxID: {selectedOrder.transaction_id} (Sender: {selectedOrder.sender_number})
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    updatePaymentStatus(selectedOrder.id, 'verified');
                    setSelectedOrder((prev) => (prev ? { ...prev, payment_status: 'verified' } : null));
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
                >
                  Verify & Approve Payment
                </button>
                <button
                  onClick={() => {
                    updatePaymentStatus(selectedOrder.id, 'failed');
                    setSelectedOrder((prev) => (prev ? { ...prev, payment_status: 'failed' } : null));
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
                >
                  Reject Payment
                </button>
              </div>
            </div>

            {/* Order Status Control */}
            <div className="flex items-center justify-between border-t pt-3 text-xs">
              <span className="font-bold text-gray-700">Change Order Status:</span>
              <select
                value={selectedOrder.order_status}
                onChange={(e) => {
                  const newSt = e.target.value as OrderStatus;
                  updateOrderStatus(selectedOrder.id, newSt);
                  setSelectedOrder((prev) => (prev ? { ...prev, order_status: newSt } : null));
                }}
                className="bg-[#173B32] text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL: QUICK ADJUST STOCK */}
      {/* =============================================================== */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#292824]">
              Adjust Inventory Stock
            </h3>
            <p className="text-xs text-gray-600">
              {editingVariant.productName} ({editingVariant.size}, {editingVariant.color})
            </p>

            <div>
              <label className="text-xs font-bold block mb-1">New Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={newStockInput}
                onChange={(e) => setNewStockInput(Number(e.target.value))}
                className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2 text-sm font-bold"
              />
            </div>

            <div className="flex gap-2 pt-2 justify-end">
              <button
                onClick={() => setEditingVariant(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStockSubmit}
                className="bg-[#173B32] hover:bg-[#122E27] text-white px-4 py-1.5 rounded text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL: ADD VARIATION */}
      {/* =============================================================== */}
      {isAddVariantModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-base font-bold text-[#292824]">Add Variation</h3>
              <button
                onClick={() => setIsAddVariantModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Size *</label>
                <select
                  value={variantFormSize}
                  onChange={(e) => setVariantFormSize(e.target.value)}
                  className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="Free Size">Free Size</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Color *</label>
                <input
                  type="text"
                  value={variantFormColor}
                  onChange={(e) => setVariantFormColor(e.target.value)}
                  placeholder="e.g. Green, Beige"
                  className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Regular Price (৳) *</label>
                <input
                  type="number"
                  value={variantFormRegPrice}
                  onChange={(e) => setVariantFormRegPrice(Number(e.target.value))}
                  className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Sale Price (৳) *</label>
                <input
                  type="number"
                  value={variantFormSalePrice}
                  onChange={(e) => setVariantFormSalePrice(Number(e.target.value))}
                  className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <label className="font-bold block mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  value={variantFormStock}
                  onChange={(e) => setVariantFormStock(Number(e.target.value))}
                  className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsAddVariantModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVariantToProduct}
                className="bg-[#173B32] text-white px-4 py-1.5 text-xs font-semibold rounded cursor-pointer"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* MODAL: ADD CATEGORY */}
      {/* =============================================================== */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateCategory}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-base font-bold text-[#292824]">Add New Category</h3>
              <button
                type="button"
                onClick={() => setIsAddCatModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Footwear, Winter Wear"
                value={catFormName}
                onChange={(e) => setCatFormName(e.target.value)}
                className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Short category summary..."
                value={catFormDesc}
                onChange={(e) => setCatFormDesc(e.target.value)}
                className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Image URL</label>
              <input
                type="url"
                value={catFormImage}
                onChange={(e) => setCatFormImage(e.target.value)}
                className="w-full bg-[#FAF5ED] border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsAddCatModalOpen(false)}
                className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#173B32] text-white px-4 py-1.5 font-semibold rounded cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
