
import { formatValue } from '@/lib/census';

export const createFeatureHandlers = (
  data: any[] | undefined, 
  variable: string | undefined, 
  format: string | undefined,
  geographyLevel: string,
  onRegionSelect?: (region: string, level: string) => void
) => {
  return (feature: any, layer: any) => {
    if (!data || !variable) return;

    // Find data for this region
    const regionData = data.find((item: any) => {
      if (geographyLevel === 'state') {
        return item.NAME && feature.properties.name && 
          item.NAME.includes(feature.properties.name);
      } else if (geographyLevel === 'county') {
        return item.NAME && feature.properties.name && 
          item.NAME.includes(feature.properties.name);
      } else if (geographyLevel === 'zip') {
        return item.NAME && feature.properties.ZCTA5CE10 && 
          item.NAME.includes(feature.properties.ZCTA5CE10);
      }
      return false;
    });

    if (regionData && regionData[variable]) {
      const formattedValue = formatValue(regionData[variable], format);
      
      // Add tooltip
      layer.bindTooltip(`<strong>${feature.properties.name || feature.properties.ZCTA5CE10}</strong><br/>${formattedValue}`);
      
      // Add click handler
      layer.on('click', () => {
        if (onRegionSelect) {
          // Get next geography level
          let nextLevel = 'state';
          if (geographyLevel === 'state') nextLevel = 'county';
          else if (geographyLevel === 'county') nextLevel = 'zip';
          
          // Get region identifier
          const regionId = feature.properties.name || feature.properties.ZCTA5CE10;
          onRegionSelect(regionId, nextLevel);
        }
      });
    }
  };
};
