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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Reference</span>
            <h1 className="text-2xl font-black text-slate-900 font-mono mt-0.5">{order.orderNumber}</h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Placed on {new Date(order.createdAt).toLocaleDateString('en-BD', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Purchased Items
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {order.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-slate-500 mt-0.5">
                    Unit Price: ৳{item.price.toLocaleString('en-BD')} | Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-black text-slate-900 text-sm">
                  ৳{item.total.toLocaleString('en-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" /> Delivery Address
            </h4>
            <p className="font-medium text-slate-800 leading-relaxed">{order.shippingAddress}</p>
            <p className="text-slate-600">{order.shippingCity} {order.shippingZip ? `(${order.shippingZip})` : ''}</p>
            {order.notes && (
              <p className="text-slate-500 italic mt-2">Note: {order.notes}</p>
            )}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" /> Payment & Charges
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
