import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Headphones, Watch, BatteryCharging, Zap, Shield, Truck } from 'lucide-react';
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
      case 'smartphones': return <Smartphone className="w-8 h-8" />;
      case 'earbuds': return <Headphones className="w-8 h-8" />;
      case 'smartwatches': return <Watch className="w-8 h-8" />;
      case 'power-banks': return <BatteryCharging className="w-8 h-8" />;
      default: return <Zap className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" /> Next-Gen Technology Store
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Upgrade Your Life With Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Gadgets</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Explore authentic flagships, noise-cancelling earbuds, smartwatches, and fast-charging accessories with official warranty and instant bKash checkout across Bangladesh.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all text-sm"
              >
                Explore All Gadgets
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/track-order"
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl transition text-sm"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Discover high-end electronics tailored to your needs</p>
          </div>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center mb-4">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Handpicked Deals</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Featured Gadgets</h2>
          </div>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Value Proposition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-xl relative z-10">
            <h3 className="text-3xl font-black mb-4 tracking-tight">
              Ready for Guest Checkout with Instant bKash?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              No long registration required. Browse your desired gadget, add to cart, and checkout seamlessly as a guest or with your customer account.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-950 font-bold rounded-xl text-sm hover:bg-slate-100 transition shadow-sm"
            >
              Start Shopping Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
