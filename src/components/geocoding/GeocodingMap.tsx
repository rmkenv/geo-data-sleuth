
import React, { useState } from 'react';
import SearchBoxGeocoder from './SearchBoxGeocoder';
import Map from '@/components/Map';
import { type GeocodeResult } from '@/services/geocodingService';
import { Card, CardContent } from '@/components/ui/card';

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
    
    // Send results to map search component via custom event
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
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <SearchBoxGeocoder onResults={handleGeocodeResults} />
      </div>
      
      <div className="w-full h-[600px]">
        <Card className="w-full h-full">
          <CardContent className="p-0 h-full">
            <Map
              title="Census Geography Explorer"
              selectedRegion={selectedRegion}
              geographyLevel={geographyLevel}
              onRegionSelect={handleRegionSelect}
              isLoading={false}
            />
          </CardContent>
        </Card>
      </div>
      
      {geocodeResults.length > 0 && (
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium mb-2">Found {geocodeResults.length} address matches</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {geocodeResults.map((result, index) => (
              <div key={index} className="text-sm p-2 border rounded hover:bg-accent/50 cursor-pointer" 
                   onClick={() => handleGeocodeResults([result])}>
                <div className="font-medium">{result.matchedAddress}</div>
                <div className="text-xs text-muted-foreground">
                  ({result.coordinates[1].toFixed(6)}, {result.coordinates[0].toFixed(6)})
                  {result.side && ` - ${result.side} side of street`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeocodingMap;
