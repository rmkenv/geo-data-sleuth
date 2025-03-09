
import React, { useEffect } from 'react';
import L from 'leaflet';

interface MapControllerProps {
  map: L.Map | null;
  center: [number, number];
  zoom: number;
}

const MapController = ({ map, center, zoom }: MapControllerProps) => {
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

export default MapController;
