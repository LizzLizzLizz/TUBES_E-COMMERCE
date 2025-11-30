'use client';

import { useState } from 'react';

interface MapLocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  className?: string;
}

export default function MapLocationPicker({ onLocationSelect, className = '' }: MapLocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        
        // Optional: Reverse geocode to get address name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          onLocationSelect({
            latitude,
            longitude,
            address: data.display_name,
          });
        } catch (err) {
          // If reverse geocoding fails, still pass coordinates
          onLocationSelect({ latitude, longitude });
        }
        
        setLoading(false);
      },
      (error) => {
        setError('Unable to get your location. Please enable location permissions.');
        setLoading(false);
      }
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Mendapatkan Lokasi...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Gunakan Lokasi Saya
          </>
        )}
      </button>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {location && (
        <div className="text-sm bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="font-medium text-green-800">✓ Lokasi Terdeteksi</p>
          <p className="text-green-700 text-xs mt-1">
            Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Menggunakan lokasi GPS akan memberikan opsi kurir instant delivery (Gojek, Grab)
      </p>
    </div>
  );
}
