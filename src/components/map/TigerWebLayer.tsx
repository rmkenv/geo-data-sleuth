
import React, { useEffect } from 'react';
import L from 'leaflet';
import { TIGERWEB_SERVICES } from './mapConstants';

interface TigerWebLayerProps {
  map: L.Map | null;
  selectedLayerService: string;
}

const TigerWebLayer = ({ map, selectedLayerService }: TigerWebLayerProps) => {
  useEffect(() => {
    if (!map) return;

    // Clear previous TigerWeb layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer.WMS && layer.options.layers === 'layer') {
        map.removeLayer(layer);
      }
    });

    // Add the selected TigerWeb layer
    const tigerLayer = L.tileLayer.wms(selectedLayerService, {
      layers: 'layer',
      format: 'image/png',
      transparent: true,
      attribution: 'U.S. Census Bureau'
    });
    
    tigerLayer.addTo(map);

    return () => {
      if (map) {
        map.removeLayer(tigerLayer);
      }
    };
  }, [map, selectedLayerService]);

  return null;
};

export default TigerWebLayer;
