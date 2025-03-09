
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  setLeafletMap: (map: L.Map) => void;
  mapCenter: [number, number];
  zoomLevel: number;
  children?: React.ReactNode;
}

const MapContainer = ({ 
  mapRef, 
  setLeafletMap, 
  mapCenter, 
  zoomLevel, 
  children 
}: MapContainerProps) => {
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Create a unique ID for the map container
      const mapId = `map-${Math.random().toString(36).substring(2, 9)}`;
      mapRef.current.id = mapId;
      
      console.log(`Initializing map with ID: ${mapId}`);
      
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: mapCenter,
        zoom: zoomLevel,
        scrollWheelZoom: true,
        zoomControl: true
      });
      
      // Add base OSM layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Share the map instance with parent
      setLeafletMap(mapInstanceRef.current);
      console.log('Map initialized and shared with parent component');
    } else {
      // Update center and zoom if map already exists
      mapInstanceRef.current.setView(mapCenter, zoomLevel);
      console.log(`Map view updated to ${mapCenter} at zoom ${zoomLevel}`);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up map instance');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
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

  return <>{children}</>;
};

export default MapContainer;
