import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BatteryCharging,
  Flame,
  Headphones,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
  Watch,
  Zap,
} from 'lucide-react';
import api from '../api/axios';
import ProductGrid from '../components/products/ProductGrid';
import HeroSlider from '../components/home/HeroSlider';
import FlashSaleSection from '../components/home/FlashSaleSection';
import useCountdown from '../hooks/useCountdown';

const FALLBACK_BANNERS = [
  {
    id: 'fallback-brand',
    title: 'Authentic gadgets with official warranty.',
    subtitle:
      'Explore flagship smartphones, noise-cancelling earbuds, smartwatches and power accessories. Visit our Dhaka showroom or order online with bKash and cash on delivery.',
    badge: 'LHQ BANGLADESH · OFFICIAL RETAILER',
    ctaText: 'Browse all gadgets',
    linkUrl: '/products',
    theme: 'sky',
    imageUrl: null,
  },
];

const pad = (value) => String(value).padStart(2, '0');

function FlashSaleTeaser({ flashSale }) {
  const countdown = useCountdown(flashSale?.endsAt);
  const isLive = Boolean(flashSale && flashSale.products?.length && !countdown.expired);

  const compactCountdown = countdown.expired
    ? 'Ended'
    : `${countdown.days > 0 ? `${countdown.days}d ` : ''}${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;

  const scrollToFlashSale = () => {
    document.getElementById('flash-sale')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/20 blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300">
            <Flame className="h-3.5 w-3.5" /> Flash sale
          </span>
          {isLive && (
            <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
              {flashSale.discountPercent}% off
            </span>
          )}
        </div>

        {isLive ? (
          <>
            <p className="mt-2 text-lg font-bold leading-snug">{flashSale.title}</p>
            <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">
              {flashSale.subtitle || 'Limited-time prices on selected gadgets.'}
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg font-bold leading-snug">
              Official warranty on every gadget
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Authentic products, nationwide delivery and bKash checkout.
            </p>
          </>
        )}
      </div>

      <div className="relative mt-4">
        {isLive ? (
          <>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Ends in</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">{compactCountdown}</p>
            <button
              type="button"
              onClick={scrollToFlashSale}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-500"
            >
              Shop the flash sale <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sky-400" /> 1-year official warranty
            </p>
            <p className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 shrink-0 text-sky-400" /> Free delivery over ৳5,000
            </p>
            <p className="flex items-center gap-2">
              <Store className="h-3.5 w-3.5 shrink-0 text-sky-400" /> Konapara showroom pickup
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [flashSale, setFlashSale] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        api.get('/products/featured'),
        api.get('/categories'),
        api.get('/banners'),
        api.get('/flash-sales/active'),
      ]);

      const [prodRes, catRes, bannerRes, saleRes] = results;

      if (prodRes.status === 'fulfilled') {
        setFeaturedProducts(prodRes.value.data.data.products || []);
      }
      if (catRes.status === 'fulfilled') {
        setCategories(catRes.value.data.data.categories || []);
      }
      if (bannerRes.status === 'fulfilled') {
        setBanners(bannerRes.value.data.data.banners || []);
      }
      if (saleRes.status === 'fulfilled') {
        setFlashSale(saleRes.value.data.data.flashSale || null);
      }

      const failed = results.filter((result) => result.status === 'rejected');
      if (failed.length > 0) {
        console.error('Some home page data failed to load:', failed.map((item) => item.reason));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'smartphones': return <Smartphone className="w-5 h-5" />;
      case 'earbuds': return <Headphones className="w-5 h-5" />;
      case 'smartwatches': return <Watch className="w-5 h-5" />;
      case 'power-banks': return <BatteryCharging className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const visibleBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

  return (
    <div className="space-y-12 pb-16 sm:space-y-14">
      {/* Hero: admin-managed ad slider + storefront rail */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {loading ? (
              <div className="h-[380px] animate-pulse rounded-2xl bg-slate-200 sm:h-[390px] lg:h-[420px]" />
            ) : (
              <HeroSlider banners={visibleBanners} />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {/* Flash sale teaser (or trust card when no campaign is live) */}
            <FlashSaleTeaser flashSale={flashSale} />

            {/* Store & support card */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src="/logo.jpg"
                    alt="LHQ Bangladesh"
                    className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">LHQ Bangladesh</p>
                    <p className="mt-0.5 flex items-start gap-1 text-[11px] leading-snug text-slate-500">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                      Konapara Shopping Complex, Dhaka, Ground Floor
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-sky-600" /> Official warranty
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                    <Truck className="h-3.5 w-3.5 text-sky-600" /> Nationwide delivery
                  </span>
                </div>
              </div>

              <a
                href="tel:01348178750"
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <Phone className="h-3.5 w-3.5" /> 01348178750
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Admin-managed flash sale with live countdown */}
      <FlashSaleSection flashSale={flashSale} loading={loading} />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Featured categories</h2>
          </div>
          <Link to="/products" className="text-sky-600 hover:text-sky-700 font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col items-center text-center shadow-xs"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1 group-hover:text-sky-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Gadgets Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Featured gadgets</h2>
          </div>
          <Link to="/products" className="text-sky-600 hover:text-sky-700 font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors">
            See all products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Store Visit & Support Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 rounded-2xl p-8 sm:p-10 text-white border border-slate-800">
          <div className="max-w-2xl space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-900 text-sky-400 text-xs font-medium border border-slate-800">
              Retail Showroom
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              Konapara Shopping Complex, Dhaka, Ground Floor
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Prefer testing devices before purchasing? Visit the <strong>LHQ Bangladesh</strong> retail store or order online with instant bKash checkout and cash on delivery. Hotline: <strong>01348178750</strong> • Email: <strong>lhqbangladesh@gmail.com</strong>.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5"
              >
                Browse catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="tel:01348178750"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium rounded-lg text-xs sm:text-sm transition-colors border border-slate-800 inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" /> 01348178750
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
