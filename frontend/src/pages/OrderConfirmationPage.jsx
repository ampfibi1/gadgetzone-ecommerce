import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Home, Phone, MapPin } from 'lucide-react';
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
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          We have received your order at <strong>LHQ BANGLADESH</strong>. Our logistics team is preparing your package for delivery.
        </p>

        <div className="inline-block px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono mb-8">
          Order Reference: <strong className="text-cyan-700 text-sm">{orderNumber}</strong>
        </div>

        {order && (
          <div className="text-left bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 space-y-3 text-xs">
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
              <span className="font-black text-slate-900 text-sm">
                ৳{order.total?.toLocaleString('en-BD')}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Delivery Destination:</span>
              <span className="font-medium text-slate-800">{order.shippingCity || 'Bangladesh'}</span>
            </div>
          </div>
        )}

        {/* Store Support Card */}
        <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-100 text-xs text-slate-700 text-left mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" /> LHQ BANGLADESH Outlet:
            </p>
            <p className="text-slate-600 text-[11px]">
              Konapara Shopping Complex, Dhaka, Ground Floor
            </p>
          </div>
          <a
            href="tel:01348178750"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold text-xs shadow-xs"
          >
            <Phone className="w-3 h-3" /> 01348178750
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/products"
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
          <Link
            to="/account/orders"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
