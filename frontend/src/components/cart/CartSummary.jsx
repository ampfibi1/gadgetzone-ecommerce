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
    <div className="sticky top-24 rounded-xl border border-line bg-surface p-5">
      <h3 className="border-b border-line pb-3 text-[14px] font-medium text-ink">Order summary</h3>

      <div className="mb-5 mt-4 space-y-2.5 text-[12px]">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="font-mono text-[12px] tabular-nums text-ink">
            ৳{subtotal.toLocaleString('en-BD')}
          </span>
        </div>

        <div className="flex justify-between text-muted">
          <span>Delivery</span>
          {hasFreeShipping ? (
            <span className="font-mono text-[12px] text-positive">Free</span>
          ) : (
            <span className="font-mono text-[12px] tabular-nums text-ink">৳{shipping}</span>
          )}
        </div>

        {!hasFreeShipping && subtotal > 0 && (
          <div className="rounded-lg border border-line bg-raised p-3 text-[11px] leading-4 text-ink-soft">
            Add ৳{(5000 - subtotal).toLocaleString('en-BD')} more for free delivery
          </div>
        )}

        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="text-[13px] font-medium text-ink">Total</span>
          <span className="font-mono text-[18px] tabular-nums text-ink">
            ৳{total.toLocaleString('en-BD')}
          </span>
        </div>
      </div>

      {onCheckout ? (
        <button
          type="button"
          onClick={onCheckout}
          disabled={items.length === 0 || isCheckingOut}
          className="ui-btn ui-btn-primary w-full"
        >
          {isCheckingOut ? 'Processing' : 'Place order'}
          {!isCheckingOut && <ArrowRight className="h-4 w-4" />}
        </button>
      ) : (
        <Link to="/checkout" className="ui-btn ui-btn-primary w-full">
          Proceed to checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 border-t border-line pt-3 text-[10px] text-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>bKash & cash on delivery</span>
      </div>
    </div>
  );
}
