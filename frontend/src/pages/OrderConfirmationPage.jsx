import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin, Phone } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 text-center">
      <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
          Order placed successfully
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
          Thank you for choosing <strong>LHQ Bangladesh</strong>. We have received your order and are preparing it for delivery.
        </p>

        <div className="inline-block px-3.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono mb-6">
          Order reference: <strong className="text-slate-900 font-semibold">{orderNumber}</strong>
        </div>

        {order && (
          <div className="text-left bg-slate-50 rounded-lg p-5 border border-slate-200/80 mb-6 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Order status:</span>
              <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                {order.status || 'CONFIRMED'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Payment status:</span>
              <span className="font-medium text-slate-800">
                {order.payment?.status || (location.state?.paidViaBkash ? 'COMPLETED' : 'PENDING')}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Total amount:</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ৳{order.total?.toLocaleString('en-BD')}
              </span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-500">Delivery destination:</span>
              <span className="font-medium text-slate-800">{order.shippingCity || 'Bangladesh'}</span>
            </div>
          </div>
        )}

        {/* Store Support Card */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 text-left mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="font-medium text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" /> LHQ Bangladesh Showroom
            </p>
            <p className="text-slate-500 text-[11px]">
              Konapara Shopping Complex, Dhaka, Ground Floor
            </p>
          </div>
          <a
            href="tel:01348178750"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs transition-colors"
          >
            <Phone className="w-3 h-3" /> 01348178750
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/products"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue shopping
          </Link>
          <Link
            to="/account/orders"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
          >
            Order history
          </Link>
        </div>
      </div>
    </div>
  );
}
