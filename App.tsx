
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Scan, LogIn, LayoutDashboard, Home, ChevronLeft, Package, Trash2, Edit, Plus, Search } from 'lucide-react';
import { AppRoute, Product, User } from './types';
import Scanner from './components/Scanner';
import HomeView from './components/HomeView';
import AdminDashboard from './components/AdminDashboard';
import ProductDetails from './components/ProductDetails';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('super_scanner_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('super_scanner_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('super_scanner_user');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-green-600 text-white p-4 flex items-center justify-between shadow-md">
          <Link to={AppRoute.HOME} className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            <h1 className="font-bold text-lg tracking-tight">SiêuQuét AI</h1>
          </Link>
          <div className="flex gap-4">
            {currentUser?.role === 'admin' ? (
              <Link to={AppRoute.ADMIN_DASHBOARD} className="p-1 hover:bg-green-700 rounded-full transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            ) : (
              <Link to={AppRoute.ADMIN_LOGIN} className="p-1 hover:bg-green-700 rounded-full transition-colors">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-24 overflow-y-auto">
          <Routes>
            <Route path={AppRoute.HOME} element={<HomeView />} />
            <Route path={AppRoute.SCAN} element={<Scanner />} />
            <Route path={AppRoute.ADMIN_LOGIN} element={<LoginForm onLogin={handleLogin} />} />
            <Route 
              path={AppRoute.ADMIN_DASHBOARD} 
              element={currentUser?.role === 'admin' ? <AdminDashboard /> : <LoginForm onLogin={handleLogin} />} 
            />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>

        {/* Bottom Tab Bar (Sticky) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-2 flex items-center justify-around z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <Link to={AppRoute.HOME} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-600 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Trang chủ</span>
          </Link>
          
          <Link to={AppRoute.SCAN} className="flex flex-col items-center justify-center -mt-8 bg-green-600 p-4 rounded-full text-white shadow-lg hover:bg-green-700 transition-all hover:scale-105 active:scale-95">
            <Scan className="w-8 h-8" />
          </Link>

          <Link to={currentUser?.role === 'admin' ? AppRoute.ADMIN_DASHBOARD : AppRoute.ADMIN_LOGIN} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-600 transition-colors">
            <Package className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Kho hàng</span>
          </Link>
        </nav>
      </div>
    </HashRouter>
  );
};

export default App;
