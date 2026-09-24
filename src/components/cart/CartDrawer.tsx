import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { COMPLIMENTARY_SAMPLES } from '../../data/products';
import { X, Trash2, Plus, Minus, Gift, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    formatPrice,
    selectedSamples,
    toggleSample,
    discountCode,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    discountSavings,
    setIsCheckoutOpen,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [discountError, setDiscountError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyDiscount(inputCode);
    if (!res.success) {
      setDiscountError(res.message);
    } else {
      setDiscountError(null);
      setInputCode('');
    }
  };

  const finalEstimatedSubtotal = Math.max(0, cartSubtotal - discountSavings);

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0d0b09]/80 backdrop-blur-md"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#14110e] border-l border-[#c9a96e]/30 h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-6 border-b border-[#f3ede4]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#f3ede4]">Atelier Bag</h2>
            <span className="text-xs uppercase tracking-wider text-[#8a8278]">
              ({cart.reduce((s, i) => s + i.quantity, 0)} {cart.length === 1 ? 'flacon' : 'items'})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Shopping Bag"
            className="p-1.5 text-[#8a8278] hover:text-[#f3ede4] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-[#1a1511] border-b border-[#f3ede4]/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#8a8278]">
              {remainingForFreeShipping > 0
                ? `Add ${formatPrice(remainingForFreeShipping)} for complimentary white glove courier`
                : 'Complimentary white glove courier unlocked'}
            </span>
            <span className="font-serif text-[#c9a96e] font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1 bg-[#251f1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a96e] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#8a8278] mx-auto opacity-50" />
              <p className="font-serif text-xl text-[#f3ede4]">Your shopping bag is empty</p>
              <p className="text-xs text-[#8a8278] max-w-xs mx-auto">
                Explore our Permanent Collection or discover the 5-flacon Discovery Coffret.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-widest font-medium rounded-sm"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#1e1914] border border-[#f3ede4]/10 rounded-sm"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-18 h-18 object-cover rounded-sm border border-[#f3ede4]/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-base text-[#f3ede4] truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8a8278] hover:text-[#c2574a] p-1 transition-colors"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#8a8278]">
                      {item.variantSize} · {item.concentration}
                    </p>

                    {item.engraving && (
                      <p className="text-[10px] text-[#c9a96e] font-serif mt-0.5">
                        Monogram: ❝ {item.engraving} ❞
                      </p>
                    )}

                    {item.giftWrap && (
                      <p className="text-[10px] text-[#8a8278] flex items-center gap-1 mt-0.5">
                        <Gift className="w-2.5 h-2.5 text-[#c9a96e]" />
                        <span>Maison Wax-Sealed Coffret</span>
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#f3ede4]/15 rounded-sm bg-[#14110e]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#8a8278] hover:text-[#f3ede4]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-[#f3ede4]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#8a8278] hover:text-[#f3ede4]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm text-[#c9a96e]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Complimentary Samples Selection in Bag */}
              <div className="pt-4 border-t border-[#f3ede4]/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="uppercase tracking-wider text-[#8a8278]">
                    Your 2 Complimentary Samples:
                  </span>
                  <span className="text-[#c9a96e] text-[10px]">
                    {selectedSamples.length}/2 Enclosed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {COMPLIMENTARY_SAMPLES.map((s) => {
                    const isChecked = selectedSamples.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSample(s.id)}
                        className={`text-left p-2 rounded-sm text-[11px] border transition-all ${
                          isChecked
                            ? 'bg-[#c9a96e]/15 border-[#c9a96e] text-[#f3ede4]'
                            : 'bg-[#181410] border-[#f3ede4]/10 text-[#8a8278] hover:border-[#f3ede4]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{s.name}</span>
                          {isChecked && <Check className="w-3 h-3 text-[#c9a96e] shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout & Discounts */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#f3ede4]/10 bg-[#16120e] space-y-4">
            {/* Privilege Code Input */}
            <div>
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-2.5 bg-[#c9a96e]/10 border border-[#c9a96e]/40 rounded-sm text-xs">
                  <div>
                    <span className="font-semibold text-[#c9a96e] uppercase tracking-wider">
                      {appliedDiscount.code}
                    </span>
                    <span className="text-[#8a8278] text-[10px] block mt-0.5">
                      -{formatPrice(discountSavings)} applied
                    </span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-xs text-[#8a8278] hover:text-[#c2574a] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyDiscount} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Privilege Code (try MAISON15)"
                    className="flex-1 bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-xs uppercase tracking-wider text-[#f3ede4] placeholder-[#8a8278] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2a221a] hover:bg-[#c9a96e] hover:text-[#0d0b09] text-[#f3ede4] text-xs uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {discountError && (
                <p className="text-[11px] text-[#c2574a] mt-1">{discountError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#8a8278] pt-2 border-t border-[#f3ede4]/10">
              <div className="flex justify-between">
                <span>Atelier Subtotal</span>
                <span className="text-[#f3ede4]">{formatPrice(cartSubtotal)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-[#7d9a6a]">
                  <span>Privilege Savings ({appliedDiscount.code})</span>
                  <span>-{formatPrice(discountSavings)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Courier</span>
                <span className="text-[#f3ede4]">
                  {remainingForFreeShipping === 0 ? 'Complimentary' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif text-[#f3ede4] pt-2 border-t border-[#f3ede4]/10">
                <span>Estimated Total</span>
                <span className="text-[#c9a96e] font-semibold">
                  {formatPrice(finalEstimatedSubtotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-4 px-6 bg-[#c9a96e] hover:bg-[#d9b97e] text-[#0d0b09] text-xs uppercase tracking-[0.25em] font-semibold rounded-sm transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
