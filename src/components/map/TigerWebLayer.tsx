
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

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

    console.log(`Loading tile layer from: ${selectedLayerService}`);

    // Clear previous layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    try {
      // Use regular tile layer instead of WMS for ArcGIS REST services
      const serviceUrl = `${selectedLayerService}/MapServer/tile/{z}/{y}/{x}`;
      layerRef.current = L.tileLayer(serviceUrl, {
        maxZoom: 19,
        opacity: 0.7,
        attribution: 'ESRI ArcGIS'
      }).addTo(map);
      
      console.log('Tile Layer added successfully');
    } catch (error) {
      console.error('Error adding tile layer:', error);
    }

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
