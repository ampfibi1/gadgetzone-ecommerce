import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import PriceDisplay from '../common/PriceDisplay';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (product.stock <= 0) {
      toast.error('This item is out of stock');
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const primaryImage = product.images?.[0]?.url || FALLBACK_IMAGE;
  const isOutOfStock = product.stock <= 0;
  const saving = product.comparePrice && product.comparePrice > product.price
    ? product.comparePrice - product.price
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-raised p-5"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="h-full w-full object-contain object-center transition-opacity duration-150 group-hover:opacity-90"
          loading="lazy"
        />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.category && (
            <span className="font-mono text-[10px] leading-4 text-muted">
              {product.category.name}
            </span>
          )}

          {isOutOfStock ? (
            <span className="font-mono text-[10px] leading-4 text-danger">Out of stock</span>
          ) : saving > 0 ? (
            <span className="font-mono text-[10px] leading-4 text-ember">
              Save ৳{saving.toLocaleString('en-BD')}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-ink transition-colors group-hover:text-ember">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-muted">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-3">
          <PriceDisplay
            amount={product.price}
            compareAmount={product.comparePrice}
            size="md"
          />

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="ui-btn ui-btn-secondary ui-btn-sm shrink-0"
            aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
