'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Keranjang Kosong</h1>
        <p className="mt-4 text-sm sm:text-base text-gray-600">
          Belum ada produk di keranjang Anda. Yuk, mulai belanja!
        </p>
        <Link
          href="/products"
          className="mt-6 sm:mt-8 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-5xl sm:text-6xl font-normal text-gray-900" style={{ fontFamily: 'Aerosol Soldier' }}>Keranjang Belanja</h1>
        <button
          onClick={clearCart}
          className="text-xs sm:text-sm text-red-600 hover:text-red-800"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <div
              key={`${item.product.id}-${item.variantName || 'default'}-${index}`}
              className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg shadow-sm"
            >
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={item.product.images[0] || 'https://picsum.photos/seed/product/200/200'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-grow min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="text-sm sm:text-lg font-medium hover:text-gray-600 transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                {item.variantName && (
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Varian: {item.variantName}
                  </p>
                )}
                <p className="mt-1 text-sm sm:text-base text-gray-600">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(item.product.price)}
                </p>

                <div className="mt-3 flex items-center gap-3 sm:gap-4 flex-wrap">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.variantId)}
                      className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 sm:px-4 py-1 border-x border-gray-300 text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                      className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.variantId)}
                    className="flex items-center gap-1 text-xs sm:text-sm text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Hapus
                  </button>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm sm:text-lg">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-20">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Ringkasan Belanja</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(total)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(total)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full text-center px-4 sm:px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
            >
              Lanjut ke Pembayaran
            </Link>

            <Link
              href="/products"
              className="mt-3 block w-full text-center px-4 sm:px-6 py-3 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
