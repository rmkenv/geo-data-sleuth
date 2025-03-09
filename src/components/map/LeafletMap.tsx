
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapController from './MapController';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import MapSearch from './MapSearch';
import MapLayerSelector from './MapLayerSelector';
import MapMarkers from './MapMarkers';
import GeoJsonLayer from './GeoJsonLayer';
import { useMapData } from '@/hooks/useMapData';
import { GEOGRAPHY_LEVELS, TIGERWEB_SERVICES } from './mapConstants';

interface LeafletMapProps {
  data?: any[];
  variable?: string;
  format?: string;
  selectedRegion?: string;
  geographyLevel?: string;
  onRegionSelect?: (region: string, level: string) => void;
}

const LeafletMap = ({ 
  data, 
  variable, 
  format, 
  selectedRegion,
  geographyLevel = 'state',
  onRegionSelect
}: LeafletMapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLayerService, setSelectedLayerService] = useState(TIGERWEB_SERVICES.states);

  // Get the current geography level service
  useEffect(() => {
    const currentLevel = GEOGRAPHY_LEVELS.find(level => level.id === geographyLevel);
    if (currentLevel) {
      setSelectedLayerService(currentLevel.service);
    }
  }, [geographyLevel]);

  // Load map data from the custom hook
  const { usGeoJson, isMapLoaded } = useMapData(selectedRegion, geographyLevel, selectedLayerService);

  // Update map center and zoom based on selected region
  useEffect(() => {
    if (selectedRegion) {
      // Zoom level based on geography level
      if (geographyLevel === 'state') {
        setZoomLevel(6);
        // Example coordinates for a state (e.g., California)
        setMapCenter([36.7783, -119.4179]);
      } else if (geographyLevel === 'county') {
        setZoomLevel(8);
        // Example coordinates for a county
        setMapCenter([37.7749, -122.4194]);
      } else if (geographyLevel === 'tract' || geographyLevel === 'blockGroup') {
        setZoomLevel(10);
        // Example coordinates for a tract/block group
        setMapCenter([37.7749, -122.4194]);
      } else if (geographyLevel === 'block') {
        setZoomLevel(12);
        setMapCenter([37.7749, -122.4194]);
      }
    } else {
      // Reset to US view
      setMapCenter([39.8283, -98.5795]);
      setZoomLevel(4);
    }
  }, [selectedRegion, geographyLevel]);

  // Handle search results
  const handleSearch = (results: any[]) => {
    setSearchResults(results);
    if (results.length > 0) {
      // Center map on first result
      const [lng, lat] = results[0].center;
      setMapCenter([lat, lng]);
      setZoomLevel(12);
    }
  };

  // Handle layer selection
  const handleLayerChange = (serviceUrl: string, level: string) => {
    setSelectedLayerService(serviceUrl);
    if (onRegionSelect) {
      // Reset the region selection when changing layers
      onRegionSelect('', level);
    }
  };

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        {...{
          center: mapCenter,
          zoom: zoomLevel
        } as any}
        style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <MapController center={mapCenter} zoom={zoomLevel} />
        
        <TileLayer
          {...{
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          } as any}
        />
        
        <GeoJsonLayer 
          data={data}
          variable={variable}
          format={format}
          geographyLevel={geographyLevel}
          usGeoJson={usGeoJson}
          onRegionSelect={onRegionSelect}
        />
        
        <MapMarkers searchResults={searchResults} />
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-0 right-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md">
        <MapLayerSelector 
          levels={GEOGRAPHY_LEVELS}
          currentLevel={geographyLevel} 
          onLayerChange={handleLayerChange}
        />
      </div>
      
      <div className="absolute top-0 left-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md w-64">
        <MapSearch onSearchResults={handleSearch} />
      </div>

      <MapLegend />
      
      {selectedRegion && onRegionSelect && (
        <GeographyBreadcrumb 
          selectedRegion={selectedRegion} 
          geographyLevel={geographyLevel} 
          onRegionSelect={onRegionSelect} 
        />
      )}
    </div>
  );
};

export default LeafletMap;
