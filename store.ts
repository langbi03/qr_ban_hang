
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
    id: '5',
    barcode: '8934588012121',
    name: 'Bia Tiger Lon 330ml',
    category: 'Đồ uống có cồn',
    price: 19500,
    description: 'Dòng bia Lager cao cấp được yêu thích toàn cầu với hương vị đậm đà, sảng khoái.',
    imageUrl: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/316845/bhx/httpscdnv2tgddvnbhx-staticbhxproductsimages2282316845bhxlon-330ml-1202412031318045954_202412040956494059.jpg',
    stock: 120,
    origin: 'Singapore / Việt Nam'
  },
  {
    id: '6',
    barcode: '8935270921651',
    name: 'Tăm bông Salina (SBD002)',
    category: 'Vệ sinh cá nhân',
    price: 36000,
    description: 'Tăm bông cao cấp Salina, sản phẩm của Công ty Cổ phần Đầu tư K&G Việt Nam. Đầu bông mềm mại, thấm hút tốt, an toàn cho sức khỏe.',
    imageUrl: 'data:image/jpeg;base64,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',
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
  
  // Kiểm tra xem sản phẩm mới đã có trong localStorage chưa, nếu chưa thì cập nhật
  const currentProducts: Product[] = JSON.parse(stored);
  const hasNewProduct = currentProducts.some(p => p.barcode === '8935270921651');
  
  if (!hasNewProduct) {
    const newProduct = INITIAL_PRODUCTS.find(p => p.barcode === '8935270921651');
    if (newProduct) {
      const updated = [...currentProducts, newProduct];
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
