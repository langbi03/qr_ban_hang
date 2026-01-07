
export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  origin: string;
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export enum AppRoute {
  HOME = '/',
  SCAN = '/scan',
  ADMIN_LOGIN = '/login',
  ADMIN_DASHBOARD = '/admin',
  PRODUCT_DETAILS = '/product/:id'
}

export interface ScanResult {
  barcode?: string;
  productName?: string;
  confidence: number;
}
