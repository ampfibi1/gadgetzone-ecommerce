import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck, Smartphone, Truck, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getShippingCost, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shippingAddress: user?.address || '',
    shippingCity: 'Dhaka',
    shippingZip: '',
    paymentMethod: 'BKASH',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [bkashModalOpen, setBkashModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        shippingAddress: user.address || prev.shippingAddress,
      }));
    }
  }, [user]);

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-sm text-slate-500 mb-6">Add items to your cart before checking out.</p>
        <Link to="/products" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.shippingAddress || !formData.shippingCity) {
      toast.error('Please fill in all required delivery details.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingZip: formData.shippingZip,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        // Guest info if unauthenticated
        ...(!isAuthenticated && {
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
        }),
      };

      const res = await api.post('/orders', orderPayload);
      const order = res.data.data.order;
      setCreatedOrder(order);

      if (formData.paymentMethod === 'BKASH') {
        // Initiate bKash payment
        const payRes = await api.post('/payments/bkash/create', { orderId: order.id });
        const { bkashURL, paymentID, sandbox } = payRes.data.data;

        if (bkashURL) {
          // Real bKash gateway redirect
          window.location.href = bkashURL;
          return;
        }

        // Sandbox simulated bKash modal
        setBkashModalOpen(true);
      } else {
        // Cash on Delivery
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.orderNumber}`, { state: { order } });
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecuteSimulatedBkash = async () => {
    setSubmitting(true);
    try {
      await api.post('/payments/bkash/execute', {
        orderId: createdOrder.id,
        paymentID: `SIM-${Date.now()}`,
      });
      clearCart();
      toast.success('bKash Payment Verified & Completed!');
      navigate(`/order-confirmation/${createdOrder.orderNumber}`, {
        state: { order: createdOrder, paidViaBkash: true },
      });
    } catch (err) {
      toast.error('Payment simulation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">
          {isAuthenticated
            ? `Checking out as logged in customer (${user?.name})`
            : 'Guest Checkout — No registration or login required'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Details */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-8">
          {/* Contact Details */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                1. Customer & Contact Details
              </h3>
              {!isAuthenticated && (
                <Link to="/login" className="text-xs text-blue-600 hover:underline font-semibold">
                  Already have an account? Sign In
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahim Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. rahim@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +880 1712 345678"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-lg text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              2. Shipping Address (Bangladesh)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Street Address & House / Flat No. <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="e.g. House 42, Road 7, Sector 3, Uttara"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    City / Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleChange}
                    placeholder="e.g. 1230"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Delivery Notes / Special Instructions
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call before delivery, leave with guard"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-lg text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              3. Payment Method
            </h3>

            <div className="space-y-3">
              {/* bKash Option */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  formData.paymentMethod === 'BKASH'
                    ? 'border-pink-500 bg-pink-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BKASH"
                  checked={formData.paymentMethod === 'BKASH'}
                  onChange={handleChange}
                  className="mt-1 text-pink-600 focus:ring-pink-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-pink-600 text-white font-extrabold text-xs">
                        bKash
                      </span>
                      Instant Online Payment
                    </span>
                    <span className="text-xs font-bold text-pink-600">Recommended</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay securely using your bKash wallet or sandbox test simulator. Instant confirmation.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery Option */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  formData.paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-xs">
                        COD
                      </span>
                      Cash on Delivery
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay with cash when the delivery courier arrives at your doorstep anywhere in Bangladesh.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-slate-300 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/25 transition-all text-base"
          >
            {submitting ? 'Creating Order...' : `Confirm Order (৳${total.toLocaleString('en-BD')})`}
            {!submitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs sticky top-24">
            <h3 className="font-bold text-base text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Items in Your Cart ({items.length})
            </h3>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-blue-600 font-black">৳{total.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bKash Sandbox Payment Simulation Modal */}
      {bkashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
              bKash
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">bKash Payment Gateway</h3>
            <p className="text-xs text-pink-600 font-semibold mb-4">Sandbox / Test Demonstration Mode</p>

            <div className="bg-slate-50 rounded-xl p-4 text-xs text-left space-y-1.5 mb-6 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold text-slate-800">{createdOrder?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payable Amount:</span>
                <span className="font-bold text-slate-900">৳{createdOrder?.total.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant:</span>
                <span className="font-semibold text-slate-800">LHQ BANGLADESH</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              In test mode, clicking "Simulate bKash Payment" will trigger the bKash execution callback, complete the payment transaction, and confirm your order.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExecuteSimulatedBkash}
                disabled={submitting}
                className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-pink-600/20"
              >
                {submitting ? 'Verifying with bKash...' : 'Simulate Successful bKash Payment'}
              </button>
              <button
                onClick={() => setBkashModalOpen(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
