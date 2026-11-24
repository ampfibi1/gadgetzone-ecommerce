import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  const fetchProducts = async (page = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/products/admin/all?page=${page}&limit=15&search=${encodeURIComponent(searchQuery)}`);
      setProducts(res.data.data.products || []);
      setPagination(res.data.data.pagination || { page, limit: 15, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, search);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1, search);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate/delete "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      toast.success(`Product deactivated`);
      fetchProducts(pagination.page, search);
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="ui-container py-8">
      <div className="mb-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Product catalog</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage products, pricing, categories, and inventory</p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-3.5 py-2 bg-[var(--color-ember)] hover:bg-[var(--color-ember-strong)] text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add new product
        </Link>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2 max-w-md">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
        />
        <button
          type="submit"
          className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg text-xs transition-colors"
        >
          Search
        </button>
      </form>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-stone-200 p-10 text-center text-stone-400 text-xs">
          No products found.
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-medium border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-xs line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">{prod.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-700">
                      {prod.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-900">
                      ৳{prod.price?.toLocaleString('en-BD')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${prod.stock <= 5 ? 'text-amber-600' : 'text-stone-800'}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                          prod.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          className="p-1.5 text-[var(--color-ember)] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
              onPageChange={(p) => fetchProducts(p, search)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
