
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
      mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, zoomLevel);
      
      // Add base OSM layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Share the map instance with parent
      setLeafletMap(mapInstanceRef.current);
    } else {
      // Update center and zoom if map already exists
      mapInstanceRef.current.setView(mapCenter, zoomLevel);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapRef, setLeafletMap, mapCenter, zoomLevel]);

  return <>{children}</>;
};

export default MapContainer;
