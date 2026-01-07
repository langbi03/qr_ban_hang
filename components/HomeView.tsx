
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, ShieldCheck, Zap, Info } from 'lucide-react';
import { getProducts } from '../store';
import { AppRoute } from '../types';

const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const products = getProducts().slice(0, 3);

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Xin chào!</h2>
        <p className="text-gray-500 text-lg leading-relaxed">Quét bất kỳ sản phẩm nào trong siêu thị để xem chi tiết ngay lập tức.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50 p-4 rounded-2xl flex flex-col gap-2">
          <Zap className="text-blue-600 w-6 h-6" />
          <h3 className="font-bold text-blue-900">Quét Nhanh</h3>
          <p className="text-xs text-blue-700 leading-tight">Nhận diện mã vạch & mặt hàng tức thì bằng AI.</p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl flex flex-col gap-2">
          <ShieldCheck className="text-green-600 w-6 h-6" />
          <h3 className="font-bold text-green-900">Xác thực</h3>
          <p className="text-xs text-green-700 leading-tight">Thông tin trực tiếp từ cơ sở dữ liệu kho hàng.</p>
        </div>
      </div>

      <button 
        onClick={() => navigate(AppRoute.SCAN)}
        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-green-700 active:scale-[0.98] transition-all mb-10"
      >
        <Scan className="w-6 h-6" />
        BẮT ĐẦU QUÉT
      </button>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-gray-800">Sản phẩm nổi bật</h3>
          <span className="text-green-600 text-sm font-semibold">Xem tất cả</span>
        </div>
        <div className="space-y-4">
          {products.map(product => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:border-green-200 transition-all cursor-pointer shadow-sm group"
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" 
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <p className="text-green-600 font-bold">{product.price.toLocaleString('vi-VN')} ₫</p>
              </div>
              <Info className="w-5 h-5 text-gray-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
