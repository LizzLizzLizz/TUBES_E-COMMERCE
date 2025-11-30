export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  status: 'UNPAID' | 'PAID' | 'PACKED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  total: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}