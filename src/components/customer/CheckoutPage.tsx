import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Tag,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethodType } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartCount,
    settings,
    currentUser,
    placeOrder,
    setActiveTab,
    activeCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  // Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap

  // Coupon input
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Bangladesh Divisions
  const divisions = [
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Rangpur',
    'Mymensingh',
  ];

  // Shipping calculation
  const isInsideDhaka = division === 'Dhaka' && district.toLowerCase().includes('dhaka');
  const standardShipping = isInsideDhaka
    ? settings.inside_dhaka_shipping
    : settings.outside_dhaka_shipping;
  const shippingFee = cartSubtotal >= settings.free_shipping_threshold ? 0 : standardShipping;

  // Coupon discount
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discount_type === 'percentage') {
      discountAmount = Math.round((cartSubtotal * activeCoupon.discount_value) / 100);
    } else {
      discountAmount = activeCoupon.discount_value;
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your cart is empty. Add products before checkout.');
      return;
    }

    setIsSubmitting(true);

    const result = placeOrder({
      customer_name: name,
      customer_email: email || `${phone}@guest.stylenest.com`,
      customer_phone: phone,
      delivery_address: address,
      division,
      district,
      notes,
      payment_method: paymentMethod,
      sender_number: senderNumber,
      transaction_id: transactionId,
      honeypot,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error || 'Failed to place order. Please review your information.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#292824]">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-2">Add some items before checking out.</p>
        <button
          onClick={() => setActiveTab('store')}
          className="mt-4 bg-[#173B32] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#122E27] cursor-pointer"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5ED] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('store')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#173B32] hover:text-[#C9684B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#173B32]" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">Order Validation Notice</p>
              <p>{formError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Honeypot field for fake bot prevention */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot_field"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* LEFT 7 COLUMNS: Customer & Shipping & Payment Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Customer Information */}
            <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#292824]">
                  1. Customer Information
                </h3>
                <span className="text-xs text-gray-400">* Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahim Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#173B32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    Phone Number (BD) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#173B32] focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Must be valid 11-digit Bangladeshi mobile number
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    Email Address (Optional for order tracking updates)
                  </label>
                  <input
                    type="email"
                    placeholder="rahim@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#173B32] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#292824]">
                  2. Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#173B32]"
                  >
                    {divisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka City, Uttara"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#173B32]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    Street Address & House Details *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House number, Road number, Sector/Area, Landmark..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#173B32]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1">
                    Order Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver in afternoon"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#173B32]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#292824]">
                  3. Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                {settings.cod_active && (
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#173B32] bg-[#F2F6F4]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 text-[#173B32] focus:ring-[#173B32]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#292824]">Cash on Delivery</span>
                          <p className="text-xs text-gray-500">Pay with cash when your parcel arrives</p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-[#173B32]" />
                    </div>
                  </label>
                )}

                {/* Manual bKash */}
                {settings.bkash_active && (
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-[#DF146E] bg-pink-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'bkash'}
                          onChange={() => setPaymentMethod('bkash')}
                          className="w-4 h-4 text-[#DF146E]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#292824]">bKash Payment</span>
                          <p className="text-xs text-gray-500">
                            {settings.bkash_type} Account: <span className="font-bold text-[#DF146E]">{settings.bkash_number}</span>
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#DF146E] text-white text-xs font-bold px-2 py-0.5 rounded">
                        bKash
                      </span>
                    </div>

                    {paymentMethod === 'bkash' && (
                      <div className="mt-4 pt-3 border-t border-pink-100 text-xs space-y-3">
                        <div className="p-2.5 bg-white rounded-lg border border-pink-200 text-gray-700">
                          <p className="font-semibold text-[#DF146E] mb-1">Instructions:</p>
                          <p>{settings.bkash_instructions}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-[#292824] block mb-1">
                              Your bKash Number *
                            </label>
                            <input
                              type="tel"
                              required={paymentMethod === 'bkash'}
                              placeholder="01XXXXXXXXX"
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#DF146E]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#292824] block mb-1">
                              Transaction Reference / TrxID *
                            </label>
                            <input
                              type="text"
                              required={paymentMethod === 'bkash'}
                              placeholder="e.g. BK9X7742AQ"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#DF146E]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                )}

                {/* Manual Nagad */}
                {settings.nagad_active && (
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F7941D] bg-orange-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'nagad'}
                          onChange={() => setPaymentMethod('nagad')}
                          className="w-4 h-4 text-[#F7941D]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#292824]">Nagad Payment</span>
                          <p className="text-xs text-gray-500">
                            {settings.nagad_type} Account: <span className="font-bold text-[#F7941D]">{settings.nagad_number}</span>
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#F7941D] text-white text-xs font-bold px-2 py-0.5 rounded">
                        নগদ
                      </span>
                    </div>

                    {paymentMethod === 'nagad' && (
                      <div className="mt-4 pt-3 border-t border-orange-100 text-xs space-y-3">
                        <div className="p-2.5 bg-white rounded-lg border border-orange-200 text-gray-700">
                          <p className="font-semibold text-[#F7941D] mb-1">Instructions:</p>
                          <p>{settings.nagad_instructions}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-[#292824] block mb-1">
                              Your Nagad Number *
                            </label>
                            <input
                              type="tel"
                              required={paymentMethod === 'nagad'}
                              placeholder="01XXXXXXXXX"
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#F7941D]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#292824] block mb-1">
                              Transaction Reference / TrxID *
                            </label>
                            <input
                              type="text"
                              required={paymentMethod === 'nagad'}
                              placeholder="e.g. NGD483910M"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#F7941D]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                )}

                {/* Manual Rocket */}
                {settings.rocket_active && (
                  <label
                    className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'rocket'
                        ? 'border-[#8C3494] bg-purple-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'rocket'}
                          onChange={() => setPaymentMethod('rocket')}
                          className="w-4 h-4 text-[#8C3494]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#292824]">Rocket Payment</span>
                          <p className="text-xs text-gray-500">
                            {settings.rocket_type} Account: <span className="font-bold text-[#8C3494]">{settings.rocket_number}</span>
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#8C3494] text-white text-xs font-bold px-2 py-0.5 rounded">
                        Rocket
                      </span>
                    </div>

                    {paymentMethod === 'rocket' && (
                      <div className="mt-4 pt-3 border-t border-purple-100 text-xs space-y-3">
                        <div className="p-2.5 bg-white rounded-lg border border-purple-200 text-gray-700">
                          <p className="font-semibold text-[#8C3494] mb-1">Instructions:</p>
                          <p>{settings.rocket_instructions}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-[#292824] block mb-1">
                              Your Rocket Number *
                            </label>
                            <input
                              type="tel"
                              required={paymentMethod === 'rocket'}
                              placeholder="01XXXXXXXXX"
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#8C3494]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#292824] block mb-1">
                              Transaction Reference / TrxID *
                            </label>
                            <input
                              type="text"
                              required={paymentMethod === 'rocket'}
                              placeholder="e.g. RCKT839201"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#8C3494]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-card border border-[#E1ECE7] p-6 space-y-5 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-[#292824] border-b border-gray-100 pb-3">
                Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.cart_id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-12 h-14 object-cover rounded bg-[#FAF5ED] border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#292824] truncate">{item.product_name}</p>
                      <p className="text-gray-500">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#292824]">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100" />

              {/* Promo Code Form */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#292824] block mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#C9684B]" />
                  <span>Promo Code</span>
                </label>

                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <span className="font-bold text-emerald-800">
                      Code: {activeCoupon.code} applied (-৳ {discountAmount})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#FAF5ED]/50 border border-gray-200 rounded-lg px-3 py-2 text-xs uppercase font-semibold focus:outline-none focus:border-[#173B32]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#173B32] hover:bg-[#122E27] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              </div>

              <hr className="border-gray-100" />

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#292824]/80">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳ {cartSubtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-৳ {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#292824]/80">
                  <span className="flex items-center gap-1">
                    Shipping ({isInsideDhaka ? 'Dhaka City' : 'Outside Dhaka'})
                  </span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `৳ ${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-[#292824]">Grand Total</span>
                  <span className="font-serif text-2xl font-bold text-[#173B32]">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C9684B] hover:bg-[#B25439] text-white py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Order (৳ {grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-gray-500 space-y-1.5 text-center pt-2">
                <p>✓ All products quality checked before dispatch</p>
                <p>✓ 7-Day Hassle-free return policy applies</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
