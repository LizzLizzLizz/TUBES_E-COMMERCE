import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Akses Ditolak</h1>
          <p className="mt-4 text-gray-600">
            Anda harus menjadi admin untuk mengakses area ini.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 p-6">
        <div className="mb-8">
          <Link href="/" className="text-white text-xl font-bold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="PERON.ID" 
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Dasbor
          </Link>
          <Link
            href="/admin/products"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Produk
          </Link>
          <Link
            href="/admin/orders"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Pesanan
          </Link>
          <Link
            href="/admin/users"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Pengguna
          </Link>
          <div className="border-t border-gray-700 my-4"></div>
          <Link
            href="/"
            className="block rounded-lg px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            ← Kembali ke Situs
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}