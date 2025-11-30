'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import Script from 'next/script';

type ShippingRate = {
  company: string;
  courier_name: string;
  courier_service_name: string;
  price: number;
  estimated_delivery_time: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  
  const [userData, setUserData] = useState<any>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [status, items, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const response = await res.json();
      if (response.status === 'success' && response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchShippingRates = async () => {
    // Validate user has coordinates saved
    if (!userData?.latitude || !userData?.longitude) {
      showToast('Mohon lengkapi alamat Anda dengan memilih lokasi di peta di halaman Profil', 'warning');
      router.push('/account');
      return;
    }

    setLoadingRates(true);
    setSelectedShipping(null);
    
    try {
      const cartItems = items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        variantName: item.variantName,
      }));

      const payload = {
        items: cartItems,
        destination_latitude: userData.latitude,
        destination_longitude: userData.longitude,
      };

      const res = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      if (response.status === 'success' && response.data?.pricing) {
        setShippingRates(response.data.pricing);
      } else {
        throw new Error(response.message || 'Failed to fetch shipping rates');
      }
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
      showToast('Gagal mengambil tarif pengiriman', 'error');
    } finally {
      setLoadingRates(false);
    }
  };



  const handlePayment = async () => {
    if (!selectedShipping) {
      showToast('Pilih metode pengiriman terlebih dahulu', 'warning');
      return;
    }

    if (!userData || !userData.phone || !userData.address) {
      showToast('Lengkapi data profil Anda terlebih dahulu (nomor telepon dan alamat)', 'warning');
      router.push('/account');
      return;
    }

    setIsProcessing(true);
    try {
      const cartItems = items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        variantId: item.variantId,
        variantName: item.variantName,
      }));

      const totalAmount = total + selectedShipping.price;

      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shipping_cost: selectedShipping.price,
          shipping_courier: `${selectedShipping.company} - ${selectedShipping.courier_service_name}`,
          total_amount: totalAmount,
          customer_details: {
            name: userData.name || session?.user?.name,
            email: userData.email || session?.user?.email,
            phone: userData.phone,
            address: userData.address,
            postal_code: userData.postalCode || '',
          },
        }),
      });

      const response = await res.json();
      if (response.status === 'success' && response.data?.token) {
        // @ts-ignore - Snap is loaded from CDN
        window.snap.pay(response.data.token, {
          onSuccess: function() {
            clearCart();
            router.push('/payment-success?order_id=' + response.data.order_id);
          },
          onPending: function() {
            clearCart();
            router.push('/payment-success?order_id=' + response.data.order_id + '&status=pending');
          },
          onError: function() {
            showToast('Pembayaran gagal. Silakan coba lagi.', 'error');
            // Don't clear cart on error - allow user to retry or modify order
            setIsProcessing(false);
          },
          onClose: function() {
            // User closed payment popup without completing
            setIsProcessing(false);
          },
        });
      } else {
        throw new Error(response.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Gagal membuat pembayaran', 'error');
      setIsProcessing(false);
    }
  };

  if (status === 'loading' || !userData) {
    return (
      <div className="text-center py-16">
        <p className="text-lg">Memuat...</p>
      </div>
    );
  }

  const grandTotal = selectedShipping ? total + selectedShipping.price : total;

  return (
    <>
      <Script
        src={`https://app.${process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' ? '' : 'sandbox.'}midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      
      <div className="space-y-8">
        <h1 className="text-5xl sm:text-6xl font-normal text-gray-900" style={{ fontFamily: 'Aerosol Soldier' }}>Pembayaran</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Shipping & User Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Penerima</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium">{userData.name || session?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telepon:</span>
                  <span className="font-medium">{userData.phone || 'Belum diisi'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Alamat:</span>
                  <p className="font-medium mt-1">{userData.address || 'Belum diisi'}</p>
                </div>
              </div>
              {(!userData.phone || !userData.address) && (
                <a
                  href="/account"
                  className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                >
                  Lengkapi profil Anda →
                </a>
              )}
            </div>

            {/* Shipping Calculation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Pilih Pengiriman</h2>
              <div className="space-y-4">
                {/* Show saved address */}
                {userData?.address && userData?.latitude && userData?.longitude ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm font-medium text-green-800 mb-1">📍 Alamat Pengiriman:</p>
                    <p className="text-sm text-green-700">{userData.address}</p>
                    <p className="text-xs text-green-600 mt-2">
                      Koordinat: {userData.latitude.toFixed(6)}, {userData.longitude.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Alamat Belum Lengkap</p>
                    <p className="text-sm text-yellow-700 mb-3">
                      Mohon lengkapi alamat Anda dengan memilih lokasi di peta untuk menghitung ongkos kirim.
                    </p>
                    <a
                      href="/account"
                      className="inline-block px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
                    >
                      Lengkapi Alamat →
                    </a>
                  </div>
                )}

                {/* Check Shipping Button */}
                <button
                  onClick={fetchShippingRates}
                  disabled={loadingRates || !userData?.latitude || !userData?.longitude}
                  className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loadingRates ? (
                    <span className="flex items-center justify-center">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Mengecek Tarif...
                    </span>
                  ) : (
                    'Cek Ongkos Kirim'
                  )}
                </button>

                {/* Shipping Rates */}
                {shippingRates.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Pilih Kurir ({shippingRates.length} opsi tersedia)
                    </label>
                    {shippingRates.map((rate, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedShipping(rate)}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedShipping === rate
                            ? 'border-black bg-gray-50 ring-2 ring-black'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{rate.company.toUpperCase()}</p>
                            <p className="text-sm text-gray-600">{rate.courier_service_name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Estimasi: {rate.estimated_delivery_time}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            }).format(rate.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-medium">
                    {selectedShipping
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(selectedShipping.price)
                      : '-'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedShipping || isProcessing || !userData?.phone || !userData?.address}
                className="mt-6 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
              </button>

              {(!userData?.phone || !userData?.address) && (
                <p className="mt-2 text-xs text-red-600 text-center">
                  Lengkapi data profil terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}