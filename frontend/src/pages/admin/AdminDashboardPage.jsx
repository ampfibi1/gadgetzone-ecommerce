import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-purple-100 text-purple-700">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">LHQ BANGLADESH Platform Operations</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Management Overview</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Add New Gadget
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
            <span className="text-2xl font-black text-slate-900">৳{stats.totalRevenue?.toLocaleString('en-BD')}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Orders</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalOrders}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Live Gadgets</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Registered Users</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalCustomers}</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Navigation Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Link
          to="/admin/products"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 font-bold text-slate-800 text-xs text-center hover:shadow-xs transition"
        >
          📦 Product Catalog
        </Link>
        <Link
          to="/admin/orders"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 font-bold text-slate-800 text-xs text-center hover:shadow-xs transition"
        >
          📋 Customer Orders
        </Link>
        <Link
          to="/admin/categories"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 font-bold text-slate-800 text-xs text-center hover:shadow-xs transition"
        >
          🏷️ Manage Categories
        </Link>
        <Link
          to="/admin/customers"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 font-bold text-slate-800 text-xs text-center hover:shadow-xs transition"
        >
          👥 View Customers
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="font-bold text-lg text-slate-900">Recent Platform Orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            View All Orders
          </Link>
        </div>

        {data?.recentOrders?.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No orders in system yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentOrders?.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">
                      {ord.orderNumber}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {ord.user ? ord.user.name : (ord.guestName || 'Guest Visitor')}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {ord.payment?.method || 'bKash'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ৳{ord.total?.toLocaleString('en-BD')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
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
