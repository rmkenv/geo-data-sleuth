
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { CENSUS_GEOCODER } from './mapConstants';
import { toast } from '@/components/ui/use-toast';

interface MapSearchProps {
  onSearchResults: (results: any[]) => void;
}

const MapSearch = ({ onSearchResults }: MapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      console.log('Attempting to geocode address:', searchQuery);
      // Using the Census Geocoder API with the provided API key
      const encodedAddress = encodeURIComponent(searchQuery);
      
      // For better reliability, set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
      
      const response = await fetch(
        `${CENSUS_GEOCODER.onelineAddress}?address=${encodedAddress}&benchmark=${CENSUS_GEOCODER.benchmark}&vintage=${CENSUS_GEOCODER.vintage}&format=json&key=${CENSUS_GEOCODER.key}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Census Geocoder API returned status: ${response.status}`);
        throw new Error(`Search failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Geocoding response:', data);
      
      if (!data.result || !Array.isArray(data.result.addressMatches) || data.result.addressMatches.length === 0) {
        console.log('No matches found in Census Geocoder response');
        toast({
          title: "No results found",
          description: "Try a different address or format",
          variant: "destructive",
        });
        
        // Use fallback for no results
        throw new Error('No matches found');
      }
      
      // Transform Census geocoder results to match the expected format
      const transformedResults = data.result.addressMatches.map((match: any) => ({
        id: match.geographies?.['2020 Census Blocks']?.[0]?.GEOID || String(Math.random()),
        place_name: match.matchedAddress,
        text: `${match.addressComponents.city || ''}, ${match.addressComponents.state || ''}`,
        center: [match.coordinates.x, match.coordinates.y], // [longitude, latitude]
        match_type: match.tigerLine?.side || 'exact'
      }));
      
      console.log('Transformed results:', transformedResults);
      onSearchResults(transformedResults);
    } catch (error) {
      console.error('Error during location search:', error);
      
      // Use a local geocoding fallback
      console.log('Using local fallback geocoding for:', searchQuery);
      const localGeocodeResult = simulateGeocoding(searchQuery);
      
      toast({
        title: "Census Geocoder is unavailable",
        description: "Using local fallback geocoding",
        variant: "default", // Only "default" and "destructive" are allowed
      });
      
      onSearchResults([localGeocodeResult]);
    } finally {
      setIsSearching(false);
    }
  };

  // Local fallback geocoding function with expanded locations
  const simulateGeocoding = (address: string) => {
    const knownLocations: Record<string, [number, number]> = {
      // [longitude, latitude] format for consistency with API
      "washington dc": [-77.0369, 38.9072],
      "new york": [-74.0060, 40.7128],
      "los angeles": [-118.2437, 34.0522],
      "chicago": [-87.6298, 41.8781],
      "houston": [-95.3698, 29.7604],
      "baltimore": [-76.6122, 39.2904],
      "philadelphia": [-75.1652, 39.9526],
      "boston": [-71.0589, 42.3601],
      "dallas": [-96.7970, 32.7767],
      "san francisco": [-122.4194, 37.7749],
      "atlanta": [-84.3880, 33.7490],
      "miami": [-80.1918, 25.7617],
      "seattle": [-122.3321, 47.6062],
      "denver": [-104.9903, 39.7392],
      "phoenix": [-112.0740, 33.4484],
      "portland": [-122.6765, 45.5231],
      "pittsburgh": [-79.9959, 40.4406],
      "detroit": [-83.0458, 42.3314],
      "nashville": [-86.7816, 36.1627],
      "austin": [-97.7431, 30.2672],
      "maryland": [-76.6413, 39.0458],
      "virginia": [-78.6569, 37.4316],
      "california": [-119.4179, 36.7783],
      "florida": [-81.5158, 27.6648],
      "texas": [-99.9018, 31.9686],
      "new york state": [-75.4653, 42.6526],
    };
    
    // Try to match the entered address with known locations
    const lowerAddress = address.toLowerCase();
    let coordinates: [number, number] = [-98.5795, 39.8283]; // Default to US center
    let matchedPlace = '';
    
    for (const [location, coords] of Object.entries(knownLocations)) {
      if (lowerAddress.includes(location)) {
        coordinates = coords;
        matchedPlace = location.charAt(0).toUpperCase() + location.slice(1);
        break;
      }
    }
    
    // If no specific match, try to extract state or city names
    if (!matchedPlace) {
      const words = lowerAddress.split(/\s+/);
      for (const word of words) {
        for (const [location, coords] of Object.entries(knownLocations)) {
          if (location.includes(word) && word.length > 3) {
            coordinates = coords;
            matchedPlace = location.charAt(0).toUpperCase() + location.slice(1);
            break;
          }
        }
      }
    }
    
    // Create a fallback result
    return {
      id: 'local-' + Date.now(),
      place_name: matchedPlace ? `${matchedPlace} (approximate)` : `Approximate location for: ${address}`,
      text: 'Using local fallback geocoding',
      center: coordinates, // [longitude, latitude]
      match_type: 'approximate'
    };
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter an address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" size="sm" disabled={isSearching} className="px-2">
        {isSearching ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default MapSearch;
