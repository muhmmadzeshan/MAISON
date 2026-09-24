import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/common/Header';
import { HeroChapterScroll } from './components/home/HeroChapterScroll';
import { ProductGridSection } from './components/home/ProductGridSection';
import { AtelierStorySection } from './components/home/AtelierStorySection';
import { DiscoverySetSection } from './components/home/DiscoverySetSection';
import { Footer } from './components/common/Footer';
import { SearchOverlay } from './components/common/SearchOverlay';
import { ProductDetailModal } from './components/pdp/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AccountPrivacyModal } from './components/account/AccountPrivacyModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { CookieBanner } from './components/common/CookieBanner';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#0d0b09] text-[#f3ede4] selection:bg-[#c9a96e]/30 selection:text-[#f3ede4] relative flex flex-col font-sans">
        {/* Navigation Top Bar Contract Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* 5-Chapter 3D WebGL Flacon Hero */}
          <HeroChapterScroll />

          {/* Curated Product Catalogue */}
          <ProductGridSection />

          {/* Grasse Atelier Craft & Interactive Olfactory Pyramid */}
          <AtelierStorySection />

          {/* Discovery Coffret Feature Showcase */}
          <DiscoverySetSection />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Interactive Overlays & Modals */}
        <SearchOverlay />
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <AccountPrivacyModal />
        <AdminDashboardModal />
        <CookieBanner />
      </div>
    </StoreProvider>
  );
}
