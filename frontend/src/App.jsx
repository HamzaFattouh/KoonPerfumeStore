import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import StarBackground from './components/common/StarBackground';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import QuickViewModal from './components/common/QuickViewModal';
import Toast from './components/common/Toast';

// Direct import for Home to ensure instant First Contentful Paint (FCP)
import Home from './pages/Home';

// Route Code-Splitting with React.lazy
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const PerfumeQuiz = lazy(() => import('./pages/PerfumeQuiz'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin Routes
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Elegant fallback during chunk transition
const RouteLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div
      className="w-8 h-8 rounded-full border-2 animate-spin"
      style={{ borderColor: 'var(--kawn-border)', borderTopColor: 'var(--kawn-gold)' }}
    />
  </div>
);

// Auto scroll to top on page change
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
};

// Main App Layout Shell
const AppLayout = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between transition-colors duration-500 ${
        isAdmin
          ? 'bg-[#111111] text-[#F5F0E8]'
          : `store-shell ${
              isDark
                ? 'bg-[#111111] text-[#F5F0E8] selection:bg-[#C5A36A]/30 selection:text-[#F5F0E8]'
                : 'bg-[#F3EBDD] text-[#29231D] selection:bg-[#A98750]/25 selection:text-[#29231D]'
            }`
      }`}
    >
      {/* Atmospheric 3D / Particle Environment (Adapts to Dark & Light Mode) */}
      {!isAdmin && <StarBackground />}

      {/* Navigation Bar (hidden in Admin) */}
      {!isAdmin && <Navbar />}

      {/* Main App Routes */}
      <main className="flex-1 relative z-10">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/quiz" element={<PerfumeQuiz />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Management Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Store Drawers & Modals (hidden in Admin) */}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <QuickViewModal />}
      <Toast />

      {/* Footer (hidden in Admin) */}
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout />
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
