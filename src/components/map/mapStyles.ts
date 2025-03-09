
import { PathOptions } from 'leaflet';

export const getRegionStyle = (data: any[] | undefined, variable: string | undefined, geographyLevel: string) => {
  return (feature: any): PathOptions => {
    if (!data || !variable || !feature) {
      return {
        fillColor: '#b3e5fc',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

    // Find data for this region
    const regionData = data?.find((item: any) => {
      if (!item || !feature.properties) return false;
      
      if (item.GEOID && feature.properties.GEOID) {
        return item.GEOID === feature.properties.GEOID;
      }
      
      // Match by state code
      if (item.STATE && feature.properties.STATE) {
        return item.STATE === feature.properties.STATE;
      }
      
      // Fallback to name matching
      if (geographyLevel === 'state') {
        return item.NAME && feature.properties.NAME && 
          item.NAME.includes(feature.properties.NAME);
      } else if (geographyLevel === 'county') {
        return item.NAME && feature.properties.NAME && 
          item.NAME.includes(feature.properties.NAME);
      } else if (geographyLevel === 'tract') {
        return item.TRACT && feature.properties.TRACT && 
          item.TRACT === feature.properties.TRACT;
      }
      return false;
    });

    // Get value for choropleth
    const value = regionData ? regionData[variable] : 0;
    
    // Color scale based on value
    const getColor = (val: number) => {
      if (!val) return '#dddddd';
      
      // Customize these ranges based on your data
      return val > 100000 ? '#084c61' :
             val > 75000 ? '#177e89' :
             val > 50000 ? '#39a0ab' :
             val > 25000 ? '#6dcdb8' :
                          '#b3e5fc';
    };

    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };
};
