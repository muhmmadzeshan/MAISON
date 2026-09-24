import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeBottleCanvas } from '../canvas/PerfumeBottleCanvas';
import { COMPLIMENTARY_SAMPLES } from '../../data/products';
import { X, Sparkles, Gift, Check, ShieldCheck, Heart, RotateCcw } from 'lucide-react';
import { ProductVariant } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForPDP,
    closePDP,
    addToCart,
    formatPrice,
    selectedSamples,
    toggleSample,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const product = selectedProductForPDP;

  // Selected variant state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    return product ? product.variants[0] : null;
  });

  const [engravingText, setEngravingText] = useState<string>('');
  const [giftWrap, setGiftWrap] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pyramid' | 'ritual' | 'delivery'>('pyramid');

  // Update selected variant when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[1] || product.variants[0]);
      setEngravingText('');
    }
  }, [product]);

  if (!product || !selectedVariant) return null;

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0d0b09]/90 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={closePDP} aria-hidden="true" />

      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#14110e] border border-[#c9a96e]/30 rounded-sm shadow-2xl flex flex-col lg:flex-row overflow-hidden z-10">
        {/* Close Button */}
        <button
          onClick={closePDP}
          aria-label="Close detail window"
          className="absolute top-4 right-4 z-20 p-2 text-[#8a8278] hover:text-[#f3ede4] bg-[#0d0b09]/60 hover:bg-[#0d0b09] rounded-full border border-[#f3ede4]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 3D Flacon Interactive Viewer */}
        <div className="lg:w-1/2 min-h-[340px] lg:min-h-[580px] bg-[#0d0b09] relative flex items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-[#f3ede4]/10">
          <PerfumeBottleCanvas
            product={product}
            engravingText={engravingText}
            activeChapter={1}
            interactive={true}
            className="w-full h-full"
          />

          {/* Scent Mood Pill indicator */}
          <div className="absolute top-4 left-4 bg-[#14110e]/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#f3ede4]/10 flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: product.colours.highlight }}
            />
            <span className="uppercase tracking-widest text-[#8a8278]">
              {product.family} Olfactory Profile
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
            <p className="text-[11px] uppercase tracking-widest text-[#8a8278] bg-[#0d0b09]/75 backdrop-blur-md py-1 px-3 rounded-full inline-block border border-[#f3ede4]/10">
              Rotatable 3D Flacon · Real-time Monogram Engraving
            </p>
          </div>
        </div>

        {/* Right Side: Contiguous Purchase Module */}
        <div className="lg:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[580px] lg:max-h-none space-y-6">
          {/* Header Title & Price */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e]">
                {product.family} · Reserve Extractions
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="text-[#8a8278] hover:text-[#c9a96e] transition-colors p-1"
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#c9a96e] text-[#c9a96e]' : ''}`} />
              </button>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#f3ede4] mt-1">
              {product.name}
            </h2>
            <p className="text-xs text-[#8a8278] mt-0.5">{product.subtitle}</p>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl text-[#c9a96e]">
                {formatPrice(selectedVariant.price.USD)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-xs line-through text-[#8a8278]">
                  {formatPrice(selectedVariant.compareAtPrice.USD)}
                </span>
              )}
              <span className="text-[11px] text-[#7d9a6a] ml-auto">
                {selectedVariant.stock > 0
                  ? `In Stock (${selectedVariant.stock} flacons ready)`
                  : 'Atelier Backorder'}
              </span>
            </div>
          </div>

          {/* Size & Concentration Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-[#8a8278] block mb-2">
              Select Flacon Volume &amp; Concentration:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((v) => {
                const isSelected = v.sku === selectedVariant.sku;
                return (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 text-left border rounded-sm transition-all ${
                      isSelected
                        ? 'border-[#c9a96e] bg-[#c9a96e]/10 shadow-md'
                        : 'border-[#f3ede4]/10 bg-[#1e1914] hover:border-[#f3ede4]/25'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${isSelected ? 'text-[#c9a96e]' : 'text-[#f3ede4]'}`}>
                      {v.size}
                    </p>
                    <p className="text-[10px] text-[#8a8278] line-clamp-1 mt-0.5">
                      {v.concentration}
                    </p>
                    <p className="text-xs font-serif text-[#c9a96e] mt-1">
                      {formatPrice(v.price.USD)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Bottle Monogram Engraving Input */}
          <div className="p-4 bg-[#1a1511] border border-[#c9a96e]/30 rounded-sm">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="pdp-engraving" className="text-xs uppercase tracking-wider text-[#f3ede4] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span>Complimentary Monogram Engraving</span>
              </label>
              <span className="text-[10px] text-[#8a8278]">
                {12 - engravingText.length} chars left
              </span>
            </div>
            <p className="text-[11px] text-[#8a8278] mb-2.5">
              Type your initials or moniker to preview live on the 3D bottle label.
            </p>
            <input
              id="pdp-engraving"
              type="text"
              maxLength={12}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
              placeholder="e.g. ZEESHAAN"
              className="w-full bg-[#14110e] border border-[#f3ede4]/15 px-3 py-2 text-sm font-serif tracking-widest text-[#c9a96e] placeholder-[#8a8278] rounded-sm focus:outline-none focus:border-[#c9a96e]"
            />
          </div>

          {/* Complimentary Samples (Select 2) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-[#8a8278]">
                Two Complimentary Samples (Enclosed):
              </label>
              <span className="text-[11px] text-[#c9a96e]">
                {selectedSamples.length}/2 Selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COMPLIMENTARY_SAMPLES.slice(0, 4).map((smp) => {
                const isChecked = selectedSamples.includes(smp.id);
                return (
                  <button
                    key={smp.id}
                    onClick={() => toggleSample(smp.id)}
                    className={`p-2.5 text-left border rounded-sm transition-all flex items-start justify-between ${
                      isChecked
                        ? 'border-[#c9a96e] bg-[#c9a96e]/10'
                        : 'border-[#f3ede4]/10 bg-[#1e1914] text-[#8a8278]'
                    }`}
                  >
                    <div>
                      <p className={`text-xs ${isChecked ? 'text-[#f3ede4] font-medium' : 'text-[#8a8278]'}`}>
                        {smp.name}
                      </p>
                      <p className="text-[10px] text-[#8a8278] mt-0.5 line-clamp-1">{smp.notes}</p>
                    </div>
                    {isChecked && <Check className="w-3.5 h-3.5 text-[#c9a96e] shrink-0 ml-1 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gift Wrap Checkbox */}
          <label className="flex items-center gap-3 p-3 bg-[#1e1914] border border-[#f3ede4]/10 rounded-sm cursor-pointer hover:border-[#c9a96e]/30 transition-colors">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="accent-[#c9a96e] w-4 h-4 cursor-pointer"
            />
            <Gift className="w-4 h-4 text-[#c9a96e]" />
            <div className="text-xs">
              <span className="text-[#f3ede4]">Maison Wax-Sealed Gift Coffret Presentation</span>
              <span className="text-[#8a8278] block text-[11px]">Includes handwritten embossed calligraphy card (+$12 / €10)</span>
            </div>
          </label>

          {/* Primary Buy Button */}
          <button
            onClick={() => {
              addToCart(product, selectedVariant, engravingText, giftWrap, 1);
              closePDP();
            }}
            className="w-full py-4 px-6 bg-[#c9a96e] hover:bg-[#d9b97e] text-[#0d0b09] text-xs uppercase tracking-[0.25em] font-semibold rounded-sm transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>Add Flacon to Bag · {formatPrice(selectedVariant.price.USD + (giftWrap ? 12 : 0))}</span>
          </button>

          {/* Olfactory / Ritual Accordions */}
          <div className="pt-4 border-t border-[#f3ede4]/10">
            <div className="flex items-center gap-4 text-xs uppercase tracking-wider border-b border-[#f3ede4]/10 pb-2 mb-3">
              <button
                onClick={() => setActiveTab('pyramid')}
                className={`py-1 transition-colors ${activeTab === 'pyramid' ? 'text-[#c9a96e] border-b border-[#c9a96e]' : 'text-[#8a8278] hover:text-[#f3ede4]'}`}
              >
                Olfactory Pyramid
              </button>
              <button
                onClick={() => setActiveTab('ritual')}
                className={`py-1 transition-colors ${activeTab === 'ritual' ? 'text-[#c9a96e] border-b border-[#c9a96e]' : 'text-[#8a8278] hover:text-[#f3ede4]'}`}
              >
                The Application Ritual
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`py-1 transition-colors ${activeTab === 'delivery' ? 'text-[#c9a96e] border-b border-[#c9a96e]' : 'text-[#8a8278] hover:text-[#f3ede4]'}`}
              >
                Delivery &amp; Returns
              </button>
            </div>

            {activeTab === 'pyramid' && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#c9a96e] font-serif text-sm">Top Notes: </span>
                  <span className="text-[#8a8278]">
                    {product.pyramid.top.map((n) => `${n.name} (${n.origin})`).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#c9a96e] font-serif text-sm">Heart Notes: </span>
                  <span className="text-[#8a8278]">
                    {product.pyramid.heart.map((n) => `${n.name} (${n.origin})`).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#c9a96e] font-serif text-sm">Base Notes: </span>
                  <span className="text-[#8a8278]">
                    {product.pyramid.base.map((n) => `${n.name} (${n.origin})`).join(', ')}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'ritual' && (
              <p className="text-xs text-[#8a8278] leading-relaxed">
                Apply to pulse points: behind the earlobes, along the hollow of the clavicle, and the interior wrists. Due to the high concentration of natural resinous oils, avoid direct contact with pale silks.
              </p>
            )}

            {activeTab === 'delivery' && (
              <p className="text-xs text-[#8a8278] leading-relaxed">
                Orders are dispatched from our Grasse atelier via climate-controlled courier. Includes a 2ml matching trial vial: test the trial first, and if unsuited, return the unopened 50ml flacon within 30 days for a full refund.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
