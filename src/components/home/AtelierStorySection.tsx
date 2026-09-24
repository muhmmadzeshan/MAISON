import React, { useState } from 'react';
import { Compass, Sparkles, Feather, ShieldCheck } from 'lucide-react';

export const AtelierStorySection: React.FC = () => {
  const [activeTier, setActiveTier] = useState<'top' | 'heart' | 'base'>('heart');

  const pyramidTiers = {
    top: {
      title: 'Top Accords — The Prelude (0 to 20 Minutes)',
      duration: 'High volatility volatile esters & citrus oils',
      description:
        'The instantaneous olfactory overture. Sun-drenched Italian bergamot, hand-crushed pink peppercorn, and wild bitter orange zests that awaken the senses before yielding to the composition’s core.',
      ingredients: ['Calabrian Bergamot', 'Pink Peppercorn', 'Sicilian Mandarin', 'Bitter Petitgrain'],
    },
    heart: {
      title: 'Heart Notes — The Character (20 Minutes to 4 Hours)',
      duration: 'Medium molecular weight aromatics & floral absolutes',
      description:
        'The soul of the fragrance. Wild Damascus rose petals distilled in copper alembics, wild Somalian frankincense tears, and Haitian vetiver root harvested at full maturation in Les Cayes.',
      ingredients: ['Turkish Damask Rose', 'Somalian Frankincense', 'Haitian Vetiver', 'Smoked Cade'],
    },
    base: {
      title: 'Base Notes — The Sillage & Skin Scent (4 to 24+ Hours)',
      duration: 'Heavy fixatives, ancient resins & rare woods',
      description:
        'The intimate anchor. Atlantic grey ambergris, aged bourbon vanilla bean infusions, and 15-year-old Cambodian oud that marry intimately with the wearer’s natural body chemistry.',
      ingredients: ['Aged Grey Ambergris', 'Atlas Mountain Cedar', 'Bourbon Vanilla Pod', 'Cambodian Oud'],
    },
  };

  return (
    <section id="atelier-story" className="py-24 bg-[#110e0b] border-y border-[#f3ede4]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Atelier Craftsmanship Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e]">
              Grasse · Haute Parfumerie
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#f3ede4] leading-tight">
              Six Months of Oak Barrel Maceration
            </h2>
            <p className="text-sm sm:text-base text-[#8a8278] leading-relaxed">
              Unlike commercial fragrances assembled with chemical stabilizers, each flacon at MAISON undergoes artisanal cold maceration in seasoned French oak casks. This patient aging harmonizes volatile botanicals, imparting a rich amber hue and unrivaled sillage.
            </p>
            <p className="text-sm text-[#8a8278] leading-relaxed">
              Every crystal vessel is filled by hand in our Grasse laboratory, inspected under polarized light for optical clarity, and accompanied by an authenticated Certificate of Extraction.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#f3ede4]/10">
              <div>
                <p className="font-serif text-2xl text-[#c9a96e]">28%</p>
                <p className="text-xs uppercase tracking-wider text-[#8a8278] mt-1">
                  Extrait Concentration
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#c9a96e]">100%</p>
                <p className="text-xs uppercase tracking-wider text-[#8a8278] mt-1">
                  Traceable Terroirs
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#c9a96e]/30 shadow-2xl">
              <img
                src="/src/assets/images/perfume_hero_flacon_1790224221417.jpg"
                alt="Artisanal perfume glass flacon in studio"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0d0b09]/90 backdrop-blur-md border border-[#f3ede4]/10 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#c9a96e]">Laboratory Log</p>
                <p className="font-serif text-sm text-[#f3ede4] mt-0.5">
                  &ldquo;Perfume is silent architecture; time is its stone.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Olfactory Pyramid Architecture */}
        <div id="olfactory-craft" className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e]">
              Temporal Composition
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#f3ede4] mt-2">
              The Architecture of the Scent Pyramid
            </h3>
            <p className="text-xs sm:text-sm text-[#8a8278] mt-2">
              Select a layer to examine the temporal release of raw botanicals on the skin.
            </p>
          </div>

          {/* Tier Switcher Buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-[#14110e] border border-[#f3ede4]/10 rounded-sm">
              {(['top', 'heart', 'base'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`px-5 py-2 text-xs uppercase tracking-[0.15em] rounded-sm transition-all ${
                    activeTier === tier
                      ? 'bg-[#c9a96e] text-[#0d0b09] font-medium shadow-md'
                      : 'text-[#8a8278] hover:text-[#f3ede4]'
                  }`}
                >
                  {tier} tier
                </button>
              ))}
            </div>
          </div>

          {/* Active Tier Display Card */}
          <div className="max-w-3xl mx-auto bg-[#14110e] border border-[#c9a96e]/30 rounded-sm p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#f3ede4]/10 pb-4">
              <h4 className="font-serif text-2xl text-[#f3ede4]">
                {pyramidTiers[activeTier].title}
              </h4>
              <span className="text-xs text-[#c9a96e] font-serif italic">
                {pyramidTiers[activeTier].duration}
              </span>
            </div>

            <p className="text-sm text-[#8a8278] leading-relaxed mt-4">
              {pyramidTiers[activeTier].description}
            </p>

            <div className="mt-6 pt-4 border-t border-[#f3ede4]/10">
              <p className="text-[11px] uppercase tracking-wider text-[#8a8278] mb-3">
                Signature Raw Extractions in This Layer
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pyramidTiers[activeTier].ingredients.map((ing) => (
                  <div
                    key={ing}
                    className="p-3 bg-[#1e1914] border border-[#f3ede4]/10 rounded-sm text-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c9a96e] mx-auto mb-1.5 opacity-80" />
                    <p className="text-xs font-serif text-[#f3ede4]">{ing}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Atelier Privileges & Guarantees */}
        <div className="mt-20 pt-12 border-t border-[#f3ede4]/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Feather className="w-6 h-6 text-[#c9a96e] shrink-0" />
            <div>
              <h5 className="font-serif text-lg text-[#f3ede4]">Two Complimentary Samples</h5>
              <p className="text-xs text-[#8a8278] mt-1">
                Choose two 2ml discovery vials with every flacon order to experience neighboring creations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Compass className="w-6 h-6 text-[#c9a96e] shrink-0" />
            <div>
              <h5 className="font-serif text-lg text-[#f3ede4]">Complimentary White Glove Delivery</h5>
              <p className="text-xs text-[#8a8278] mt-1">
                Temperature-shielded express courier on all acquisitions exceeding $150 / €140.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#c9a96e] shrink-0" />
            <div>
              <h5 className="font-serif text-lg text-[#f3ede4]">Personal Monogram Engraving</h5>
              <p className="text-xs text-[#8a8278] mt-1">
                Bespoke laser debossing of your initials onto the flacon label and presentation coffret.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
