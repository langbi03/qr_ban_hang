
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, X, Check, Package, Barcode, DollarSign, Filter, Layers, Inbox, QrCode } from 'lucide-react';
import { getProducts, saveProducts } from '../store';
import { Product } from '../types';
import { QRCodeSVG } from 'qrcode.react';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [viewingQR, setViewingQR] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return unique.sort();
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStock = stockFilter === 'all' 
      ? true 
      : stockFilter === 'in' 
        ? p.stock > 0 
        : p.stock <= 0;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      barcode: formData.get('barcode') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      stock: Number(formData.get('stock')),
      origin: formData.get('origin') as string,
      description: formData.get('description') as string,
      imageUrl: (formData.get('imageUrl') as string) || `https://picsum.photos/seed/${Date.now()}/400/300`
    };

    let updatedList;
    if (editingProduct) {
      updatedList = products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p);
    } else {
      const newProduct: Product = {
        ...productData as Product,
        id: Math.random().toString(36).substr(2, 9),
      };
      updatedList = [...products, newProduct];
    }

    setProducts(updatedList);
    saveProducts(updatedList);
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý kho</h2>
          <p className="text-xs text-gray-500">{filteredProducts.length} / {products.length} sản phẩm</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="bg-green-600 text-white p-2 rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc mã vạch..." 
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border-none rounded-lg text-xs font-semibold py-1.5 pl-2 pr-8 focus:ring-2 focus:ring-green-500 shadow-sm shrink-0"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-white border-none rounded-lg text-xs font-semibold py-1.5 pl-2 pr-8 focus:ring-2 focus:ring-green-500 shadow-sm shrink-0"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="in">Còn hàng (>0)</option>
            <option value="out">Hết hàng (0)</option>
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-green-100 transition-colors">
              <img src={product.imageUrl} className="w-16 h-16 object-cover rounded-xl shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 line-clamp-1 truncate">{product.name}</h3>
                <p className="text-[10px] text-gray-400 font-mono truncate">{product.barcode}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-green-600 font-bold text-sm">{product.price.toLocaleString()} ₫</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${product.stock > 0 ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
                    Tồn: {product.stock}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button 
                  onClick={() => setViewingQR(product)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Xem mã QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Không tìm thấy sản phẩm</p>
        </div>
      )}

      {viewingQR && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs rounded-[40px] p-8 flex flex-col items-center animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-zinc-400">Smart QR Card</h3>
              <button onClick={() => setViewingQR(null)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-zinc-50 p-6 rounded-[32px] mb-6 shadow-inner border border-zinc-100">
              <QRCodeSVG 
                value={viewingQR.barcode} 
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="text-center mb-6">
              <h4 className="font-extrabold text-zinc-900 mb-1">{viewingQR.name}</h4>
              <p className="text-xs font-mono text-zinc-400">{viewingQR.barcode}</p>
            </div>

            <button 
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
              onClick={() => setViewingQR(null)}
            >
              <Check className="w-5 h-5" />
              XÁC NHẬN
            </button>
          </div>
        </div>
      )}

      {(isAddingNew || editingProduct) && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[32px] p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button onClick={() => { setIsAddingNew(false); setEditingProduct(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tên sản phẩm</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input required name="name" defaultValue={editingProduct?.name} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mã vạch</label>
                  <div className="relative">
                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input required name="barcode" defaultValue={editingProduct?.barcode} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Giá (₫)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input required type="number" name="price" defaultValue={editingProduct?.price} className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tồn kho</label>
                  <input required type="number" name="stock" defaultValue={editingProduct?.stock} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Xuất xứ</label>
                  <input required name="origin" defaultValue={editingProduct?.origin} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Danh mục</label>
                <input required name="category" list="category-list" defaultValue={editingProduct?.category} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
                <datalist id="category-list">
                  {categories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mô tả</label>
                <textarea name="description" rows={3} defaultValue={editingProduct?.description} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-green-700 active:scale-[0.98] transition-all">
                  <Check className="w-6 h-6" />
                  LƯU SẢN PHẨM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
