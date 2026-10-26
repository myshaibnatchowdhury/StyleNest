import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveTab,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId);

  // States for selected variant attributes
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setModalTab] = useState<'desc' | 'fabric' | 'shipping' | 'reviews'>('desc');

  // Initialize variant when product changes
  React.useEffect(() => {
    if (product && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedSize(defaultVariant.size);
      setSelectedColor(defaultVariant.color);
      setActiveImage(defaultVariant.image_url || product.images[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Find exact matching variant based on size and color selection
  const matchingVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants.find((v) => v.size === selectedSize) || product.variants[0];

  // Available unique sizes and colors
  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variantWithColor = product.variants.find((v) => v.color === color && v.size === selectedSize) ||
      product.variants.find((v) => v.color === color);
    if (variantWithColor && variantWithColor.image_url) {
      setActiveImage(variantWithColor.image_url);
    }
  };

  const handleAddToCart = () => {
    if (!matchingVariant) return;
    addToCart(product, matchingVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!matchingVariant) return;
    const added = addToCart(product, matchingVariant, quantity);
    if (added) {
      setSelectedProductId(null);
      setActiveTab('checkout');
    }
  };

  const isWish = isWishlisted(product.id);
  const isOutOfStock = !matchingVariant || matchingVariant.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#FAF5ED] flex flex-col md:flex-row my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-6 bg-[#FAF5ED] flex flex-col justify-between">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-subtle border border-gray-100">
            <img
              src={activeImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.is_new && (
              <span className="absolute top-3 left-3 bg-[#173B32] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImage === img ? 'border-[#173B32] ring-2 ring-[#173B32]/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Variant Selectors */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Category & Wishlist */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-[#173B32] bg-[#E1ECE7] px-2.5 py-0.5 rounded-full">
                {product.category_name}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border border-gray-200 transition-colors cursor-pointer ${
                  isWish ? 'text-[#C9684B] border-[#C9684B]' : 'text-gray-400 hover:text-[#C9684B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWish ? 'fill-[#C9684B]' : ''}`} />
              </button>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl font-bold text-[#292824] leading-snug">
              {product.name}
            </h2>

            {/* SKU and Rating */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-semibold text-[#292824]">{product.rating}</span>
                <span className="ml-1 text-gray-400">({product.reviews_count} reviews)</span>
              </div>
              <span>•</span>
              <span>SKU: {matchingVariant?.sku || product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-[#173B32]">
                ৳ {(matchingVariant?.sale_price || product.sale_price).toLocaleString()}
              </span>
              {(matchingVariant?.regular_price || product.regular_price) >
                (matchingVariant?.sale_price || product.sale_price) && (
                <span className="text-sm text-gray-400 line-through">
                  ৳ {(matchingVariant?.regular_price || product.regular_price).toLocaleString()}
                </span>
              )}
              {isOutOfStock ? (
                <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  Out of Stock
                </span>
              ) : (
                <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock ({matchingVariant.stock} available)
                </span>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Color Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-2">
                Color: <span className="font-medium text-gray-600">{selectedColor}</span>
              </label>
              <div className="flex items-center space-x-2">
                {availableColors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#173B32] bg-[#F2F6F4] text-[#173B32] ring-1 ring-[#173B32]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant?.color_code || '#292824' }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-2">
                Size: <span className="font-medium text-gray-600">{selectedSize}</span>
              </label>
              <div className="flex items-center space-x-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#173B32] text-white border-[#173B32] shadow-xs'
                          : 'bg-white text-[#292824] border-gray-200 hover:border-[#173B32]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-[#292824]">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        matchingVariant ? Math.min(matchingVariant.stock, q + 1) : q + 1
                      )
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Subtotal: ৳ {((matchingVariant?.sale_price || product.sale_price) * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="space-y-2.5 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#173B32] hover:bg-[#122E27] text-white shadow-sm'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#C9684B] hover:bg-[#B25439] text-white shadow-sm'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Assurance pills */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#292824]/70 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#173B32]" /> Standard delivery 2-4 days
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#173B32]" /> 7-day hassle-free returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
