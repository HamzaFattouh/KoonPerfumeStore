import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import StarBackground from './components/common/StarBackground';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import QuickViewModal from './components/common/QuickViewModal';
import Toast from './components/common/Toast';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import PerfumeQuiz from './pages/PerfumeQuiz';
import About from './pages/About';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';

// Auto scroll to top on page change
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="relative min-h-screen bg-[#07080b] text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
          {/* Subtle cosmic background particles */}
          <StarBackground />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main App Routes */}
          <main className="flex-1 relative z-10">
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
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Global Drawers & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <Toast />

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

