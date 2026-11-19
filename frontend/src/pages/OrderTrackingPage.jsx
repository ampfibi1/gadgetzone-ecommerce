import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing & Packing' },
  { key: 'SHIPPED', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderNumberInput, setOrderNumberInput] = useState(searchParams.get('orderNumber') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrackOrder = async (number) => {
    if (!number.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(number.trim())}`);
      setOrder(res.data.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'No order found with this order number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialOrderNumber = searchParams.get('orderNumber');
    if (initialOrderNumber) {
      fetchTrackOrder(initialOrderNumber);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderNumberInput.trim()) {
      setSearchParams({ orderNumber: orderNumberInput.trim() });
      fetchTrackOrder(orderNumberInput.trim());
    }
  };

  const getStepStatus = (stepKey, currentStatus) => {
    if (currentStatus === 'CANCELLED') return 'cancelled';

    const stepIndex = ORDER_STEPS.findIndex((s) => s.key === stepKey);
    const currentIndex = ORDER_STEPS.findIndex((s) => s.key === currentStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Track Your Order</h1>
        <p className="text-sm text-slate-500">
          Enter your order number (e.g. GZ-20261119-XXXX) to check the live delivery status of your gadgets.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <input
            type="text"
            placeholder="Enter Order Number (e.g., GZ-20261119-ABC123)"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            className="flex-1 px-4 py-3 text-sm rounded-xl focus:outline-hidden font-mono uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner text="Searching order details..." />}

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center max-w-lg mx-auto text-red-700 text-sm">
          <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="font-semibold">{error}</p>
          <p className="text-xs text-red-500 mt-1">Please verify the order number from your confirmation email or invoice.</p>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs animate-in fade-in">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-8">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tracking Order</span>
              <h2 className="text-2xl font-black text-slate-900 font-mono">{order.orderNumber}</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Amount</span>
              <p className="text-xl font-black text-blue-600">৳{order.total?.toLocaleString('en-BD')}</p>
            </div>
          </div>

          {/* Stepper / Timeline */}
          {order.status === 'CANCELLED' ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-800 text-sm mb-8">
              <h4 className="font-bold">This order was Cancelled</h4>
              <p className="text-xs text-red-600 mt-1">For assistance, please contact customer support at +880 1700-000000</p>
            </div>
          ) : (
            <div className="mb-12">
              <div className="relative flex justify-between items-center">
                {/* Horizontal Progress Bar */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0" />

                {ORDER_STEPS.map((step) => {
                  const status = getStepStatus(step.key, order.status);
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : status === 'current'
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs text-center font-medium max-w-[80px] ${
                          status === 'current'
                            ? 'text-blue-700 font-bold'
                            : status === 'completed'
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details Preview */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Ordered Items</h4>
            <div className="divide-y divide-slate-200/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="text-slate-400 ml-2">x {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
