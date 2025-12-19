'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const registered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Email atau password salah. Pastikan Anda sudah terdaftar.');
        } else {
          setError(result.error);
        }
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full space-y-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-normal" style={{ fontFamily: 'Aerosol Soldier' }}>Selamat Datang</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Masuk ke akun Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {registered && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
            Akun berhasil dibuat! Silakan login dengan email dan password Anda.
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            className="mt-1 w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Kata Sandi
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="mt-1 w-full rounded-md border-gray-300"
          />
          <div className="mt-1 text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Lupa kata sandi?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Masuk'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md space-y-8 px-4">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}