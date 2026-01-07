
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, ShieldCheck, MapPin, Package, Tag, Sparkles, QrCode, Download, Loader2 } from 'lucide-react';
import { getProducts } from '../store';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { QRCodeSVG } from 'qrcode.react';

const LoaderIcon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const p = getProducts().find(p => p.id === id);
    if (p) {
      setProduct(p);
    }
  }, [id]);

  const fetchAiInsight = async () => {
    if (!product) return;
    setIsLoadingAi(true);
    try {
      const desc = await generateProductDescription(product.name);
      setAiDescription(desc);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!product) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-green-600 font-bold">Quay về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 h-full bg-gray-50 pb-10">
      <div className="relative h-72">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm text-red-500">
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-[32px] -mt-8 relative z-10 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${product.stock > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-full border border-green-100"
          >
            <QrCode className="w-4 h-4" />
            {showQR ? 'Ẩn mã QR' : 'Hiện mã QR'}
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{product.name}</h2>
        <p className="text-2xl font-black text-green-600 mb-6">{product.price.toLocaleString('vi-VN')} ₫</p>

        {showQR && (
          <div className="mb-8 p-6 bg-zinc-900 rounded-[32px] flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-4 rounded-3xl shadow-2xl">
              <QRCodeSVG 
                value={product.barcode} 
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm mb-1">Mã QR Thông Minh</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{product.barcode}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <MapPin className="text-gray-400 w-5 h-5" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Xuất xứ</p>
              <p className="text-sm font-semibold text-gray-700">{product.origin}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Tag className="text-gray-400 w-5 h-5" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Mã vạch</p>
              <p className="text-sm font-semibold text-gray-700">{product.barcode}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-2">Mô tả sản phẩm</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {product.description}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-green-600 w-5 h-5" />
            <h4 className="font-bold text-green-800">Phân tích từ AI</h4>
          </div>
          
          {aiDescription ? (
            <p className="text-green-700 text-sm italic leading-relaxed">
              "{aiDescription}"
            </p>
          ) : (
            <button 
              onClick={fetchAiInsight}
              disabled={isLoadingAi}
              className="text-green-600 text-sm font-bold flex items-center gap-2 hover:underline disabled:opacity-50"
            >
              {isLoadingAi ? (
                <span className="flex items-center gap-2">
                  <LoaderIcon className="animate-spin" /> Đang suy nghĩ...
                </span>
              ) : 'Tạo tóm tắt bằng AI'}
            </button>
          )}
          
          <Sparkles className="absolute -bottom-2 -right-2 text-green-100 w-16 h-16 opacity-50" />
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 border-2 border-green-600 flex items-center justify-center p-3 rounded-2xl font-bold text-green-600 hover:bg-green-50 transition-colors cursor-pointer text-center">
            Tìm tương tự
          </button>
          <button className="flex-1 bg-green-600 flex items-center justify-center p-3 rounded-2xl font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all cursor-pointer text-center">
            Thêm vào DS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
