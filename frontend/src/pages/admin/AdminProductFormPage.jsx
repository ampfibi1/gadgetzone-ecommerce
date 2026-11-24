import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: 10,
    categoryId: '',
    sku: '',
    isActive: true,
    isFeatured: false,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data.data.categories || []);

        if (isEditMode) {
          // Find product details
          const prodRes = await api.get('/products/admin/all?limit=100');
          const found = prodRes.data.data.products?.find((p) => p.id === id);
          if (found) {
            setFormData({
              name: found.name || '',
              description: found.description || '',
              price: found.price?.toString() || '',
              comparePrice: found.comparePrice?.toString() || '',
              stock: found.stock || 0,
              categoryId: found.categoryId || found.category?.id || '',
              sku: found.sku || '',
              isActive: found.isActive ?? true,
              isFeatured: found.isFeatured ?? false,
            });
            setImages(found.images?.map((img) => img.url) || []);
          }
        }
      } catch (err) {
        toast.error('Failed to load initial data');
      } finally {
        setFetching(false);
      }
    };
    fetchInit();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('image', file);

      const res = await api.post('/images/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data.data.url;
      setImages([...images, uploadedUrl]);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('Name, price and category are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock),
        images: images.map((url, idx) => ({ url, isPrimary: idx === 0 })),
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to products
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          {isEditMode ? 'Edit gadget' : 'Add new gadget'}
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Provide product details, pricing in BDT, inventory count and official images
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Samsung Galaxy A55 5G"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                SKU / Model Number
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. SAM-A55-128"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Price (BDT) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 49999"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Regular / Compare Price (Optional)
              </label>
              <input
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 54999"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Product Description & Specifications <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Highlight features, display, battery, processor, and warranty..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Product Images */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Product Images
            </label>

            {/* Input URL */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                placeholder="Paste Image URL..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>

            {/* File Upload Option */}
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer">
                <Upload className="w-4 h-4 text-blue-600" />
                {uploadingImage ? 'Uploading Image...' : 'Or Upload Local File'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview List */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden group">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-[9px] text-white text-center font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">Active (Visible in Store)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">Featured on Homepage</span>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
