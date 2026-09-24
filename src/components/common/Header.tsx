import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, ShieldCheck, UserCheck, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Currency } from '../../types';

interface HeaderProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection }) => {
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAdminOpen,
    setIsPrivacyOpen,
    currency,
    setCurrency,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0d0b09]/92 backdrop-blur-md border-b border-[#f3ede4]/10 py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-[#0d0b09]/80 via-[#0d0b09]/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <a
          href="/"
          className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#f3ede4] hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]"
        >
          MAISON
        </a>

        {/* Zone 2: Clean 4–6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-[#8a8278]">
          <a
            href="#flacons"
            onClick={(e) => handleNavClick(e, 'flacons')}
            className="hover:text-[#f3ede4] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c9a96e] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Collection
          </a>
          <a
            href="#atelier-story"
            onClick={(e) => handleNavClick(e, 'atelier-story')}
            className="hover:text-[#f3ede4] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c9a96e] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            The Atelier
          </a>
          <a
            href="#olfactory-craft"
            onClick={(e) => handleNavClick(e, 'olfactory-craft')}
            className="hover:text-[#f3ede4] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c9a96e] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Olfactory Pyramid
          </a>
          <a
            href="#discovery"
            onClick={(e) => handleNavClick(e, 'discovery')}
            className="hover:text-[#f3ede4] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-[#c9a96e] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
          >
            Discovery Set
          </a>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Select Currency"
              className="bg-transparent text-xs tracking-wider uppercase text-[#8a8278] hover:text-[#f3ede4] focus:outline-none focus:text-[#c9a96e] cursor-pointer py-1 pr-1 border-b border-transparent hover:border-[#c9a96e]/30"
            >
              <option value="USD" className="bg-[#14110e] text-[#f3ede4]">USD ($)</option>
              <option value="EUR" className="bg-[#14110e] text-[#f3ede4]">EUR (€)</option>
              <option value="GBP" className="bg-[#14110e] text-[#f3ede4]">GBP (£)</option>
            </select>
          </div>

          {/* Search Trigger with '/' keyboard hint */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open Fragrance Search"
            className="flex items-center gap-2 text-[#8a8278] hover:text-[#f3ede4] transition-colors group p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]"
          >
            <Search className="w-4 h-4 group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline-block text-[10px] tracking-wider border border-[#f3ede4]/15 px-1.5 py-0.5 rounded text-[#8a8278] group-hover:border-[#c9a96e]/40">
              /
            </span>
          </button>

          {/* Privacy & Account Trigger */}
          <button
            onClick={() => setIsPrivacyOpen(true)}
            aria-label="Account & GDPR Privacy Portal"
            title="Patron Portal & Privacy Rights"
            className="text-[#8a8278] hover:text-[#f3ede4] transition-colors p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* Atelier Admin Management Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            aria-label="Open Atelier Administration Console"
            title="Atelier Admin & Inventory Console"
            className="text-[#8a8278] hover:text-[#c9a96e] transition-colors p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Shopping Bag"
            className="relative flex items-center justify-center p-2 text-[#f3ede4] hover:text-[#c9a96e] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a96e] text-[#0d0b09] text-[10px] font-semibold flex items-center justify-center rounded-full animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
