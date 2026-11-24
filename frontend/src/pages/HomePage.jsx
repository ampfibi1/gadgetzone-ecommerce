import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Headphones, Watch, BatteryCharging, Zap, ShieldCheck, Truck, Store, Phone, Award } from 'lucide-react';
import api from '../api/axios';
import ProductGrid from '../components/products/ProductGrid';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(prodRes.data.data.products || []);
        setCategories(catRes.data.data.categories || []);
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Showcase Section */}
      <section className="bg-slate-950 text-white py-14 sm:py-18 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-400 text-xs font-medium">
                <Award className="w-3.5 h-3.5" /> LHQ Bangladesh • Official Retailer
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Authentic gadgets with official warranty.
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Explore the latest flagship smartphones, noise-cancelling earbuds, smartwatches, and high-wattage power accessories. Visit our Dhaka retail shop or order online with bKash and cash on delivery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg flex items-center gap-2 transition-colors text-xs sm:text-sm"
                >
                  Browse all gadgets
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:01348178750"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium rounded-lg flex items-center gap-2 transition-colors text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  01348178750
                </a>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Official warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Nationwide delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Konapara showroom</span>
                </div>
              </div>
            </div>

            {/* Right Hero Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm p-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-4">
                <img
                  src="/logo.jpg"
                  alt="LHQ Bangladesh"
                  className="w-20 h-20 mx-auto rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-semibold text-white">LHQ Bangladesh</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Konapara Shopping Complex, Dhaka, Ground Floor
                  </p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                  Direct support hotline: <a href="tel:01348178750" className="text-sky-400 font-medium">01348178750</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
