import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const TrackOrderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { orders, currentUser } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState(currentUser?.phone || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanNum = orderQuery.trim().replace('#', '');
    const cleanPhone = phoneQuery.trim().replace(/[\s-]/g, '');

    const found = orders.find((o) => {
      const matchNum = o.order_number.replace('#', '') === cleanNum;
      const matchPhone = !cleanPhone || o.customer_phone.replace(/[\s-]/g, '').includes(cleanPhone);
      return matchNum && matchPhone;
    });

    setSearchedOrder(found || null);
  };

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: string) => {
    return steps.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FAF5ED] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#173B32]" />
            <h2 className="font-serif text-lg font-bold text-[#292824]">Track Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Inputs */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#292824] block mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. #1001 or 1001"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#173B32]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#292824] block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#173B32]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#173B32] hover:bg-[#122E27] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Search Order Status</span>
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div>
            {searchedOrder ? (
              <div className="bg-[#FAF5ED]/60 rounded-xl p-5 border border-gray-200 space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-500">Order</span>
                    <h3 className="font-bold text-base text-[#173B32]">
                      {searchedOrder.order_number}
                    </h3>
                    <p className="text-xs text-gray-600">{searchedOrder.customer_name}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      searchedOrder.order_status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : searchedOrder.order_status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {searchedOrder.order_status}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Shipment Progress
                  </span>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                    {steps.map((st, i) => {
                      const currentIdx = getStepIndex(searchedOrder.order_status);
                      const isComplete = i <= currentIdx;
                      return (
                        <div key={st} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isComplete
                                ? 'bg-[#173B32] text-white ring-2 ring-[#E1ECE7]'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isComplete ? '✓' : i + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-semibold ${
                              isComplete ? 'text-[#173B32]' : 'text-gray-400'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items preview */}
                <div className="border-t border-gray-200 pt-3 text-xs space-y-2">
                  <span className="font-bold text-[#292824] block">Items in Parcel:</span>
                  {searchedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-gray-600">
                      <span>
                        {it.product_name} ({it.size}, {it.color}) × {it.quantity}
                      </span>
                      <span className="font-semibold text-[#292824]">
                        ৳ {(it.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-[#173B32]">
                    <span>Total Amount:</span>
                    <span>৳ {searchedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-700 space-y-1">
                <AlertCircle className="w-5 h-5 mx-auto text-red-500 mb-1" />
                <p className="font-bold">No order found matching your inquiry.</p>
                <p className="text-gray-500">
                  Please double check your order number (e.g. #1001) and mobile number.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
