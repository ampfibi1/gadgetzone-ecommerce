import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/customers?page=${page}&limit=15`);
      setCustomers(res.data.data.customers || []);
      setPagination(res.data.data.pagination || { page, limit: 15, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, []);

  return (
    <div className="ui-container py-8">
      <div className="mb-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>
      </div>

      <div className="pb-5 border-b border-stone-200 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Registered customers</h1>
        <p className="text-xs text-stone-500 mt-0.5">Review customer accounts and order totals across Bangladesh</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : customers.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-stone-200 p-10 text-center text-stone-400 text-xs">
          No registered customer accounts found.
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Customer name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Total orders</th>
                  <th className="px-5 py-3">Registered date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-stone-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-semibold text-xs shrink-0">
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="px-5 py-3 text-stone-600">{c.email}</td>
                    <td className="px-5 py-3 text-stone-700">{c.phone || 'N/A'}</td>
                    <td className="px-5 py-3 font-semibold text-stone-900 tabular-nums">
                      {c._count?.orders || 0} order(s)
                    </td>
                    <td className="px-5 py-3 text-stone-400">
                      {new Date(c.createdAt).toLocaleDateString('en-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-stone-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(p) => fetchCustomers(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
