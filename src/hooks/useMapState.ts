
import { useState } from 'react';
import { TIGERWEB_SERVICES, GEOGRAPHY_LEVELS } from '@/components/map/mapConstants';

export const useMapState = (
  geographyLevel: string = 'state',
  selectedRegion?: string
) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLayerService, setSelectedLayerService] = useState(TIGERWEB_SERVICES.states);
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null);
  const [activeTool, setActiveTool] = useState('pan');
  const [dataGranularity, setDataGranularity] = useState('tract');
  const [areaOfInterest, setAreaOfInterest] = useState<any>(null);

  // Set the layer service based on geography level
  const updateLayerService = (level: string) => {
    const currentLevel = GEOGRAPHY_LEVELS.find(l => l.id === level);
    if (currentLevel) {
      setSelectedLayerService(currentLevel.service);
      console.log(`Selected layer service: ${currentLevel.service} for level ${level}`);
    }
  };

  // Update map center and zoom based on geography level and region
  const updateMapView = (region?: string, level?: string) => {
    if (region) {
      const newLevel = level || geographyLevel;
      
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
      setMapCenter([39.8283, -98.5795]);
      setZoomLevel(4);
    }
  };

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
