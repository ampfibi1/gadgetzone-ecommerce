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
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
        <div>
          <h1 className="text-2xl font-medium text-ink tracking-tight">Shopping cart</h1>
          <p className="text-xs text-muted mt-1">Review your selected items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-medium text-muted hover:text-danger transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-line p-5 shadow-xs">
          <div className="divide-y divide-line">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-line">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ember hover:text-ember-strong transition-colors"
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
