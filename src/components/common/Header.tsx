import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Shield,
  ChevronDown,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC<{ onOpenTrackOrder: () => void; onOpenHelp: () => void }> = ({
  onOpenTrackOrder,
  onOpenHelp,
}) => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    currentUser,
    setIsAuthModalOpen,
    logout,
    wishlist,
    settings,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', slug: null },
    { label: 'Women', slug: 'women' },
    { label: 'Men', slug: 'men' },
    { label: 'Kids', slug: 'kids' },
    { label: 'Traditional', slug: 'traditional' },
    { label: 'Accessories', slug: 'accessories' },
    { label: 'New Arrivals', slug: 'new-arrivals' },
    { label: 'Sale', slug: 'sale', isSale: true },
  ];

  const handleNavClick = (slug: string | null) => {
    setActiveTab('store');
    setSelectedCategorySlug(slug);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5ED] border-b border-[#FAF5ED] shadow-sm">
      {/* 1. ANNOUNCEMENT BAR */}
      {settings.announcement_bar_active && (
        <div className="bg-[#173B32] text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-medium tracking-wide text-center sm:text-left">
              {settings.announcement_bar_text}
            </p>
            <div className="flex items-center space-x-6 text-xs text-[#FAF5ED]/90">
              <button
                onClick={onOpenTrackOrder}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Track Order
              </button>
              <button
                onClick={onOpenHelp}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Help
              </button>
              <button
                onClick={onOpenHelp}
                className="hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('store');
                setSelectedCategorySlug(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <img
                src="/stylenest-logo.png"
                alt="StyleNest Logo"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback logo if file not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#292824]">
                  Style<span className="text-[#C9684B]">Nest</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#292824]/70 font-semibold -mt-1">
                  Wear Your Vibe
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'store') setActiveTab('store');
                }}
                className="w-full bg-white border border-[#292824]/20 rounded-l-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#173B32] transition-colors placeholder:text-[#292824]/40"
              />
              <button
                onClick={() => {
                  if (activeTab !== 'store') setActiveTab('store');
                }}
                className="bg-[#173B32] hover:bg-[#122E27] text-white px-5 rounded-r-md flex items-center justify-center transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Actions: Auth, Socials, Wishlist, Cart, Admin Switch */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* View Admin Panel Toggle Pill */}
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'store' : 'admin')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#C9684B] text-white shadow-sm'
                  : 'bg-[#173B32] text-white hover:bg-[#122E27]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{activeTab === 'admin' ? 'Back to Customer Store' : 'Admin Panel'}</span>
            </button>

            {/* Auth options */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#292824] hover:text-[#173B32] cursor-pointer py-1"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#173B32] text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline max-w-[100px] truncate">{currentUser.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown border border-[#FAF5ED] py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-[#FAF5ED]">
                        <p className="font-semibold text-[#292824] truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E1ECE7] text-[#173B32]">
                          {currentUser.role}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF5ED] text-[#173B32] flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </button>

                      <button
                        onClick={onOpenTrackOrder}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF5ED] text-[#292824] flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Order History
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer border-t border-[#FAF5ED]"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs sm:text-sm font-medium text-[#292824] hover:text-[#C9684B] transition-colors cursor-pointer"
                >
                  Login <span className="text-gray-300">|</span> Register
                </button>
              )}
            </div>

            {/* Social Media Icons (from reference image) */}
            <div className="hidden sm:flex items-center space-x-2 text-[#292824]/70">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#173B32] hover:text-white transition-all cursor-pointer"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#173B32] hover:text-white transition-all cursor-pointer"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Wishlist Heart Icon */}
            <button
              onClick={() => {
                setActiveTab('store');
                setSelectedCategorySlug('wishlist');
              }}
              className="relative p-2 text-[#292824] hover:text-[#C9684B] transition-colors cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9684B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#292824] hover:text-[#173B32] transition-colors cursor-pointer flex items-center gap-1.5"
              title="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-2 bg-[#C9684B] text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              </div>
              <span className="hidden lg:inline text-xs font-semibold text-[#292824]">
                ৳ {cartSubtotal.toLocaleString()}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#292824] hover:text-[#173B32] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full flex">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'store') setActiveTab('store');
              }}
              className="w-full bg-white border border-[#292824]/20 rounded-l-md px-3.5 py-2 text-sm focus:outline-none focus:border-[#173B32]"
            />
            <button
              onClick={() => {
                if (activeTab !== 'store') setActiveTab('store');
              }}
              className="bg-[#173B32] text-white px-4 rounded-r-md flex items-center justify-center cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION MENU (Home, Women, Men, Kids, Accessories, New Arrivals, Sale) */}
      <nav className="border-t border-[#FAF5ED] bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                activeTab === 'store' &&
                (item.slug === null
                  ? selectedCategorySlug === null && !searchQuery
                  : selectedCategorySlug === item.slug);

              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavClick(item.slug)}
                    className={`relative py-1 transition-colors cursor-pointer ${
                      item.isSale
                        ? 'text-[#C9684B] font-bold hover:text-[#B25439]'
                        : isActive
                        ? 'text-[#173B32] font-semibold'
                        : 'text-[#292824] hover:text-[#173B32]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9684B] rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#FAF5ED] bg-white px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#FAF5ED]">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Navigation</span>
            <button
              onClick={() => {
                setActiveTab(activeTab === 'admin' ? 'store' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs bg-[#173B32] text-white px-3 py-1 rounded-full font-semibold"
            >
              {activeTab === 'admin' ? 'Store Front' : 'Admin Panel'}
            </button>
          </div>

          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item.slug)}
                  className={`w-full text-left py-2 px-3 rounded-md text-sm font-medium ${
                    item.isSale
                      ? 'text-[#C9684B] font-bold bg-[#FDF6F4]'
                      : 'text-[#292824] hover:bg-[#FAF5ED]'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
