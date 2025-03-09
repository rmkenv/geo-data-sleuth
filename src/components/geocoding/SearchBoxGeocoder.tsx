
import React, { useState } from 'react';
import { geocodeAddress, type GeocodeResult } from '@/services/geocodingService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SearchBoxGeocoderProps {
  onResults?: (results: GeocodeResult[]) => void;
}

const SearchBoxGeocoder = ({ onResults }: SearchBoxGeocoderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Parse the one-line address into components as best we can
      // Format expected: "123 Main St, City, State ZIP"
      const parts = searchQuery.split(',').map(part => part.trim());
      const addressComponents: any = { street: parts[0] || '' };
      
      if (parts.length > 1) {
        addressComponents.city = parts[1] || '';
      }
      
      if (parts.length > 2) {
        // Last part might contain state and ZIP
        const stateZip = parts[2].split(' ').filter(Boolean);
        if (stateZip.length >= 1) {
          addressComponents.state = stateZip[0];
        }
        if (stateZip.length >= 2) {
          addressComponents.zip = stateZip.slice(1).join(' ');
        }
      }
      
      const geocodeResults = await geocodeAddress(addressComponents);
      
      if (geocodeResults.length === 0) {
        toast({
          title: 'No matching addresses found',
          description: 'Try adjusting your search query',
          variant: 'destructive'
        });
      } else if (onResults) {
        onResults(geocodeResults);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({
        title: 'Geocoding Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="flex w-full gap-2">
      <Input
        type="text"
        placeholder="Search for an address (e.g. 123 Main St, Baltimore, MD 21227)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" size="icon" disabled={isLoading} className="px-2 shrink-0">
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default SearchBoxGeocoder;
