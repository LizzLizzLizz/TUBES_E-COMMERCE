'use client';

import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface MapAddressPickerProps {
  onAddressSelect: (data: {
    address: string;
    latitude: number;
    longitude: number;
    city?: string;
    province?: string;
    postalCode?: string;
  }) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapAddressPicker: React.FC<MapAddressPickerProps> = ({
  onAddressSelect,
  initialLat = -6.200000, // Default: Jakarta
  initialLng = 106.816666,
}) => {
  const [markerPosition, setMarkerPosition] = useState({
    lat: initialLat,
    lng: initialLng,
  });
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: initialLat,
    lng: initialLng,
  };

  // Reverse geocoding: Convert coordinates to address
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results[0]) {
        const result = data.results[0];
        const formattedAddress = result.formatted_address;
        
        // Extract address components
        const addressComponents = result.address_components;
        let city = '';
        let province = '';
        let postalCode = '';

        addressComponents.forEach((component: any) => {
          if (component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            province = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        setAddress(formattedAddress);
        
        // Call parent callback with complete data
        onAddressSelect({
          address: formattedAddress,
          latitude: lat,
          longitude: lng,
          city,
          province,
          postalCode,
        });
      } else {
        setError('Tidak dapat menemukan alamat untuk lokasi ini');
      }
    } catch (err) {
      setError('Gagal mengambil alamat. Silakan coba lagi.');
      console.error('Reverse geocoding error:', err);
    } finally {
      setLoading(false);
    }
  }, [onAddressSelect]);

  // Handle map click
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Handle marker drag
  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Get current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });
          
          // Pan map to current location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
          }
          
          reverseGeocode(lat, lng);
        },
        (error) => {
          setError('Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif.');
          setLoading(false);
        }
      );
    } else {
      setError('Browser Anda tidak mendukung geolocation');
      setLoading(false);
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Klik pada peta atau tarik marker untuk memilih lokasi
        </p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Loading...
            </>
          ) : (
            <>
              📍 Lokasi Saya
            </>
          )}
        </button>
      </div>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onClick={onMapClick}
          onLoad={onLoad}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        </GoogleMap>
      </LoadScript>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {address && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800 mb-1">📍 Alamat Terpilih:</p>
          <p className="text-sm text-green-700">{address}</p>
          <p className="text-xs text-green-600 mt-2">
            Koordinat: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        </div>
      )}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-700">
          💡 <strong>Tips:</strong> Zoom in untuk akurasi lebih tinggi. Alamat ini akan disimpan di profil Anda dan digunakan untuk menghitung ongkos kirim.
        </p>
      </div>
    </div>
  );
};

export default MapAddressPicker;
