
import React, { useState } from 'react';
import { geocodeAddress, type AddressComponents, type GeocodeResult } from '@/services/geocodingService';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AddressGeocoderProps {
  onResults?: (results: GeocodeResult[]) => void;
  initialAddress?: AddressComponents;
}

const AddressGeocoder = ({ onResults, initialAddress }: AddressGeocoderProps) => {
  const [address, setAddress] = useState<AddressComponents>(initialAddress || {
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.street || (!address.zip && !(address.city && address.state))) {
      setError('Please provide street and zip code OR street, city and state');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const geocodeResults = await geocodeAddress(address);
      setResults(geocodeResults);
      
      if (geocodeResults.length === 0) {
        setError('No matching addresses found');
      } else if (onResults) {
        onResults(geocodeResults);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Geocoding Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setAddress({
      street: '',
      city: '',
      state: '',
      zip: ''
    });
    setResults([]);
    setError(null);
  };
  
  const handleSelectResult = (result: GeocodeResult) => {
    if (onResults) {
      onResults([result]);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Address Geocoder</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                value={address.street}
                onChange={handleInputChange}
                placeholder="123 Main St"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  placeholder="Baltimore"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  placeholder="MD"
                  maxLength={2}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                name="zip"
                value={address.zip}
                onChange={handleInputChange}
                placeholder="21227"
                maxLength={10}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Geocoding...
                </>
              ) : (
                'Geocode Address'
              )}
            </Button>
            
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 border rounded-md border-destructive bg-destructive/10 text-destructive">
            {error}
          </div>
        )}
      </CardContent>
      
      {results.length > 0 && (
        <CardFooter className="flex-col">
          <div className="text-sm font-medium mb-2">Results ({results.length})</div>
          <div className="w-full space-y-2">
            {results.map((result, index) => (
              <div
                key={`result-${index}`}
                className="p-3 border rounded-md text-sm hover:bg-muted/50 cursor-pointer"
                onClick={() => handleSelectResult(result)}
              >
                <div className="font-medium">{result.matchedAddress}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Coordinates: {result.coordinates[1].toFixed(6)}, {result.coordinates[0].toFixed(6)}
                </div>
                {result.side && (
                  <div className="text-xs text-muted-foreground">
                    Match type: {result.side} side of street
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AddressGeocoder;
