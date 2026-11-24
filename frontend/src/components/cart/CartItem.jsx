import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { Link } from 'react-router-dom';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const primaryImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
  const lineTotal = product.price * quantity;

  return (
    <div className="flex flex-col gap-4 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <Link to={`/products/${product.slug}`} className="shrink-0">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-16 w-16 rounded-md border border-line bg-raised object-contain p-1.5"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${product.slug}`}
            className="line-clamp-1 text-[13px] font-medium text-ink transition-colors hover:text-ember"
          >
            {product.name}
          </Link>
          <p className="mt-1 font-mono text-[10px] text-muted">
            ৳{product.price.toLocaleString('en-BD')} each
          </p>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="mt-1 font-mono text-[10px] text-ember">
              {product.stock} left
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
        <div className="flex items-center overflow-hidden rounded-lg border border-line bg-surface">
          <button
            type="button"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-raised"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center font-mono text-[12px] tabular-nums text-ink">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={product.stock && quantity >= product.stock}
            className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-raised disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="min-w-[72px] text-right font-mono text-[13px] tabular-nums text-ink">
          ৳{lineTotal.toLocaleString('en-BD')}
        </span>

        <button
          type="button"
          onClick={() => removeItem(product.id)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-danger"
          title="Remove item"
          aria-label={`Remove ${product.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
