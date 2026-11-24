import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Eye, Calendar, Clock } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/my-orders?page=${page}&limit=10`);
      setOrders(res.data.data.orders || []);
      setPagination(res.data.data.pagination || { page, limit: 10, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Order history</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review all purchases placed under your customer account
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
          <h3 className="font-semibold text-slate-800 text-sm mb-1">No orders found</h3>
          <p className="text-xs text-slate-500 mb-5">You haven't placed any orders yet.</p>
          <Link to="/products" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors">
            Browse gadgets
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {ord.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-BD')}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {ord.items?.length || 0} gadget(s)
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ৳{ord.total?.toLocaleString('en-BD')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/account/orders/${ord.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
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
