import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getDiscountedPrice } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'fm_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      const updated = items.map(i =>
        i.product.id === product.id
          ? { ...i, quantity: Math.min(i.quantity + quantity, i.product.stock) }
          : i
      );
      saveItems(updated);
    } else {
      saveItems([...items, { product, quantity: Math.min(quantity, product.stock) }]);
    }
  };

  const removeFromCart = (productId: string) => {
    saveItems(items.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = items.map(i =>
      i.product.id === productId
        ? { ...i, quantity: Math.min(quantity, i.product.stock) }
        : i
    );
    saveItems(updated);
  };

  const clearCart = () => saveItems([]);

  const getItemCount = () => items.reduce((sum, i) => sum + i.quantity, 0);

  const getSubtotal = () =>
    items.reduce((sum, i) => {
      const price = getDiscountedPrice(i.product.price, i.product.discount);
      return sum + price * i.quantity;
    }, 0);

  const getTotal = () => getSubtotal(); // Free shipping

  const isInCart = (productId: string) => items.some(i => i.product.id === productId);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount, getSubtotal, getTotal, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
