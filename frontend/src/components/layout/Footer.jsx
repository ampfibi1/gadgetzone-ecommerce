import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, Mail, Phone, MapPin, Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 border-t border-slate-800">
      {/* Service Highlights */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700/60">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Nationwide delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dhaka inside 24-48h, across Bangladesh 2-4 days</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Genuine warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% authentic gadgets with brand warranty support</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700/60">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Retail showroom</h4>
              <p className="text-xs text-slate-400 mt-0.5">Konapara Shopping Complex, Dhaka, Ground Floor</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700/60">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Direct support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Call 01348178750 (10:00 AM – 9:00 PM)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="LHQ Bangladesh"
              className="w-10 h-10 rounded-lg object-cover border border-slate-700"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight leading-none">
                LHQ <span className="text-sky-400">Bangladesh</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">
                Authentic retail & online store
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            LHQ Bangladesh is your trusted retail hub for authentic smartphones, active noise-cancelling earbuds, smartwatches, and fast-charging accessories.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[11px] font-medium">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[11px] font-medium">
              Cash on delivery
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h5 className="font-semibold text-slate-200 text-xs mb-3">
            Categories
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/products?category=smartphones" className="hover:text-sky-400 transition-colors">
                Smartphones
              </Link>
            </li>
            <li>
              <Link to="/products?category=earbuds" className="hover:text-sky-400 transition-colors">
                Earbuds & Audio
              </Link>
            </li>
            <li>
              <Link to="/products?category=smartwatches" className="hover:text-sky-400 transition-colors">
                Smartwatches & Fitness
              </Link>
            </li>
            <li>
              <Link to="/products?category=power-banks" className="hover:text-sky-400 transition-colors">
                Power banks & Chargers
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-sky-400 transition-colors">
                All gadgets
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-semibold text-slate-200 text-xs mb-3">
            Quick links
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/products" className="hover:text-sky-400 transition-colors">
                Catalog
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-sky-400 transition-colors">
                Shopping cart
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-sky-400 transition-colors">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-sky-400 transition-colors">
                Create account
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-sky-400 transition-colors">
                My account
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Store Location */}
        <div>
          <h5 className="font-semibold text-slate-200 text-xs mb-3">
            Store location & contact
          </h5>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-300 block">Retail showroom</span>
                <span className="text-slate-400">Konapara Shopping Complex, Dhaka, Ground Floor</span>
              </div>
            </li>

            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-medium text-slate-300 block">Phone & WhatsApp</span>
                <a href="tel:01348178750" className="text-sky-400 hover:underline">
                  01348178750
                </a>
              </div>
            </li>

            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-medium text-slate-300 block">Email</span>
                <a href="mailto:lhqbangladesh@gmail.com" className="hover:text-sky-400 transition-colors">
                  lhqbangladesh@gmail.com
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} LHQ Bangladesh. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Konapara Shopping Complex, Dhaka, Ground Floor • 01348178750
          </p>
        </div>
      </div>
    </footer>
  );
}
