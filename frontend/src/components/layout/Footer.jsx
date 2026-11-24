import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Mail, MapPin, Phone, ShieldCheck, Store, Truck } from 'lucide-react';

const currentYear = new Date().getFullYear();

const services = [
  {
    icon: Truck,
    title: 'Nationwide delivery',
    copy: 'Dhaka in 24–48 hours, across Bangladesh in 2–4 days',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine warranty',
    copy: 'Authentic gadgets with brand warranty support',
  },
  {
    icon: Store,
    title: 'Retail showroom',
    copy: 'Konapara Shopping Complex, Dhaka, Ground Floor',
  },
  {
    icon: Headphones,
    title: 'Direct support',
    copy: 'Call 01348178750, 10:00 AM – 9:00 PM',
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-night text-night-muted">
      <div className="border-b border-night-line">
        <div className="ui-container grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.title} className="flex items-start gap-3">
              <service.icon className="mt-0.5 h-4 w-4 shrink-0 text-night-muted" />
              <div>
                <h4 className="text-xs font-medium text-night-text">{service.title}</h4>
                <p className="mt-1 text-[11px] leading-4 text-night-muted">{service.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ui-container grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="LHQ Bangladesh"
              className="h-10 w-10 rounded-md border border-night-line object-cover"
            />
            <span className="flex flex-col">
              <span className="text-[16px] font-semibold leading-none text-night-text">LHQ Bangladesh</span>
              <span className="mt-1 font-mono text-[9px] text-night-muted">Official retailer · Dhaka</span>
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-[12px] leading-5 text-night-muted">
            Authentic smartphones, earbuds, smartwatches and power accessories, backed by
            official warranty and a real counter in Dhaka.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="ui-tag border-night-line bg-night-soft text-night-muted">bKash</span>
            <span className="ui-tag border-night-line bg-night-soft text-night-muted">Cash on delivery</span>
          </div>
        </div>

        <div>
          <h5 className="font-mono text-[10px] text-night-muted">Categories</h5>
          <ul className="mt-3 space-y-2 text-[12px]">
            <li><Link to="/products?category=smartphones" className="transition-colors hover:text-night-text">Smartphones</Link></li>
            <li><Link to="/products?category=earbuds" className="transition-colors hover:text-night-text">Earbuds & audio</Link></li>
            <li><Link to="/products?category=smartwatches" className="transition-colors hover:text-night-text">Smartwatches</Link></li>
            <li><Link to="/products?category=power-banks" className="transition-colors hover:text-night-text">Power banks & chargers</Link></li>
            <li><Link to="/products" className="transition-colors hover:text-night-text">All gadgets</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-mono text-[10px] text-night-muted">Quick links</h5>
          <ul className="mt-3 space-y-2 text-[12px]">
            <li><Link to="/products" className="transition-colors hover:text-night-text">Catalog</Link></li>
            <li><Link to="/cart" className="transition-colors hover:text-night-text">Cart</Link></li>
            <li><Link to="/login" className="transition-colors hover:text-night-text">Sign in</Link></li>
            <li><Link to="/register" className="transition-colors hover:text-night-text">Create account</Link></li>
            <li><Link to="/account" className="transition-colors hover:text-night-text">My account</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-mono text-[10px] text-night-muted">Counter & contact</h5>
          <ul className="mt-3 space-y-3 text-[12px]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Konapara Shopping Complex,<br />Dhaka, Ground Floor</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:01348178750" className="font-mono text-[12px] text-night-text transition-colors hover:text-white">
                01348178750
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:lhqbangladesh@gmail.com" className="transition-colors hover:text-night-text">
                lhqbangladesh@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-night-line">
        <div className="ui-container flex flex-col gap-2 py-5 font-mono text-[10px] text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} LHQ Bangladesh</p>
          <p>Konapara Shopping Complex · Dhaka · 01348178750</p>
        </div>
      </div>
    </footer>
  );
}
