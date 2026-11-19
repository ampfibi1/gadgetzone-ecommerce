import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
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
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Link */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900/80 backdrop-blur-xs text-white">
            {product.category.name}
          </span>
        )}

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-600 text-white shadow-xs">
            Out of Stock
          </span>
        ) : product.comparePrice && product.comparePrice > product.price ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
            Save ৳{(product.comparePrice - product.price).toLocaleString('en-BD')}
          </span>
        ) : null}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.slug}`} className="block mb-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
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
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
