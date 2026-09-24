import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, Gift, Check } from 'lucide-react';

export const DiscoverySetSection: React.FC = () => {
  const { products, openPDP, addToCart, formatPrice } = useStore();
  const discoveryProduct = products.find((p) => p.isDiscoverySet) || products[products.length - 1];
  const defaultVariant = discoveryProduct.variants[0];

  return (
    <section id="discovery" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
      <div className="bg-gradient-to-br from-[#181410] via-[#14110e] to-[#0d0b09] border border-[#c9a96e]/30 rounded-sm p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a96e]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Visual Area */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#f3ede4]/10 shadow-2xl group">
              <img
                src={discoveryProduct.image}
                alt="Coffret Découverte Luxury Discovery Set"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#0d0b09]/80 backdrop-blur-md border border-[#c9a96e]/40 px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#c9a96e]">
                Includes $80 Flacon Voucher
              </div>
            </div>
          </div>

          {/* Right Editorial & Purchase Area */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e]">
                The Atelier Introduction
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#f3ede4] mt-2">
                Coffret Découverte
              </h2>
              <p className="font-serif text-xl text-[#c9a96e] mt-1">
                Five Miniature Glass Flacons · 5 × 10ml
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#8a8278] leading-relaxed">
              Experience the complete spectrum of MAISON haute parfumerie from the intimacy of your private salon. Accompanied by blotter cards and an archival presentation coffret debossed in gold foil.
            </p>

            {/* Inclusions list */}
            <div className="space-y-2.5 pt-2">
              {[
                'Ambre Nuit (10ml Extrait)',
                'Vétiver Fumé (10ml Extrait)',
                'Rose Noire (10ml Extrait)',
                'Fleur de Santal & Iris Céleste (10ml each)',
                'Full credit voucher of $80 / €75 toward your first 50ml or 100ml flacon',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-[#f3ede4]/90">
                  <span className="w-4 h-4 rounded-full bg-[#c9a96e]/20 text-[#c9a96e] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Pricing & CTA */}
            <div className="pt-6 border-t border-[#f3ede4]/10 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#8a8278]">Complimentary Shipping</p>
                <p className="font-serif text-3xl text-[#f3ede4] mt-0.5">
                  {formatPrice(defaultVariant.price.USD)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => addToCart(discoveryProduct, defaultVariant)}
                  className="py-3.5 px-8 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-[#d9b97e] transition-colors shadow-lg flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Acquire Coffret</span>
                </button>

                <button
                  onClick={() => openPDP(discoveryProduct)}
                  className="py-3.5 px-5 bg-transparent border border-[#f3ede4]/20 text-[#f3ede4] text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#f3ede4]/5 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
