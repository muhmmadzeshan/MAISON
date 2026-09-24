import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Currency } from '../../types';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currency, setCurrency, setIsPrivacyOpen } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0a0807] border-t border-[#f3ede4]/10 text-[#8a8278] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Tier: Brand Wordmark & Newsletter Invitation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#f3ede4]/10">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl text-[#f3ede4] tracking-[0.25em] block">
              MAISON
            </span>
            <p className="font-serif italic text-sm text-[#c9a96e]">
              Haute Parfumerie &amp; 3D Olfactory Atelier · Grasse &amp; Paris
            </p>
            <p className="text-xs text-[#8a8278] max-w-sm leading-relaxed">
              Founded on the belief that scent is intimate architecture. Hand-poured in Grasse from cold-macerated botanicals and encased in optical flint crystal flacons.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e] block">
              Privileged Salon Despatches
            </span>
            <p className="text-xs text-[#f3ede4]/80">
              Receive confidential invitations to new harvest distillations and private salon events.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-[#1e1914] border border-[#c9a96e]/30 rounded-sm text-xs text-[#c9a96e] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Your invitation dispatch has been logged. Bienvenue à la Maison.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your patron email..."
                  className="flex-1 bg-[#14110e] border border-[#f3ede4]/15 px-3.5 py-2.5 text-xs text-[#f3ede4] placeholder-[#8a8278] rounded-sm focus:outline-none focus:border-[#c9a96e]"
                />
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#c9a96e] text-[#0d0b09] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#d9b97e] transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Join Salon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-[#8a8278]">Double opt-in verified. Unsubscribe at your pleasure.</p>
          </div>
        </div>

        {/* Middle Tier: Atelier Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#f3ede4]/10 text-xs">
          <div>
            <h4 className="font-serif text-sm text-[#f3ede4] uppercase tracking-wider mb-4">
              Flagship Salons
            </h4>
            <ul className="space-y-2">
              <li>Place Vendôme · Paris</li>
              <li>Mayfair, Mount Street · London</li>
              <li>Madison Avenue · New York</li>
              <li>Ginza Six · Tokyo</li>
              <li>Laboratory &amp; Gardens · Grasse</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-[#f3ede4] uppercase tracking-wider mb-4">
              The Collection
            </h4>
            <ul className="space-y-2">
              <li>Ambre Nuit (Ambergris &amp; Rose)</li>
              <li>Vétiver Fumé (Smoked Roots)</li>
              <li>Rose Noire (Damascus Rose)</li>
              <li>Coffret Découverte (5×10ml)</li>
              <li>Bespoke Flacon Engraving</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-[#f3ede4] uppercase tracking-wider mb-4">
              Atelier Service
            </h4>
            <ul className="space-y-2">
              <li>White Glove Courier</li>
              <li>Complimentary Sample Policy</li>
              <li>Wax-Sealed Gift Packaging</li>
              <li>30-Day Sealed Returns</li>
              <li>Maceration Consultation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm text-[#f3ede4] uppercase tracking-wider mb-4">
              Data &amp; Privacy
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="hover:text-[#c9a96e] transition-colors text-left underline underline-offset-4"
                >
                  GDPR / CCPA Patron Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="hover:text-[#c9a96e] transition-colors text-left"
                >
                  Export Patron Archive (JSON)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="hover:text-[#c9a96e] transition-colors text-left"
                >
                  Right to Erasure (Article 17)
                </button>
              </li>
              <li>Stripe Radar Protected</li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Currency & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} MAISON Haute Parfumerie S.A.S. Paris · All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-wider text-[#8a8278]">Currency:</span>
            <div className="flex gap-2">
              {(['USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-0.5 rounded text-[11px] uppercase font-mono transition-colors ${
                    currency === c
                      ? 'bg-[#c9a96e] text-[#0d0b09] font-bold'
                      : 'hover:text-[#f3ede4]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
