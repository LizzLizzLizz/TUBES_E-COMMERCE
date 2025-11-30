'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full space-y-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-normal" style={{ fontFamily: 'Aerosol Soldier' }}>Buat Akun</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Daftar untuk memulai</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
            className="mt-1 w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-md border-gray-300"
          />
          <p className="mt-1 text-xs text-gray-500">
            Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter khusus (!@#$%^&*)
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Konfirmasi Kata Sandi
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="mt-1 w-full rounded-md border-gray-300"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Membuat Akun...' : 'Buat Akun'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}