
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { toast } from '@/components/ui/use-toast';
import { FALLBACK_GEOJSON } from './mapConstants';

interface TigerWebLayerProps {
  map: L.Map | null;
  selectedLayerService: string;
}

const TigerWebLayer = ({ map, selectedLayerService }: TigerWebLayerProps) => {
  const layerRef = useRef<L.TileLayer | null>(null);
  const [hasError, setHasError] = useState(false);
  
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

    // Add the selected layer
    try {
      // Add a base map layer first
      const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      
      // For ArcGIS Feature Services, we use the GeoJSON loader
      // We don't add a WMS layer here, the GeoJSON layer will be added separately
      
      console.log('Map layer setup complete');
    } catch (error) {
      console.error('Error adding map layer:', error);
      setHasError(true);
      loadFallbackLayer(map);
    }

    return () => {
      if (map && layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
        console.log('Map layer removed');
      }
    };
  }, [map, selectedLayerService]);
  
  const loadFallbackLayer = (map: L.Map) => {
    // Determine which fallback to use based on the selected layer service
    let fallbackUrl = FALLBACK_GEOJSON.states;
    
    if (selectedLayerService.includes('Counties')) {
      fallbackUrl = FALLBACK_GEOJSON.counties;
    } else if (selectedLayerService.includes('Tracts')) {
      fallbackUrl = FALLBACK_GEOJSON.tracts;
    }
    
    // Load the fallback GeoJSON
    fetch(fallbackUrl)
      .then(response => response.json())
      .then(data => {
        const geojsonLayer = L.geoJSON(data, {
          style: {
            color: '#3388ff',
            weight: 1,
            fillOpacity: 0.1
          }
        }).addTo(map);
        
        console.log('Fallback GeoJSON layer added to map');
      })
      .catch(error => {
        console.error('Error loading fallback GeoJSON:', error);
      });
  };

  return null;
};

export default TigerWebLayer;
