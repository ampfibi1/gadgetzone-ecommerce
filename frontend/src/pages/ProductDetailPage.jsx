import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Plus, Minus, MapPin, Phone } from 'lucide-react';
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
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link to="/" className="hover:text-ink-soft transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-ink-soft transition-colors">Products</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-ink-soft transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink-soft truncate font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-surface p-6 sm:p-8 rounded-xl border border-line">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-raised border border-line p-6 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border p-1 bg-raised shrink-0 transition-colors ${
                    selectedImage === img.url ? 'border-ember' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            {product.category && (
              <span className="inline-block px-2 py-0.5 bg-raised text-ink-soft text-xs font-medium rounded mb-3">
                {product.category.name}
              </span>
            )}

            <h1 className="text-xl sm:text-2xl font-medium text-ink tracking-tight mb-2">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-xs text-muted font-mono mb-4">
                SKU: {product.sku}
              </p>
            )}

            {/* Price Box */}
            <div className="p-4 bg-raised border border-line rounded-xl mb-5">
              <PriceDisplay
                amount={product.price}
                compareAmount={product.comparePrice}
                className="text-xl font-medium"
              />
              <p className="text-xs text-muted mt-1">
                Inclusive of all taxes. Free delivery on orders over ৳5,000.
              </p>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-danger' : 'bg-positive'}`} />
              <span className={`text-xs font-medium ${isOutOfStock ? 'text-danger' : 'text-positive'}`}>
                {isOutOfStock ? 'Out of stock' : `In stock (${product.stock} units available)`}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-ink text-xs mb-1.5">Description</h3>
              <p className="text-xs text-ink-soft leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-5 border-t border-line">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-line rounded-lg overflow-hidden bg-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-ink-soft hover:bg-raised disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-semibold text-ink tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-ink-soft hover:bg-raised disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-2.5 px-5 bg-ember hover:bg-ember-strong disabled:bg-raised disabled:text-muted text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Currently out of stock' : 'Add to cart'}
              </button>
            </div>

            {/* Guarantees & Store Info */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line text-center text-[11px] text-muted">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-ember" />
                <span>Fast BD delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-positive" />
                <span>Official warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-muted" />
                <span>Replacement policy</span>
              </div>
            </div>

            <div className="p-3 bg-raised rounded-lg border border-line text-[11px] text-ink-soft flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-ember shrink-0" />
                Konapara Shopping Complex, Dhaka, Ground Floor
              </span>
              <a href="tel:01348178750" className="flex items-center gap-1 text-ember font-medium hover:underline">
                <Phone className="w-3 h-3" /> 01348178750
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
