
import { useState, useCallback } from 'react';
import { TIGERWEB_SERVICES, GEOGRAPHY_LEVELS } from '@/components/map/mapConstants';
import { Map as LeafletMap } from 'leaflet';

export const useMapState = (
  geographyLevel: string = 'state',
  selectedRegion?: string
) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLayerService, setSelectedLayerService] = useState(TIGERWEB_SERVICES.states);
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null);
  const [activeTool, setActiveTool] = useState('pan');
  const [dataGranularity, setDataGranularity] = useState('tract');
  const [areaOfInterest, setAreaOfInterest] = useState<any>(null);

  // Set the layer service based on geography level
  const updateLayerService = useCallback((level: string) => {
    const currentLevel = GEOGRAPHY_LEVELS.find(l => l.id === level);
    if (currentLevel) {
      setSelectedLayerService(currentLevel.service);
      console.log(`Selected layer service: ${currentLevel.service} for level ${level}`);
    } else {
      console.warn(`Geography level not found: ${level}`);
    }
  }, []);

  // Update map center and zoom based on geography level and region
  const updateMapView = useCallback((region?: string, level?: string) => {
    const newLevel = level || geographyLevel;
    
    if (region) {
      console.log(`Updating map view for region: ${region}, level: ${newLevel}`);
      
      if (newLevel === 'state') {
        setZoomLevel(6);
        setMapCenter([36.7783, -119.4179]);
      } else if (newLevel === 'county') {
        setZoomLevel(8);
        setMapCenter([37.7749, -122.4194]);
      } else if (newLevel === 'tract' || newLevel === 'blockGroup') {
        setZoomLevel(10);
        setMapCenter([37.7749, -122.4194]);
      } else if (newLevel === 'block') {
        setZoomLevel(12);
        setMapCenter([37.7749, -122.4194]);
      } else if (newLevel === 'zip') {
        setZoomLevel(8);
        setMapCenter([37.7749, -122.4194]);
      }
    } else {
      // Reset to US view
      console.log('Resetting map to US view');
      setMapCenter([39.8283, -98.5795]);
      setZoomLevel(4);
    }
  }, [geographyLevel]);

  return {
    mapCenter,
    setMapCenter,
    zoomLevel,
    setZoomLevel,
    searchResults,
    setSearchResults,
    selectedLayerService,
    setSelectedLayerService,
    leafletMap,
    setLeafletMap,
    activeTool,
    setActiveTool,
    dataGranularity,
    setDataGranularity,
    areaOfInterest,
    setAreaOfInterest,
    updateLayerService,
    updateMapView
  };
};
