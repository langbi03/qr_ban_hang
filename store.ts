
import { Product } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    barcode: '8934567890123',
    name: 'Mì Hảo Hảo Tôm Chua Cay',
    category: 'Thực phẩm ăn liền',
    price: 4500,
    description: 'Hương vị tôm chua cay truyền thống, sợi mì dai ngon, đậm đà bản sắc Việt. Sản phẩm được yêu thích nhất của Acecook.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',
    stock: 1500,
    origin: 'Việt Nam'
  },
  {
    id: '2',
    barcode: '8930001234567',
    name: 'Sữa Tươi TH True Milk Ít Đường (Hộp 1L)',
    category: 'Sữa & Sản phẩm từ sữa',
    price: 38500,
    description: 'Sữa tươi sạch nguyên chất từ trang trại TH, giàu dinh dưỡng, canxi và vitamin, tốt cho sức khỏe cả gia đình.',
    imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=400',
    stock: 85,
    origin: 'Việt Nam'
  },
  {
    id: '3',
    barcode: '049000000443',
    name: 'Coca-Cola Lon 330ml',
    category: 'Đồ uống',
    price: 11000,
    description: 'Nước giải khát có gas vị cola đặc trưng, mang lại cảm giác sảng khoái tức thì.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
    stock: 450,
    origin: 'Quốc tế'
  },
  {
    id: '4',
    barcode: '8934563128076',
    name: 'Nước Khoáng La Vie 500ml',
    category: 'Đồ uống',
    price: 5500,
    description: 'Nước khoáng thiên nhiên đóng chai tại nguồn, bổ sung các khoáng chất thiết yếu cho cơ thể.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPaoQ8KFpvw8ILzhrHTs3J6gbNbvcZHYGMLg&s',
    stock: 200,
    origin: 'Việt Nam'
  },
  {
    id: 'sbd002',
    barcode: '8935270921651',
    name: 'Tăm bông Salina kháng khuẩn (SBD002)',
    category: 'Vệ sinh cá nhân',
    price: 36000,
    description: 'Tăm bông cao cấp Salina từ Công ty Cổ phần Đầu tư K&G Việt Nam. Đầu bông mềm mại, kháng khuẩn, an toàn cho da nhạy cảm. Sản xuất tại Việt Nam.',
    imageUrl: 'https://images.unsplash.com/photo-1626285492712-49606d04d80d?auto=format&fit=crop&q=80&w=400',
    stock: 500,
    origin: 'Việt Nam'
  }
];

const STORAGE_KEY = 'super_scanner_products';

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  
  const currentProducts: Product[] = JSON.parse(stored);
  // Luôn đảm bảo sản phẩm Salina thực tế có trong kho dữ liệu
  const hasSalina = currentProducts.some(p => p.barcode === '8935270921651');
  
  if (!hasSalina) {
    const salina = INITIAL_PRODUCTS.find(p => p.barcode === '8935270921651');
    if (salina) {
      const updated = [...currentProducts, salina];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
  }
  
  return currentProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const findProductByBarcode = (barcode: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.barcode === barcode);
};

export const findProductByName = (name: string): Product | undefined => {
  const products = getProducts();
  const normalizedSearch = name.toLowerCase();
  return products.find(p => p.name.toLowerCase().includes(normalizedSearch));
};
