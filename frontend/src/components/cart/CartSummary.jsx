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
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs sticky top-24">
      <h3 className="font-semibold text-base text-slate-900 mb-4 pb-3 border-b border-slate-100">
        Order summary
      </h3>

      <div className="space-y-2.5 text-xs mb-5">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900 tabular-nums">৳{subtotal.toLocaleString('en-BD')}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Delivery charge</span>
          {hasFreeShipping ? (
            <span className="font-medium text-emerald-700">Free</span>
          ) : (
            <span className="font-medium text-slate-900 tabular-nums">৳{shipping}</span>
          )}
        </div>

        {!hasFreeShipping && subtotal > 0 && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px]">
            Add <strong className="text-slate-900">৳{(5000 - subtotal).toLocaleString('en-BD')}</strong> more for free delivery
          </div>
        )}

        <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
          <span className="font-semibold text-slate-900 text-sm">Total</span>
          <span className="font-bold text-lg text-slate-900 tabular-nums">৳{total.toLocaleString('en-BD')}</span>
        </div>
      </div>

      {onCheckout ? (
        <button
          onClick={onCheckout}
          disabled={items.length === 0 || isCheckingOut}
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors"
        >
          {isCheckingOut ? 'Processing...' : 'Place order'}
          {!isCheckingOut && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      ) : (
        <Link
          to="/checkout"
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors text-center"
        >
          Proceed to checkout
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>bKash & Cash on delivery available</span>
      </div>
    </div>
  );
}
