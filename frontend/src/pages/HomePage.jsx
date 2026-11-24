import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BatteryCharging,
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
import SectionHeading from '../components/common/SectionHeading';
import useCountdown from '../hooks/useCountdown';

const FALLBACK_BANNERS = [
  {
    id: 'fallback-brand',
    title: 'Authentic gadgets, officially warranted.',
    subtitle:
      'Phones, earbuds, smartwatches and power gear from the counter at Konapara. Pay with bKash or cash on delivery.',
    badge: 'LHQ / Dhaka',
    ctaText: 'Browse the catalog',
    linkUrl: '/products',
    theme: 'sky',
    imageUrl: null,
  },
];

const pad = (value) => String(value).padStart(2, '0');

const categoryIcons = {
  smartphones: Smartphone,
  earbuds: Headphones,
  smartwatches: Watch,
  'power-banks': BatteryCharging,
};

function CounterRail({ flashSale }) {
  const countdown = useCountdown(flashSale?.endsAt);
  const isLive = Boolean(flashSale && flashSale.products?.length && !countdown.expired);

  const compactCountdown = countdown.expired
    ? 'Ended'
    : `${countdown.days > 0 ? `${countdown.days}d ` : ''}${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;

  const scrollToFlashSale = () => {
    document.getElementById('flash-sale')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="flex h-full flex-col rounded-xl border border-line bg-surface p-5">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="ui-kicker">
            <span className="ui-mark" />
            Flash sale
          </span>
          {isLive && <span className="ui-tag ui-tag-accent">{flashSale.discountPercent}% off</span>}
        </div>

        {isLive ? (
          <>
            <h3 className="mt-3 text-[18px] font-medium leading-6 tracking-[-0.01em] text-ink">
              {flashSale.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-muted">
              {flashSale.subtitle || 'Limited-time prices on selected gadgets.'}
            </p>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] text-muted">Ends in</p>
                <p className="mt-1 font-mono text-[17px] tabular-nums text-ink">{compactCountdown}</p>
              </div>
              <button
                type="button"
                onClick={scrollToFlashSale}
                className="ui-btn ui-btn-secondary ui-btn-sm"
              >
                Shop sale
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-3 text-[18px] font-medium leading-6 tracking-[-0.01em] text-ink">
              Official warranty on every gadget
            </h3>
            <div className="mt-4 space-y-2.5">
              <p className="flex items-center gap-2 text-[11px] text-ink-soft">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-muted" />
                1-year official warranty
              </p>
              <p className="flex items-center gap-2 text-[11px] text-ink-soft">
                <Truck className="h-3.5 w-3.5 shrink-0 text-muted" />
                Free delivery over ৳5,000
              </p>
              <p className="flex items-center gap-2 text-[11px] text-ink-soft">
                <Store className="h-3.5 w-3.5 shrink-0 text-muted" />
                Konapara showroom pickup
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-auto border-t border-line pt-5">
        <div className="flex items-start gap-3">
          <img
            src="/logo.jpg"
            alt=""
            className="h-9 w-9 shrink-0 rounded-md border border-line object-cover"
          />
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-ink">LHQ Bangladesh</p>
            <p className="mt-0.5 flex items-start gap-1 text-[11px] leading-4 text-muted">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              Konapara Shopping Complex, Dhaka
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-muted">
          <span>Daily 10:00–21:00</span>
          <span>Ground floor</span>
        </div>

        <a href="tel:01348178750" className="ui-btn ui-btn-secondary ui-btn-sm mt-3 w-full">
          <Phone className="h-3.5 w-3.5" />
          Call the counter
        </a>
      </div>
    </aside>
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

  const visibleBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

  return (
    <div className="pb-16">
      <section className="ui-container pt-6 sm:pt-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
          <div>
            {loading ? (
              <div className="h-[540px] animate-pulse rounded-xl bg-raised sm:h-[460px] lg:h-[480px]" />
            ) : (
              <HeroSlider banners={visibleBanners} />
            )}
          </div>

          <CounterRail flashSale={flashSale} />
        </div>
      </section>

      <FlashSaleSection flashSale={flashSale} loading={loading} className="mt-10 sm:mt-12" />

      <section className="ui-container mt-12 sm:mt-16">
        <SectionHeading
          index="01 / Categories"
          title="Shop by category"
          description="Phones, audio, wearables and power gear, all covered by official warranty."
          action={{ label: 'All gadgets', to: '/products' }}
        />

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || Zap;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group flex flex-col justify-between gap-8 rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-raised"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-[18px] w-[18px] text-muted" />
                  {category._count?.products !== undefined && (
                    <span className="font-mono text-[10px] text-muted">
                      {category._count.products}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[13px] font-medium text-ink">{category.name}</h3>
                  <p className="mt-1 line-clamp-1 text-[11px] text-muted">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="ui-container mt-12 sm:mt-16">
        <SectionHeading
          index="02 / Catalog"
          title="Featured gadgets"
          description="A short list from the counter, chosen for stock and warranty."
          action={{ label: 'All products', to: '/products' }}
        />
        <div className="mt-6">
          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      <section className="ui-container mt-12 sm:mt-16">
        <div className="grid overflow-hidden rounded-xl border border-night-line bg-night md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-10">
            <div className="ui-kicker text-night-muted">
              <span className="ui-mark" />
              Retail showroom
            </div>
            <h2 className="mt-3 max-w-md text-[28px] font-medium leading-[1.08] tracking-[-0.02em] text-night-text sm:text-[34px]">
              Test it at the counter. Take it home.
            </h2>
            <p className="mt-4 max-w-lg text-[13px] leading-6 text-night-muted">
              The showroom is on the ground floor at Konapara Shopping Complex. Compare the
              devices in person, then pay with bKash or cash on delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="ui-btn ui-btn-lg bg-night-text text-night hover:bg-white"
              >
                Browse the catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:01348178750"
                className="ui-btn ui-btn-lg border-night-line text-night-text hover:bg-night-soft"
              >
                <Phone className="h-4 w-4" />
                01348178750
              </a>
            </div>
          </div>

          <div className="border-t border-night-line p-6 sm:p-8 md:border-l md:border-t-0">
            <div className="rounded-lg border border-night-line bg-night-soft p-5">
              <p className="font-mono text-[9px] text-night-muted">Store details</p>
              <p className="mt-2 text-[16px] font-medium text-night-text">LHQ Bangladesh</p>
              <p className="mt-1 text-[12px] leading-5 text-night-muted">
                Konapara Shopping Complex
                <br />
                Dhaka, Ground Floor
              </p>

              <div className="my-4 border-t border-night-line" />

              <dl className="space-y-2 font-mono text-[10px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-night-muted">Open</dt>
                  <dd className="text-night-text">10:00–21:00</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-night-muted">Phone</dt>
                  <dd>
                    <a href="tel:01348178750" className="text-night-text hover:text-white">
                      01348178750
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-night-muted">Email</dt>
                  <dd>
                    <a
                      href="mailto:lhqbangladesh@gmail.com"
                      className="text-night-text hover:text-white"
                    >
                      lhqbangladesh@gmail.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
