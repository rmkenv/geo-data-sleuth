
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
}

const SearchBar = ({ onSearchResults }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const results = await performSearch(searchQuery);
      onSearchResults(results);
    } catch (error) {
      console.error('Error during location search:', error);
      
      // Use a local geocoding fallback
      console.log('Using local fallback geocoding for:', searchQuery);
      const localGeocodeResult = simulateGeocoding(searchQuery);
      
      toast({
        title: "Census Geocoder is unavailable",
        description: "Using local fallback geocoding",
        variant: "default",
      });
      
      onSearchResults([localGeocodeResult]);
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

export default SearchBar;
