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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
        </Link>
      </div>

      <div className="pb-6 border-b border-slate-200 mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registered Customers</h1>
        <p className="text-sm text-slate-500 mt-1">Review accounts and order counts across Bangladesh</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No registered customer accounts found.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Total Orders</th>
                  <th className="px-6 py-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{c.email}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{c.phone || 'N/A'}</td>
                    <td className="px-6 py-4 font-black text-blue-600">
                      {c._count?.orders || 0} order(s)
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('en-BD')}
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
              onPageChange={(p) => fetchCustomers(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
