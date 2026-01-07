
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, X, Loader2, Zap, ZapOff, 
  FlipHorizontal, History, CheckCircle2, 
  AlertCircle, ChevronRight, ScanLine, Maximize
} from 'lucide-react';
import { analyzeProductImage, ScanAIResult } from '../services/geminiService';
import { findProductByBarcode, findProductByName } from '../store';
import { Product } from '../types';

const Scanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [status, setStatus] = useState<'idle' | 'searching' | 'success' | 'not_found'>('idle');
  const [lastMatch, setLastMatch] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Product[]>([]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const initCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setError(null);
    } catch (err) {
      if (facingMode === 'environment') setFacingMode('user');
      else setError("Không thể truy cập camera. Vui lòng cấp quyền.");
    }
  };

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setStatus('searching');

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Tối ưu khung hình quét (Center Crop)
    const size = Math.min(video.videoWidth, video.videoHeight, 800);
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      
      if (facingMode === 'user') {
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      try {
        const result: ScanAIResult = await analyzeProductImage(base64);
        let product = null;

        if (result.barcode) product = findProductByBarcode(result.barcode);
        if (!product && result.productName) product = findProductByName(result.productName);

        if (product) {
          setLastMatch(product);
          setStatus('success');
          setHistory(prev => [product!, ...prev.filter(p => p.id !== product!.id)].slice(0, 5));
          if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
          
          // Sau 3 giây thành công thì quay lại trạng thái idle để quét tiếp
          setTimeout(() => setStatus('idle'), 3000);
        } else {
          setStatus(result.type !== 'unknown' ? 'not_found' : 'idle');
        }
      } catch (e) {
        setStatus('idle');
      } finally {
        setIsScanning(false);
      }
    }
  }, [isScanning, facingMode]);

  useEffect(() => {
    initCamera();
    return stopCamera;
  }, [facingMode]);

  useEffect(() => {
    if (isAutoMode && status === 'idle' && !isScanning) {
      scanIntervalRef.current = setTimeout(processFrame, 2000);
    }
    return () => { if (scanIntervalRef.current) clearTimeout(scanIntervalRef.current); };
  }, [isAutoMode, status, isScanning, processFrame]);

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden">
      {/* Viewfinder Header */}
      <div className="absolute top-0 inset-x-0 z-30 p-6 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className={`px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 flex items-center gap-2 ${
            status === 'success' ? 'bg-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]' :
            status === 'searching' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' :
            'bg-white/10 border-white/20'
          }`}>
            {status === 'searching' ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {status === 'searching' ? 'Đang tìm...' : 
               status === 'success' ? 'Đã tìm thấy' : 
               status === 'not_found' ? 'Không có trong kho' : 'Sẵn sàng'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/')} 
          className="p-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md pointer-events-auto active:scale-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Camera Core */}
      <div className="relative flex-1 flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay playsInline muted 
          className={`w-full h-full object-cover transition-opacity duration-700 ${isScanning ? 'opacity-60' : 'opacity-100'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
        />
        
        {/* Overlay Scanner UI */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`relative w-72 h-72 transition-all duration-700 ${
            status === 'success' ? 'scale-110' : 'scale-100'
          }`}>
            {/* Corner Brackets */}
            <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-3xl transition-colors duration-500 ${status === 'success' ? 'border-green-400' : 'border-white/30'}`} />
            <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-3xl transition-colors duration-500 ${status === 'success' ? 'border-green-400' : 'border-white/30'}`} />
            <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-3xl transition-colors duration-500 ${status === 'success' ? 'border-green-400' : 'border-white/30'}`} />
            <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-3xl transition-colors duration-500 ${status === 'success' ? 'border-green-400' : 'border-white/30'}`} />

            {/* Scanning Animation */}
            <div className={`absolute inset-0 rounded-3xl overflow-hidden`}>
              <div className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,1)] animate-[scan_2.5s_infinite_ease-in-out] ${status === 'success' ? 'hidden' : 'block'}`} />
              <div className="absolute inset-0 bg-white/5 backdrop-invert-[0.05]" />
            </div>

            {/* Success Visual */}
            {status === 'success' && (
              <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="absolute bottom-32 left-6 right-6 bg-red-500/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-4">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Control & History Panel */}
      <div className="bg-zinc-950 p-6 pb-12 rounded-t-[40px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-40">
        {/* Match Preview Card */}
        {status === 'success' && lastMatch && (
          <div 
            onClick={() => navigate(`/product/${lastMatch.id}`)}
            className="mb-6 bg-white text-black p-4 rounded-3xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-500 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
          >
            <img src={lastMatch.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
            <div className="flex-1">
              <h4 className="font-black text-sm truncate">{lastMatch.name}</h4>
              <p className="text-green-600 font-black text-base">{lastMatch.price.toLocaleString()} ₫</p>
            </div>
            <div className="bg-zinc-100 p-2 rounded-xl">
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between max-w-sm mx-auto mb-8">
          <button 
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={`flex flex-col items-center gap-2 transition-all ${isAutoMode ? 'text-green-500' : 'text-zinc-600'}`}
          >
            <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${isAutoMode ? 'border-green-500/30 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-zinc-800 bg-zinc-900'}`}>
              {isAutoMode ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Tự động</span>
          </button>

          <button 
            onClick={processFrame}
            disabled={isScanning || status === 'success'}
            className={`group relative w-20 h-20 flex items-center justify-center transition-all ${isScanning ? 'scale-90 opacity-50' : 'active:scale-90'}`}
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40" />
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              {isScanning ? <Loader2 className="w-8 h-8 text-black animate-spin" /> : <ScanLine className="w-8 h-8 text-black" />}
            </div>
          </button>

          <button 
            onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
            className="flex flex-col items-center gap-2 text-zinc-600 hover:text-white transition-all"
          >
            <div className="p-4 rounded-2xl border-2 border-zinc-800 bg-zinc-900">
              <FlipHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Lật mặt</span>
          </button>
        </div>

        {/* History Strip */}
        {history.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Lịch sử vừa quét</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {history.map(p => (
                <div 
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    <img src={p.imageUrl} className="w-14 h-14 rounded-2xl object-cover border border-white/10" alt="" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <CheckCircle2 className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-zinc-400 max-w-[56px] truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(280px); opacity: 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Scanner;
