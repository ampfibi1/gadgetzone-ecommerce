import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, ArrowRight, Clock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders?limit=5');
        setOrders(res.data.data.orders || []);
      } catch (err) {
        console.error('Failed to load my orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-slate-950 rounded-xl p-6 sm:p-8 text-white mb-8 border border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
          Welcome back, {user?.name}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Customer Portal: Review orders, profile details, and default delivery information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="md:col-span-1 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-5">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-base border border-slate-800">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 text-sm truncate">{user?.name}</h3>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700">
                Customer account
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Phone number</span>
              <span className="font-medium text-slate-800">{user?.phone || 'Not provided yet'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Default delivery address</span>
              <span className="font-medium text-slate-800 leading-relaxed block">
                {user?.address || 'No saved address. Add one in Profile.'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/account/profile"
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5" /> Edit profile
            </Link>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-sky-600" /> Recent orders
            </h3>
            <Link to="/account/orders" className="text-xs font-medium text-sky-600 hover:text-sky-700">
              View all
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Clock className="w-7 h-7 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-700">No orders placed yet</p>
              <p className="text-slate-400 mt-0.5">Your orders will appear here once placed.</p>
              <Link
                to="/products"
                className="inline-block mt-3 px-3.5 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-500 transition-colors"
              >
                Browse gadgets
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-medium text-slate-900 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-BD')} • {ord.items?.length || 0} items
                    </span>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block tabular-nums">
                        ৳{ord.total?.toLocaleString('en-BD')}
                      </span>
                      <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {ord.status}
                      </span>
                    </div>

                    <Link
                      to={`/account/orders/${ord.id}`}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                      title="View order details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
