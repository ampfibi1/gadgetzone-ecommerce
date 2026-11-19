import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, Truck, Home } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/track/${orderNumber}`);
          setOrder(res.data.data.order);
        } catch (err) {
          console.error('Order fetch error', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          We have received your order and our logistics team in Bangladesh is preparing it for delivery.
        </p>

        <div className="inline-block px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono mb-8">
          Order Number: <strong className="text-blue-600 text-sm">{orderNumber}</strong>
        </div>

        {order && (
          <div className="text-left bg-slate-50/80 rounded-2xl p-6 border border-slate-100 mb-8 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Order Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {order.status || 'CONFIRMED'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-slate-800">
                {order.payment?.status || (location.state?.paidViaBkash ? 'COMPLETED' : 'PENDING')}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Total Amount:</span>
              <span className="font-bold text-slate-900 text-sm">
                ৳{order.total?.toLocaleString('en-BD')}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Destination:</span>
              <span className="font-medium text-slate-800">{order.shippingCity || 'Bangladesh'}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/track-order?orderNumber=${orderNumber}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition"
          >
            <Truck className="w-4 h-4" /> Track Status Live
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
