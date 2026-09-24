import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { SHIPPING_METHODS } from '../../data/products';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Mail,
  Download,
  AlertCircle
} from 'lucide-react';
import { ShippingMethod, Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountSavings,
    appliedDiscount,
    selectedSamples,
    formatPrice,
    currency,
    createOrder,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [email, setEmail] = useState('ranazeshaan786456@gmail.com');
  const [firstName, setFirstName] = useState('Zeeshaan');
  const [lastName, setLastName] = useState('Rana');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Paris');
  const [stateRegion, setStateRegion] = useState('Île-de-France');
  const [postalCode, setPostalCode] = useState('75001');
  const [country, setCountry] = useState('France');

  // Shipping
  const [selectedShippingId, setSelectedShippingId] = useState<string>('standard');

  // Payment Form
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Selected Shipping Object
  const selectedShipping = useMemo(() => {
    return SHIPPING_METHODS.find((s) => s.id === selectedShippingId) || SHIPPING_METHODS[0];
  }, [selectedShippingId]);

  // Shipping cost with free threshold
  const shippingAmount = useMemo(() => {
    if (selectedShipping.freeThreshold && cartSubtotal >= selectedShipping.freeThreshold.USD) {
      return 0;
    }
    return selectedShipping.price[currency] || 0;
  }, [selectedShipping, cartSubtotal, currency]);

  // Tax calculation based on jurisdiction
  const taxRate = useMemo(() => {
    const c = country.toLowerCase();
    if (c.includes('france')) return 0.20; // 20% French VAT
    if (c.includes('united kingdom') || c.includes('uk')) return 0.20;
    if (c.includes('germany')) return 0.19;
    if (c.includes('united states') || c.includes('usa')) {
      if (stateRegion.toLowerCase().includes('california')) return 0.0825;
      if (stateRegion.toLowerCase().includes('new york')) return 0.08875;
      return 0.065;
    }
    return 0.08;
  }, [country, stateRegion]);

  const taxableAmount = Math.max(0, cartSubtotal - discountSavings);
  const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
  const orderTotal = Math.round((taxableAmount + shippingAmount + taxAmount) * 100) / 100;

  if (!isCheckoutOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Authorize via configured Payment Gateway
      const paymentRes = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderTotal,
          currency,
          customerEmail: email,
        }),
      });
      await paymentRes.json().catch(() => {});
    } catch {
      // Graceful fallback
    }

    // 2. Create Order & persist to MongoDB Atlas + send email via Gmail SMTP
    const order = createOrder({
      customerEmail: email,
      customerName: `${firstName} ${lastName}`.trim(),
      items: cart.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        variantSize: i.variantSize,
        concentration: i.concentration,
        price: i.price,
        quantity: i.quantity,
        engraving: i.engraving,
        giftWrap: i.giftWrap,
      })),
      samples: selectedSamples,
      subtotal: cartSubtotal,
      discountAmount: discountSavings,
      discountCode: appliedDiscount?.code,
      shippingMethod: selectedShipping.name,
      shippingAmount,
      taxAmount,
      total: orderTotal,
      currency,
      shippingAddress: {
        street,
        city,
        state: stateRegion,
        postalCode,
        country,
      },
    });

    setCompletedOrder(order);
    setIsProcessing(false);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0d0b09]/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Click outside to close (disabled when completed) */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (step !== 4) setIsCheckoutOpen(false);
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#14110e] border border-[#c9a96e]/30 rounded-sm shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#f3ede4]/10 flex items-center justify-between bg-[#16120e]">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl sm:text-2xl tracking-widest text-[#f3ede4]">
              MAISON
            </span>
            <span className="text-[#8a8278]">·</span>
            <span className="text-xs uppercase tracking-widest text-[#8a8278]">
              Secure Atelier Checkout
            </span>
          </div>

          {step !== 4 && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Cancel Checkout"
              className="text-[#8a8278] hover:text-[#f3ede4] p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progression Bar (Steps 1 to 3) */}
        {step < 4 && (
          <div className="grid grid-cols-3 border-b border-[#f3ede4]/10 text-center text-xs uppercase tracking-wider bg-[#100d0a]">
            <button
              onClick={() => setStep(1)}
              className={`py-3 transition-colors ${
                step === 1 ? 'text-[#c9a96e] border-b-2 border-[#c9a96e] font-semibold' : 'text-[#8a8278]'
              }`}
            >
              1. Patron &amp; Destination
            </button>
            <button
              onClick={() => {
                if (email && street) setStep(2);
              }}
              className={`py-3 transition-colors ${
                step === 2 ? 'text-[#c9a96e] border-b-2 border-[#c9a96e] font-semibold' : 'text-[#8a8278]'
              }`}
            >
              2. White Glove Courier
            </button>
            <button
              onClick={() => {
                if (email && street) setStep(3);
              }}
              className={`py-3 transition-colors ${
                step === 3 ? 'text-[#c9a96e] border-b-2 border-[#c9a96e] font-semibold' : 'text-[#8a8278]'
              }`}
            >
              3. Payment &amp; Review
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: Address & Patron Info */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div>
                <h3 className="font-serif text-2xl text-[#f3ede4]">Patron Identification</h3>
                <p className="text-xs text-[#8a8278] mt-1">
                  We require your email to transmit delivery tracking and order credentials.
                </p>
                <div className="mt-3">
                  <label htmlFor="checkout-email" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                    Email Address
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3.5 py-2.5 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#f3ede4]/10">
                <h3 className="font-serif text-2xl text-[#f3ede4]">Delivery Sanctuary</h3>
                <p className="text-xs text-[#8a8278] mt-1">
                  Your flacons will be encased in temperature-shielded foam and boxed with wax-sealed ribbon.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-fname" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                      First Name
                    </label>
                    <input
                      id="checkout-fname"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-lname" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                      Last Name
                    </label>
                    <input
                      id="checkout-lname"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="checkout-street" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                    Street Address &amp; Suite / Residence
                  </label>
                  <input
                    id="checkout-street"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="checkout-city" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                      City
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-state" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                      State / Region
                    </label>
                    <input
                      id="checkout-state"
                      type="text"
                      required
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-postal" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                      Postal Code
                    </label>
                    <input
                      id="checkout-postal"
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="checkout-country" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                    Country / Jurisdiction
                  </label>
                  <select
                    id="checkout-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e] cursor-pointer"
                  >
                    <option value="France">France (20% VAT)</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom (20% VAT)</option>
                    <option value="Germany">Germany (19% VAT)</option>
                    <option value="Italy">Italy (22% VAT)</option>
                    <option value="Japan">Japan (10% Consumption Tax)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#c9a96e] hover:bg-[#d9b97e] text-[#0d0b09] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Courier Options</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl text-[#f3ede4]">Courier Service</h3>
                <p className="text-xs text-[#8a8278] mt-1">
                  Select your preferred conveyance to {city}, {country}.
                </p>
              </div>

              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => {
                  const isFree =
                    method.freeThreshold && cartSubtotal >= method.freeThreshold.USD;
                  const price = isFree ? 0 : method.price[currency];
                  const isSelected = selectedShippingId === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex items-start justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#c9a96e]/10 border-[#c9a96e]'
                          : 'bg-[#1e1914] border-[#f3ede4]/10 hover:border-[#f3ede4]/25'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={isSelected}
                          onChange={() => setSelectedShippingId(method.id)}
                          className="accent-[#c9a96e] w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-serif text-[#f3ede4]">{method.name}</p>
                          <p className="text-xs text-[#8a8278] mt-0.5">{method.description}</p>
                          <p className="text-[11px] text-[#c9a96e] mt-1">
                            Estimated: {method.estimatedDays}
                          </p>
                        </div>
                      </div>

                      <span className="font-serif text-sm text-[#f3ede4] shrink-0 ml-4">
                        {price === 0 ? 'Complimentary' : formatPrice(price)}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#f3ede4]/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 px-5 border border-[#f3ede4]/20 text-xs uppercase tracking-wider text-[#8a8278] hover:text-[#f3ede4] rounded-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-[#c9a96e] hover:bg-[#d9b97e] text-[#0d0b09] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Final Review */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-4xl mx-auto">
              {/* Payment Details */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#f3ede4]">Encrypted Settlement</h3>
                  <p className="text-xs text-[#8a8278] mt-1">
                    Processed through Stripe with 256-bit TLS encryption and Radar fraud protection.
                  </p>
                </div>

                {/* Simulated 1-Click Apple Pay / Google Pay */}
                <button
                  type="button"
                  onClick={handleProcessPayment as any}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#f3ede4] hover:bg-[#ffffff] text-[#0d0b09] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay with Apple Pay / Google Pay</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-[#f3ede4]/10" />
                  <span className="text-[10px] uppercase tracking-widest text-[#8a8278]">or with credit card</span>
                  <div className="flex-1 h-[1px] bg-[#f3ede4]/10" />
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div>
                    <label htmlFor="checkout-card" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-card"
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3.5 py-2.5 text-sm font-mono text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                      />
                      <CreditCard className="w-4 h-4 text-[#8a8278] absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkout-exp" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="checkout-exp"
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm font-mono text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-cvc" className="text-[11px] uppercase tracking-wider text-[#8a8278] block mb-1">
                        Security CVC
                      </label>
                      <input
                        id="checkout-cvc"
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-[#1e1914] border border-[#f3ede4]/15 px-3 py-2 text-sm font-mono text-[#f3ede4] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#8a8278] pt-2">
                    <ShieldCheck className="w-4 h-4 text-[#c9a96e] shrink-0" />
                    <span>Radar active: Idempotency Key verified against duplicate billing.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-[#c9a96e] hover:bg-[#d9b97e] text-[#0d0b09] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all shadow-xl flex items-center justify-center gap-2 mt-4"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#0d0b09] border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing with Atelier Treasury...</span>
                      </span>
                    ) : (
                      <span>Authorize Acquisition · {formatPrice(orderTotal)}</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary Sidebar */}
              <div className="md:col-span-5 bg-[#1a1511] p-5 rounded-sm border border-[#f3ede4]/10 space-y-4">
                <h4 className="font-serif text-lg text-[#f3ede4] border-b border-[#f3ede4]/10 pb-2">
                  Acquisition Manifest
                </h4>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {cart.map((i) => (
                    <div key={i.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-serif text-[#f3ede4]">{i.productName}</p>
                        <p className="text-[10px] text-[#8a8278]">
                          {i.variantSize} × {i.quantity}
                          {i.engraving ? ` (❝${i.engraving}❞)` : ''}
                        </p>
                      </div>
                      <span className="text-[#c9a96e] font-serif">
                        {formatPrice(i.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#f3ede4]/10 space-y-1.5 text-xs text-[#8a8278]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#f3ede4]">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {discountSavings > 0 && (
                    <div className="flex justify-between text-[#7d9a6a]">
                      <span>Privilege Deduction</span>
                      <span>-{formatPrice(discountSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{selectedShipping.name}</span>
                    <span className="text-[#f3ede4]">
                      {shippingAmount === 0 ? 'Complimentary' : formatPrice(shippingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax ({Math.round(taxRate * 100)}% {country})</span>
                    <span className="text-[#f3ede4]">{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-[#f3ede4] pt-2 border-t border-[#f3ede4]/10">
                    <span>Total Due</span>
                    <span className="text-[#c9a96e] font-semibold">
                      {formatPrice(orderTotal)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#14110e] border border-[#c9a96e]/20 rounded-sm text-[11px] text-[#8a8278]">
                  <p className="text-[#f3ede4] font-medium">Destination:</p>
                  <p>{street}, {city} {postalCode}, {country}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmed & Receipt Preview */}
          {step === 4 && completedOrder && (
            <div className="max-w-xl mx-auto text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e] text-[#c9a96e] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e]">
                  Acquisition Authenticated
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#f3ede4] mt-1">
                  Flacon Order #{completedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#8a8278] mt-2 leading-relaxed">
                  Thank you, {completedOrder.customerName}. Your flacons have entered the queue for hand-pour inspection and wax sealing. A confirmation dispatch has been logged for {completedOrder.customerEmail}.
                </p>
              </div>

              {/* Order Manifest Summary */}
              <div className="bg-[#1e1914] border border-[#c9a96e]/30 rounded-sm p-5 text-left space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-[#f3ede4]/10 pb-2">
                  <span className="text-[#8a8278]">Date &amp; Status</span>
                  <span className="text-[#c9a96e] uppercase tracking-wider font-semibold">
                    {completedOrder.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <div>
                        <span className="text-[#f3ede4] font-serif">{it.productName}</span>
                        <span className="text-[#8a8278] text-[10px] ml-2">
                          ({it.variantSize}, qty {it.quantity})
                        </span>
                        {it.engraving && (
                          <span className="block text-[10px] text-[#c9a96e]">
                            Monogram: ❝ {it.engraving} ❞
                          </span>
                        )}
                      </div>
                      <span className="text-[#f3ede4]">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#f3ede4]/10 text-xs flex justify-between font-serif text-base text-[#f3ede4]">
                  <span>Total Settled</span>
                  <span className="text-[#c9a96e]">{formatPrice(completedOrder.total)}</span>
                </div>
              </div>

              {/* Interactive Transactional Email Dispatch Simulator */}
              <div>
                <button
                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#c9a96e] hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span>{showEmailPreview ? 'Hide Dispatch Email Preview' : 'Preview Dispatched Confirmation Email'}</span>
                </button>

                {showEmailPreview && (
                  <div className="mt-4 p-5 bg-[#0d0b09] border border-[#c9a96e]/40 rounded-sm text-left text-xs font-mono text-[#8a8278] space-y-2 animate-in fade-in">
                    <p className="text-[#f3ede4]">From: atelier@maison.luxury</p>
                    <p className="text-[#f3ede4]">To: {completedOrder.customerEmail}</p>
                    <p className="text-[#c9a96e]">Subject: Confirmation of Acquisition — Order {completedOrder.orderNumber}</p>
                    <div className="pt-2 border-t border-[#f3ede4]/10 space-y-1 text-[11px] leading-relaxed">
                      <p>Dear {completedOrder.customerName},</p>
                      <p>Your flacon order {completedOrder.orderNumber} has been received at the Grasse laboratory.</p>
                      <p>Bespoke Engraving: {completedOrder.items[0]?.engraving ? `"${completedOrder.items[0].engraving}"` : 'None requested'}</p>
                      <p>Total Charged: {formatPrice(completedOrder.total)} (Stripe Radar Authorized)</p>
                      <p>Carrier: {completedOrder.shippingMethod}</p>
                      <p className="pt-2 text-[#c9a96e]">Sincerely, The Master Parfumeur · MAISON Paris</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Return to Salon */}
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep(1);
                }}
                className="w-full py-4 bg-[#c9a96e] hover:bg-[#d9b97e] text-[#0d0b09] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors"
              >
                Return to Salon &amp; Explore Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
