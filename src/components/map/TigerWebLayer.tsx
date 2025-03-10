
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

    console.log(`Loading WMS layer from: ${selectedLayerService}`);

    // Clear previous layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    try {
      // Add WMS layer
      layerRef.current = L.tileLayer.wms(selectedLayerService + '/MapServer/WMSServer', {
        layers: '0',
        format: 'image/png',
        transparent: true,
        version: '1.1.0'
      }).addTo(map);
      
      console.log('WMS Layer added successfully');
    } catch (error) {
      console.error('Error adding WMS layer:', error);
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
