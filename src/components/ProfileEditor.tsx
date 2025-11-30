'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MapAddressPicker from './MapAddressPicker';

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
}

export default function ProfileEditor({ user }: { user: User }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    latitude: null as number | null,
    longitude: null as number | null,
    city: '',
    province: '',
    postalCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const response = await res.json();
      
      if (response.status === 'success') {
        setMessage('Profil berhasil diperbarui!');
        setIsEditing(false);
        router.refresh();
      } else {
        throw new Error(response.message || 'Gagal menyimpan profil');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      latitude: null,
      longitude: null,
      city: '',
      province: '',
      postalCode: '',
    });
    setIsEditing(false);
    setShowMap(false);
    setMessage('');
  };

  if (!isEditing) {
    return (
      <div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Nama</label>
            <p className="text-lg">{user.name || 'Tidak ada nama'}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Telepon</label>
            <p className="text-lg">{user.phone || 'Belum diisi'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Alamat</label>
            <p className="text-lg">{user.address || 'Belum diisi'}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="text-lg capitalize">{user.role}</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Profil
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telepon
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="08123456789"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat
        </label>
        
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            {showMap ? '📝 Input Manual' : '🗺️ Pilih di Peta'}
          </button>
          {formData.latitude && formData.longitude && (
            <span className="px-3 py-2 bg-green-50 text-green-700 text-sm rounded-md">
              ✓ Koordinat tersimpan
            </span>
          )}
        </div>

        {showMap ? (
          <div className="border border-gray-300 rounded-md p-4">
            <MapAddressPicker
              onAddressSelect={(data) => {
                setFormData({
                  ...formData,
                  address: data.address,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  city: data.city || '',
                  province: data.province || '',
                  postalCode: data.postalCode || '',
                });
              }}
              initialLat={formData.latitude || undefined}
              initialLng={formData.longitude || undefined}
            />
          </div>
        ) : (
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Jl. Contoh No. 123, Jakarta"
            required
          />
        )}
      </div>

      {message && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {message}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
