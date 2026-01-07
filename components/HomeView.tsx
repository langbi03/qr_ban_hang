
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, ShieldCheck, Zap, Box, Plus } from 'lucide-react';
import { getProducts } from '../store';
import { AppRoute, Product } from '../types';

interface HomeViewProps {
  onAddToCart: (product: Product) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const products = getProducts().slice(0, 5);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 mt-4">
        <h2 className="text-4xl font-black text-slate-900 mb-2 leading-none">SmartPocket</h2>
        <p className="text-slate-500 font-medium">Trợ lý quản lý sản phẩm thông minh của bạn.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-5 rounded-[28px] flex flex-col gap-3 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Quét AI</h3>
            <p className="text-[11px] text-slate-400 leading-tight mt-1">Nhận diện mã vạch và vật phẩm tức thì.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[28px] flex flex-col gap-3 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Bảo mật</h3>
            <p className="text-[11px] text-slate-400 leading-tight mt-1">Thông tin minh bạch, chính xác 100%.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate(AppRoute.SCAN)}
        className="w-full bg-indigo-600 text-white py-5 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all mb-12"
      >
        <Scan className="w-6 h-6" />
        BẮT ĐẦU QUÉT
      </button>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-600" />
            Mới cập nhật
          </h3>
        </div>
        <div className="space-y-4">
          {products.map(product => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex items-center gap-4 bg-white p-4 rounded-[28px] border border-slate-50 hover:border-indigo-100 transition-all cursor-pointer shadow-sm group relative"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm line-clamp-1 pr-10">{product.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{product.category}</p>
                <p className="text-indigo-600 font-black text-lg mt-1">{product.price.toLocaleString('vi-VN')} ₫</p>
              </div>
              <button 
                onClick={(e) => handleQuickAdd(e, product)}
                className="absolute top-4 right-4 w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
