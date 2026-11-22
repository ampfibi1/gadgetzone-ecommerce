import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin, Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 border-t border-slate-800/80">
      {/* Features Bar - Gadget & Gear Style Trust Highlights */}
      <div className="border-b border-slate-900 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express Bangladesh Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Inside Dhaka 24-48h, Nationwide 2-4 days</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Tech</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic gadgets with official brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Retail Store Visit</h4>
              <p className="text-xs text-slate-400 mt-0.5">Konapara Shopping Complex, Ground Floor</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Customer Care</h4>
              <p className="text-xs text-slate-400 mt-0.5">Call 01348178750 (9am - 10pm)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="LHQ BANGLADESH"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30"
            />
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-tight leading-none">
                LHQ <span className="text-cyan-400">BANGLADESH</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Gadget & Electronics Hub
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            LHQ BANGLADESH is your premier retailer for authentic smartphones, active noise-cancelling earbuds, smartwatches, and high-performance charging accessories.
          </p>

          <div className="flex items-center gap-2.5 pt-1">
            <span className="px-2.5 py-1 bg-pink-950/40 text-pink-400 border border-pink-800/50 rounded-md font-bold text-[11px]">
              bKash Accepted
            </span>
            <span className="px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 rounded-md font-bold text-[11px]">
              Cash on Delivery
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h5 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-[11px] text-cyan-400">
            Featured Categories
          </h5>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/products?category=smartphones" className="hover:text-cyan-400 transition">
                Smartphones & Flagships
              </Link>
            </li>
            <li>
              <Link to="/products?category=earbuds" className="hover:text-cyan-400 transition">
                TWS & ANC Earbuds
              </Link>
            </li>
            <li>
              <Link to="/products?category=smartwatches" className="hover:text-cyan-400 transition">
                Smartwatches & Fitness Trackers
              </Link>
            </li>
            <li>
              <Link to="/products?category=power-banks" className="hover:text-cyan-400 transition">
                High-Wattage Power Banks
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-cyan-400 transition">
                Browse Full Catalog
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links (Track Order completely removed) */}
        <div>
          <h5 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-[11px] text-cyan-400">
            Quick Links
          </h5>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/products" className="hover:text-cyan-400 transition">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-cyan-400 transition">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-cyan-400 transition">
                Customer Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-cyan-400 transition">
                Create Customer Account
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-cyan-400 transition">
                My Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Store Location */}
        <div>
          <h5 className="font-bold text-white text-sm mb-4 tracking-wide uppercase text-[11px] text-cyan-400">
            Store Location & Contact
          </h5>
          <ul className="space-y-3.5 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Retail Shop Address:</span>
                <span className="text-slate-400">Konapara Shopping Complex, Dhaka, Ground Floor</span>
              </div>
            </li>

            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-200 block">Hotline & WhatsApp:</span>
                <a href="tel:01348178750" className="text-cyan-400 hover:underline font-semibold">
                  01348178750
                </a>
              </div>
            </li>

            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-200 block">Email Support:</span>
                <a href="mailto:lhqbangladesh@gmail.com" className="hover:text-cyan-400 transition">
                  lhqbangladesh@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} LHQ BANGLADESH. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">
            Konapara Shopping Complex, Dhaka, Ground Floor | 01348178750
          </p>
        </div>
      </div>
    </footer>
  );
}
