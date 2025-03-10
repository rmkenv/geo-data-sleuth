
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { ARCGIS_SERVICES, BASEMAPS } from './mapConstants';
import MapContainer from './MapContainer';
import MapControls from './MapControls';
import MapLayers from './MapLayers';
import { useMapData } from '@/hooks/useMapData';
import { useMapState } from '@/hooks/useMapState';
import { toast } from '@/components/ui/use-toast';

// Fix Leaflet icon issue
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
  // Get map state from custom hook
  const mapState = useMapState(geographyLevel, selectedRegion);
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentBasemap, setCurrentBasemap] = useState('osm');
  const [mapInitialized, setMapInitialized] = useState(false);

  // Fix default Leaflet icon issue
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon,
      iconUrl: icon,
      shadowUrl: iconShadow
    });
    
    console.log('Leaflet icons fixed');
  }, []);

  // Update layer service when geography level changes
  useEffect(() => {
    if (mapInitialized) {
      console.log(`Geography level changed to: ${geographyLevel}`);
      mapState.updateLayerService(geographyLevel);
    }
  }, [geographyLevel, mapState, mapInitialized]);

  // Update map view when selected region or geography level changes
  useEffect(() => {
    if (mapInitialized) {
      console.log(`Selected region changed to: ${selectedRegion}, geography level: ${geographyLevel}`);
      mapState.updateMapView(selectedRegion, geographyLevel);
    }
  }, [selectedRegion, geographyLevel, mapState, mapInitialized]);

  // Handle basemap change
  const handleBasemapChange = (basemap: string) => {
    console.log(`Changing basemap to: ${basemap}`);
    setCurrentBasemap(basemap);
    
    // Notification
    toast({
      title: "Basemap changed",
      description: `Switched to ${basemap === 'osm' ? 'OpenStreetMap' : 'Satellite'} basemap`,
      variant: "default",
    });
  };

  // Set up the map
  const handleMapSetup = (map: L.Map) => {
    console.log('Map setup complete, setting map instance');
    mapState.setLeafletMap(map);
    setMapInitialized(true);
    
    // Force a rerender of the layers when the map is ready
    const serviceUrl = mapState.dataGranularity === 'zip' 
      ? ARCGIS_SERVICES.zipCodes 
      : ARCGIS_SERVICES.censusTracts;
    
    mapState.setSelectedLayerService(serviceUrl);
  };

  // Load map data from the custom hook
  const { usGeoJson, isMapLoaded } = useMapData(
    selectedRegion, 
    geographyLevel, 
    mapState.selectedLayerService
  );

  // Handle search results
  const handleSearch = (results: any[]) => {
    mapState.setSearchResults(results);
    if (results.length > 0 && results[0].center) {
      const [lng, lat] = results[0].center;
      mapState.setMapCenter([lat, lng]);
      mapState.setZoomLevel(12);
    }
  };

  // Handle layer change
  const handleLayerChange = (serviceUrl: string, level: string) => {
    console.log(`Layer changed to: ${serviceUrl}, level: ${level}`);
    mapState.setSelectedLayerService(serviceUrl);
  };

  // Handle area selection
  const handleAreaSelected = (geojson: any) => {
    mapState.setAreaOfInterest(geojson);
    if (geojson) {
      toast({
        title: "Area of Interest selected",
        description: "Data will populate for the selected area",
        variant: "default",
      });
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
      <div 
        ref={mapRef} 
        id="map-container"
        className="h-full w-full z-0" 
        style={{ borderRadius: '0 0 0.5rem 0.5rem' }} 
      />
      
      {mapRef.current && (
        <MapContainer 
          mapRef={mapRef}
          setLeafletMap={handleMapSetup}
          mapCenter={mapState.mapCenter}
          zoomLevel={mapState.zoomLevel}
          currentBasemap={currentBasemap}
        >
          {mapState.leafletMap && mapInitialized && (
            <MapLayers
              map={mapState.leafletMap}
              selectedLayerService={
                mapState.dataGranularity === 'zip' 
                  ? ARCGIS_SERVICES.zipCodes 
                  : ARCGIS_SERVICES.censusTracts
              }
              data={data}
              variable={variable}
              format={format}
              geographyLevel={geographyLevel}
              dataGranularity={mapState.dataGranularity}
              usGeoJson={usGeoJson}
              searchResults={mapState.searchResults}
              activeTool={mapState.activeTool}
              onRegionSelect={onRegionSelect}
              onAreaSelected={handleAreaSelected}
            />
          )}
        </MapContainer>
      )}

      <MapControls
        geographyLevel={geographyLevel}
        selectedRegion={selectedRegion}
        onRegionSelect={onRegionSelect}
        onLayerChange={handleLayerChange}
        onSearch={handleSearch}
        onToolChange={mapState.setActiveTool}
        onGranularityChange={(granularity) => {
          console.log(`Granularity changed to: ${granularity}`);
          mapState.setDataGranularity(granularity);
          
          // Change the layer service based on granularity
          const serviceUrl = granularity === 'zip' 
            ? ARCGIS_SERVICES.zipCodes 
            : ARCGIS_SERVICES.censusTracts;
          
          mapState.setSelectedLayerService(serviceUrl);
          
          toast({
            title: "Layer changed",
            description: `Switched to ${granularity === 'zip' ? 'ZIP Code' : 'Census Tract'} layer`,
            variant: "default",
          });
        }}
        onBasemapChange={handleBasemapChange}
        currentBasemap={currentBasemap}
      />
    </div>
  );
};

export default LeafletMap;
