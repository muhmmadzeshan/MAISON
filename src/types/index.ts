export type FragranceFamily = 'Woody' | 'Floral' | 'Amber' | 'Fresh' | 'Citrus' | 'Leather';

export type Concentration = 'Eau de Parfum' | 'Extrait de Parfum';

export interface OlfactoryNote {
  id: string;
  name: string;
  origin: string;
  description: string;
  accentColor: string;
}

export interface OlfactoryPyramid {
  top: OlfactoryNote[];
  heart: OlfactoryNote[];
  base: OlfactoryNote[];
}

export interface ProductVariant {
  sku: string;
  size: '30ml' | '50ml' | '100ml';
  concentration: Concentration;
  price: Record<Currency, number>; // Minor units or display units (we use display units e.g. 195 USD)
  compareAtPrice?: Record<Currency, number>;
  stock: number;
}

export interface PerfumeProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  story: string;
  family: FragranceFamily;
  intensity: 1 | 2 | 3 | 4 | 5;
  pyramid: OlfactoryPyramid;
  variants: ProductVariant[];
  image: string;
  turntableImage?: string;
  isDiscoverySet?: boolean;
  searchKeywords: string[];
  colours: {
    deep: string;
    mid: string;
    highlight: string;
    liquidHex: number;
    glassTintHex: number;
    capHex: number;
  };
}

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CartItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  variantSize: string;
  concentration: Concentration;
  price: number;
  currency: Currency;
  quantity: number;
  image: string;
  engraving?: string;
  giftWrap?: boolean;
}

export interface SampleVial {
  id: string;
  name: string;
  family: string;
  notes: string;
}

export interface DiscountRule {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number; // 15 for 15%, or 25 for $25 off
  description: string;
  minSpend?: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: Record<Currency, number>;
  freeThreshold?: Record<Currency, number>;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  variantSize: string;
  concentration: string;
  price: number;
  quantity: number;
  engraving?: string;
  giftWrap?: boolean;
}

export type OrderStatus = 'pending' | 'macerating' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  items: OrderItemSnapshot[];
  samples: string[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingMethod: string;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  currency: Currency;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface DataRequestRecord {
  id: string;
  email: string;
  type: 'export' | 'delete';
  requestedAt: string;
  status: 'pending' | 'completed';
}
