import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck, Smartphone, Truck } from 'lucide-react';
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
        <h2 className="text-lg font-semibold text-ink mb-2">Your cart is empty</h2>
        <p className="text-xs text-muted mb-6">Add items to your cart before checking out.</p>
        <Link to="/products" className="px-5 py-2.5 bg-ember hover:bg-ember-strong text-white font-medium rounded-lg text-xs transition-colors">
          Browse products
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
        const payRes = await api.post('/payments/bkash/create', { orderId: order.id });
        const { bkashURL } = payRes.data.data;

        if (bkashURL) {
          window.location.href = bkashURL;
          return;
        }

        setBkashModalOpen(true);
      } else {
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
      <div className="mb-8 pb-4 border-b border-line">
        <h1 className="text-2xl font-medium text-ink tracking-tight">Checkout</h1>
        <p className="text-xs text-muted mt-1">
          {isAuthenticated
            ? `Checking out as logged in customer (${user?.name})`
            : 'Guest checkout — No registration or password required'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Details */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <div className="bg-surface p-5 sm:p-6 rounded-xl border border-line">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-line">
              <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-ember" />
                1. Customer & contact details
              </h3>
              {!isAuthenticated && (
                <Link to="/login" className="text-xs text-ember hover:underline font-medium">
                  Have an account? Sign in
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1">
                  Full name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahim Ahmed"
                  className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1">
                  Email address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. rahim@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink-soft mb-1">
                  Mobile phone number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 01712345678"
                  className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-surface p-5 sm:p-6 rounded-xl border border-line">
            <h3 className="font-semibold text-sm text-ink mb-5 pb-3 border-b border-line flex items-center gap-2">
              <Truck className="w-4 h-4 text-ember" />
              2. Delivery address (Bangladesh)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1">
                  Street address & House / Apartment <span className="text-danger">*</span>
                </label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="e.g. House 42, Road 7, Sector 3, Uttara"
                  className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1">
                    City / Division <span className="text-danger">*</span>
                  </label>
                  <select
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden bg-surface"
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
                  <label className="block text-xs font-medium text-ink-soft mb-1">
                    Postal code (Optional)
                  </label>
                  <input
                    type="text"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleChange}
                    placeholder="e.g. 1230"
                    className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-soft mb-1">
                  Delivery notes (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call before delivery, leave with reception"
                  className="w-full px-3 py-2 rounded-lg border border-line text-xs sm:text-sm focus:ring-1 focus:ring-ember focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-surface p-5 sm:p-6 rounded-xl border border-line">
            <h3 className="font-semibold text-sm text-ink mb-5 pb-3 border-b border-line flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-ember" />
              3. Payment method
            </h3>

            <div className="space-y-3">
              {/* bKash Option */}
              <label
                className={`flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'BKASH'
                    ? 'border-ember bg-ember-soft'
                    : 'border-line hover:border-line-strong'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BKASH"
                  checked={formData.paymentMethod === 'BKASH'}
                  onChange={handleChange}
                  className="mt-1 text-ember focus:ring-ember"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink text-xs sm:text-sm flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-ember text-white font-medium text-[10px]">
                        bKash
                      </span>
                      Instant bKash payment
                    </span>
                    <span className="text-[11px] font-medium text-ember">Recommended</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Pay securely using bKash account or sandbox simulator with immediate verification.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery Option */}
              <label
                className={`flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'COD'
                    ? 'border-positive bg-positive/10'
                    : 'border-line hover:border-line-strong'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="mt-1 text-positive focus:ring-positive"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink text-xs sm:text-sm flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-positive text-white font-medium text-[10px]">
                        COD
                      </span>
                      Cash on delivery
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Pay with cash when the delivery courier delivers to your address anywhere in Bangladesh.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-ember hover:bg-ember-strong disabled:bg-raised disabled:text-muted text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
          >
            {submitting ? 'Creating order...' : `Confirm order (৳${total.toLocaleString('en-BD')})`}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-line p-5 shadow-xs sticky top-24">
            <h3 className="font-semibold text-sm text-ink mb-4 pb-3 border-b border-line">
              Cart summary ({items.length})
            </h3>

            <div className="divide-y divide-line max-h-72 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-contain bg-raised border border-line shrink-0 p-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink-soft truncate">{item.product.name}</p>
                    <p className="text-[11px] text-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-ink tabular-nums">
                    ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-line">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-medium text-ink tabular-nums">৳{subtotal.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span className="font-medium text-ink">{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
              </div>
              <div className="flex justify-between text-ink font-semibold text-sm pt-2 border-t border-line">
                <span>Total due</span>
                <span className="tabular-nums">৳{total.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bKash Sandbox Payment Simulation Modal */}
      {bkashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-ember flex items-center justify-center mx-auto mb-3 font-medium text-lg">
              bKash
            </div>
            <h3 className="text-lg font-semibold text-ink mb-0.5">bKash Payment Gateway</h3>
            <p className="text-xs text-ember font-medium mb-4">Sandbox simulation mode</p>

            <div className="bg-raised rounded-lg p-3 text-xs text-left space-y-1.5 mb-5 border border-line">
              <div className="flex justify-between">
                <span className="text-muted">Invoice:</span>
                <span className="font-mono font-medium text-ink-soft">{createdOrder?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payable amount:</span>
                <span className="font-semibold text-ink tabular-nums">৳{createdOrder?.total.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Merchant:</span>
                <span className="font-medium text-ink-soft">LHQ Bangladesh</span>
              </div>
            </div>

            <p className="text-xs text-muted mb-5 leading-relaxed">
              In test mode, clicking below verifies the transaction callback and completes your order.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleExecuteSimulatedBkash}
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-ember hover:bg-ember-strong text-white font-medium rounded-lg text-xs transition-colors"
              >
                {submitting ? 'Verifying with bKash...' : 'Simulate successful bKash payment'}
              </button>
              <button
                onClick={() => setBkashModalOpen(false)}
                className="w-full py-2 text-xs text-muted hover:text-ink-soft transition-colors"
              >
                Cancel and close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
