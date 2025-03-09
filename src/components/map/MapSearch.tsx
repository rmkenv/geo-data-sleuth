
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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
      // Using the Census Geocoder API (no API key required)
      const encodedAddress = encodeURIComponent(searchQuery);
      const response = await fetch(
        `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodedAddress}&benchmark=2020&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      // Transform Census geocoder results to match the expected format
      const transformedResults = data.result?.addressMatches?.map((match: any) => ({
        id: match.geographies?.['2020 Census Blocks']?.[0]?.GEOID || String(Math.random()),
        place_name: match.matchedAddress,
        text: `${match.addressComponents.city || ''}, ${match.addressComponents.state || ''}`,
        center: [match.coordinates.x, match.coordinates.y], // [longitude, latitude]
        match_type: match.tigerLine?.side || 'exact'
      })) || [];
      
      onSearchResults(transformedResults);
    } catch (error) {
      console.error('Error during location search:', error);
      // Fallback: Create a mock result for demonstration
      const fallbackResult = [{
        id: 'fallback',
        place_name: `Results for: ${searchQuery}`,
        text: 'Location not found or service unavailable',
        center: [-98.5795, 39.8283], // US center [lng, lat]
      }];
      onSearchResults(fallbackResult);
    } finally {
      setIsSearching(false);
    }
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
