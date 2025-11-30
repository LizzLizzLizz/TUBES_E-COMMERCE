'use client';

import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

export default function ConditionalSearchBar() {
  const pathname = usePathname();
  
  // Hide search bar on these pages
  const hideSearchBar = 
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/signout') ||
    pathname?.startsWith('/cart') ||
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/account') ||
    pathname?.startsWith('/admin');
  
  if (hideSearchBar) return null;
  
  return <SearchBar />;
}
