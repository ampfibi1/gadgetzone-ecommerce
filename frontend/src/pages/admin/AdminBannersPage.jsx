import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Image, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const THEMES = [
  { value: 'sky', label: 'Sky blue', shell: 'bg-gradient-to-r from-sky-700 via-sky-800 to-slate-900' },
  { value: 'violet', label: 'Violet', shell: 'bg-gradient-to-r from-violet-700 via-purple-900 to-slate-900' },
  { value: 'emerald', label: 'Emerald', shell: 'bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900' },
  { value: 'amber', label: 'Amber', shell: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-800' },
  { value: 'rose', label: 'Rose', shell: 'bg-gradient-to-r from-rose-600 via-rose-800 to-slate-900' },
  { value: 'slate', label: 'Slate', shell: 'bg-gradient-to-r from-slate-700 via-slate-900 to-black' },
];

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  badge: '',
  ctaText: 'Shop now',
  linkUrl: '/products',
  imageUrl: '',
  theme: 'sky',
  isActive: true,
  sortOrder: 0,
};

const getTheme = (value) => THEMES.find((theme) => theme.value === value) || THEMES[0];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/admin/all');
      setBanners(res.data.data.banners || []);
    } catch (err) {
      toast.error('Failed to load ad banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      ctaText: banner.ctaText || '',
      linkUrl: banner.linkUrl || '',
      imageUrl: banner.imageUrl || '',
      theme: banner.theme || 'sky',
      isActive: banner.isActive ?? true,
      sortOrder: banner.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/images/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, imageUrl: res.data.data.url }));
      toast.success('Banner artwork uploaded');
    } catch (err) {
      toast.error('Failed to upload banner artwork');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error('Banner title is required');
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };

    setSaving(true);
    try {
      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, payload);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', payload);
        toast.success('Banner created');
      }
      setModalOpen(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (banner) => {
    if (!window.confirm(`Delete the "${banner.title}" banner slide?`)) return;

    try {
      await api.delete(`/banners/${banner.id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner.id}`, { isActive: !banner.isActive });
      toast.success(banner.isActive ? 'Banner hidden from storefront' : 'Banner is now live');
      fetchBanners();
    } catch (err) {
      toast.error('Failed to update banner status');
    }
  };

  const previewTheme = getTheme(form.theme);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Hero ad banners</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create the promotional slides that rotate in the storefront hero slider.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Create banner
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Image className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">No ad banners yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Create your first slide to replace the static hero on the home page.
          </p>
          <button
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((banner) => {
            const theme = getTheme(banner.theme);
            return (
              <div
                key={banner.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <div className={`relative h-28 p-4 ${theme.shell}`}>
                  {banner.imageUrl && (
                    <img
                      src={banner.imageUrl}
                      alt=""
                      className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-40"
                    />
                  )}
                  <div className="relative z-10">
                    {banner.badge && (
                      <span className="inline-block rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                        {banner.badge}
                      </span>
                    )}
                    <p className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{banner.title}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="line-clamp-2 text-xs text-slate-500">
                    {banner.subtitle || 'No subtitle provided.'}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-medium">
                    <span
                      className={`rounded px-1.5 py-0.5 ${
                        banner.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {banner.isActive ? 'Live' : 'Hidden'}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 border border-slate-200">
                      Order {banner.sortOrder}
                    </span>
                    {banner.linkUrl && (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <ExternalLink className="w-3 h-3" /> {banner.linkUrl}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleActive(banner)}
                      className="text-[11px] font-medium text-slate-600 hover:text-slate-900"
                    >
                      {banner.isActive ? 'Hide from storefront' : 'Publish to storefront'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(banner)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-50"
                        aria-label={`Edit ${banner.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        aria-label={`Delete ${banner.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              {editingBanner ? 'Edit banner slide' : 'Create banner slide'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Slides rotate automatically every 6 seconds in the order set below.
            </p>

            {/* Live preview */}
            <div className={`relative mb-5 overflow-hidden rounded-xl p-4 ${previewTheme.shell}`}>
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt=""
                  className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-40"
                />
              )}
              <div className="relative z-10 max-w-[70%]">
                {form.badge && (
                  <span className="inline-block rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                    {form.badge}
                  </span>
                )}
                <p className="mt-1.5 line-clamp-2 text-sm font-bold text-white">
                  {form.title || 'Your banner headline'}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] text-white/75">
                  {form.subtitle || 'Add a short supporting line for the promotion.'}
                </p>
                <span className="mt-2 inline-flex rounded bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-900">
                  {form.ctaText || 'Shop now'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 11.11 Gadget Festival"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Small badge
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    placeholder="e.g. LIMITED TIME"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button text
                  </label>
                  <input
                    type="text"
                    name="ctaText"
                    value={form.ctaText}
                    onChange={handleChange}
                    placeholder="Shop the deals"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supporting line
                  </label>
                  <textarea
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Up to 45% off this week only..."
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button link
                  </label>
                  <input
                    type="text"
                    name="linkUrl"
                    value={form.linkUrl}
                    onChange={handleChange}
                    placeholder="/products?category=earbuds"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Colour theme
                  </label>
                  <select
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-sky-500"
                  >
                    {THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Artwork image URL (optional)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://... or upload below"
                      className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Without artwork the slide uses the selected colour theme.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:mt-6">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Show this slide on the storefront
                </label>
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
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white rounded-lg text-xs font-semibold"
                >
                  {saving ? 'Saving...' : editingBanner ? 'Save changes' : 'Publish banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
