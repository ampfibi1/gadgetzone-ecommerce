import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartSummary({ onCheckout, isCheckingOut = false }) {
  const { getSubtotal, getShippingCost, getTotal, items } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const hasFreeShipping = subtotal >= 5000;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs sticky top-24">
      <h3 className="font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString('en-BD')}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Shipping (Bangladesh)</span>
          {hasFreeShipping ? (
            <span className="font-semibold text-emerald-600">FREE</span>
          ) : (
            <span className="font-semibold text-slate-900">৳{shipping}</span>
          )}
        </div>

        {!hasFreeShipping && subtotal > 0 && (
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
            Add <strong>৳{(5000 - subtotal).toLocaleString('en-BD')}</strong> more for Free Delivery!
          </div>
        )}

        <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
          <span className="font-bold text-slate-900 text-base">Total</span>
          <span className="font-black text-2xl text-blue-600">৳{total.toLocaleString('en-BD')}</span>
        </div>
      </div>

      {onCheckout ? (
        <button
          onClick={onCheckout}
          disabled={items.length === 0 || isCheckingOut}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          {isCheckingOut ? 'Processing...' : 'Place Order'}
          {!isCheckingOut && <ArrowRight className="w-4 h-4" />}
        </button>
      ) : (
        <Link
          to="/checkout"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-center"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Secure checkout with bKash & Cash on Delivery</span>
      </div>
    </div>
  );
}
