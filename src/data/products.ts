import { PerfumeProduct, SampleVial, ShippingMethod, DiscountRule } from '../types';

export const PERFUME_PRODUCTS: PerfumeProduct[] = [
  {
    id: 'ambre-nuit',
    slug: 'ambre-nuit',
    name: 'Ambre Nuit',
    subtitle: 'Golden Ambergris & Damascene Rose',
    tagline: 'An evening encounter between luminous amber and midnight velvety rose.',
    story: 'Conceived under the dusk skies of Grasse, Ambre Nuit pairs the deep animalic warmth of aged ambergris with the tender voluptuousness of nocturnal Turkish rose, rounded by bourbon vanilla and smoky benzoin resin.',
    family: 'Amber',
    intensity: 4,
    image: '/src/assets/images/perfume_ambre_nuit_1790224239415.jpg',
    turntableImage: '/src/assets/images/perfume_hero_flacon_1790224221417.jpg',
    searchKeywords: ['amber', 'rose', 'warm', 'vanilla', 'evening', 'oriental', 'ambergris', 'spicy'],
    colours: {
      deep: '#1e1006',
      mid: '#6e3c12',
      highlight: '#d49b43',
      liquidHex: 0xd9822b,
      glassTintHex: 0x221308,
      capHex: 0xd4af37, // Champagne gold
    },
    pyramid: {
      top: [
        { id: 'an-t1', name: 'Calabrian Bergamot', origin: 'Reggio Calabria, Italy', description: 'Sun-drenched luminous citrus delivering immediate sparkle and crisp opening warmth.', accentColor: '#e8c547' },
        { id: 'an-t2', name: 'Pink Peppercorn', origin: 'Madagascar', description: 'Dry, spicy and gently resinous top note balancing the rich florals.', accentColor: '#e07a5f' }
      ],
      heart: [
        { id: 'an-h1', name: 'Damask Rose Absolute', origin: 'Isparta, Turkey', description: 'Hand-picked at dawn; dense, honeyed, velvety petals yielding narcotic floral depth.', accentColor: '#b5485d' },
        { id: 'an-h2', name: 'Somalian Frankincense', origin: 'Puntland, Somalia', description: 'Wild harvested tears of Boswellia sacra offering meditative incense ribbons.', accentColor: '#c9a96e' }
      ],
      base: [
        { id: 'an-b1', name: 'Aged Grey Ambergris', origin: 'Atlantic Seaboard', description: 'Saline, mineralic warmth with unmatched radiance and skin intimacy.', accentColor: '#8a6240' },
        { id: 'an-b2', name: 'Bourbon Vanilla Bean', origin: 'Sambava, Madagascar', description: 'Dark, woody, non-sweet balsamic vanilla pod essence.', accentColor: '#4a2810' },
        { id: 'an-b3', name: 'Sumatran Benzoin', origin: 'North Sumatra', description: 'Sweet balsamic crystalline resin lending smooth longevity.', accentColor: '#6d4c3d' }
      ]
    },
    variants: [
      {
        sku: 'MSN-AN-30-EDP',
        size: '30ml',
        concentration: 'Eau de Parfum',
        price: { USD: 165, EUR: 155, GBP: 135 },
        stock: 14
      },
      {
        sku: 'MSN-AN-50-EDP',
        size: '50ml',
        concentration: 'Eau de Parfum',
        price: { USD: 240, EUR: 220, GBP: 195 },
        compareAtPrice: { USD: 265, EUR: 245, GBP: 215 },
        stock: 22
      },
      {
        sku: 'MSN-AN-100-EXT',
        size: '100ml',
        concentration: 'Extrait de Parfum',
        price: { USD: 380, EUR: 350, GBP: 310 },
        stock: 6
      }
    ]
  },
  {
    id: 'vetiver-fume',
    slug: 'vetiver-fume',
    name: 'Vétiver Fumé',
    subtitle: 'Smoked Haitian Vetiver & Atlas Cedar',
    tagline: 'The elemental calm of damp peat, crushed pine needles, and glowing birch embers.',
    story: 'Born from high-altitude distillation in Les Cayes, Vétiver Fumé strips the root of its earthiness and crowns it with smoked cade wood, cold black pepper, and towering cedarwood from Morocco’s Atlas mountains.',
    family: 'Woody',
    intensity: 5,
    image: '/src/assets/images/perfume_vetiver_fume_1790224254380.jpg',
    turntableImage: '/src/assets/images/perfume_vetiver_fume_1790224254380.jpg',
    searchKeywords: ['vetiver', 'smoky', 'woody', 'cedar', 'earthy', 'moss', 'birch', 'leather'],
    colours: {
      deep: '#07140e',
      mid: '#153222',
      highlight: '#4a7c59',
      liquidHex: 0x2d5236, // Deep forest green
      glassTintHex: 0x0c1b12,
      capHex: 0x4a4d4b, // Gunmetal smoked steel
    },
    pyramid: {
      top: [
        { id: 'vf-t1', name: 'Cold Black Pepper', origin: 'Tellicherry, India', description: 'Crisp aromatic bite opening the respiratory senses into cool pine air.', accentColor: '#4a4d4b' },
        { id: 'vf-t2', name: 'Bitter Petitgrain', origin: 'Paraguay', description: 'Woody green citrus leaves lending tart aristocratic elegance.', accentColor: '#6f8f52' }
      ],
      heart: [
        { id: 'vf-h1', name: 'Haitian Vetiver Root', origin: 'Les Cayes, Haiti', description: 'Fair-trade harvested roots offering rich hazelnut, grassy and smoky nuances.', accentColor: '#5c6f4e' },
        { id: 'vf-h2', name: 'Smoked Cade Wood', origin: 'Cévennes, France', description: 'Pyrolyzed juniper branches evoking hearth fire and vintage leather boots.', accentColor: '#3c342d' }
      ],
      base: [
        { id: 'vf-b1', name: 'Atlas Mountain Cedar', origin: 'Ifrane, Morocco', description: 'Pencil-shaving crispness blended with dry resiny mountain warmth.', accentColor: '#7a5a40' },
        { id: 'vf-b2', name: 'Green Oakmoss Absolute', origin: 'Macedonia', description: 'Lichen forest floor accord grounding the composition in timeless chypre heritage.', accentColor: '#2b3e2b' }
      ]
    },
    variants: [
      {
        sku: 'MSN-VF-30-EDP',
        size: '30ml',
        concentration: 'Eau de Parfum',
        price: { USD: 165, EUR: 155, GBP: 135 },
        stock: 9
      },
      {
        sku: 'MSN-VF-50-EDP',
        size: '50ml',
        concentration: 'Eau de Parfum',
        price: { USD: 240, EUR: 220, GBP: 195 },
        stock: 18
      },
      {
        sku: 'MSN-VF-100-EXT',
        size: '100ml',
        concentration: 'Extrait de Parfum',
        price: { USD: 380, EUR: 350, GBP: 310 },
        stock: 4
      }
    ]
  },
  {
    id: 'rose-noire',
    slug: 'rose-noire',
    name: 'Rose Noire',
    subtitle: 'Damascus Black Rose & Wild Saffron',
    tagline: 'An intoxicating soliflore shrouded in midnight spices and velvet leather.',
    story: 'Neither virginal nor fragile, Rose Noire showcases the nocturnal side of florality: inky black petals steeped in Kashmiri saffron pistils, Cambodian oud smoke, and bitter cacao shavings.',
    family: 'Floral',
    intensity: 4,
    image: '/src/assets/images/perfume_rose_noire_1790224269228.jpg',
    turntableImage: '/src/assets/images/perfume_rose_noire_1790224269228.jpg',
    searchKeywords: ['rose', 'saffron', 'oud', 'floral', 'dark', 'sensual', 'leather', 'cacao'],
    colours: {
      deep: '#150609',
      mid: '#420d18',
      highlight: '#942b3d',
      liquidHex: 0x5e1525, // Deep obsidian garnet
      glassTintHex: 0x1f070c,
      capHex: 0xb8860b, // Dark polished brass
    },
    pyramid: {
      top: [
        { id: 'rn-t1', name: 'Kashmiri Saffron', origin: 'Pampore, India', description: 'Intensely metallic, leathery, and golden-red spice filaments.', accentColor: '#d66829' },
        { id: 'rn-t2', name: 'Mandarin Zest', origin: 'Sicily, Italy', description: 'Sharp juicy brightness cutting through the narcotic floral body.', accentColor: '#f28e2b' }
      ],
      heart: [
        { id: 'rn-h1', name: 'Black Damascus Rose', origin: 'Halfeti, Anatolia', description: 'The legendary dark rose with natural peppery and wine-barrel facets.', accentColor: '#7a192c' },
        { id: 'rn-h2', name: 'Dark Patchouli Heart', origin: 'Aceh, Indonesia', description: 'Double-distilled light fraction, omitting camphor for chocolate-like earth.', accentColor: '#4a3222' }
      ],
      base: [
        { id: 'rn-b1', name: 'Aged Cambodian Oud', origin: 'Koh Kong, Cambodia', description: 'Balsamic, gently barnyard, deep woody resin aged 15 years.', accentColor: '#2b1a13' },
        { id: 'rn-b2', name: 'Crushed Castoreum Accord', origin: 'Botanical Re-creation', description: 'Supple warm glove-leather warmth radiating endless skin attraction.', accentColor: '#1d120c' }
      ]
    },
    variants: [
      {
        sku: 'MSN-RN-30-EDP',
        size: '30ml',
        concentration: 'Eau de Parfum',
        price: { USD: 175, EUR: 165, GBP: 145 },
        stock: 8
      },
      {
        sku: 'MSN-RN-50-EDP',
        size: '50ml',
        concentration: 'Eau de Parfum',
        price: { USD: 255, EUR: 235, GBP: 210 },
        compareAtPrice: { USD: 285, EUR: 260, GBP: 235 },
        stock: 15
      },
      {
        sku: 'MSN-RN-100-EXT',
        size: '100ml',
        concentration: 'Extrait de Parfum',
        price: { USD: 395, EUR: 365, GBP: 325 },
        stock: 3
      }
    ]
  },
  {
    id: 'coffret-decouverte',
    slug: 'coffret-decouverte',
    name: 'Coffret Découverte',
    subtitle: 'The Atelier Collection (5 × 10ml)',
    tagline: 'Five miniature crystal flacons with gold atomizers in an embossed presentation box.',
    story: 'Experience the complete olfactory spectrum of the Maison: Ambre Nuit, Vétiver Fumé, Rose Noire, Fleur de Santal, and the exclusive salon reserve Iris Céleste. Includes a €75 / $80 voucher redeemable toward any full 50ml or 100ml flacon.',
    family: 'Fresh',
    intensity: 3,
    image: '/src/assets/images/perfume_discovery_set_1790224282920.jpg',
    turntableImage: '/src/assets/images/perfume_discovery_set_1790224282920.jpg',
    isDiscoverySet: true,
    searchKeywords: ['discovery', 'sample', 'gift', 'set', 'travel', 'miniature', 'coffret', 'voucher'],
    colours: {
      deep: '#14110e',
      mid: '#3d3429',
      highlight: '#c9a96e',
      liquidHex: 0xc9a96e,
      glassTintHex: 0x1a1612,
      capHex: 0xd4af37,
    },
    pyramid: {
      top: [
        { id: 'cd-t1', name: 'Curated Flight', origin: 'Maison Archives', description: '5 miniature 10ml atomizers engineered with precision micro-pumps.', accentColor: '#c9a96e' }
      ],
      heart: [
        { id: 'cd-h1', name: 'Five Unique Extractions', origin: 'Global Terroirs', description: 'From Mediterranean solar accords to Indonesian resinous depths.', accentColor: '#9e7b45' }
      ],
      base: [
        { id: 'cd-b1', name: 'Atelier Redeemable Voucher', origin: 'Gift Certificate', description: '$80 voucher enclosed to purchase your favored full flacon.', accentColor: '#f3ede4' }
      ]
    },
    variants: [
      {
        sku: 'MSN-CD-5X10',
        size: '50ml',
        concentration: 'Eau de Parfum',
        price: { USD: 115, EUR: 105, GBP: 95 },
        stock: 35
      }
    ]
  }
];

