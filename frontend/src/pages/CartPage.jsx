import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function CartPage() {
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="You haven't added any gadgets to your cart yet."
          actionText="Browse gadgets"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shopping cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
