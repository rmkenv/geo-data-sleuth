
export const getRegionStyle = (data: any[] | undefined, variable: string | undefined, geographyLevel: string) => {
  return (feature: any) => {
    if (!data || !variable) {
      return {
        fillColor: '#b3e5fc',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

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

    // Get value for choropleth
    const value = regionData ? regionData[variable] : 0;
    
    // Color scale based on value
    const getColor = (val: number) => {
      if (!val) return '#dddddd';
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
