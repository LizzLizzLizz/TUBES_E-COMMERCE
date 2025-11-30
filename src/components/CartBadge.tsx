'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function CartBadge() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="text-gray-500 hover:text-gray-900 relative">
      <ShoppingCartIcon className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
