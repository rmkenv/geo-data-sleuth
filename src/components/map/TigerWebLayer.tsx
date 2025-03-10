
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { FALLBACK_GEOJSON } from './mapConstants';

interface TigerWebLayerProps {
  map: L.Map | null;
  selectedLayerService: string;
}

const TigerWebLayer = ({ map, selectedLayerService }: TigerWebLayerProps) => {
  const layerRef = useRef<L.TileLayer | null>(null);
  
  useEffect(() => {
    if (!map) {
      console.log('Map not available for TigerWebLayer');
      return;
    }

    console.log(`Loading layer from: ${selectedLayerService}`);

    // Clear previous layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    // We don't add a WMS layer here, the GeoJSON layer will be added separately
    console.log('Layer setup complete');

    return () => {
      if (map && layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, selectedLayerService]);

  return null;
};

export default TigerWebLayer;
