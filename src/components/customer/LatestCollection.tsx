import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, ArrowRight, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';

export const LatestCollection: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    sortBy,
    setSortBy,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isWishlisted,
    wishlist,
  } = useStore();

  // Track active variant per product card
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});

  // Filter products
  const filteredProducts = products.filter((prod) => {
    if (!prod.is_published) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = prod.name.toLowerCase().includes(q);
      const matchesDesc = prod.description.toLowerCase().includes(q);
      const matchesCat = prod.category_name.toLowerCase().includes(q);
      if (!matchesName && !matchesDesc && !matchesCat) return false;
    }

    // Category / Wishlist / Sale filter
    if (selectedCategorySlug === 'wishlist') {
      return wishlist.includes(prod.id);
    }
    if (selectedCategorySlug === 'sale') {
      return prod.is_sale;
    }
    if (selectedCategorySlug === 'new-arrivals') {
      return prod.is_new;
    }
    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat && prod.category_id !== cat.id) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.sale_price - b.sale_price;
    if (sortBy === 'price-high') return b.sale_price - a.sale_price;
    if (sortBy === 'popular') return b.reviews_count - a.reviews_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getActiveVariant = (product: Product): ProductVariant => {
    if (selectedVariants[product.id]) {
      return selectedVariants[product.id];
    }
    // Return first active in-stock variant or first variant
    const inStock = product.variants.find((v) => v.stock > 0 && v.is_active);
    return inStock || product.variants[0];
  };

  const handleSelectColor = (product: Product, variant: ProductVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariants((prev) => ({
      ...prev,
      [product.id]: variant,
    }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVar = getActiveVariant(product);
    addToCart(product, activeVar, 1);
  };

  return (
    <section id="latest-collection" className="py-12 bg-[#FAF5ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292824] tracking-tight">
                Latest Collection
              </h2>
              <div className="w-10 h-0.5 bg-[#C9684B]" />
            </div>
            <p className="text-xs sm:text-sm text-[#292824]/60 mt-1 font-medium">
              Explore freshly crafted fashion designed with timeless comfort & premium textures.
            </p>
          </div>

          {/* Category Filter Pills & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedCategorySlug(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategorySlug === null
                  ? 'bg-[#173B32] text-white shadow-xs'
                  : 'bg-white text-[#292824] hover:bg-[#E1ECE7] border border-[#E1ECE7]'
              }`}
            >
              All Items
            </button>

            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategorySlug(c.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategorySlug === c.slug
                    ? 'bg-[#173B32] text-white shadow-xs'
                    : 'bg-white text-[#292824] hover:bg-[#E1ECE7] border border-[#E1ECE7]'
                }`}
              >
                {c.name}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E1ECE7] text-xs font-semibold text-[#292824] rounded-full px-3 py-1.5 focus:outline-none focus:border-[#173B32]"
            >
              <option value="latest">Sort by: Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid matching the screenshot (5 columns on desktop) */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-subtle border border-[#E1ECE7]">
            <ShoppingBag className="w-12 h-12 text-[#9BBDAC] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#292824]">No products found</h3>
            <p className="text-xs text-[#292824]/60 mt-1">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
              }}
              className="mt-4 bg-[#173B32] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-[#122E27]"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {sortedProducts.map((product) => {
              const activeVariant = getActiveVariant(product);
              const isWish = isWishlisted(product.id);
              const isOutOfStock = activeVariant.stock <= 0;

              // Unique colors for swatches
              const colorVariants = product.variants.filter(
                (v, index, self) => index === self.findIndex((t) => t.color === v.color)
              );

              const displayImage = activeVariant.image_url || product.images[0];
              const discountPercent =
                activeVariant.regular_price > activeVariant.sale_price
                  ? Math.round(
                      ((activeVariant.regular_price - activeVariant.sale_price) /
                        activeVariant.regular_price) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className="group bg-white rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-300 border border-[#FAF5ED] flex flex-col cursor-pointer"
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-[3/4] bg-[#F2F6F4] overflow-hidden">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badge top-left (New or -20%) */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {product.is_new && (
                        <span className="bg-[#173B32] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          New
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="bg-[#C9684B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart button top-right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all z-10 shadow-xs cursor-pointer ${
                        isWish ? 'text-[#C9684B]' : 'text-gray-400 hover:text-[#C9684B]'
                      }`}
                      title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWish ? 'fill-[#C9684B]' : ''}`} />
                    </button>

                    {/* Stock Status Tag if out of stock or low stock */}
                    {isOutOfStock ? (
                      <div className="absolute inset-x-0 bottom-0 bg-red-600/85 text-white text-[11px] font-bold text-center py-1">
                        Out of Stock
                      </div>
                    ) : activeVariant.stock <= 5 ? (
                      <div className="absolute inset-x-0 bottom-0 bg-amber-600/85 text-white text-[10px] font-semibold text-center py-0.5">
                        Only {activeVariant.stock} left in stock
                      </div>
                    ) : null}
                  </div>

                  {/* Card Details */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      {/* Title */}
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#292824] line-clamp-1 group-hover:text-[#173B32] transition-colors">
                        {product.name}
                      </h3>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#292824]/60">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium">({product.reviews_count})</span>
                      </div>

                      {/* Price (Sale price & Regular price strikethrough) */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="font-bold text-sm sm:text-base text-[#292824]">
                          ৳ {activeVariant.sale_price.toLocaleString()}
                        </span>
                        {activeVariant.regular_price > activeVariant.sale_price && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳ {activeVariant.regular_price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Color Swatches matching reference image */}
                      <div className="flex items-center space-x-1.5 mt-2.5">
                        {colorVariants.map((v) => {
                          const isSelected = activeVariant.color === v.color;
                          return (
                            <button
                              key={v.id}
                              onClick={(e) => handleSelectColor(product, v, e)}
                              className={`w-4 h-4 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                                isSelected
                                  ? 'ring-2 ring-offset-1 ring-[#173B32] scale-110'
                                  : 'border-gray-300 hover:scale-105'
                              }`}
                              style={{ backgroundColor: v.color_code || '#292824' }}
                              title={`${v.color} (${v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'})`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Terracotta "Add to Cart" Button */}
                    <div className="pt-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={isOutOfStock}
                        className={`w-full py-2 px-3 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isOutOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#C9684B] hover:bg-[#B25439] text-white shadow-xs hover:shadow-sm'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
