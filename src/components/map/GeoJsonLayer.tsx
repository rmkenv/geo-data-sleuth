
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { getRegionStyle } from './mapStyles';

interface GeoJsonLayerProps {
  data: any[] | undefined;
  variable: string | undefined;
  format: string | undefined;
  geographyLevel: string;
  usGeoJson: any;
  onRegionSelect?: (region: string, level: string) => void;
}

const GeoJsonLayer = ({ 
  data, 
  variable, 
  format, 
  geographyLevel, 
  usGeoJson, 
  onRegionSelect 
}: GeoJsonLayerProps) => {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  
  useEffect(() => {
    if (!usGeoJson || !usGeoJson.features || usGeoJson.features.length === 0) {
      console.log('No GeoJSON data available for rendering');
      return;
    }
    
    console.log(`Rendering GeoJsonLayer with ${usGeoJson.features.length} features`);
    
    // Get style function for regions
    const regionStyleFunction = getRegionStyle(data, variable, geographyLevel);

    // Find the Leaflet map instance
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer || !mapContainer.__leaflet_instance__) {
      console.log('Map container or Leaflet instance not found');
      return;
    }
    
    const mapInstance = mapContainer.__leaflet_instance__;
    
    // Remove existing GeoJSON layer if it exists
    if (geoJsonLayerRef.current) {
      mapInstance.removeLayer(geoJsonLayerRef.current);
    }
    
    // Create new GeoJSON layer
    try {
      geoJsonLayerRef.current = L.geoJSON(usGeoJson, {
        style: regionStyleFunction,
        onEachFeature: (feature, layer) => {
          // Add click handler
          layer.on({
            click: (e) => handleFeatureClick(e, feature, layer, mapInstance),
            mouseover: (e) => handleFeatureMouseover(e, layer),
            mouseout: (e) => handleFeatureMouseout(e, layer, feature)
          });
        }
      }).addTo(mapInstance);
      
      console.log('GeoJSON layer added to map');
    } catch (error) {
      console.error('Error creating GeoJSON layer:', error);
    }
    
    // Cleanup function
    return () => {
      if (mapInstance && geoJsonLayerRef.current) {
        mapInstance.removeLayer(geoJsonLayerRef.current);
        console.log('GeoJSON layer removed from map');
      }
    };
  }, [usGeoJson, data, variable, geographyLevel, format, onRegionSelect]);
  
  // Handle feature click
  const handleFeatureClick = (e: L.LeafletEvent, feature: any, layer: L.Layer, map: L.Map) => {
    console.log('Feature clicked:', feature);
    
    if (onRegionSelect && feature && feature.properties) {
      // Get next geography level
      let nextLevel = 'state';
      if (geographyLevel === 'state') nextLevel = 'county';
      else if (geographyLevel === 'county') nextLevel = 'tract';
      else if (geographyLevel === 'tract') nextLevel = 'blockGroup';
      else if (geographyLevel === 'blockGroup') nextLevel = 'block';
      
      // Get region identifier based on the geography level
      let regionId = '';
      if (geographyLevel === 'state') {
        regionId = feature.properties.STATE || feature.properties.STATEFP || feature.properties.GEOID || feature.properties.name;
      } else if (geographyLevel === 'county') {
        regionId = feature.properties.COUNTY || feature.properties.COUNTYFP || feature.properties.GEOID;
      } else if (geographyLevel === 'tract') {
        regionId = feature.properties.TRACT || feature.properties.TRACTCE || feature.properties.GEOID;
      } else if (geographyLevel === 'blockGroup') {
        regionId = feature.properties.BLKGRP || feature.properties.GEOID;
      } else {
        regionId = feature.properties.BLOCK || feature.properties.GEOID;
      }
      
      console.log(`Selected region: ${regionId}, next level: ${nextLevel}`);
      onRegionSelect(regionId, nextLevel);
    }
    
    // Create popup with census data
    if (data && variable && feature && feature.properties) {
      const regionData = data.find((item: any) => {
        // Match data to feature based on various ID fields
        if (item && item.GEOID && feature.properties.GEOID) {
          return item.GEOID === feature.properties.GEOID;
        } else if (item && item.NAME && feature.properties.name) {
          return item.NAME.includes(feature.properties.name);
        }
        return false;
      });
      
      if (regionData && regionData[variable]) {
        const value = regionData[variable];
        const formattedValue = format === 'currency' 
          ? `$${value.toLocaleString()}`
          : format === 'percent'
            ? `${value.toFixed(1)}%`
            : value.toLocaleString();
        
        const name = feature.properties.NAME || 
                    feature.properties.name || 
                    feature.properties.GEOID || 
                    'Selected Region';
                    
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`
            <div class="p-2">
              <h3 class="font-bold">${name}</h3>
              <p>${variable}: ${formattedValue}</p>
            </div>
          `)
          .openOn(map);
      }
    }
  };

  // Handle mouseover event
  const handleFeatureMouseover = (e: L.LeafletEvent, layer: L.Layer) => {
    if (layer instanceof L.Path) {
      layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
      });
    }
  };

  // Handle mouseout event
  const handleFeatureMouseout = (e: L.LeafletEvent, layer: L.Layer, feature: any) => {
    if (layer instanceof L.Path) {
      const regionStyleFunction = getRegionStyle(data, variable, geographyLevel);
      layer.setStyle(regionStyleFunction(feature));
    }
  };

  return null;
};

export default GeoJsonLayer;
