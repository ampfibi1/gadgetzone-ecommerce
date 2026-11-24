import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import Countdown from '../common/Countdown';
import useCountdown from '../../hooks/useCountdown';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';

function FlashSaleCard({ product, discountPercent, onAddToCart }) {
  const stock = Number(product.stock) || 0;
  const stockPercent = Math.max(6, Math.min(100, Math.round((stock / 50) * 100)));
  const image = product.images?.[0]?.url || FALLBACK_IMAGE;

  return (
    <article className="flex min-w-0 w-full flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-colors hover:border-slate-300">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-lg bg-slate-50"
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain p-3"
          loading="lazy"
        />
        <span className="absolute left-2 top-2 rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {discountPercent}% off
        </span>
      </Link>

      <Link
        to={`/products/${product.slug}`}
        className="mt-2 line-clamp-2 min-h-[2.25rem] text-xs font-medium leading-snug text-slate-900 transition-colors hover:text-sky-600"
      >
        {product.name}
      </Link>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-sm font-bold tabular-nums text-slate-900">
          ৳{Number(product.flashPrice).toLocaleString('en-BD')}
        </span>
        <span className="text-[11px] text-slate-400 line-through tabular-nums">
          ৳{Number(product.regularPrice).toLocaleString('en-BD')}
        </span>
      </div>

      <div className="mt-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${stock <= 5 ? 'bg-rose-500' : 'bg-amber-500'}`}
            style={{ width: `${stockPercent}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>Only {stock} left</span>
          <span className="tabular-nums">{product.flashDiscountPercent}% off</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        disabled={stock <= 0}
        className={`mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
          stock <= 0
            ? 'cursor-not-allowed bg-slate-100 text-slate-400'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        Add to cart
      </button>
    </article>
  );
}

export default function FlashSaleSection({ flashSale, loading = false }) {
  const addItem = useCartStore((state) => state.addItem);
  const countdown = useCountdown(flashSale?.endsAt);

  if (loading) {
    return (
      <section id="flash-sale" className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </section>
    );
  }

  if (!flashSale || !flashSale.products?.length || countdown.expired) {
    return null;
  }

  const discountPercent = flashSale.discountPercent;

  const handleAddToCart = (product) => {
    addItem(
      {
        ...product,
        price: product.flashPrice,
        comparePrice: product.regularPrice,
      },
      1
    );
    toast.success(`${product.name} added to cart at the flash price!`);
  };

  return (
    <section id="flash-sale" className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xs">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-rose-50 via-orange-50 to-white px-5 py-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  {flashSale.title || 'Flash sale'}
                </h2>
                <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {discountPercent}% off
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {flashSale.subtitle || 'Limited-time prices on selected gadgets.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Ends in
              </span>
              <Countdown endsAt={flashSale.endsAt} />
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 transition-colors hover:text-rose-800"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5 xl:grid-cols-6">
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
