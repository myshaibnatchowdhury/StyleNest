import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroCarousel } from './components/customer/HeroCarousel';
import { ServiceHighlights } from './components/customer/ServiceHighlights';
import { CategorySection } from './components/customer/CategorySection';
import { LatestCollection } from './components/customer/LatestCollection';
import { CartDrawer } from './components/customer/CartDrawer';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderSuccessPage } from './components/customer/OrderSuccessPage';
import { TrackOrderModal } from './components/customer/TrackOrderModal';
import { AuthModal } from './components/customer/AuthModal';
import { PolicyModal } from './components/customer/PolicyModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2 } from 'lucide-react';

const StyleNestApp: React.FC = () => {
  const { activeTab, toastMessage } = useStore();

  // Modals
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

  const handleOpenPolicy = (title: string, content: string) => {
    setPolicyModal({ isOpen: true, title, content });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5ED] text-[#292824]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#173B32] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce-subtle border border-[#2A5D4F]">
          <CheckCircle2 className="w-4 h-4 text-[#C9684B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Switcher */}
      {activeTab === 'admin' ? (
        <AdminDashboard />
      ) : (
        <>
          <Header
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
            onOpenHelp={() =>
              handleOpenPolicy(
                'Help & FAQs',
                'Welcome to StyleNest Customer Care!\n\n1. How do I place an order?\nSimply browse our latest collection, pick your preferred size and color, click Add to Cart, and proceed to checkout.\n\n2. What payment methods are supported?\nWe accept Cash on Delivery, manual bKash, Nagad, and Rocket.\n\n3. Can I track my order status?\nYes, click "Track Order" in the top bar and enter your Order Number and mobile number.\n\n4. How long does delivery take?\nInside Dhaka: 24 to 48 hours. Outside Dhaka: 3 to 5 business days.'
              )
            }
          />

          <main className="flex-1">
            {activeTab === 'store' && (
              <>
                <HeroCarousel />
                <ServiceHighlights />
                <CategorySection />
                <LatestCollection />
              </>
            )}

            {activeTab === 'checkout' && <CheckoutPage />}

            {activeTab === 'order-success' && (
              <OrderSuccessPage onOpenTrackOrder={() => setIsTrackOrderOpen(true)} />
            )}
          </main>

          <Footer
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
            onOpenPolicy={handleOpenPolicy}
          />

          {/* Customer Drawers and Modals */}
          <CartDrawer />
          <ProductDetailModal />
          <TrackOrderModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
          />
          <AuthModal />
          <PolicyModal
            isOpen={policyModal.isOpen}
            title={policyModal.title}
            content={policyModal.content}
            onClose={() => setPolicyModal({ ...policyModal, isOpen: false })}
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StyleNestApp />
    </StoreProvider>
  );
}
