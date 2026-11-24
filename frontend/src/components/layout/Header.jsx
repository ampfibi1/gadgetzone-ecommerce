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
    { name: 'All gadgets', path: '/products' },
    { name: 'Smartphones', path: '/products?category=smartphones' },
    { name: 'Earbuds', path: '/products?category=earbuds' },
    { name: 'Smartwatches', path: '/products?category=smartwatches' },
    { name: 'Power banks', path: '/products?category=power-banks' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800">
      {/* Top Utility & Contact Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-xs py-2 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs">
            <a href="tel:01348178750" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors font-medium">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>01348178750</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Konapara Shopping Complex, Dhaka, Ground Floor</span>
            </div>
            <span className="hidden lg:inline text-slate-700">|</span>
            <a href="mailto:lhqbangladesh@gmail.com" className="hidden lg:flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>lhqbangladesh@gmail.com</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-0.5 rounded text-[11px] text-slate-300">
              Free delivery over ৳5,000 • bKash & Cash on delivery
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.jpg"
              alt="LHQ Bangladesh"
              className="w-11 h-11 rounded-lg object-cover border border-slate-700"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white leading-none">
                LHQ <span className="text-sky-400">Bangladesh</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">
                Authentic retail & online store
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search smartphones, earbuds, smartwatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-white placeholder-slate-400 text-sm rounded-lg pl-3.5 pr-10 py-2 border border-slate-700 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Hotline Tablet/Desktop */}
            <a
              href="tel:01348178750"
              className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">Support hotline</span>
                <span className="font-semibold text-white">01348178750</span>
              </div>
            </a>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-200 hover:text-white rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-2"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-sky-400" />
              <span className="hidden md:inline text-xs font-semibold text-slate-200">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-sky-600 text-white text-[11px] font-semibold h-5 min-w-5 px-1 rounded-full flex items-center justify-center tabular-nums">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Authentication Dropdown / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium truncate max-w-[120px]">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 text-slate-200 rounded-lg shadow-xl border border-slate-800 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-800 text-sky-400 border border-slate-700">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-sky-300 hover:bg-slate-800 font-medium transition-colors"
                      >
                        <Shield className="w-4 h-4 text-sky-400" /> Admin dashboard
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" /> Account details
                    </Link>

                    <Link
                      to="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" /> Order history
                    </Link>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Categories Bar */}
      <nav className="hidden lg:block bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-medium">
            {categoryLinks.map((item) => {
              const isActive = location.pathname + location.search === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3.5 py-2.5 transition-colors border-b-2 ${
                    isActive
                      ? 'border-sky-400 text-sky-300 font-semibold'
                      : 'border-transparent text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Konapara Shopping Complex, Dhaka
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 px-4 border-t border-slate-800 bg-slate-950 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs rounded-lg pl-3 pr-9 py-2 border border-slate-800 focus:outline-hidden focus:border-sky-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Mobile Category Links */}
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 px-3 mb-1">Categories</p>
            {categoryLinks.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                {cat.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-sky-300 bg-slate-900 border border-slate-800 rounded-lg mt-2"
              >
                <Shield className="w-3.5 h-3.5 inline mr-2 text-sky-400" /> Admin dashboard
              </Link>
            )}
          </div>

          {/* Mobile Store Info */}
          <div className="pt-3 border-t border-slate-900 text-xs text-slate-400 space-y-1.5 px-3">
            <p className="flex items-center gap-2 text-slate-300 font-medium">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> 01348178750
            </p>
            <p className="flex items-start gap-2 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              Konapara Shopping Complex, Dhaka, Ground Floor
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
