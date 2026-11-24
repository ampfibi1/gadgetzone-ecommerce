import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

const THEMES = {
  sky: {
    shell: 'bg-gradient-to-br from-sky-700 via-sky-800 to-slate-950',
    badge: 'border-sky-300/30 bg-sky-400/15 text-sky-100',
    cta: 'bg-white text-sky-900 hover:bg-sky-50',
    ghost: 'border-white/25 text-white hover:bg-white/10',
  },
  violet: {
    shell: 'bg-gradient-to-br from-violet-700 via-purple-900 to-slate-950',
    badge: 'border-violet-300/30 bg-violet-400/15 text-violet-100',
    cta: 'bg-white text-violet-900 hover:bg-violet-50',
    ghost: 'border-white/25 text-white hover:bg-white/10',
  },
  emerald: {
    shell: 'bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-950',
    badge: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100',
    cta: 'bg-white text-emerald-900 hover:bg-emerald-50',
    ghost: 'border-white/25 text-white hover:bg-white/10',
  },
  amber: {
    shell: 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-800',
    badge: 'border-amber-200/40 bg-amber-300/20 text-amber-50',
    cta: 'bg-white text-orange-900 hover:bg-orange-50',
    ghost: 'border-white/30 text-white hover:bg-white/10',
  },
  rose: {
    shell: 'bg-gradient-to-br from-rose-600 via-rose-800 to-slate-950',
    badge: 'border-rose-300/30 bg-rose-400/15 text-rose-100',
    cta: 'bg-white text-rose-900 hover:bg-rose-50',
    ghost: 'border-white/25 text-white hover:bg-white/10',
  },
  slate: {
    shell: 'bg-gradient-to-br from-slate-700 via-slate-900 to-black',
    badge: 'border-slate-300/30 bg-slate-400/15 text-slate-100',
    cta: 'bg-white text-slate-900 hover:bg-slate-50',
    ghost: 'border-white/25 text-white hover:bg-white/10',
  },
};

const isExternalLink = (url) => /^https?:\/\//i.test(url || '');

function SlideLink({ href, className, children, tabIndex = 0 }) {
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} tabIndex={tabIndex}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href || '/products'} className={className} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

export default function HeroSlider({ banners = [], className = '' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const count = banners.length;

  useEffect(() => {
    if (count <= 1 || paused) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6000);

    return () => clearInterval(timer);
  }, [count, paused, index]);

  if (count === 0) return null;

  const activeIndex = Math.min(index, count - 1);
  const goTo = (next) => {
    setIndex(((next % count) + count) % count);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) > 45) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
  };

  return (
    <div
      className={`group relative h-[380px] overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm sm:h-[390px] lg:h-[420px] ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((banner, slideIndex) => {
        const theme = THEMES[banner.theme] || THEMES.sky;
        const isActive = slideIndex === activeIndex;

        return (
          <div
            key={banner.id || `slide-${slideIndex}`}
            className={`absolute inset-0 transition-opacity duration-500 ${theme.shell} ${
              isActive ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
            }`}
            aria-hidden={!isActive}
            inert={!isActive ? true : undefined}
          >
            {/* Ambient light blobs */}
            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-[-6rem] left-1/3 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

            {/* Banner artwork */}
            {banner.imageUrl && (
              <div className="absolute inset-y-0 right-0 hidden w-[58%] sm:block">
                <img
                  src={banner.imageUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-90"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
                  }}
                  loading={slideIndex === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
            )}

            {/* Slide copy */}
            <div className="relative z-20 flex h-full max-w-xl flex-col justify-center gap-3.5 p-6 sm:p-10">
              {banner.badge && (
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${theme.badge}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {banner.badge}
                </span>
              )}

              <h2 className="max-w-lg text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                {banner.title}
              </h2>

              {banner.subtitle && (
                <p className="max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
                  {banner.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                <SlideLink
                  href={banner.linkUrl}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${theme.cta}`}
                  tabIndex={isActive ? 0 : -1}
                >
                  {banner.ctaText || 'Shop now'}
                  <ChevronRight className="h-4 w-4" />
                </SlideLink>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-[11px] font-medium ${theme.ghost}`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Official warranty
                </span>
              </div>

              <p className="pt-1 text-[11px] text-white/60">
                bKash &amp; cash on delivery · Konapara showroom, Dhaka
              </p>
            </div>
          </div>
        );
      })}

      {/* Slide counter */}
      <div className="pointer-events-none absolute right-4 top-4 z-30 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] font-medium tabular-nums text-white/80 backdrop-blur-sm">
        {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>

      {/* Controls */}
      {count > 1 && (
        <>
          <div className="absolute bottom-4 left-6 z-30 flex items-center gap-1.5 sm:left-10">
            {banners.map((banner, dotIndex) => (
              <button
                key={`dot-${banner.id || dotIndex}`}
                type="button"
                onClick={() => goTo(dotIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  dotIndex === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to promotion ${dotIndex + 1}`}
                aria-current={dotIndex === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>

          <div className="absolute bottom-3.5 right-4 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
              aria-label="Previous promotion"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
              aria-label="Next promotion"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
