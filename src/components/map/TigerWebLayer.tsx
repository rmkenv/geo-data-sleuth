
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface TigerWebLayerProps {
  map: L.Map | null;
  selectedLayerService: string;
}

const TigerWebLayer = ({ map, selectedLayerService }: TigerWebLayerProps) => {
  const layerRef = useRef<L.TileLayer.WMS | null>(null);
  
  useEffect(() => {
    if (!map) {
      console.log('Map not available for TigerWebLayer');
      return;
    }

    console.log(`Loading TigerWeb layer from: ${selectedLayerService}`);

    // Clear previous TigerWeb layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    // Add the selected TigerWeb layer
    try {
      layerRef.current = L.tileLayer.wms(selectedLayerService, {
        layers: 'layer',
        format: 'image/png',
        transparent: true,
        attribution: 'U.S. Census Bureau'
      }).addTo(map);
      
      console.log('TigerWeb layer added to map');
    } catch (error) {
      console.error('Error adding TigerWeb layer:', error);
    }

    return () => {
      if (map && layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
        console.log('TigerWeb layer removed from map');
      }
    };
  }, [map, selectedLayerService]);

  return null;
};

export default TigerWebLayer;
