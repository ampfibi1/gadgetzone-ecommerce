import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Eye, Filter } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '15');
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await api.get(`/orders?${params.toString()}`);
      setOrders(res.data.data.orders || []);
      setPagination(res.data.data.pagination || { page, limit: 15, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Order management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review orders, update fulfillment status, and track payments</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-xs">
          No orders found matching criteria.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Customer Type & Name</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString('en-BD')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {ord.user ? ord.user.name : (ord.guestName || 'Guest Visitor')}
                      </p>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        ord.userId ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {ord.userId ? 'Account Customer' : 'Guest Checkout'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {ord.shippingCity}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className="block">{ord.payment?.method || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Status: {ord.payment?.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ৳{ord.total?.toLocaleString('en-BD')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:outline-hidden"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(p) => fetchOrders(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
