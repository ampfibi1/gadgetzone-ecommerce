import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Calendar } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to orders
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Order reference</span>
            <h1 className="text-xl font-bold text-slate-900 font-mono mt-0.5">{order.orderNumber}</h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Placed on {new Date(order.createdAt).toLocaleDateString('en-BD', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-600" /> Purchased items
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {order.items?.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-semibold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                  <p className="text-slate-500 mt-0.5">
                    Unit price: ৳{item.price.toLocaleString('en-BD')} | Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-slate-900 text-xs sm:text-sm tabular-nums">
                  ৳{item.total.toLocaleString('en-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200/80 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" /> Delivery address
            </h4>
            <p className="font-medium text-slate-800 leading-relaxed">{order.shippingAddress}</p>
            <p className="text-slate-600">{order.shippingCity} {order.shippingZip ? `(${order.shippingZip})` : ''}</p>
            {order.notes && (
              <p className="text-slate-500 italic mt-2">Note: {order.notes}</p>
            )}
          </div>

          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200/80 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-sky-600" /> Payment & charges
            </h4>
            <div className="flex justify-between text-slate-600">
              <span>Payment Method:</span>
              <span className="font-bold text-slate-800">{order.payment?.method || 'bKash / COD'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Status:</span>
              <span className="font-bold text-emerald-700">{order.payment?.status || 'PENDING'}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
              <span>Subtotal:</span>
              <span>৳{order.subtotal?.toLocaleString('en-BD')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span>{order.shippingCost === 0 ? 'FREE' : `৳${order.shippingCost}`}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
              <span>Total Paid / Due:</span>
              <span className="text-blue-600 text-base font-black">৳{order.total?.toLocaleString('en-BD')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
