
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, Scan, LogIn, LayoutDashboard, Home, Package, ShoppingCart } from 'lucide-react';
import { AppRoute, Product, User, CartItem } from './types';
import Scanner from './components/Scanner';
import HomeView from './components/HomeView';
import AdminDashboard from './components/AdminDashboard';
import ProductDetails from './components/ProductDetails';
import LoginForm from './components/LoginForm';
import CartView from './components/CartView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smart_pocket_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('smart_pocket_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('smart_pocket_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('smart_pocket_user', JSON.stringify(user));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden font-sans">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-indigo-700 text-white p-4 flex items-center justify-between shadow-lg">
          <Link to={AppRoute.HOME} className="flex items-center gap-2">
            <Box className="w-6 h-6 fill-indigo-200 text-indigo-200" />
            <h1 className="font-black text-xl tracking-tighter uppercase italic">SmartPocket AI</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link to={AppRoute.CART} className="relative p-2 hover:bg-indigo-800 rounded-2xl transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            {currentUser?.role === 'admin' ? (
              <Link to={AppRoute.ADMIN_DASHBOARD} className="p-2 hover:bg-indigo-800 rounded-2xl transition-all">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            ) : (
              <Link to={AppRoute.ADMIN_LOGIN} className="p-2 hover:bg-indigo-800 rounded-2xl transition-all">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-24 overflow-y-auto">
          <Routes>
            <Route path={AppRoute.HOME} element={<HomeView onAddToCart={addToCart} />} />
            <Route path={AppRoute.SCAN} element={<Scanner onAddToCart={addToCart} />} />
            <Route path={AppRoute.CART} element={<CartView cart={cart} onUpdateQuantity={updateQuantity} onClearCart={clearCart} />} />
            <Route path={AppRoute.ADMIN_LOGIN} element={<LoginForm onLogin={handleLogin} />} />
            <Route 
              path={AppRoute.ADMIN_DASHBOARD} 
              element={currentUser?.role === 'admin' ? <AdminDashboard /> : <LoginForm onLogin={handleLogin} />} 
            />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={addToCart} />} />
          </Routes>
        </main>

        {/* Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-indigo-50 p-3 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[32px]">
          <Link to={AppRoute.HOME} className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Trang chủ</span>
          </Link>
          
          <Link to={AppRoute.SCAN} className="flex flex-col items-center justify-center -mt-10 bg-indigo-600 p-4 rounded-3xl text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 border-4 border-white">
            <Scan className="w-8 h-8" />
          </Link>

          <Link to={AppRoute.CART} className="relative flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Giỏ hàng</span>
          </Link>
        </nav>
      </div>
    </HashRouter>
  );
};

export default App;
