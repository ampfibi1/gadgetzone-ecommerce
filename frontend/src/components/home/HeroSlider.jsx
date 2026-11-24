import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const THEMES = {
  sky: { panel: 'bg-[#12161c]', accent: '#7f9aaa' },
  violet: { panel: 'bg-[#17131b]', accent: '#9a88a4' },
  emerald: { panel: 'bg-[#111815]', accent: '#7f9a85' },
  amber: { panel: 'bg-[#1a1510]', accent: '#c58a4a' },
  rose: { panel: 'bg-[#1a1213]', accent: '#ad7c77' },
  slate: { panel: 'bg-[#151310]', accent: '#9a9184' },
};

const isExternalLink = (url) => /^https?:\/\//i.test(url || '');

const formatBadge = (text) => {
  if (!text) return '';
  const isAllCaps = text === text.toUpperCase() && text !== text.toLowerCase();
  if (!isAllCaps) return text;
  return text.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};

function SlideLink({ href, className, children }) {
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href || '/products'} className={className}>
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
  const banner = banners[activeIndex];
  const theme = THEMES[banner.theme] || THEMES.sky;

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
      className={`group relative h-[540px] overflow-hidden rounded-xl bg-night text-night-text sm:h-[460px] lg:h-[440px] ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Store promotions"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        key={banner.id || activeIndex}
        className={`ui-slide-enter absolute inset-0 ${theme.panel}`}
      >
        <div className="grid h-full grid-rows-[1fr_150px] sm:grid-cols-[1.15fr_0.85fr] sm:grid-rows-1">
          <div className="relative flex min-h-0 flex-col justify-center p-6 pb-12 sm:p-10 sm:pb-14">
            <div className="ui-kicker text-night-muted">
              <span
                className="inline-block h-1.5 w-1.5 shrink-0"
                style={{ backgroundColor: theme.accent }}
              />
              {formatBadge(banner.badge) || 'LHQ / Dhaka'}
            </div>

            <h2 className="mt-4 max-w-[15ch] text-[34px] font-medium leading-[1.04] tracking-[-0.03em] text-night-text sm:mt-5 sm:text-[44px] lg:text-[50px]">
              {banner.title}
            </h2>

            {banner.subtitle && (
              <p className="mt-4 max-w-[42ch] text-[13px] leading-6 text-night-muted sm:mt-5 sm:text-[14px]">
                {banner.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <SlideLink
                href={banner.linkUrl}
                className="ui-btn ui-btn-lg bg-night-text text-night hover:bg-white"
              >
                {banner.ctaText || 'Shop the collection'}
                <ChevronRight className="h-4 w-4" />
              </SlideLink>

              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-night-muted">
                <ShieldCheck className="h-3.5 w-3.5" />
                Official warranty
              </span>
            </div>

            <p className="mt-7 font-mono text-[10px] text-night-muted">
              bKash &amp; cash on delivery · Konapara showroom, Dhaka
            </p>

            {count > 1 && (
              <div className="absolute bottom-4 left-6 flex items-center gap-1.5 sm:left-10 lg:left-12">
                {banners.map((item, dotIndex) => (
                  <button
                    key={`dot-${item.id || dotIndex}`}
                    type="button"
                    onClick={() => goTo(dotIndex)}
                    className={`h-0.5 transition-colors ${
                      dotIndex === activeIndex
                        ? 'w-6 bg-night-text'
                        : 'w-3 bg-night-line hover:bg-night-muted'
                    }`}
                    aria-label={`Go to promotion ${dotIndex + 1}`}
                    aria-current={dotIndex === activeIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative min-h-0 border-t border-night-line bg-night-soft sm:border-l sm:border-t-0">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8">
                <img
                  src="/logo.jpg"
                  alt=""
                  className="h-20 w-20 rounded-md border border-night-line object-cover opacity-80"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="pointer-events-none absolute right-4 top-4 z-30 font-mono text-[10px] text-night-muted">
        {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>

      {count > 1 && (
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-night-line bg-night text-night-text transition-colors hover:bg-night-soft"
            aria-label="Previous promotion"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-night-line bg-night text-night-text transition-colors hover:bg-night-soft"
            aria-label="Next promotion"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
