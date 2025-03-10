
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BASEMAPS } from './mapConstants';

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  setLeafletMap: (map: L.Map) => void;
  mapCenter: [number, number];
  zoomLevel: number;
  currentBasemap: string;
  children?: React.ReactNode;
}

const MapContainer = ({ 
  mapRef, 
  setLeafletMap, 
  mapCenter, 
  zoomLevel,
  currentBasemap = 'osm',
  children 
}: MapContainerProps) => {
  const mapInstanceRef = useRef<L.Map | null>(null);
  const basemapLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) {
      console.error('Map container ref not found');
      return;
    }

    // Only initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      console.log('Initializing map with center:', mapCenter, 'zoom:', zoomLevel);
      
      try {
        // Clear any existing map instance
        if (mapRef.current._leaflet_id) {
          console.log('Clearing existing Leaflet instance');
          mapRef.current._leaflet_id = undefined;
        }

        // Create new map instance
        const map = L.map(mapRef.current, {
          center: mapCenter,
          zoom: zoomLevel,
          scrollWheelZoom: true,
          zoomControl: true,
          attributionControl: true
        });
        
        mapInstanceRef.current = map;
        
        // Add initial base layer
        if (BASEMAPS[currentBasemap]) {
          console.log(`Adding initial basemap: ${currentBasemap}`);
          basemapLayerRef.current = L.tileLayer(BASEMAPS[currentBasemap].url, {
            attribution: BASEMAPS[currentBasemap].attribution,
            maxZoom: BASEMAPS[currentBasemap].maxZoom
          }).addTo(map);
        } else {
          console.error(`Basemap not found: ${currentBasemap}`);
        }

        // Share the map instance with parent
        setLeafletMap(map);
        
        console.log('Map initialized successfully with ID:', map._leaflet_id);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up map instance');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        basemapLayerRef.current = null;
      }
    };
  }, [mapRef, setLeafletMap]);

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      console.log(`Setting map view to ${mapCenter} at zoom ${zoomLevel}`);
      mapInstanceRef.current.setView(mapCenter, zoomLevel);
    }
  }, [mapCenter, zoomLevel]);

  // Update basemap when currentBasemap changes
  useEffect(() => {
    if (mapInstanceRef.current && BASEMAPS[currentBasemap]) {
      console.log(`Changing basemap to ${currentBasemap}`);
      
      // Remove current basemap layer
      if (basemapLayerRef.current) {
        mapInstanceRef.current.removeLayer(basemapLayerRef.current);
      }
      
      // Add new basemap layer
      basemapLayerRef.current = L.tileLayer(BASEMAPS[currentBasemap].url, {
        attribution: BASEMAPS[currentBasemap].attribution,
        maxZoom: BASEMAPS[currentBasemap].maxZoom
      }).addTo(mapInstanceRef.current);
      
      console.log(`Basemap changed to ${currentBasemap}`);
    } else if (!BASEMAPS[currentBasemap]) {
      console.error(`Invalid basemap: ${currentBasemap}`);
    }
  }, [currentBasemap]);

  return <>{children}</>;
};

export default MapContainer;
