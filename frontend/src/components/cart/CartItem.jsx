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
            className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${product.slug}`}
            className="font-semibold text-slate-900 hover:text-blue-600 transition text-sm line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit Price: <span className="font-semibold text-slate-700">৳{product.price.toLocaleString('en-BD')}</span>
          </p>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 transition"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-slate-800">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={product.stock && quantity >= product.stock}
            className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[90px]">
          <span className="font-bold text-slate-900 text-sm">
            ৳{lineTotal.toLocaleString('en-BD')}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(product.id)}
          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
          title="Remove Item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
