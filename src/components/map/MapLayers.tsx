
import React from 'react';
import L from 'leaflet';
import TigerWebLayer from './TigerWebLayer';
import GeoJsonLayer from './GeoJsonLayer';
import MapMarkers from './MapMarkers';
import LassoTool from './LassoTool';
import MapController from './MapController';

interface MapLayersProps {
  map: L.Map;
  selectedLayerService: string;
  data?: any[];
  variable?: string;
  format?: string;
  geographyLevel: string;
  dataGranularity: string;
  usGeoJson: any;
  searchResults: any[];
  activeTool: string;
  onRegionSelect?: (region: string, level: string) => void;
  onAreaSelected: (geojson: any) => void;
}

const MapLayers = ({
  map,
  selectedLayerService,
  data,
  variable,
  format,
  geographyLevel,
  dataGranularity,
  usGeoJson,
  searchResults,
  activeTool,
  onRegionSelect,
  onAreaSelected
}: MapLayersProps) => {
  // Prevent rendering if map is not available
  if (!map) {
    console.log('Map instance not available for layers');
    return null;
  }

  return (
    <>
      <TigerWebLayer 
        map={map}
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
        map={map}
        active={activeTool === 'lasso'}
        onAreaSelected={onAreaSelected}
      />
      
      <MapController
        map={map}
        center={[39.8283, -98.5795]} // Default to US center
        zoom={4}                     // Default zoom level
      />
    </>
  );
};

export default MapLayers;
