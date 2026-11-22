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
      case 'smartphones': return <Smartphone className="w-7 h-7" />;
      case 'earbuds': return <Headphones className="w-7 h-7" />;
      case 'smartwatches': return <Watch className="w-7 h-7" />;
      case 'power-banks': return <BatteryCharging className="w-7 h-7" />;
      default: return <Zap className="w-7 h-7" />;
    }
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Showcase Section - Inspired by Gadget & Gear */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-14 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Glowing Background Accent */}
        <div className="absolute -top-24 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 text-xs font-bold tracking-wide">
                <Award className="w-3.5 h-3.5" /> LHQ BANGLADESH • Official Gadget Retailer
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Authentic Gadgets, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                  Unmatched Experience.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Discover the latest flagships, true wireless ANC earbuds, smartwatches, and high-wattage power banks with official brand warranty. Visit our store or enjoy fast nationwide delivery.
              </p>

              {/* Action Buttons (NO Track Order) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-98 transition text-sm"
                >
                  Explore All Gadgets
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:01348178750"
                  className="px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold rounded-xl flex items-center gap-2 transition text-sm"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  Call: 01348178750
                </a>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>100% Genuine Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Fast BD Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Konapara Outlet</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xs text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-xl ring-2 ring-cyan-500/40 p-1 bg-slate-950">
                  <img src="/logo.jpg" alt="LHQ Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
                <h3 className="text-xl font-black text-white">LHQ BANGLADESH</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your trusted electronics destination at Konapara Shopping Complex, Dhaka, Ground Floor.
                </p>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-cyan-300 font-semibold">
                  📞 Hotline: 01348178750
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Clean Gadget & Gear Tile Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-0.5">Explore by Category</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Popular Departments</h2>
          </div>
          <Link to="/products" className="text-cyan-700 hover:text-cyan-800 font-bold text-xs sm:text-sm flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-cyan-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center shadow-xs"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center mb-4 shadow-inner">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 group-hover:text-cyan-600 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Gadgets Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest block mb-0.5">Official Warranty Products</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Featured Gadgets</h2>
          </div>
          <Link to="/products" className="text-cyan-700 hover:text-cyan-800 font-bold text-xs sm:text-sm flex items-center gap-1">
            See All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Store Visit & bKash Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider">
              Visit Our Outlet in Dhaka
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Konapara Shopping Complex, Dhaka, Ground Floor
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Prefer testing before purchasing? Visit the <strong>LHQ BANGLADESH</strong> retail shop or order online with instant bKash checkout and Cash on Delivery. For inquiries, call <strong>01348178750</strong> or email <strong>lhqbangladesh@gmail.com</strong>.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md inline-flex items-center gap-2"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:01348178750"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm transition border border-white/20 inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> 01348178750
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
