
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
  // Get map state from custom hook
  const mapState = useMapState(geographyLevel, selectedRegion);
  const mapRef = useRef<HTMLDivElement>(null);
  const [basemapLayers, setBasemapLayers] = useState<{[key: string]: L.TileLayer}>({});
  const [currentBasemap, setCurrentBasemap] = useState('osm');

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

  // Update layer service when geography level changes
  useEffect(() => {
    mapState.updateLayerService(geographyLevel);
  }, [geographyLevel]);

  // Update map view when selected region or geography level changes
  useEffect(() => {
    mapState.updateMapView(selectedRegion, geographyLevel);
  }, [selectedRegion, geographyLevel]);

  // Initialize basemap layers when map is created
  useEffect(() => {
    if (mapState.leafletMap) {
      // Initialize basemap layers
      const osmLayer = L.tileLayer(BASEMAPS.osm.url, {
        attribution: BASEMAPS.osm.attribution,
        maxZoom: BASEMAPS.osm.maxZoom
      }).addTo(mapState.leafletMap);
      
      const satelliteLayer = L.tileLayer(BASEMAPS.satellite.url, {
        attribution: BASEMAPS.satellite.attribution,
        maxZoom: BASEMAPS.satellite.maxZoom
      });
      
      setBasemapLayers({
        osm: osmLayer,
        satellite: satelliteLayer
      });
      
      // Set initial basemap
      setCurrentBasemap('osm');
    }
  }, [mapState.leafletMap]);

  // Handle basemap change
  const handleBasemapChange = (basemap: string) => {
    if (!mapState.leafletMap || !basemapLayers[basemap]) return;
    
    // Remove current basemap
    Object.values(basemapLayers).forEach(layer => {
      if (mapState.leafletMap?.hasLayer(layer)) {
        mapState.leafletMap.removeLayer(layer);
      }
    });
    
    // Add new basemap
    basemapLayers[basemap].addTo(mapState.leafletMap);
    setCurrentBasemap(basemap);
    
    // Notification
    toast({
      title: "Basemap changed",
      description: `Switched to ${basemap === 'osm' ? 'OpenStreetMap' : 'Satellite'} basemap`,
      variant: "default",
    });
  };

  // Load map data from the custom hook
  const { usGeoJson, isMapLoaded } = useMapData(
    selectedRegion, 
    geographyLevel, 
    mapState.dataGranularity === 'zip' 
      ? ARCGIS_SERVICES.zipCodes 
      : ARCGIS_SERVICES.censusTracts
  );

  // Listen for search results from custom event
  useEffect(() => {
    const handleSearchResultsEvent = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        console.log('Received search results:', e.detail);
        mapState.setSearchResults(e.detail);
        
        if (e.detail.length > 0 && e.detail[0].center) {
          const [lng, lat] = e.detail[0].center;
          mapState.setMapCenter([lat, lng]);
          mapState.setZoomLevel(12);
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
    mapState.setSearchResults(results);
    if (results.length > 0 && results[0].center) {
      const [lng, lat] = results[0].center;
      mapState.setMapCenter([lat, lng]);
      mapState.setZoomLevel(12);
    }
  };

  // Handle layer change - simplified as the selector is removed but maintained for API compatibility
  const handleLayerChange = (serviceUrl: string, level: string) => {
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

  console.log('Rendering LeafletMap component with:', { 
    mapCenter: mapState.mapCenter, 
    zoomLevel: mapState.zoomLevel, 
    searchResults: mapState.searchResults 
  });

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
          setLeafletMap={mapState.setLeafletMap}
          mapCenter={mapState.mapCenter}
          zoomLevel={mapState.zoomLevel}
          initialBasemap="osm"
        >
          {mapState.leafletMap && (
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
