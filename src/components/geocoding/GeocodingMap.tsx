
import React, { useState } from 'react';
import AddressGeocoder from './AddressGeocoder';
import Map from '@/components/Map';
import { type GeocodeResult } from '@/services/geocodingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GeocodingMap = () => {
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [geographyLevel, setGeographyLevel] = useState<string>('state');
  
  const handleGeocodeResults = (results: GeocodeResult[]) => {
    setGeocodeResults(results);
    
    // Transform geocode results to the format expected by MapMarkers
    const transformedResults = results.map(result => ({
      id: result.tigerLineId || String(Math.random()),
      place_name: result.matchedAddress,
      text: `Match score: ${result.matchScore}`,
      center: result.coordinates,
      match_type: result.side || 'exact'
    }));
    
    // Send results to map search component via callback
    if (window && 'dispatchEvent' in window) {
      window.dispatchEvent(new CustomEvent('map-search-results', { 
        detail: transformedResults 
      }));
    }
  };
  
  const handleRegionSelect = (region: string, level: string) => {
    setSelectedRegion(region);
    setGeographyLevel(level);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <AddressGeocoder onResults={handleGeocodeResults} />
      </div>
      
      <div className="md:col-span-2 h-[600px]">
        <Card className="w-full h-full">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Census Geography Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-4rem)]">
            <Map
              title="Census Geography Explorer"
              selectedRegion={selectedRegion}
              geographyLevel={geographyLevel}
              onRegionSelect={handleRegionSelect}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeocodingMap;
