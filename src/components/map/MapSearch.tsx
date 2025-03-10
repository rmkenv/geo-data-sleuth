
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Maximize2, Lasso } from 'lucide-react';
import { CENSUS_GEOCODER, ARCGIS_SERVICES } from './mapConstants';
import { toast } from '@/components/ui/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { queryFeaturesByPoint } from '@/lib/arcgisService';

interface MapSearchProps {
  onSearchResults: (results: any[]) => void;
  onToolChange?: (tool: string) => void;
  onGranularityChange?: (granularity: string) => void;
}

const MapSearch = ({ 
  onSearchResults,
  onToolChange,
  onGranularityChange 
}: MapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTool, setActiveTool] = useState('pan');
  const [granularity, setGranularity] = useState('tract');

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
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
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
      
      // Transform Census geocoder results
      const transformedResults = await Promise.all(
        data.result.addressMatches.map(async (match: any) => {
          const longitude = match.coordinates.x;
          const latitude = match.coordinates.y;
          
          // Query the ArcGIS service to get additional information about this location
          let blockInfo = [];
          try {
            blockInfo = await queryFeaturesByPoint(longitude, latitude, ARCGIS_SERVICES.censusBlocks);
            console.log('ArcGIS block info:', blockInfo);
          } catch (error) {
            console.error('Error querying ArcGIS blocks:', error);
          }
          
          return {
            id: match.geographies?.['2020 Census Blocks']?.[0]?.GEOID || String(Math.random()),
            place_name: match.matchedAddress,
            text: `${match.addressComponents.city || ''}, ${match.addressComponents.state || ''}`,
            center: [match.coordinates.x, match.coordinates.y], // [longitude, latitude]
            match_type: match.tigerLine?.side || 'exact',
            blockInfo: blockInfo.length > 0 ? blockInfo[0] : null
          };
        })
      );
      
      console.log('Transformed results with ArcGIS data:', transformedResults);
      onSearchResults(transformedResults);
      
      // If we have block info, show it in a toast
      if (transformedResults[0]?.blockInfo) {
        const block = transformedResults[0].blockInfo;
        toast({
          title: "Location information",
          description: `Census Block: ${block.attributes?.GEOID || 'Unknown'}`,
          variant: "default",
        });
      }
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

  // Local fallback geocoding function
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

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId);
    if (onToolChange) {
      onToolChange(toolId);
    }
  };

  const handleGranularityChange = (value: string) => {
    if (value) {
      setGranularity(value);
      if (onGranularityChange) {
        onGranularityChange(value);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
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
      
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Button
            variant={activeTool === 'pan' ? "default" : "outline"}
            size="sm"
            onClick={() => handleToolChange('pan')}
            className="px-2 py-1 h-8"
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Pan</span>
          </Button>
          <Button
            variant={activeTool === 'lasso' ? "default" : "outline"}
            size="sm"
            onClick={() => handleToolChange('lasso')}
            className="px-2 py-1 h-8"
          >
            <Lasso className="h-4 w-4 mr-1" />
            <span className="text-xs">Lasso</span>
          </Button>
        </div>
        
        <ToggleGroup 
          type="single" 
          value={granularity}
          onValueChange={handleGranularityChange}
          className="gap-1"
        >
          <ToggleGroupItem value="zip" size="sm" className="text-xs px-2 py-1 h-8">
            ZIP Code
          </ToggleGroupItem>
          <ToggleGroupItem value="tract" size="sm" className="text-xs px-2 py-1 h-8">
            Census Tract
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default MapSearch;
