import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PerfumeProduct } from '../../types';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openPDP, addToCart, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for '/' to open, 'Esc' to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        // Prevent typing '/' into active inputs if outside
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchFamily = p.family.toLowerCase().includes(q);
      const matchTagline = p.tagline.toLowerCase().includes(q);
      const matchKeywords = p.searchKeywords.some((k) => k.toLowerCase().includes(q));
      const matchNotes = [
        ...p.pyramid.top,
        ...p.pyramid.heart,
        ...p.pyramid.base,
      ].some((n) => n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));

      return matchName || matchFamily || matchTagline || matchKeywords || matchNotes;
    });
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0d0b09]/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl bg-[#14110e] border border-[#f3ede4]/15 rounded-sm p-6 sm:p-8 shadow-2xl z-10">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#f3ede4]/15 pb-4">
          <Search className="w-5 h-5 text-[#c9a96e] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by notes (e.g. amber, oud, vetiver, rose), family, or flacon..."
            className="w-full bg-transparent text-lg sm:text-xl font-serif text-[#f3ede4] placeholder-[#8a8278] focus:outline-none tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8a8278] hover:text-[#f3ede4] p-1 mr-2"
              aria-label="Clear Search Input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="text-xs uppercase tracking-widest text-[#8a8278] hover:text-[#c9a96e] border border-[#f3ede4]/10 hover:border-[#c9a96e]/40 px-2 py-1 rounded transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1">
          {query.trim().length === 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a8278] mb-3">
                Curated Olfactory Inquiries
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Damask Rose',
                  'Aged Ambergris',
                  'Haitian Vetiver',
                  'Somalian Frankincense',
                  'Wild Saffron',
                  'Woody Family',
                  'Coffret Découverte',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs tracking-wider text-[#f3ede4]/80 bg-[#1e1914] hover:bg-[#c9a96e]/20 hover:text-[#c9a96e] border border-[#f3ede4]/10 px-3 py-1.5 rounded-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a8278]">
                {results.length} Olfactory {results.length === 1 ? 'Creation' : 'Creations'} Located
              </p>
              <div className="divide-y divide-[#f3ede4]/10">
                {results.map((product) => {
                  const defaultVariant = product.variants[0];
                  return (
                    <div
                      key={product.id}
                      className="py-4 flex items-center justify-between gap-4 group hover:bg-[#1a1511]/50 px-2 transition-colors rounded-sm"
                    >
                      <div
                        className="flex items-center gap-4 cursor-pointer flex-1"
                        onClick={() => {
                          setIsSearchOpen(false);
                          openPDP(product);
                        }}
                      >
                        <div className="w-16 h-16 rounded-sm overflow-hidden bg-[#0d0b09] border border-[#f3ede4]/10 shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-lg text-[#f3ede4] group-hover:text-[#c9a96e] transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-[10px] uppercase tracking-wider text-[#8a8278]">
                              · {product.family}
                            </span>
                          </div>
                          <p className="text-xs text-[#8a8278] line-clamp-1 mt-0.5">
                            {product.subtitle}
                          </p>
                          <p className="text-xs font-serif text-[#c9a96e] mt-1">
                            From {formatPrice(defaultVariant.price.USD)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(product, defaultVariant);
                            setIsSearchOpen(false);
                          }}
                          className="px-3 py-1.5 bg-[#c9a96e]/15 hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0d0b09] border border-[#c9a96e]/40 rounded-sm text-xs uppercase tracking-wider transition-colors"
                        >
                          Quick Add
                        </button>
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            openPDP(product);
                          }}
                          aria-label={`Inspect ${product.name}`}
                          className="p-2 text-[#8a8278] hover:text-[#f3ede4] transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Sparkles className="w-6 h-6 text-[#8a8278] mx-auto mb-3 opacity-60" />
              <p className="font-serif text-lg text-[#f3ede4]">
                No rare flacons matched &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#8a8278] mt-1 max-w-sm mx-auto">
                Try searching by raw notes such as amber, cedar, damask rose, or explore our curated discovery coffret.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
