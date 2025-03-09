
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { toast } from '@/components/ui/use-toast';

interface TigerWebLayerProps {
  map: L.Map | null;
  selectedLayerService: string;
}

const TigerWebLayer = ({ map, selectedLayerService }: TigerWebLayerProps) => {
  const layerRef = useRef<L.TileLayer.WMS | null>(null);
  const [hasError, setHasError] = useState(false);
  
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
      // Add a base map layer first
      const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      
      // Then try to add the TigerWeb layer
      layerRef.current = L.tileLayer.wms(selectedLayerService, {
        layers: 'layer',
        format: 'image/png',
        transparent: true,
        attribution: 'U.S. Census Bureau'
      });
      
      // Add error handling for the WMS layer
      layerRef.current.on('tileerror', (error) => {
        console.error('TigerWeb tile error:', error);
        if (!hasError) {
          setHasError(true);
          toast({
            title: "Geographic data service issue",
            description: "Using OpenStreetMap basemap only",
            variant: "default",
          });
        }
      });
      
      layerRef.current.addTo(map);
      console.log('TigerWeb layer added to map');
    } catch (error) {
      console.error('Error adding TigerWeb layer:', error);
      setHasError(true);
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
