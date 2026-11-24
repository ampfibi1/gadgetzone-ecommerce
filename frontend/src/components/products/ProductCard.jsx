import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import PriceDisplay from '../common/PriceDisplay';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('Sorry, this product is currently out of stock.');
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-sm transition-colors flex flex-col h-full">
      {/* Product Image Link */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50 p-4">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-contain object-center transition-opacity group-hover:opacity-95"
          loading="lazy"
        />

        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-medium rounded bg-slate-900/80 text-white">
            {product.category.name}
          </span>
        )}

        {/* Stock / Savings Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium rounded bg-rose-600 text-white">
            Out of stock
          </span>
        ) : product.comparePrice && product.comparePrice > product.price ? (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium rounded border border-sky-200 bg-sky-50 text-sky-800">
            Save ৳{(product.comparePrice - product.price).toLocaleString('en-BD')}
          </span>
        ) : null}
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link to={`/products/${product.slug}`} className="block mb-1.5">
          <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <PriceDisplay
            amount={product.price}
            compareAmount={product.comparePrice}
            className="flex-col !gap-0"
          />

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
