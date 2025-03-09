
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { TIGERWEB_SERVICES, GEOGRAPHY_LEVELS } from './mapConstants';
import MapController from './MapController';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import MapSearch from './MapSearch';
import MapLayerSelector from './MapLayerSelector';
import MapMarkers from './MapMarkers';
import GeoJsonLayer from './GeoJsonLayer';
import { useMapData } from '@/hooks/useMapData';
import TigerWebLayer from './TigerWebLayer';
import MapContainer from './MapContainer';
import LassoTool from './LassoTool';
import { toast } from '@/components/ui/use-toast';

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
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null);
  const [activeTool, setActiveTool] = useState('pan');
  const [dataGranularity, setDataGranularity] = useState('tract');
  const [areaOfInterest, setAreaOfInterest] = useState<any>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);

  // Fix default Leaflet icon issue
  useEffect(() => {
    console.log('Setting up Leaflet default icon');
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

  // Listen for search results from custom event
  useEffect(() => {
    const handleSearchResultsEvent = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        console.log('Received search results:', e.detail);
        setSearchResults(e.detail);
        
        if (e.detail.length > 0 && e.detail[0].center) {
          const [lng, lat] = e.detail[0].center;
          setMapCenter([lat, lng]);
          setZoomLevel(12);
        }
      }
    };
    
    window.addEventListener('map-search-results', handleSearchResultsEvent);
    return () => {
      window.removeEventListener('map-search-results', handleSearchResultsEvent);
    };
  }, []);

  // Handle search results directly
  const handleSearch = (results: any[]) => {
    console.log('Search results in LeafletMap:', results);
    setSearchResults(results);
    if (results.length > 0 && results[0].center) {
      const [lng, lat] = results[0].center;
      setMapCenter([lat, lng]);
      setZoomLevel(12);
    }
  };

  // Handle layer selection
  const handleLayerChange = (serviceUrl: string, level: string) => {
    console.log(`Layer changed to ${level} with service: ${serviceUrl}`);
    setSelectedLayerService(serviceUrl);
    if (onRegionSelect) {
      onRegionSelect('', level);
    }
  };

  // Handle tool change
  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    
    if (tool === 'pan') {
      // Re-enable map dragging if it was disabled
      if (leafletMap) {
        leafletMap.dragging.enable();
      }
    }
  };

  // Handle granularity change
  const handleGranularityChange = (granularity: string) => {
    setDataGranularity(granularity);
    toast({
      title: "Data granularity changed",
      description: `Data will be displayed at ${granularity === 'zip' ? 'ZIP code' : 'Census tract'} level`,
      variant: "default",
    });
  };

  // Handle drawn AOI
  const handleAreaSelected = (geojson: any) => {
    setAreaOfInterest(geojson);
    if (geojson) {
      toast({
        title: "Area of Interest selected",
        description: "Data will populate for the selected area",
        variant: "default",
      });
      
      // Here you would trigger data fetching for the selected area
      // This would depend on your data fetching implementation
      
      // For demonstration purposes, we'll just console.log the GeoJSON
      console.log('Selected AOI:', geojson);
    }
  };

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('Rendering LeafletMap component with:', { mapCenter, zoomLevel, searchResults });

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        id="map-container"
        className="h-full w-full" 
        style={{ borderRadius: '0 0 0.5rem 0.5rem' }} 
      />
      
      {mapRef.current && (
        <MapContainer 
          mapRef={mapRef}
          setLeafletMap={setLeafletMap}
          mapCenter={mapCenter}
          zoomLevel={zoomLevel}
        >
          {leafletMap && (
            <>
              <TigerWebLayer 
                map={leafletMap}
                selectedLayerService={selectedLayerService}
              />
              
              {usGeoJson && (
                <GeoJsonLayer
                  data={data}
                  variable={variable}
                  format={format}
                  geographyLevel={dataGranularity === 'zip' ? 'zip' : geographyLevel}
                  usGeoJson={usGeoJson}
                  onRegionSelect={onRegionSelect}
                />
              )}
              
              <MapMarkers searchResults={searchResults} />
              
              <LassoTool 
                map={leafletMap}
                active={activeTool === 'lasso'}
                onAreaSelected={handleAreaSelected}
              />
              
              <MapController
                map={leafletMap}
                center={mapCenter}
                zoom={zoomLevel}
              />
            </>
          )}
        </MapContainer>
      )}

      {/* Map controls overlay */}
      <div className="absolute top-0 right-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md">
        <MapLayerSelector 
          levels={GEOGRAPHY_LEVELS}
          currentLevel={geographyLevel} 
          onLayerChange={handleLayerChange}
        />
      </div>
      
      <div className="absolute top-0 left-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md w-64">
        <MapSearch 
          onSearchResults={handleSearch}
          onToolChange={handleToolChange}
          onGranularityChange={handleGranularityChange}
        />
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
