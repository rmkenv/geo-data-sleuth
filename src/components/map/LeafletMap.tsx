import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TIGERWEB_SERVICES } from './mapConstants';
import MapController from './MapController';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import MapSearch from './MapSearch';
import MapLayerSelector from './MapLayerSelector';
import MapMarkers from './MapMarkers';
import GeoJsonLayer from './GeoJsonLayer';
import { useMapData } from '@/hooks/useMapData';
import { GEOGRAPHY_LEVELS } from './mapConstants';

// Fix Leaflet icon issue in production
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Fix default Leaflet icon issue
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon,
      iconUrl: icon,
      shadowUrl: iconShadow
    });
  }, []);

  // Get the current geography level service
  useEffect(() => {
    const currentLevel = GEOGRAPHY_LEVELS.find(level => level.id === geographyLevel);
    if (currentLevel) {
      setSelectedLayerService(currentLevel.service);
      console.log(`Selected layer service: ${currentLevel.service} for level ${geographyLevel}`);
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

  // Initialize and update map
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(mapCenter, zoomLevel);
      
      // Base layer - OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);

      // Add Census TIGERweb layers
      Object.entries(TIGERWEB_SERVICES).forEach(([key, url]) => {
        const tigerLayer = L.tileLayer.wms(url, {
          layers: 'layer',
          format: 'image/png',
          transparent: true,
          attribution: 'U.S. Census Bureau'
        });

        if (key === 'states') {
          tigerLayer.addTo(leafletMapRef.current!);
        }
      });
    } else {
      // Update center and zoom if map already exists
      leafletMapRef.current.setView(mapCenter, zoomLevel);
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapCenter, zoomLevel]);

  // Handle search results
  const handleSearch = (results: any[]) => {
    setSearchResults(results);
    if (results.length > 0) {
      const [lng, lat] = results[0].center;
      setMapCenter([lat, lng]);
      setZoomLevel(12);
    }
  };

  // Handle layer selection
  const handleLayerChange = (serviceUrl: string, level: string) => {
    setSelectedLayerService(serviceUrl);
    if (onRegionSelect) {
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
      <div ref={mapRef} className="h-full w-full" style={{ borderRadius: '0 0 0.5rem 0.5rem' }} />

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
