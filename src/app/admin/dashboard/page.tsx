import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

type OrderWithRelations = {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/login');
  }

  const [totalProducts, totalOrders, recentOrders, completedOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.order.findMany({
      where: {
        status: 'COMPLETED',
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dasbor Admin</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Produk</h3>
          <p className="mt-2 text-3xl font-bold">{totalProducts}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Pesanan</h3>
          <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Pendapatan (Pesanan Selesai)</h3>
          <p className="mt-2 text-3xl font-bold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(
              completedOrders.reduce((acc, order) => acc + order.total, 0)
            )}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Pesanan Terbaru</h2>
        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  ID Pesanan
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order: OrderWithRelations) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {order.user.name || order.user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        order.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(order.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}