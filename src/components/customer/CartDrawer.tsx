import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    settings,
    setActiveTab,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, settings.free_shipping_threshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / settings.free_shipping_threshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#FAF5ED] flex items-center justify-between bg-[#FAF5ED]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#173B32]" />
              <h2 className="font-serif text-lg font-bold text-[#292824]">
                Your Cart ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-[#292824]/60 hover:text-[#292824] hover:bg-white/80 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#E1ECE7]/40 border-b border-[#FAF5ED]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#173B32] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#173B32]" />
                {freeShippingNeeded === 0
                  ? 'Congratulations! You unlocked FREE shipping 🎉'
                  : `Add ৳ ${freeShippingNeeded.toLocaleString()} more for FREE shipping!`}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#C4DDD3] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#173B32] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#173B32] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-[#9BBDAC]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#292824]">Your cart is empty</h3>
                <p className="text-xs text-[#292824]/60 max-w-xs mx-auto">
                  Discover our new season collection and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 bg-[#173B32] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#122E27] cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_id}
                  className="flex items-center gap-4 py-3 border-b border-[#FAF5ED] group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-20 object-cover rounded-md bg-[#FAF5ED] border border-gray-100 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-sm font-semibold text-[#292824] truncate">
                        {item.product_name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cart_id)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Size: <span className="font-medium text-[#292824]">{item.size}</span> | Color:{' '}
                      <span className="font-medium text-[#292824]">{item.color}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-bold text-sm text-[#292824]">
                        ৳ {item.price.toLocaleString()}
                      </span>

                      {/* Quantity [- 1 +] Controls */}
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.cart_id, -1)}
                          className="px-2 py-1 text-gray-500 hover:text-[#173B32] hover:bg-gray-50 rounded-l transition-colors cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-[#292824]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cart_id, 1)}
                          className="px-2 py-1 text-gray-500 hover:text-[#173B32] hover:bg-gray-50 rounded-r transition-colors cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#FAF5ED] bg-[#FAF5ED] space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-[#292824]">
                <span className="font-serif">Subtotal</span>
                <span>৳ {cartSubtotal.toLocaleString()}</span>
              </div>

              <p className="text-[11px] text-[#292824]/60">
                Taxes and delivery fee calculated at final checkout.
              </p>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#C9684B] hover:bg-[#B25439] text-white py-3.5 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>View Cart & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