export const COMPLIMENTARY_SAMPLES: SampleVial[] = [
  { id: 'smp-ambre', name: 'Ambre Nuit (2ml)', family: 'Amber', notes: 'Ambergris, Damask Rose, Vanilla' },
  { id: 'smp-vetiver', name: 'Vétiver Fumé (2ml)', family: 'Woody', notes: 'Haitian Vetiver, Cade, Black Pepper' },
  { id: 'smp-rose', name: 'Rose Noire (2ml)', family: 'Floral', notes: 'Black Rose, Saffron, Oud' },
  { id: 'smp-santal', name: 'Fleur de Santal (2ml)', family: 'Woody', notes: 'Sandalwood, Cardamom, Iris' },
  { id: 'smp-iris', name: 'Iris Céleste (2ml)', family: 'Floral', notes: 'Florentine Orris, Violet, Ambrette' },
  { id: 'smp-neroli', name: 'Néroli Sauvage (2ml)', family: 'Citrus', notes: 'Orange Blossom, Petitgrain, Bergamot' }
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Atelier Standard Courier',
    description: 'Tracked temperature-controlled delivery in cushioned protective packaging.',
    estimatedDays: '3–5 business days',
    price: { USD: 15, EUR: 12, GBP: 10 },
    freeThreshold: { USD: 150, EUR: 140, GBP: 120 }
  },
  {
    id: 'express',
    name: 'White Glove Express',
    description: 'Priority courier, signature-only handoff with gift presentation box.',
    estimatedDays: '1–2 business days',
    price: { USD: 28, EUR: 25, GBP: 22 }
  },
  {
    id: 'complimentary',
    name: 'Maison Salon VIP Handover',
    description: 'Same-day collection at any Maison Flagship (Paris Place Vendôme, London Mayfair, NYC Madison).',
    estimatedDays: 'Available in 2 hours',
    price: { USD: 0, EUR: 0, GBP: 0 }
  }
];

export const DISCOUNT_CODES: DiscountRule[] = [
  {
    code: 'MAISON15',
    type: 'percentage',
    value: 15,
    description: '15% privilege on your premier order of flacons.'
  },
  {
    code: 'FIRSTORDER',
    type: 'fixed',
    value: 30,
    description: 'Complimentary $30 / €30 courtesy deduction on orders over $150.',
    minSpend: 150
  },
  {
    code: 'FREESHIP',
    type: 'shipping',
    value: 100,
    description: 'Complimentary white glove delivery privilege on all orders.'
  }
];

export const CURRENCY_SYMBOLS: Record<import('../types').Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£'
};
