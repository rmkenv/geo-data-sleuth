
import { CENSUS_GEOCODER } from '@/components/map/mapConstants';

export interface AddressComponents {
  street: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface GeocodeResult {
  inputAddress: string;
  matchedAddress: string;
  coordinates: [number, number]; // [longitude, latitude]
  matchScore: number;
  tigerLineId?: string;
  side?: string;
  geographies?: Record<string, any>;
}

// Cache for geocoding results to minimize API calls
const geocodeCache: Record<string, GeocodeResult[]> = {};

/**
 * Geocodes an address using the Census Geocoding API
 */
export const geocodeAddress = async (address: AddressComponents): Promise<GeocodeResult[]> => {
  try {
    // Create a cache key from the address components
    const cacheKey = `${address.street}|${address.city || ''}|${address.state || ''}|${address.zip || ''}`.toLowerCase();
    
    // Check cache first
    if (geocodeCache[cacheKey]) {
      console.log('Using cached geocoding result');
      return geocodeCache[cacheKey];
    }
    
    // Determine which endpoint to use based on provided address components
    let endpoint;
    let queryParams = new URLSearchParams();
    
    // Add benchmark and format parameters (required)
    queryParams.append('benchmark', CENSUS_GEOCODER.benchmark);
    queryParams.append('vintage', CENSUS_GEOCODER.vintage);
    queryParams.append('format', 'json');
    
    if (address.zip) {
      // Use address endpoint with street + zip
      endpoint = CENSUS_GEOCODER.address;
      queryParams.append('street', address.street);
      queryParams.append('zip', address.zip);
    } else if (address.city && address.state) {
      // Use address endpoint with street + city + state
      endpoint = CENSUS_GEOCODER.address;
      queryParams.append('street', address.street);
      queryParams.append('city', address.city);
      queryParams.append('state', address.state);
    } else {
      // Use onelineAddress as fallback (less accurate but more flexible)
      endpoint = CENSUS_GEOCODER.onelineAddress;
      const onelineAddress = [
        address.street,
        address.city,
        address.state,
        address.zip
      ].filter(Boolean).join(' ');
      queryParams.append('address', onelineAddress);
    }
    
    // Add API key if available
    if (CENSUS_GEOCODER.key) {
      queryParams.append('key', CENSUS_GEOCODER.key);
    }
    
    const url = `${endpoint}?${queryParams.toString()}`;
    console.log('Geocoding request URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process and normalize the response
    let results: GeocodeResult[] = [];
    
    if (data.result?.addressMatches?.length > 0) {
      results = data.result.addressMatches.map((match: any) => ({
        inputAddress: data.result.input.address.address || '',
        matchedAddress: match.matchedAddress,
        coordinates: [match.coordinates.x, match.coordinates.y], // [longitude, latitude]
        matchScore: match.tigerLine?.side ? 100 : 90, // Estimate match quality
        tigerLineId: match.tigerLine?.tigerLineId,
        side: match.tigerLine?.side,
        geographies: match.geographies || {}
      }));
      
      // Cache the results
      geocodeCache[cacheKey] = results;
    }
    
    return results;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode address: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Batch geocode multiple addresses
 */
export const batchGeocodeAddresses = async (addresses: AddressComponents[]): Promise<GeocodeResult[][]> => {
  try {
    // Process addresses in parallel with a limit of 10 concurrent requests
    const batchSize = 10;
    const results: GeocodeResult[][] = [];
    
    for (let i = 0; i < addresses.length; i += batchSize) {
      const batch = addresses.slice(i, i + batchSize);
      const batchPromises = batch.map(address => geocodeAddress(address));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error('Batch geocoding error:', error);
    throw new Error(`Failed to batch geocode addresses: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
