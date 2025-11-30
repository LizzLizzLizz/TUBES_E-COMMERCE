'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full space-y-8 px-4 py-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <svg
            className="h-8 w-8 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Keluar dari Akun</h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          Apakah Anda yakin ingin keluar dari akun Anda?
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {isLoading ? 'Keluar...' : 'Ya, Keluar'}
        </Button>

        <Link href="/account" className="block">
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Button>
        </Link>
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              Setelah keluar, Anda perlu masuk kembali untuk mengakses akun Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
