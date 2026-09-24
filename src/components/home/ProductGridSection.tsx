import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { PerfumeProduct, FragranceFamily } from '../../types';
import { Heart, Sparkles, ArrowUpRight, Plus } from 'lucide-react';

export const ProductGridSection: React.FC = () => {
  const { products, openPDP, addToCart, formatPrice, toggleWishlist, isInWishlist } = useStore();
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const families = ['all', 'Amber', 'Woody', 'Floral', 'Discovery'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedFamily === 'all') return true;
        if (selectedFamily === 'Discovery') return p.isDiscoverySet;
        return p.family === selectedFamily;
      })
      .sort((a, b) => {
        const priceA = a.variants[0].price.USD;
        const priceB = b.variants[0].price.USD;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        return 0;
      });
  }, [products, selectedFamily, sortBy]);

  return (
    <section id="flacons" className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#f3ede4]/10 pb-8 mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e]">
            Atelier Parfumerie
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#f3ede4] mt-2">
            The Permanent Collection
          </h2>
          <p className="text-sm text-[#8a8278] mt-2 max-w-xl">
            Each flacon is individually numbered, hand-filled with cold-macerated essences, and crowned with a magnetized brass closure.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Family Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#14110e] border border-[#f3ede4]/10 rounded-sm">
            {families.map((fam) => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-all ${
                  selectedFamily === fam
                    ? 'bg-[#c9a96e] text-[#0d0b09] font-medium'
                    : 'text-[#8a8278] hover:text-[#f3ede4]'
                }`}
              >
                {fam}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#14110e] border border-[#f3ede4]/10 text-xs uppercase tracking-wider text-[#8a8278] hover:text-[#f3ede4] px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9a96e]/40 cursor-pointer"
          >
            <option value="featured">Featured Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const defaultVariant = product.variants[0];
          const isFavorited = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between bg-[#14110e]/70 border border-[#f3ede4]/10 hover:border-[#c9a96e]/40 transition-all duration-500 rounded-sm overflow-hidden"
            >
              {/* Product Visual Area */}
              <div
                className="relative aspect-[4/3] w-full bg-[#0d0b09] overflow-hidden cursor-pointer"
                onClick={() => openPDP(product)}
              >
                <img
                  src={product.image}
                  alt={`${product.name} — ${product.subtitle}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110e] via-transparent to-transparent opacity-80" />

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border transition-all ${
                    isFavorited
                      ? 'bg-[#c9a96e] border-[#c9a96e] text-[#0d0b09]'
                      : 'bg-[#0d0b09]/60 border-[#f3ede4]/20 text-[#8a8278] hover:text-[#f3ede4]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                {/* Family & Concentration Tag */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a96e] bg-[#0d0b09]/80 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#c9a96e]/30">
                    {product.family}
                  </span>
                  {product.isDiscoverySet && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#f3ede4] bg-[#c9a96e]/30 backdrop-blur-md px-2 py-1 rounded-sm border border-[#c9a96e]/50">
                      Discovery Coffret
                    </span>
                  )}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      onClick={() => openPDP(product)}
                      className="font-serif text-2xl text-[#f3ede4] group-hover:text-[#c9a96e] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <span className="font-serif text-lg text-[#c9a96e] shrink-0">
                      {formatPrice(defaultVariant.price.USD)}
                    </span>
                  </div>

                  <p className="text-xs text-[#8a8278] mt-1 line-clamp-1">
                    {product.subtitle}
                  </p>

                  <p className="text-xs text-[#8a8278]/80 mt-3 line-clamp-2 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Olfactory Notes Preview */}
                  <div className="mt-4 pt-4 border-t border-[#f3ede4]/10 flex flex-wrap gap-1.5 text-[11px] text-[#8a8278]">
                    <span className="text-[#c9a96e]">Key Notes:</span>
                    <span>{product.pyramid.top[0]?.name} ·</span>
                    <span>{product.pyramid.heart[0]?.name} ·</span>
                    <span>{product.pyramid.base[0]?.name}</span>
                  </div>
                </div>

                {/* Card Action Footers */}
                <div className="mt-6 pt-4 border-t border-[#f3ede4]/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => openPDP(product)}
                    className="text-xs uppercase tracking-wider text-[#8a8278] hover:text-[#f3ede4] flex items-center gap-1.5 transition-colors py-1"
                  >
                    <span>Inspect 3D Flacon</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => addToCart(product, defaultVariant)}
                    className="py-2 px-3.5 bg-[#c9a96e]/15 hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0d0b09] border border-[#c9a96e]/40 rounded-sm text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
