import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { Link } from 'react-router-dom';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
  const lineTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-slate-200">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link to={`/products/${product.slug}`} className="shrink-0">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${product.slug}`}
            className="font-medium text-slate-900 hover:text-sky-600 transition-colors text-xs sm:text-sm line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit price: <span className="font-medium text-slate-700 tabular-nums">৳{product.price.toLocaleString('en-BD')}</span>
          </p>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-5">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-semibold text-slate-800 tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={product.stock && quantity >= product.stock}
            className="p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[80px]">
          <span className="font-semibold text-slate-900 text-xs sm:text-sm tabular-nums">
            ৳{lineTotal.toLocaleString('en-BD')}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(product.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
