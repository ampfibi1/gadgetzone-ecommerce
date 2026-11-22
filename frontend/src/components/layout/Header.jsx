import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Shield, Menu, X, Search, LogOut, Package, Phone, MapPin, Mail, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const categoryLinks = [
    { name: 'All Gadgets', path: '/products' },
    { name: 'Smartphones', path: '/products?category=smartphones' },
    { name: 'Earbuds', path: '/products?category=earbuds' },
    { name: 'Smartwatches', path: '/products?category=smartwatches' },
    { name: 'Power Banks', path: '/products?category=power-banks' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-xl border-b border-slate-800/80">
      {/* Top Notification & Contact Bar - Inspired by Gadget & Gear */}
      <div className="bg-slate-900 border-b border-slate-800 text-[11px] py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-300">
            <a href="tel:01348178750" className="flex items-center gap-1.5 hover:text-cyan-400 transition font-medium">
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>Hotline: 01348178750</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Konapara Shopping Complex, Dhaka, Ground Floor</span>
            </div>
            <span className="hidden lg:inline text-slate-700">|</span>
            <a href="mailto:lhqbangladesh@gmail.com" className="hidden lg:flex items-center gap-1.5 hover:text-cyan-400 transition">
              <Mail className="w-3 h-3 text-cyan-400" />
              <span>lhqbangladesh@gmail.com</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-cyan-300">
            <span className="inline-flex items-center gap-1 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded text-[10px]">
              🇧🇩 Free Delivery on orders over ৳5,000 | bKash & COD
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="LHQ BANGLADESH"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition shadow-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-2xl tracking-tight text-white flex items-center leading-none">
                LHQ <span className="text-cyan-400 ml-1.5 font-black">BANGLADESH</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1">
                Authentic Gadget Destination
              </span>
            </div>
          </Link>

          {/* Search Bar - Gadget & Gear Style with wide rounded input */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search iPhone, Samsung, AirPods, Smartwatch, Anker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm rounded-full pl-5 pr-11 py-2.5 border border-slate-700/80 focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition shadow-md"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Hotline Button on Tablet/Desktop */}
            <a
              href="tel:01348178750"
              className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium">Quick Support</span>
                <span className="font-bold text-white text-xs">01348178750</span>
              </div>
            </a>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-200 hover:text-white rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition flex items-center gap-2"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              <span className="hidden md:inline text-xs font-bold text-slate-200">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Authentication Dropdown / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold truncate max-w-[100px]">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-purple-400 hover:bg-slate-800/80 font-bold transition"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-cyan-400" /> Account Dashboard
                    </Link>

                    <Link
                      to="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Package className="w-4 h-4 text-cyan-400" /> My Orders
                    </Link>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 text-left transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white rounded-xl shadow-md transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Categories Bar - Inspired by Gadget & Gear */}
      <nav className="hidden lg:block bg-slate-900/90 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-bold">
            {categoryLinks.map((item) => {
              const isActive = location.pathname + location.search === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-3 transition-colors flex items-center gap-1.5 border-b-2 ${
                    isActive
                      ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
                      : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Konapara Shopping Complex, Dhaka
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 px-4 border-t border-slate-800 bg-slate-950 space-y-4 animate-in slide-in-from-top">
          {/* Mobile Search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs rounded-xl pl-4 pr-10 py-2.5 border border-slate-800 focus:outline-hidden focus:border-cyan-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-cyan-400"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Mobile Category Links (No Track Order) */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-1">Navigation</p>
            {categoryLinks.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                {cat.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-purple-400 bg-purple-950/30 rounded-lg mt-2"
              >
                <Shield className="w-3.5 h-3.5 inline mr-2" /> Admin Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Store Info */}
          <div className="pt-3 border-t border-slate-900 text-xs text-slate-400 space-y-1.5 px-3">
            <p className="flex items-center gap-2 text-slate-300 font-semibold">
              <Phone className="w-3.5 h-3.5 text-cyan-400" /> 01348178750
            </p>
            <p className="flex items-start gap-2 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              Konapara Shopping Complex, Dhaka, Ground Floor
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
