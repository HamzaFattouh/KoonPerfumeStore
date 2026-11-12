import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load initial cart and wishlist from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('koon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('koon_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedSample, setSelectedSample] = useState('sample-1');
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('koon_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('koon_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3200);
  };

  const addToCart = (product, size = '100ml', quantity = 1) => {
    // Determine price based on chosen size
    const sizeObj = product.sizes?.find(s => s.size === size);
    const itemPrice = sizeObj ? sizeObj.price : product.price;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.size === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          nameEn: product.nameEn,
          image: product.images[0],
          price: itemPrice,
          originalPrice: product.originalPrice,
          size: size,
          concentration: product.concentration,
          quantity: quantity
        }];
      }
    });

    showToast(`تمت إضافة "${product.name} (${size})" إلى سلة المشتريات`, 'success');
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.size === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    const isExisted = wishlist.some(item => item.id === product.id);
    if (isExisted) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      showToast(`تمت إزالة "${product.name}" من قائمة الرغبات`, 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`تمت إضافة "${product.name}" إلى قائمة الرغبات ✨`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'KOON10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      showToast('تم تفعيل كود الخصم KOON10 بنجاح! خصم 10%', 'success');
      return { success: true, message: 'تم تطبيق الخصم 10%' };
    } else if (cleanCode === 'GALAXY15' || cleanCode === 'CELESTIAL') {
      setPromoCode(cleanCode);
      setDiscountPercent(15);
      showToast(`تم تفعيل كود الخصم ${cleanCode} بنجاح! خصم 15%`, 'success');
      return { success: true, message: 'تم تطبيق الخصم 15%' };
    } else if (cleanCode === 'VIP20') {
      setPromoCode(cleanCode);
      setDiscountPercent(20);
      showToast('تم تفعيل كود VIP20 الفاخر! خصم 20%', 'success');
      return { success: true, message: 'تم تطبيق الخصم 20%' };
    } else {
      showToast('كود الخصم غير صالح أو منتهي الصلاحية', 'error');
      return { success: false, message: 'كود غير صالح' };
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscountPercent(0);
    showToast('تمت إزالة كود الخصم', 'info');
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const freeShippingThreshold = 350;
  const shippingCost = subtotal === 0 ? 0 : (subtotal >= freeShippingThreshold ? 0 : 28);
  const giftWrapCost = giftWrapping ? 25 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + giftWrapCost);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      discountPercent,
      discountAmount,
      promoCode,
      applyPromo,
      removePromo,
      freeShippingThreshold,
      shippingCost,
      giftWrapping,
      setGiftWrapping,
      giftNote,
      setGiftNote,
      giftWrapCost,
      grandTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      selectedSample,
      setSelectedSample,
      isCartOpen,
      setIsCartOpen,
      quickViewProduct,
      setQuickViewProduct,
      toast,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

