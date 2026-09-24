import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PerfumeProduct,
  ProductVariant,
  CartItem,
  Currency,
  Order,
  DataRequestRecord,
  DiscountRule
} from '../types';
import { PERFUME_PRODUCTS, DISCOUNT_CODES, CURRENCY_SYMBOLS } from '../data/products';

interface StoreContextType {
  // Products & PDP
  products: PerfumeProduct[];
  selectedProductForPDP: PerfumeProduct | null;
  openPDP: (product: PerfumeProduct) => void;
  closePDP: () => void;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number, customCurrency?: Currency) => string;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: PerfumeProduct,
    variant: ProductVariant,
    engraving?: string,
    giftWrap?: boolean,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Samples (Max 2 free)
  selectedSamples: string[];
  toggleSample: (sampleId: string) => void;

  // Discounts
  discountCode: string;
  appliedDiscount: DiscountRule | null;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  discountSavings: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Checkout
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // GDPR Data Requests
  dataRequests: DataRequestRecord[];
  requestDataExport: (email: string) => void;
  requestDataDeletion: (email: string) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isPrivacyOpen: boolean;
  setIsPrivacyOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<PerfumeProduct[]>(PERFUME_PRODUCTS);
  const [selectedProductForPDP, setSelectedProductForPDP] = useState<PerfumeProduct | null>(null);

  // Currency
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('maison_currency') as Currency) || 'USD';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('maison_currency', c);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maison_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Complimentary Samples (Max 2)
  const [selectedSamples, setSelectedSamples] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('maison_samples');
      return saved ? JSON.parse(saved) : ['smp-ambre', 'smp-vetiver'];
    } catch {
      return ['smp-ambre', 'smp-vetiver'];
    }
  });

  // Discount
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountRule | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('maison_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('maison_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // default initial order for demo
    }
    return [
      {
        id: 'ord-demo-1',
        orderNumber: 'MSN-78419',
        createdAt: '2026-09-18T14:32:00Z',
        customerEmail: 'ranazeshaan786456@gmail.com',
        customerName: 'Zeeshaan Rana',
        items: [
          {
            productId: 'ambre-nuit',
            productName: 'Ambre Nuit',
            variantSize: '50ml',
            concentration: 'Eau de Parfum',
            price: 240,
            quantity: 1,
            engraving: 'ZEESHAAN',
            giftWrap: true,
          }
        ],
        samples: ['Ambre Nuit (2ml)', 'Vétiver Fumé (2ml)'],
        subtotal: 240,
        discountAmount: 36,
        discountCode: 'MAISON15',
        shippingMethod: 'Atelier Standard Courier',
        shippingAmount: 0,
        taxAmount: 16.32,
        total: 220.32,
        currency: 'USD',
        status: 'macerating',
        shippingAddress: {
          street: '742 Evergreen Terrace',
          city: 'Paris',
          state: 'Île-de-France',
          postalCode: '75001',
          country: 'France',
        }
      }
    ];
  });

  // GDPR Requests
  const [dataRequests, setDataRequests] = useState<DataRequestRecord[]>(() => {
    try {
      const saved = localStorage.getItem('maison_data_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('maison_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('maison_samples', JSON.stringify(selectedSamples));
  }, [selectedSamples]);

  useEffect(() => {
    localStorage.setItem('maison_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('maison_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('maison_data_requests', JSON.stringify(dataRequests));
  }, [dataRequests]);

  const openPDP = (product: PerfumeProduct) => {
    setSelectedProductForPDP(product);
  };

  const closePDP = () => {
    setSelectedProductForPDP(null);
  };

  const formatPrice = (amount: number, customCurrency?: Currency): string => {
    const curr = customCurrency || currency;
    const symbol = CURRENCY_SYMBOLS[curr];
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const addToCart = (
    product: PerfumeProduct,
    variant: ProductVariant,
    engraving = '',
    giftWrap = false,
    quantity = 1
  ) => {
    setCart((prev) => {
      const itemId = `${variant.sku}-${engraving}-${giftWrap}`;
      const existing = prev.find((i) => i.id === itemId);
      const price = variant.price[currency];

      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        sku: variant.sku,
        productName: product.name,
        variantSize: variant.size,
        concentration: variant.concentration,
        price,
        currency,
        quantity,
        image: product.image,
        engraving: engraving.trim() || undefined,
        giftWrap,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleSample = (sampleId: string) => {
    setSelectedSamples((prev) => {
      if (prev.includes(sampleId)) {
        return prev.filter((id) => id !== sampleId);
      }
      if (prev.length >= 2) {
        // Replace oldest
        return [prev[1], sampleId];
      }
      return [...prev, sampleId];
    });
  };

  const applyDiscount = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = DISCOUNT_CODES.find((d) => d.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid or expired atelier privilege code.' };
    }
    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Privilege requires a minimum spend of ${formatPrice(found.minSpend)}.`
      };
    }
    setDiscountCode(clean);
    setAppliedDiscount(found);
    return { success: true, message: `Applied: ${found.description}` };
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
  };

  const discountSavings = appliedDiscount
    ? appliedDiscount.type === 'percentage'
      ? Math.round(cartSubtotal * (appliedDiscount.value / 100))
      : appliedDiscount.value
    : 0;

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Initial order hydration from backend API
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orders?.length) {
          setOrders((prev) => {
            const ids = new Set(prev.map((o) => o.id));
            const fresh = data.orders.filter((o: Order) => !ids.has(o.id));
            return [...fresh, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `MSN-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to backend server: stores in MongoDB Atlas & dispatches email via Gmail SMTP
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.warn('Order sync note:', err));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const requestDataExport = (email: string) => {
    const newReq: DataRequestRecord = {
      id: `req-${Date.now()}`,
      email,
      type: 'export',
      requestedAt: new Date().toISOString(),
      status: 'completed',
    };
    setDataRequests((prev) => [newReq, ...prev]);

    // Generate downloadable JSON file
    const exportData = {
      service: 'MAISON Haute Parfumerie Atelier',
      userEmail: email,
      exportedAt: new Date().toISOString(),
      orders: orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase()),
      wishlist,
      dataRetentionPolicy: 'Compliant with GDPR Article 15 and CCPA Right of Access.',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MAISON_Data_Export_${email.replace(/[@.]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const requestDataDeletion = (email: string) => {
    const newReq: DataRequestRecord = {
      id: `req-${Date.now()}`,
      email,
      type: 'delete',
      requestedAt: new Date().toISOString(),
      status: 'completed',
    };
    setDataRequests((prev) => [newReq, ...prev]);

    // Anonymize user records per GDPR / legal compliance
    setOrders((prev) =>
      prev.map((o) =>
        o.customerEmail.toLowerCase() === email.toLowerCase()
          ? {
              ...o,
              customerEmail: 'deleted-user@anonymized.maison',
              customerName: 'Anonymized Patron',
              shippingAddress: {
                street: '[Redacted]',
                city: '[Redacted]',
                state: '[Redacted]',
                postalCode: '[Redacted]',
                country: o.shippingAddress.country,
              }
            }
          : o
      )
    );
    setWishlist([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        selectedProductForPDP,
        openPDP,
        closePDP,
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        selectedSamples,
        toggleSample,
        discountCode,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        discountSavings,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        dataRequests,
        requestDataExport,
        requestDataDeletion,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        isPrivacyOpen,
        setIsPrivacyOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
