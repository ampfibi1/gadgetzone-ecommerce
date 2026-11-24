import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarClock,
  Flame,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const toLocalInput = (value) => {
  const date = value ? new Date(value) : new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' });

const buildEmptyForm = () => ({
  title: '',
  subtitle: '',
  discountPercent: 20,
  startsAt: toLocalInput(new Date()),
  endsAt: toLocalInput(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
  isActive: true,
  productIds: [],
});

const getStatus = (sale) => {
  const now = Date.now();
  if (!sale.isActive) return { label: 'Paused', className: 'bg-slate-100 text-slate-600 border-slate-200' };
  if (new Date(sale.startsAt).getTime() > now) {
    return { label: 'Scheduled', className: 'bg-sky-50 text-sky-700 border-sky-200' };
  }
  if (new Date(sale.endsAt).getTime() < now) {
    return { label: 'Ended', className: 'bg-slate-100 text-slate-500 border-slate-200' };
  }
  return { label: 'Live now', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
};

export default function AdminFlashSalePage() {
  const [flashSales, setFlashSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [form, setForm] = useState(buildEmptyForm);
  const [productSearch, setProductSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes] = await Promise.all([
        api.get('/flash-sales/admin/all'),
        api.get('/products/admin/all', { params: { limit: 50 } }),
      ]);
      setFlashSales(salesRes.data.data.flashSales || []);
      setProducts(productsRes.data.data.products || []);
    } catch (err) {
      toast.error('Failed to load flash sale data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, productSearch]);

  const openCreateModal = () => {
    setEditingSale(null);
    setForm(buildEmptyForm());
    setProductSearch('');
    setModalOpen(true);
  };

  const openEditModal = (sale) => {
    setEditingSale(sale);
    setForm({
      title: sale.title || '',
      subtitle: sale.subtitle || '',
      discountPercent: sale.discountPercent ?? 20,
      startsAt: toLocalInput(sale.startsAt),
      endsAt: toLocalInput(sale.endsAt),
      isActive: sale.isActive ?? true,
      productIds: (sale.products || []).map((item) => item.product?.id || item.productId).filter(Boolean),
    });
    setProductSearch('');
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleProduct = (productId) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const visibleProductIds = filteredProducts.map((product) => product.id);
  const allVisibleSelected =
    visibleProductIds.length > 0 &&
    visibleProductIds.every((id) => form.productIds.includes(id));

  const toggleAllVisible = () => {
    setForm((prev) => {
      if (allVisibleSelected) {
        return { ...prev, productIds: prev.productIds.filter((id) => !visibleProductIds.includes(id)) };
      }
      return { ...prev, productIds: [...new Set([...prev.productIds, ...visibleProductIds])] };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error('Flash sale title is required');
      return;
    }

    const discount = Number(form.discountPercent);
    if (!Number.isFinite(discount) || discount < 1 || discount > 90) {
      toast.error('Discount must be between 1% and 90%');
      return;
    }

    const startsAt = new Date(form.startsAt);
    const endsAt = new Date(form.endsAt);

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      toast.error('Enter a valid start and end date');
      return;
    }

    if (endsAt <= startsAt) {
      toast.error('The end date must be after the start date');
      return;
    }

    if (form.productIds.length === 0) {
      toast.error('Select at least one product for the flash sale');
      return;
    }

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      discountPercent: discount,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      isActive: form.isActive,
      productIds: form.productIds,
    };

    setSaving(true);
    try {
      if (editingSale) {
        await api.put(`/flash-sales/${editingSale.id}`, payload);
        toast.success('Flash sale updated');
      } else {
        await api.post('/flash-sales', payload);
        toast.success('Flash sale created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save flash sale');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sale) => {
    if (!window.confirm(`Delete the "${sale.title}" flash sale?`)) return;

    try {
      await api.delete(`/flash-sales/${sale.id}`);
      toast.success('Flash sale deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete flash sale');
    }
  };

  const toggleActive = async (sale) => {
    try {
      await api.put(`/flash-sales/${sale.id}`, { isActive: !sale.isActive });
      toast.success(sale.isActive ? 'Flash sale paused' : 'Flash sale activated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update flash sale status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Flash sales</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Run a countdown campaign on the home page with a custom discount and product list.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Create flash sale
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : flashSales.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Flame className="w-8 h-8 text-rose-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">No flash sales yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Create a campaign to show discounted products with a live countdown.
          </p>
          <button
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create flash sale
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {flashSales.map((sale) => {
            const status = getStatus(sale);
            const saleProducts = sale.products || [];

            return (
              <div key={sale.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{sale.title}</h3>
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
                        {sale.discountPercent}% off
                      </span>
                    </div>

                    {sale.subtitle && (
                      <p className="mt-1 text-xs text-slate-500">{sale.subtitle}</p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateTime(sale.startsAt)} → {formatDateTime(sale.endsAt)}
                      </span>
                      <span>{saleProducts.length} products</span>
                    </div>

                    {saleProducts.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        {saleProducts.slice(0, 6).map((item) => (
                          <div
                            key={item.id}
                            className="h-9 w-9 overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                            title={item.product?.name}
                          >
                            {item.product?.images?.[0]?.url ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product?.name || 'Product'}
                                className="h-full w-full object-contain p-0.5"
                              />
                            ) : (
                              <div className="h-full w-full bg-slate-100" />
                            )}
                          </div>
                        ))}
                        {saleProducts.length > 6 && (
                          <span className="text-[11px] font-medium text-slate-400">
                            +{saleProducts.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(sale)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {sale.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => openEditModal(sale)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-50"
                      aria-label={`Edit ${sale.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      aria-label={`Delete ${sale.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              {editingSale ? 'Edit flash sale' : 'Create flash sale'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              The discount is applied to each selected product&apos;s current price.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campaign title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Midnight Flash Sale"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supporting line
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Three days only — extra savings on selected gadgets."
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount percentage *
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={form.discountPercent}
                    onChange={handleChange}
                    min="1"
                    max="90"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:mt-6">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  Campaign enabled
                </label>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Starts at *
                  </label>
                  <input
                    type="datetime-local"
                    name="startsAt"
                    value={form.startsAt}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ends at *
                  </label>
                  <input
                    type="datetime-local"
                    name="endsAt"
                    value={form.endsAt}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200">
                <div className="flex flex-col gap-2 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Products ({form.productIds.length} selected)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Only products with stock will appear on the storefront.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(event) => setProductSearch(event.target.value)}
                        placeholder="Search products"
                        className="w-40 rounded-lg border border-slate-200 py-1.5 pl-8 pr-2 text-xs focus:outline-hidden focus:border-rose-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={toggleAllVisible}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {allVisibleSelected ? 'Clear' : 'Select all'}
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-400">No products found.</p>
                  ) : (
                    filteredProducts.map((product) => {
                      const checked = form.productIds.includes(product.id);
                      return (
                        <label
                          key={product.id}
                          className={`flex cursor-pointer items-center gap-3 p-2.5 text-xs ${
                            checked ? 'bg-rose-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleProduct(product.id)}
                            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                          />
                          <div className="h-8 w-8 overflow-hidden rounded border border-slate-200 bg-slate-50 shrink-0">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt=""
                                className="h-full w-full object-contain p-0.5"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{product.name}</p>
                            <p className="text-[11px] text-slate-500">
                              ৳{Number(product.price).toLocaleString('en-BD')} · {product.stock} in stock
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white rounded-lg text-xs font-semibold"
                >
                  {saving ? 'Saving...' : editingSale ? 'Save changes' : 'Publish flash sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
