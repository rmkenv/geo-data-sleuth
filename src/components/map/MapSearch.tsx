
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
      // Using the Mapbox Geocoding API as an example
      // In a production app, you'd need to secure this with token restrictions or use a backend proxy
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2t4ZXhwbG9rMDJocDJvcW9wYXVxNWU0aSJ9.example-placeholder-token&country=us`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      onSearchResults(data.features || []);
    } catch (error) {
      console.error('Error during location search:', error);
      // Fallback: Create a mock result for demonstration
      const fallbackResult = [{
        id: 'fallback',
        place_name: `Results for: ${searchQuery}`,
        text: 'Actual search is disabled in demo mode',
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
        placeholder="Search for a location..."
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
