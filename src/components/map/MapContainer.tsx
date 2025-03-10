
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

  useEffect(() => {
    if (!mapRef.current) {
      console.error('Map ref not found');
      return;
    }

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      console.log('Initializing map');
      
      try {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: mapCenter,
          zoom: zoomLevel,
          scrollWheelZoom: true,
          zoomControl: true
        });
        
        // Add initial base layer
        basemapLayerRef.current = L.tileLayer(BASEMAPS[currentBasemap].url, {
          attribution: BASEMAPS[currentBasemap].attribution,
          maxZoom: BASEMAPS[currentBasemap].maxZoom
        }).addTo(mapInstanceRef.current);

        // Share the map instance with parent
        setLeafletMap(mapInstanceRef.current);
        
        console.log('Map initialized successfully');
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
      mapInstanceRef.current.setView(mapCenter, zoomLevel);
      console.log(`Map view updated to ${mapCenter} at zoom ${zoomLevel}`);
    }
  }, [mapCenter, zoomLevel]);

  // Update basemap when currentBasemap changes
  useEffect(() => {
    if (mapInstanceRef.current && BASEMAPS[currentBasemap]) {
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
    }
  }, [currentBasemap]);

  return <>{children}</>;
};

export default MapContainer;
