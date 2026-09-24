import React, { useState } from 'react';
import { PerfumeBottleCanvas } from '../canvas/PerfumeBottleCanvas';
import { useStore } from '../../context/StoreContext';
import { PerfumeProduct } from '../../types';
import { Sparkles, ArrowRight, ChevronRight, Eye, Edit3 } from 'lucide-react';

export const HeroChapterScroll: React.FC = () => {
  const { products, openPDP, addToCart, formatPrice } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<PerfumeProduct>(products[0]);
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [engravingInput, setEngravingInput] = useState<string>('MAISON');
  const [activeNoteTab, setActiveNoteTab] = useState<'top' | 'heart' | 'base'>('heart');

  const chapters = [
    {
      num: 1,
      name: 'The Flacon',
      subtitle: 'Pure Crystal Glass Sculpture',
      description:
        'Sculpted from heavy optical flint glass with an architectural octagonal bevel, reflecting ambient light with diamond-grade dispersion.',
    },
    {
      num: 2,
      name: 'The Monogram',
      subtitle: 'Bespoke Cap & Gold Foil Label',
      description:
        'A solid brass cap magnetically clicks into place with reassuring mechanical weight, guarding your bespoke personalized moniker.',
    },
    {
      num: 3,
      name: 'The Pyramid',
      subtitle: 'Harmonic Olfactory Architecture',
      description:
        'An unfolding temporal journey through volatile top sparkles, opulent floral and resin hearts, and grounding base woods.',
    },
    {
      num: 4,
      name: 'The Elixir',
      subtitle: 'Macerated in Grasse, France',
      description:
        'Aged for six months in French oak barrels to achieve velvety cohesion between wild harvested ambergris and Turkish petals.',
    },
    {
      num: 5,
      name: 'The Atelier',
      subtitle: 'Your Personal Flacon',
      description:
        'Hand-poured on demand. Accompanied by complimentary travel atomizers and certificate of origin.',
    },
  ];

  const currentVariant = selectedProduct.variants[1] || selectedProduct.variants[0];

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <PerfumeBottleCanvas
          product={selectedProduct}
          engravingText={engravingInput}
          activeChapter={activeChapter}
          interactive={true}
          className="w-full h-full"
        />
      </div>

      {/* Top Controls Overlay: Fragrance Selector */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8a8278]">
              Atelier Fragrance:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-[#14110e]/70 backdrop-blur-md border border-[#f3ede4]/10 rounded-sm">
              {products
                .filter((p) => !p.isDiscoverySet)
                .map((p) => {
                  const isActive = p.id === selectedProduct.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`px-3 py-1 text-xs tracking-wider uppercase transition-all duration-300 rounded-sm ${
                        isActive
                          ? 'bg-[#c9a96e] text-[#0d0b09] font-medium shadow-lg'
                          : 'text-[#8a8278] hover:text-[#f3ede4] hover:bg-[#f3ede4]/5'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Quick Monogram Customizer directly on hero */}
          <div className="flex items-center gap-2 bg-[#14110e]/75 backdrop-blur-md border border-[#c9a96e]/30 px-3 py-1.5 rounded-sm">
            <Edit3 className="w-3.5 h-3.5 text-[#c9a96e]" />
            <span className="text-[10px] uppercase tracking-wider text-[#8a8278]">
              Live Bottle Engraving:
            </span>
            <input
              type="text"
              maxLength={12}
              value={engravingInput}
              onChange={(e) => setEngravingInput(e.target.value.toUpperCase())}
              placeholder="YOUR INITIALS"
              className="w-28 bg-transparent text-xs font-serif text-[#c9a96e] placeholder-[#8a8278] focus:outline-none tracking-widest font-semibold border-b border-[#c9a96e]/40 focus:border-[#c9a96e]"
            />
          </div>
        </div>
      </div>

      {/* Middle Content Overlay: Chapter Details */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full my-auto pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Fragrance Editorial Copy */}
          <div className="lg:col-span-5 pointer-events-auto">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-[0.3em] text-[#c9a96e]">
                0{activeChapter} · {chapters[activeChapter - 1].name}
              </span>
              <span className="w-8 h-[1px] bg-[#c9a96e]/50" />
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#f3ede4] leading-[1.05] text-balance">
              {activeChapter === 1 ? selectedProduct.name : chapters[activeChapter - 1].subtitle}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#8a8278] leading-relaxed max-w-md">
              {activeChapter === 1
                ? selectedProduct.story
                : chapters[activeChapter - 1].description}
            </p>

            {/* Interactive Note Cards if Chapter 3 (Olfactory Pyramid) */}
            {activeChapter === 3 && (
              <div className="mt-5 p-4 bg-[#14110e]/90 backdrop-blur-md border border-[#c9a96e]/25 rounded-sm max-w-md">
                <div className="flex items-center gap-2 border-b border-[#f3ede4]/10 pb-2 mb-3">
                  {(['top', 'heart', 'base'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setActiveNoteTab(tier)}
                      className={`text-xs uppercase tracking-widest px-2.5 py-1 rounded transition-colors ${
                        activeNoteTab === tier
                          ? 'bg-[#c9a96e]/20 text-[#c9a96e] border border-[#c9a96e]/40'
                          : 'text-[#8a8278] hover:text-[#f3ede4]'
                      }`}
                    >
                      {tier} notes
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {selectedProduct.pyramid[activeNoteTab].map((note) => (
                    <div key={note.id} className="text-xs">
                      <div className="flex items-center justify-between text-[#f3ede4]">
                        <span className="font-serif text-sm text-[#c9a96e]">{note.name}</span>
                        <span className="text-[10px] text-[#8a8278]">{note.origin}</span>
                      </div>
                      <p className="text-[11px] text-[#8a8278] mt-0.5">{note.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() =>
                  addToCart(
                    selectedProduct,
                    currentVariant,
                    engravingInput,
                    false,
                    1
                  )
                }
                className="py-3 px-6 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-[#d9b97e] transition-all duration-300 shadow-xl flex items-center gap-2"
              >
                <span>Acquire Flacon · {formatPrice(currentVariant.price.USD)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openPDP(selectedProduct)}
                className="py-3 px-5 bg-transparent border border-[#f3ede4]/20 text-[#f3ede4] text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#f3ede4]/5 transition-colors flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span>Atelier Inspection</span>
              </button>
            </div>
          </div>

          {/* Center 3D Space empty for bottle visibility */}
          <div className="lg:col-span-4 min-h-[300px] lg:min-h-[460px] pointer-events-none" />

          {/* Right Column: Key Accords & Specs */}
          <div className="lg:col-span-3 pointer-events-auto flex flex-col items-start lg:items-end text-left lg:text-right space-y-4">
            <div className="p-4 bg-[#14110e]/75 backdrop-blur-md border border-[#f3ede4]/10 rounded-sm w-full sm:w-auto">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8278]">Concentration</p>
              <p className="font-serif text-lg text-[#f3ede4] mt-0.5">
                {currentVariant.concentration}
              </p>
              <p className="text-[11px] text-[#8a8278] mt-0.5">28% Pure Parfum Concentrate</p>

              <div className="mt-4 pt-3 border-t border-[#f3ede4]/10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8278]">Key Extraction</p>
                <p className="font-serif text-base text-[#c9a96e] mt-0.5">
                  {selectedProduct.pyramid.heart[0]?.name}
                </p>
                <p className="text-[10px] text-[#8a8278]">{selectedProduct.pyramid.heart[0]?.origin}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f3ede4]/10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8278]">Inventory Reserve</p>
                <p className="text-xs text-[#7d9a6a] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7d9a6a] animate-pulse" />
                  <span>{currentVariant.stock} flacons remaining in salon</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline: 5 Cinematic Chapters */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="border-t border-[#f3ede4]/10 pt-4 flex items-center justify-between gap-2 overflow-x-auto pb-1">
          {chapters.map((ch) => {
            const isCurrent = ch.num === activeChapter;
            return (
              <button
                key={ch.num}
                onClick={() => setActiveChapter(ch.num)}
                className={`group flex items-center gap-3 text-left py-2 px-3 rounded-sm transition-all duration-300 shrink-0 ${
                  isCurrent
                    ? 'bg-[#14110e]/90 border border-[#c9a96e]/40 shadow-lg'
                    : 'hover:bg-[#14110e]/40 border border-transparent'
                }`}
              >
                <span
                  className={`text-xs font-serif ${
                    isCurrent ? 'text-[#c9a96e]' : 'text-[#8a8278] group-hover:text-[#f3ede4]'
                  }`}
                >
                  0{ch.num}
                </span>
                <div>
                  <p
                    className={`text-xs tracking-wider uppercase ${
                      isCurrent ? 'text-[#f3ede4] font-medium' : 'text-[#8a8278] group-hover:text-[#f3ede4]'
                    }`}
                  >
                    {ch.name}
                  </p>
                  <p className="text-[10px] text-[#8a8278] hidden md:block">{ch.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
