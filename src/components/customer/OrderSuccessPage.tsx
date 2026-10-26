import React from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight, Printer, Phone, MapPin, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderSuccessPage: React.FC<{ onOpenTrackOrder: () => void }> = ({ onOpenTrackOrder }) => {
  const { lastCompletedOrder, setActiveTab } = useStore();

  if (!lastCompletedOrder) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500">No recent order found.</p>
        <button
          onClick={() => setActiveTab('store')}
          className="mt-4 bg-[#173B32] text-white px-5 py-2 rounded-full text-xs font-semibold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const order = lastCompletedOrder;

  return (
    <div className="bg-[#FAF5ED] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card border border-[#E1ECE7] p-8 space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#E1ECE7] text-[#173B32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-[#173B32]" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#C9684B] bg-[#FDF6F4] px-3 py-1 rounded-full">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#292824]">
            Thank You for Shopping at StyleNest!
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Your order <span className="font-bold text-[#173B32]">{order.order_number}</span> has been received and is being prepared with care.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FAF5ED]/50 rounded-xl p-5 border border-gray-100 space-y-4 text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
            <div>
              <span className="text-gray-500 block">Order Number</span>
              <span className="font-bold text-base text-[#173B32]">{order.order_number}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block">Date</span>
              <span className="font-medium text-[#292824]">
                {new Date(order.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 block">Customer Name</span>
              <span className="font-semibold text-[#292824]">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Phone</span>
              <span className="font-semibold text-[#292824]">{order.customer_phone}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Payment Method</span>
              <span className="font-semibold uppercase text-[#173B32]">{order.payment_method}</span>
              {order.transaction_id && (
                <span className="block text-[11px] text-gray-500 font-mono">
                  TrxID: {order.transaction_id}
                </span>
              )}
            </div>
            <div>
              <span className="text-gray-500 block">Delivery Address</span>
              <span className="font-semibold text-[#292824]">
                {order.delivery_address}, {order.district}, {order.division}
              </span>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#292824] uppercase tracking-wider">
            Items in this Order
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-12 h-14 object-cover rounded bg-[#FAF5ED]"
                  />
                  <div>
                    <p className="font-bold text-[#292824]">{item.product_name}</p>
                    <p className="text-gray-500 text-xs">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#292824]">
                  ৳ {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-[#FAF5ED] p-4 rounded-xl space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>৳ {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>-৳ {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span>{order.shipping_fee === 0 ? 'FREE' : `৳ ${order.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-[#173B32] pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span>৳ {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-[#292824] py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={onOpenTrackOrder}
            className="flex-1 bg-[#173B32] hover:bg-[#122E27] text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Track Order</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className="flex-1 bg-[#C9684B] hover:bg-[#B25439] text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
