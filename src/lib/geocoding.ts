const GOOGLE_MAPS_API_KEY = 'AIzaSyBPYhgri9fjdhxkh-1UVWfL26oLw4DvmZQ';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

/**
 * Convert an address string to coordinates using Google Maps Geocoding API
 * @param address - The address string to geocode
 * @returns Promise with latitude, longitude, and formatted address
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim() === '') {
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;

      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    console.error('Geocoding failed:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Convert coordinates to address (reverse geocoding)
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise with formatted address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    console.error('Reverse geocoding failed:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}
