'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const cartProduct = {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        images: product.images ? [product.images] : [],
        description: '',
        categoryId: '',
        category: { id: '', name: '', products: [], createdAt: new Date(), updatedAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quantity,
    };
    addItem(cartProduct.product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium text-gray-700">
          Jumlah:
        </label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))
            }
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
          product.stock === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : added
            ? 'bg-green-600 text-white'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {product.stock === 0 ? 'Stok Habis' : added ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
      </button>
    </div>
  );
}
