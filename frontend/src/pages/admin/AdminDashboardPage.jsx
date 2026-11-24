import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, Plus, ClipboardList, Tag, Image, Flame } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const stats = data?.stats || {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  };

  return (
    <div className="ui-container py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-stone-100 text-stone-700 border border-stone-200">
              Admin portal
            </span>
            <span className="text-xs text-stone-500">LHQ Bangladesh Store Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">Management overview</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="px-3.5 py-2 bg-[var(--color-ember)] hover:bg-[var(--color-ember-strong)] text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add new gadget
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg text-xs transition-colors"
          >
            Manage orders
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] p-5 rounded-xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[var(--color-ember)]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">Total revenue</span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">৳{stats.totalRevenue?.toLocaleString('en-BD')}</span>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-5 rounded-xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[var(--color-ember)]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">Total orders</span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">{stats.totalOrders}</span>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-5 rounded-xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <Package className="w-5 h-5 text-[var(--color-ember)]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">Live gadgets</span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-5 rounded-xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <Users className="w-5 h-5 text-[var(--color-ember)]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">Registered users</span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">{stats.totalCustomers}</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Navigation Links (Icons instead of emoji) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Link
          to="/admin/products"
          className="p-3.5 bg-[var(--color-surface)] rounded-lg border border-stone-200 hover:border-stone-300 font-medium text-stone-700 text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Package className="w-4 h-4 text-[var(--color-ember)]" /> Product catalog
        </Link>
        <Link
          to="/admin/orders"
          className="p-3.5 bg-[var(--color-surface)] rounded-lg border border-stone-200 hover:border-stone-300 font-medium text-stone-700 text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <ClipboardList className="w-4 h-4 text-[var(--color-ember)]" /> Customer orders
        </Link>
        <Link
          to="/admin/categories"
          className="p-3.5 bg-[var(--color-surface)] rounded-lg border border-stone-200 hover:border-stone-300 font-medium text-stone-700 text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Tag className="w-4 h-4 text-[var(--color-ember)]" /> Categories
        </Link>
        <Link
          to="/admin/banners"
          className="p-3.5 bg-[var(--color-surface)] rounded-lg border border-stone-200 hover:border-stone-300 font-medium text-stone-700 text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Image className="w-4 h-4 text-[var(--color-ember)]" /> Hero ads
        </Link>
        <Link
          to="/admin/flash-sales"
          className="p-3.5 bg-[var(--color-surface)] rounded-lg border border-stone-200 hover:border-stone-300 font-medium text-stone-700 text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Flame className="w-4 h-4 text-rose-500" /> Flash sales
        </Link>
        <Link
          to="/admin/customers"
          className="p-3.5 bg-[var(--color-surface)] rounded-lg border border-stone-200 hover:border-stone-300 font-medium text-stone-700 text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Users className="w-4 h-4 text-[var(--color-ember)]" /> Customer accounts
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-stone-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h3 className="font-semibold text-sm text-stone-900">Recent platform orders</h3>
          <Link to="/admin/orders" className="text-xs font-medium text-[var(--color-ember)] hover:text-sky-700">
            View all
          </Link>
        </div>

        {data?.recentOrders?.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-6">No orders in system yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
                <tr>
                  <th className="px-3.5 py-2.5">Order number</th>
                  <th className="px-3.5 py-2.5">Customer</th>
                  <th className="px-3.5 py-2.5">Payment</th>
                  <th className="px-3.5 py-2.5">Amount</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data?.recentOrders?.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono text-stone-800">
                      {ord.orderNumber}
                    </td>
                    <td className="px-3.5 py-2.5 font-medium text-stone-700">
                      {ord.user ? ord.user.name : (ord.guestName || 'Guest')}
                    </td>
                    <td className="px-3.5 py-2.5 text-stone-600">
                      {ord.payment?.method || 'bKash'}
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-stone-900 tabular-nums">
                      ৳{ord.total?.toLocaleString('en-BD')}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-stone-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
