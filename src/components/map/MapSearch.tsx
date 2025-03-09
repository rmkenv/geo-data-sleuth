
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
        throw new Error(`Search failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Geocoding response:', data);
      
      // Transform Census geocoder results to match the expected format
      const transformedResults = data.result?.addressMatches?.map((match: any) => ({
        id: match.geographies?.['2020 Census Blocks']?.[0]?.GEOID || String(Math.random()),
        place_name: match.matchedAddress,
        text: `${match.addressComponents.city || ''}, ${match.addressComponents.state || ''}`,
        center: [match.coordinates.x, match.coordinates.y], // [longitude, latitude]
        match_type: match.tigerLine?.side || 'exact'
      })) || [];
      
      if (transformedResults.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different address or format",
          variant: "destructive",
        });
      }
      
      onSearchResults(transformedResults);
    } catch (error) {
      console.error('Error during location search:', error);
      
      // Use a local geocoding fallback (simulated result)
      // In a real app, you might use a different geocoding service as fallback
      const localGeocodeResult = simulateGeocoding(searchQuery);
      
      toast({
        title: "Census Geocoder is unavailable",
        description: "Using local fallback geocoding",
        variant: "default", // Changed from "warning" to "default" as only "default" and "destructive" are allowed
      });
      
      onSearchResults([localGeocodeResult]);
    } finally {
      setIsSearching(false);
    }
  };

  // Local fallback geocoding simulation function
  const simulateGeocoding = (address: string) => {
    const knownLocations: Record<string, [number, number]> = {
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
    };
    
    // Try to match the entered address with known locations
    const lowerAddress = address.toLowerCase();
    let coordinates: [number, number] = [-98.5795, 39.8283]; // Default to US center
    
    for (const [location, coords] of Object.entries(knownLocations)) {
      if (lowerAddress.includes(location)) {
        coordinates = coords;
        break;
      }
    }
    
    // Create a fallback result
    return {
      id: 'local-' + Date.now(),
      place_name: `Approximate location for: ${address}`,
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
