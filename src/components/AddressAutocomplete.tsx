'use client';

import { useState, useEffect, useRef } from 'react';

interface Area {
  id: string;
  name: string;
  postal_code: number;
  administrative_division_level_1_name: string;
  administrative_division_level_2_name: string;
  administrative_division_level_3_name: string;
}

interface AddressAutocompleteProps {
  onSelect: (area: Area) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  onSelect,
  placeholder = 'Cari alamat (mis: Jakarta Selatan)',
  className = '',
}: AddressAutocompleteProps) {
  const [input, setInput] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (input.length < 3) {
      setAreas([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer (300ms delay)
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/shipping/maps?input=${encodeURIComponent(input)}&countries=ID&type=single`
        );
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          setAreas(data.data);
          setShowDropdown(true);
        } else {
          setAreas([]);
        }
      } catch (error) {
        console.error('Failed to fetch areas:', error);
        setAreas([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [input]);

  const handleSelect = (area: Area) => {
    setSelectedArea(area);
    setInput(area.name);
    setShowDropdown(false);
    onSelect(area);
  };

  const handleClear = () => {
    setInput('');
    setSelectedArea(null);
    setAreas([]);
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {input && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {selectedArea && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Alamat Terpilih:</p>
              <p className="text-sm text-green-700">{selectedArea.name}</p>
              <p className="text-xs text-green-600 mt-1">
                Kode Pos: {selectedArea.postal_code}
              </p>
            </div>
            <button
              onClick={handleClear}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Ubah
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Mencari alamat...</span>
            </div>
          ) : areas.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Tidak ada hasil. Coba kata kunci lain.
            </div>
          ) : (
            <ul>
              {areas.map((area) => (
                <li
                  key={area.id}
                  onClick={() => handleSelect(area)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900">{area.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {area.administrative_division_level_3_name},{' '}
                    {area.administrative_division_level_2_name},{' '}
                    {area.administrative_division_level_1_name} - {area.postal_code}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {input.length > 0 && input.length < 3 && (
        <p className="text-xs text-gray-500 mt-1">
          Ketik minimal 3 karakter untuk mencari
        </p>
      )}
    </div>
  );
}
