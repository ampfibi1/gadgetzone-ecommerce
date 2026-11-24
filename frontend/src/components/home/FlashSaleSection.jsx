import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import Countdown from '../common/Countdown';
import useCountdown from '../../hooks/useCountdown';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';

const GRID_COLUMNS = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
};

function FlashSaleCard({ product, discountPercent, onAddToCart }) {
  const stock = Number(product.stock) || 0;
  const stockPercent = Math.max(6, Math.min(100, Math.round((stock / 50) * 100)));
  const image = product.images?.[0]?.url || FALLBACK_IMAGE;

  return (
    <article className="flex min-w-0 flex-col rounded-lg border border-line bg-surface p-3">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-md bg-raised"
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain p-3"
          loading="lazy"
        />
        <span className="absolute left-2 top-2 font-mono text-[10px] text-ember">
          −{discountPercent}%
        </span>
      </Link>

      <Link
        to={`/products/${product.slug}`}
        className="mt-3 line-clamp-2 min-h-[2.5rem] text-[12px] font-medium leading-5 text-ink transition-colors hover:text-ember"
      >
        {product.name}
      </Link>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-[14px] font-medium tabular-nums tracking-[-0.02em] text-ink">
          ৳{Number(product.flashPrice).toLocaleString('en-BD')}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted line-through">
          ৳{Number(product.regularPrice).toLocaleString('en-BD')}
        </span>
      </div>

      <div className="mt-3">
        <div className="h-0.5 w-full overflow-hidden bg-line">
          <div
            className={`h-full ${stock <= 5 ? 'bg-danger' : 'bg-ember'}`}
            style={{ width: `${stockPercent}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-muted">
          <span>{stock} left</span>
          <span>{product.flashDiscountPercent}% off</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={stock <= 0}
        className="ui-btn ui-btn-secondary ui-btn-sm mt-3 w-full"
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        Add
      </button>
    </article>
  );
}

export default function FlashSaleSection({ flashSale, loading = false, className = '' }) {
  const addItem = useCartStore((state) => state.addItem);
  const countdown = useCountdown(flashSale?.endsAt);

  if (loading) {
    return (
      <section id="flash-sale" className={`ui-container scroll-mt-24 ${className}`}>
        <div className="h-56 animate-pulse rounded-xl border border-line bg-surface" />
      </section>
    );
  }

  if (!flashSale || !flashSale.products?.length || countdown.expired) {
    return null;
  }

  const discountPercent = flashSale.discountPercent;
  const columnClass = GRID_COLUMNS[Math.min(flashSale.products.length, 6)] || GRID_COLUMNS[6];

  const handleAddToCart = (product) => {
    addItem(
      {
        ...product,
        price: product.flashPrice,
        comparePrice: product.regularPrice,
      },
      1
    );
    toast.success(`${product.name} added at the flash price`);
  };

  return (
    <section id="flash-sale" className={`ui-container scroll-mt-24 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-col gap-5 border-b border-line px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="ui-kicker">
                <span className="ui-mark" />
                Flash sale
              </span>
              <span className="ui-tag ui-tag-accent">{discountPercent}% off</span>
            </div>
            <h2 className="mt-2.5 text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[28px]">
              {flashSale.title || 'Flash sale'}
            </h2>
            <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-muted">
              {flashSale.subtitle || 'Limited-time prices on selected gadgets.'}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-5">
            <div>
              <p className="font-mono text-[9px] text-muted">Ends in</p>
              <Countdown endsAt={flashSale.endsAt} className="mt-2" />
            </div>
            <Link to="/products" className="ui-btn ui-btn-secondary ui-btn-sm">
              All deals
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5 ${columnClass}`}>
          {flashSale.products.map((product) => (
            <FlashSaleCard
              key={product.id}
              product={product}
              discountPercent={discountPercent}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
