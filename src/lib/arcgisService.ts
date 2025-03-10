
/**
 * Utility functions for working with ArcGIS services
 */

import { ARCGIS_SERVICES } from '@/components/map/mapConstants';

/**
 * Builds a query URL for ArcGIS Feature Services
 */
export const buildArcGisQuery = (
  serviceUrl: string, 
  where: string = '1=1', 
  limit: number = 1000
) => {
  const queryParams = new URLSearchParams({
    f: 'json',
    outFields: '*',
    where: where,
    resultRecordCount: limit.toString(),
    outSR: '4326',
    returnGeometry: 'true'
  });
  
  return `${serviceUrl}/query?${queryParams.toString()}`;
};

/**
 * Queries features that intersect with a point
 */
export const queryFeaturesByPoint = async (
  longitude: number,
  latitude: number,
  serviceUrl: string = ARCGIS_SERVICES.censusTracts
) => {
  const queryParams = new URLSearchParams({
    f: 'json',
    outFields: '*',
    geometryType: 'esriGeometryPoint',
    geometry: JSON.stringify({
      x: longitude,
      y: latitude,
      spatialReference: { wkid: 4326 }
    }),
    inSR: '4326',
    outSR: '4326',
    returnGeometry: 'true'
  });
  
  const url = `${serviceUrl}/query?${queryParams.toString()}`;
  
  try {
    console.log(`Querying ArcGIS by point at [${longitude}, ${latitude}]`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ArcGIS query failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.features?.length || 0} features at point`);
    return data.features || [];
  } catch (error) {
    console.error('Error querying ArcGIS by point:', error);
    return [];
  }
};

/**
 * Queries features that intersect with a polygon
 */
export const queryFeaturesByPolygon = async (
  polygonCoordinates: number[][], 
  serviceUrl: string = ARCGIS_SERVICES.censusTracts
) => {
  // Convert GeoJSON polygon coordinates to ArcGIS polygon format
  const rings = [polygonCoordinates.map(coord => [coord[0], coord[1]])];
  
  const queryParams = new URLSearchParams({
    f: 'json',
    outFields: '*',
    geometryType: 'esriGeometryPolygon',
    geometry: JSON.stringify({
      rings: rings,
      spatialReference: { wkid: 4326 }
    }),
    inSR: '4326',
    outSR: '4326',
    returnGeometry: 'true'
  });
  
  const url = `${serviceUrl}/query?${queryParams.toString()}`;
  
  try {
    console.log(`Querying ArcGIS by polygon with ${polygonCoordinates.length} points`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ArcGIS query failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.features?.length || 0} features in polygon`);
    return data.features || [];
  } catch (error) {
    console.error('Error querying ArcGIS by polygon:', error);
    return [];
  }
};

/**
 * Converts ArcGIS features to GeoJSON format
 */
export const arcGisToGeoJSON = (arcgisFeatures: any[]) => {
  if (!arcgisFeatures || arcgisFeatures.length === 0) {
    console.log('No features to convert to GeoJSON');
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
  
  console.log(`Converting ${arcgisFeatures.length} ArcGIS features to GeoJSON`);
  
  try {
    return {
      type: 'FeatureCollection',
      features: arcgisFeatures.map(feature => ({
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.attributes
      }))
    };
  } catch (error) {
    console.error('Error converting ArcGIS to GeoJSON:', error);
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
};
