
import React from 'react';
import { GeoJSON } from 'react-leaflet';
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
  if (!usGeoJson) return null;
  
  // Get style function for regions
  const regionStyleFunction = getRegionStyle(data, variable, geographyLevel);

  const handleFeatureClick = (e: any) => {
    const feature = e.sourceTarget.feature;
    const layer = e.sourceTarget;
    if (onRegionSelect && feature) {
      // Get next geography level
      let nextLevel = 'state';
      if (geographyLevel === 'state') nextLevel = 'county';
      else if (geographyLevel === 'county') nextLevel = 'tract';
      
      // Get region identifier based on the geography level
      let regionId = '';
      if (geographyLevel === 'state') {
        regionId = feature.properties.STATEFP || feature.properties.GEOID || feature.properties.name;
      } else if (geographyLevel === 'county') {
        regionId = feature.properties.COUNTYFP || feature.properties.GEOID;
      } else {
        regionId = feature.properties.GEOID || feature.properties.TRACTCE;
      }
      
      onRegionSelect(regionId, nextLevel);
    }
    
    // Create popup with census data
    if (data && variable && feature) {
      const regionData = data.find((item: any) => {
        // Match data to feature based on various ID fields
        if (item.GEOID && feature.properties.GEOID) {
          return item.GEOID === feature.properties.GEOID;
        } else if (item.NAME && feature.properties.name) {
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
                    
        layer.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${name}</h3>
            <p>${variable}: ${formattedValue}</p>
          </div>
        `).openPopup();
      }
    }
  };

  const handleFeatureMouseover = (e: any) => {
    const layer = e.sourceTarget;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.9
    });
  };

  const handleFeatureMouseout = (e: any) => {
    const layer = e.sourceTarget;
    layer.setStyle(regionStyleFunction(e.sourceTarget.feature));
  };

  return (
    <GeoJSON 
      key={`${variable}-${geographyLevel}-${JSON.stringify(usGeoJson).length}`}
      data={usGeoJson}
      pathOptions={regionStyleFunction({})}
      eventHandlers={{
        click: handleFeatureClick,
        mouseover: handleFeatureMouseover,
        mouseout: handleFeatureMouseout
      }}
    />
  );
};

export default GeoJsonLayer;
