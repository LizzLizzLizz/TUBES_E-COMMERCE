'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProfileEditor from './ProfileEditor';
import { UserIcon, ShoppingBagIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from './ConfirmDialog';
import OrderExpiryTimer from './OrderExpiryTimer';

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  role: string;
};

type Order = {
  id: string;
  total: number;
  status: string;
  address: string;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string;
    };
  }[];
};

const statusColors: Record<string, string> = {
  UNPAID: 'bg-gray-100 text-gray-800',
  PAID: 'bg-green-100 text-green-800',
  PACKED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-teal-100 text-teal-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  UNPAID: 'Belum Bayar',
  PAID: 'Sudah Bayar',
  PACKED: 'Sedang Dikemas',
  SHIPPED: 'Dalam Pengiriman',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export default function AccountTabs({ user, orders }: { user: User; orders: Order[] }) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<{ show: boolean; orderId: string | null }>({ show: false, orderId: null });

  const handleCancelOrder = async (orderId: string) => {
    setConfirmCancel({ show: true, orderId });
  };

  const confirmCancelOrder = async () => {
    if (!confirmCancel.orderId) return;

    setCancellingOrder(true);
    try {
      const res = await fetch(`/api/orders/${confirmCancel.orderId}/cancel`, {
        method: 'PATCH',
      });

      const response = await res.json();
      if (response.status === 'success') {
        showToast('Pesanan berhasil dibatalkan', 'success');
        window.location.reload();
      } else {
        throw new Error(response.message || 'Gagal membatalkan pesanan');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Terjadi kesalahan', 'error');
    } finally {
      setCancellingOrder(false);
      setConfirmCancel({ show: false, orderId: null });
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil Saya', icon: UserIcon },
    { id: 'orders', name: 'Pesanan Saya', icon: ShoppingBagIcon },
    ...(user.role === 'ADMIN' ? [{ id: 'admin', name: 'Admin Panel', icon: Cog6ToothIcon }] : []),
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with user info */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Administrator
              </span>
            )}
          </div>
          <Link
            href="/signout"
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Keluar
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Informasi Profil</h2>
            <ProfileEditor user={user} />
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Riwayat Pesanan</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Anda belum memiliki pesanan</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-sm font-medium">{order.id.substring(0, 20)}...</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>

                    {/* Expiry Timer for UNPAID orders */}
                    <OrderExpiryTimer createdAt={order.createdAt} status={order.status} />

                    <div className="border-t pt-4 space-y-3">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.product.images || '/placeholder.png'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} × {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                              }).format(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500 pl-20">
                          +{order.items.length - 2} item lainnya
                        </p>
                      )}
                    </div>

                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Total Pembayaran</p>
                        <p className="text-lg font-bold">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(order.total)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                        >
                          Lihat Detail
                        </button>
                        {(order.status === 'UNPAID' || order.status === 'PAID') && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrder}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingOrder ? 'Membatalkan...' : 'Batalkan'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Panel Tab */}
        {activeTab === 'admin' && user.role === 'ADMIN' && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/dashboard"
                className="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Dashboard</h3>
                    <p className="text-sm text-gray-500 mt-1">Statistik & overview</p>
                  </div>
                  <svg className="h-8 w-8 text-gray-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/admin/products"
                className="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Produk</h3>
                    <p className="text-sm text-gray-500 mt-1">Kelola produk</p>
                  </div>
                  <svg className="h-8 w-8 text-gray-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/admin/orders"
                className="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Pesanan</h3>
                    <p className="text-sm text-gray-500 mt-1">Kelola pesanan & status</p>
                  </div>
                  <ShoppingBagIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Pengguna</h3>
                    <p className="text-sm text-gray-500 mt-1">Kelola pengguna</p>
                  </div>
                  <UserIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Detail Pesanan</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
                <p className="text-gray-700">{selectedOrder.address}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Item Pesanan</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                      <img
                        src={item.product.images || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(item.quantity * item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Total Pembayaran</p>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Cancel Order Dialog */}
      <ConfirmDialog
        isOpen={confirmCancel.show}
        title="Batalkan Pesanan"
        message="Apakah Anda yakin ingin membatalkan pesanan ini?"
        confirmText="Ya, Batalkan"
        cancelText="Tidak"
        variant="warning"
        onConfirm={confirmCancelOrder}
        onCancel={() => setConfirmCancel({ show: false, orderId: null })}
      />
    </div>
  );
}
