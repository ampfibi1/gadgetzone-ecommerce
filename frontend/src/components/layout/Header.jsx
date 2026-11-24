import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Package,
  Phone,
  Search,
  Shield,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const categoryLinks = [
  { name: 'All gadgets', path: '/products' },
  { name: 'Smartphones', path: '/products?category=smartphones' },
  { name: 'Earbuds', path: '/products?category=earbuds' },
  { name: 'Smartwatches', path: '/products?category=smartwatches' },
  { name: 'Power banks', path: '/products?category=power-banks' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      {/* Store strip */}
      <div className="bg-night text-night-muted">
        <div className="ui-container flex h-8 items-center justify-between gap-4 font-mono text-[10px]">
          <div className="flex min-w-0 items-center gap-4">
            <a
              href="tel:01348178750"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-night-text"
            >
              <Phone className="h-3 w-3" />
              <span>01348178750</span>
            </a>
            <span className="hidden text-night-line md:inline">/</span>
            <span className="hidden min-w-0 items-center gap-1.5 md:flex">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">Konapara Shopping Complex, Dhaka</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden lg:inline">Free delivery over ৳5,000</span>
            <span className="hidden text-night-text sm:inline">bKash & cash on delivery</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="ui-container">
        <div className="flex h-[72px] items-center justify-between gap-3 sm:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="LHQ Bangladesh"
              className="h-10 w-10 rounded-md border border-line object-cover"
            />
            <span className="flex flex-col">
              <span className="whitespace-nowrap text-[17px] font-semibold leading-none tracking-[-0.01em] text-ink">
                LHQ Bangladesh
              </span>
              <span className="mt-1 hidden text-[10px] font-normal text-muted sm:block">
                Official retailer · Dhaka
              </span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden max-w-[380px] flex-1 md:flex" role="search">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search gadgets"
                aria-label="Search gadgets"
                className="ui-input pr-10"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/cart"
              className="relative flex h-10 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-ink transition-colors hover:bg-raised sm:px-3"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <span className="hidden text-xs font-medium md:inline">Cart</span>
              {itemCount > 0 && (
                <span className="font-mono text-[10px] text-ember tabular-nums">({itemCount})</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((open) => !open)}
                  className="flex h-10 items-center gap-2 rounded-lg border border-line bg-surface px-2 text-ink transition-colors hover:bg-raised sm:px-2.5"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-raised text-[11px] font-medium text-ink-soft">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                  <span className="hidden max-w-[110px] truncate text-xs font-medium sm:inline">
                    {user?.name}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted sm:inline" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="ui-shadow absolute right-0 z-50 mt-2 w-60 rounded-lg border border-line bg-surface p-1.5"
                    role="menu"
                  >
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="truncate text-xs font-medium text-ink">{user?.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted">{user?.email}</p>
                      <span className="ui-tag mt-2">{user?.role}</span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex h-9 items-center gap-2 rounded-md px-2.5 text-xs text-ink transition-colors hover:bg-raised"
                        role="menuitem"
                      >
                        <Shield className="h-4 w-4 text-muted" /> Admin dashboard
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex h-9 items-center gap-2 rounded-md px-2.5 text-xs text-ink transition-colors hover:bg-raised"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 text-muted" /> Account details
                    </Link>

                    <Link
                      to="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex h-9 items-center gap-2 rounded-md px-2.5 text-xs text-ink transition-colors hover:bg-raised"
                      role="menuitem"
                    >
                      <Package className="h-4 w-4 text-muted" /> Order history
                    </Link>

                    <div className="my-1 border-t border-line" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-left text-xs text-danger transition-colors hover:bg-raised"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="hidden h-9 items-center rounded-lg px-2.5 text-xs font-medium text-ink-soft transition-colors hover:bg-raised sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="ui-btn ui-btn-primary ui-btn-sm hidden sm:inline-flex"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-raised lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <nav className="hidden border-t border-line lg:block" aria-label="Categories">
        <div className="ui-container flex h-11 items-center justify-between">
          <div className="flex items-center gap-0.5">
            {categoryLinks.map((item) => {
              const isActive = location.pathname + location.search === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-ember text-ink'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <span className="font-mono text-[10px] text-muted">
            Konapara Shopping Complex · Ground Floor
          </span>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-paper lg:hidden">
          <div className="ui-container space-y-4 py-4">
            <form onSubmit={handleSearch} role="search">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search gadgets"
                  aria-label="Search gadgets"
                  className="ui-input pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-ink"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="space-y-0.5">
              <p className="ui-kicker mb-2">Categories</p>
              {categoryLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-raised hover:text-ink"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="space-y-1 border-t border-line pt-3">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-raised"
                    >
                      <Shield className="h-4 w-4 text-muted" /> Admin dashboard
                    </Link>
                  )}
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] text-ink-soft transition-colors hover:bg-raised"
                  >
                    <User className="h-4 w-4 text-muted" /> My account
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-danger transition-colors hover:bg-raised"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-raised"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="ui-btn ui-btn-primary mt-2 w-full"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>

            <div className="space-y-1.5 border-t border-line pt-3 font-mono text-[10px] text-muted">
              <p className="flex items-center gap-2 text-ink-soft">
                <Phone className="h-3 w-3" /> 01348178750
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                Konapara Shopping Complex, Dhaka, Ground Floor
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
