
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, X, Check, Package, Barcode, DollarSign, Filter, Layers, Inbox, QrCode, Monitor, Copy, Terminal, Download, Key, Shield } from 'lucide-react';
import { getProducts, saveProducts } from '../store';
import { Product } from '../types';
import { QRCodeSVG } from 'qrcode.react';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'export' | 'settings'>('inventory');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('smart_pocket_api_key') || '');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)
  );

  const saveApiKey = () => {
    localStorage.setItem('smart_pocket_api_key', apiKey);
    alert('Đã lưu cấu hình API Key thành công!');
  };

  const copyBuildCommand = () => {
    const cmd = "npm install && npm run dist";
    navigator.clipboard.writeText(cmd);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Quản trị hệ thống</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}
          >
            Kho hàng
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}
          >
            Cài đặt AI
          </button>
          <button 
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${activeTab === 'export' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}
          >
            Xuất file EXE
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="animate-in fade-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Tìm sản phẩm..." 
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.value)}
              />
            </div>
            <button className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg"><Plus /></button>
          </div>
          <div className="space-y-3">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm">
                <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{p.name}</h4>
                  <p className="text-indigo-600 font-black text-xs">{p.price.toLocaleString()} ₫</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-slate-300 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900">Cấu hình Gemini AI</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Dán Google Gemini API Key của bạn vào đây. Khóa này sẽ được lưu an toàn trên máy tính của bạn để bản EXE có thể hoạt động.
            </p>
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="Nhập API Key của bạn..." 
                className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button 
                onClick={saveApiKey}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                LƯU CẤU HÌNH
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <Monitor className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-6">Trình tạo File EXE tự động</h3>
            
            <div className="space-y-6 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-800">Mở thư mục code</h4>
                  <p className="text-xs text-slate-400 mt-1">Sử dụng VS Code hoặc File Explorer mở thư mục chứa toàn bộ file này.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shrink-0">2</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">Copy & Paste lệnh này</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-3">Mở Terminal (Ctrl + `) và dán dòng lệnh bên dưới:</p>
                  <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between group">
                    <code className="text-indigo-400 font-mono text-xs overflow-x-auto">npm install && npm run dist</code>
                    <button onClick={copyBuildCommand} className="text-slate-500 hover:text-white ml-2">
                      {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-2xl flex items-start gap-3 border border-indigo-100">
                <Download className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Hệ thống sẽ tự động tạo thư mục <span className="font-black">dist_exe</span>. File <span className="font-black italic">SmartPocketAI.exe</span> của bạn nằm ở trong đó!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
