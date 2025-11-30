'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage('Tautan reset kata sandi telah dikirim ke email Anda. Silakan periksa inbox Anda.');
        setEmail('');
      } else {
        setError(data.message || 'Gagal mengirim email reset');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full space-y-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-normal" style={{ fontFamily: 'Aerosol Soldier' }}>Lupa Kata Sandi</h1>
        <p className="mt-2 text-gray-600">
          Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk reset kata sandi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
            {message}
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="email@anda.com"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Ingat kata sandi Anda?{' '}
            <Link
              href="/login"
              className="font-medium text-black hover:text-gray-700"
            >
              Masuk
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-medium text-black hover:text-gray-700"
            >
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
