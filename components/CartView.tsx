
import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onClearCart }) => {
  const navigate = useNavigate();
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy quét mã sản phẩm ngay!</p>
        <button 
          onClick={() => navigate('/scan')}
          className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all"
        >
          ĐI QUÉT MÃ
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900">Giỏ hàng của bạn</h2>
        <button 
          onClick={onClearCart}
          className="text-red-500 text-sm font-bold flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Xóa hết
        </button>
      </div>

      <div className="space-y-4 mb-32">
        {cart.map(item => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-4 flex gap-4 shadow-sm relative overflow-hidden">
            <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 line-clamp-1 pr-6">{item.name}</h3>
              <p className="text-green-600 font-black mb-3">{item.price.toLocaleString()} ₫</p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 active:scale-90 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 text-xs font-bold text-gray-300">
              x{item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-6 pointer-events-none">
        <div className="bg-zinc-900 text-white p-6 rounded-[32px] shadow-2xl pointer-events-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium">Tổng cộng ({cart.length} món)</span>
            <span className="text-2xl font-black text-green-400">{totalPrice.toLocaleString()} ₫</span>
          </div>
          <button className="w-full bg-green-500 text-zinc-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-400 active:scale-95 transition-all">
            <CreditCard className="w-5 h-5" />
            THANH TOÁN NGAY
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
