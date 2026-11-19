import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 border-t border-slate-800">
      {/* Features Bar */}
      <div className="border-b border-slate-850 py-10 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Bangladesh Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Inside Dhaka 24-48h, Nationwide 3-5 days</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Gadgets</h4>
              <p className="text-xs text-slate-400 mt-0.5">Authentic products with official brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">7-Day Replacement</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement for defective items</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Friendly customer assistance 9am - 10pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
              GZ
            </div>
            <span className="font-extrabold text-xl text-white">
              Gadget<span className="text-blue-500">Zone</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400 mb-4">
            Your trusted electronic gadget hub in Bangladesh. Discover authentic smartphones, earbuds, smartwatches, and accessories at unbeatable prices.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-pink-950/40 text-pink-400 border border-pink-800/40 rounded-md font-bold">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-green-950/40 text-green-400 border border-green-800/40 rounded-md font-bold">
              Cash on Delivery
            </span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm mb-4">Top Categories</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products?category=smartphones" className="hover:text-white transition">Smartphones</Link></li>
            <li><Link to="/products?category=earbuds" className="hover:text-white transition">True Wireless Earbuds</Link></li>
            <li><Link to="/products?category=smartwatches" className="hover:text-white transition">Smartwatches</Link></li>
            <li><Link to="/products?category=power-banks" className="hover:text-white transition">Fast Charging Power Banks</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm mb-4">Quick Links</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/track-order" className="hover:text-white transition">Track Your Order</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Customer Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Create an Account</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm mb-4">Contact & Support</h5>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>support@gadgetzone.com.bd</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Level 4, Bashundhara City, Panthapath, Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} GadgetZone Bangladesh. All rights reserved. Built for production demonstration.</p>
      </div>
    </footer>
  );
}
