'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variantId?: string, variantName?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Get cart key based on user
  const getCartKey = (email: string | null | undefined) => {
    return email ? `cart_${email}` : 'cart_guest';
  };

  // Load cart from localStorage when user changes or mounts
  useEffect(() => {
    if (status === 'loading') return;

    const userEmail = session?.user?.email || null;
    const cartKey = getCartKey(userEmail);

    // If user changed, clear current cart and load new user's cart
    if (userEmail !== currentUserEmail) {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart:', error);
          setItems([]);
        }
      } else {
        setItems([]);
      }
      setCurrentUserEmail(userEmail);
    }
  }, [session?.user?.email, status, currentUserEmail]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (status === 'loading') return;
    
    const cartKey = getCartKey(session?.user?.email);
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, session?.user?.email, status]);

  const addItem = (product: Product, quantity: number, variantId?: string, variantName?: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.variantId === variantId
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, quantity, variantId, variantName }];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.product.id === productId && item.variantId === variantId)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    // Also clear from localStorage immediately
    const cartKey = getCartKey(session?.user?.email);
    localStorage.removeItem(cartKey);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}