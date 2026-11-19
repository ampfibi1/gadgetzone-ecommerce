import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useCartStore } from '../stores/cartStore';
import PriceDisplay from '../components/common/PriceDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${slug}`);
        const prod = res.data.data.product;
        setProduct(prod);
        setSelectedImage(prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} added to your cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-blue-600 transition">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800 truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img.url ? 'border-blue-600' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            {product.category && (
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mb-3">
                {product.category.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-xs text-slate-400 font-mono mb-4">
                SKU: {product.sku}
              </p>
            )}

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl mb-6">
              <PriceDisplay
                amount={product.price}
                compareAmount={product.comparePrice}
                className="text-2xl font-black"
              />
              <p className="text-xs text-slate-500 mt-1">
                Inclusive of all taxes. Free shipping on orders over ৳5,000.
              </p>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-600' : 'text-emerald-700'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units available)`}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-900 text-sm mb-2">Description & Highlights</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-3 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-3 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all text-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Fast BD Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Genuine Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
