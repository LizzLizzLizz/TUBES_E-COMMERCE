'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

type Variant = {
  id: string;
  name: string;
  stock: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string;
  variantType: string | null;
  variants: Variant[];
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAddToCart = () => {
    const cartProduct = {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: currentStock,
        images: product.images ? [product.images] : [],
        description: '',
        categoryId: '',
        category: { id: '', name: '', products: [], createdAt: new Date(), updatedAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
    };
    addItem(cartProduct.product, quantity, selectedVariant?.id, selectedVariant?.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      {product.variantType && product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            {product.variantType}:
          </label>
          <select
            value={selectedVariant?.id || ''}
            onChange={(e) => {
              const variant = product.variants.find(v => v.id === e.target.value);
              setSelectedVariant(variant || null);
              setQuantity(1); // Reset quantity when variant changes
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} {variant.stock > 0 ? `(${variant.stock} tersedia)` : '(Habis)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stock Display */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Stok:</span>
          <span
            className={
              currentStock > 10
                ? 'text-green-600 font-semibold'
                : currentStock > 0
                ? 'text-yellow-600 font-semibold'
                : 'text-red-600 font-semibold'
            }
          >
            {currentStock > 0 ? `${currentStock} unit` : 'Habis'}
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
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
            max={currentStock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), currentStock))
            }
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={currentStock === 0}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
          currentStock === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : added
            ? 'bg-green-600 text-white'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {currentStock === 0 ? 'Stok Habis' : added ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
      </button>
    </div>
  );
}
