import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, MapPin, ArrowRight, Clock } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white mb-10 shadow-lg">
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-300 text-sm">
          Customer Portal: Manage your orders, personal details, and shipping address.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 truncate">{user?.name}</h3>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                Registered Customer
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Phone Number:</span>
              <span className="font-medium text-slate-800">{user?.phone || 'Not provided yet'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold mb-0.5">Default Delivery Address:</span>
              <span className="font-medium text-slate-800 leading-relaxed block">
                {user?.address || 'No saved address. Add one in Profile.'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/account/profile"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5" /> Edit Profile Details
            </Link>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" /> Recent Orders
            </h3>
            <Link to="/account/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All Orders
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">No orders placed yet</p>
              <p className="text-xs text-slate-400 mt-1">Start shopping to see your orders here.</p>
              <Link
                to="/products"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Gadgets
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-BD')} • {ord.items?.length || 0} items
                    </span>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        ৳{ord.total?.toLocaleString('en-BD')}
                      </span>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {ord.status}
                      </span>
                    </div>

                    <Link
                      to={`/account/orders/${ord.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
                      title="View Order Details"
                    >
                      <ArrowRight className="w-4 h-4" />
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
