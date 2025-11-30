import type { Metadata } from "next";
import { Geist, Geist_Mono, Sedgwick_Ave_Display } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { UserIcon } from '@heroicons/react/24/outline';
import Providers from '@/components/Providers';
import CartBadge from '@/components/CartBadge';
import ConditionalSearchBar from '@/components/ConditionalSearchBar';
import OrderExpiryChecker from '@/components/OrderExpiryChecker';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sedgwickAve = Sedgwick_Ave_Display({
  weight: "400",
  variable: "--font-sedgwick-ave",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PERON.ID - Urban Street-Art Supplies",
  description: "Your one-stop shop for spray paints, graffiti markers, and street-art accessories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sedgwickAve.variable} antialiased min-h-screen bg-gray-100 flex flex-col`}>
        <Providers>
          <OrderExpiryChecker />
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-14 sm:h-16 items-center gap-4">
                <div className="flex-shrink-0">
                  <Link href="/" className="flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/logo.png" 
                      alt="PERON.ID" 
                      className="h-14 sm:h-16 w-auto"
                    />
                  </Link>
                </div>
                
                {/* Search Bar */}
                <ConditionalSearchBar />

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <CartBadge />
                  
                  {session ? (
                    <Link href="/account" className="text-gray-500 hover:text-gray-900" title="Akun Saya">
                      <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Link>
                  ) : (
                    <Link href="/login" className="text-sm sm:text-base text-gray-500 hover:text-gray-900">
                      Masuk
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1 w-full">
            {children}
          </main>

          <footer className="bg-white mt-auto">
            <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs sm:text-sm text-gray-500">
                © 2025 PERON.ID. All rights reserved.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
