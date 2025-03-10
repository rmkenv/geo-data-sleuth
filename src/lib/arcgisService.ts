
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
    f: 'geojson',
    outFields: '*',
    where: where,
    resultRecordCount: limit.toString()
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
    outSR: '4326'
  });
  
  const url = `${serviceUrl}/query?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ArcGIS query failed with status: ${response.status}`);
    }
    
    const data = await response.json();
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
    outSR: '4326'
  });
  
  const url = `${serviceUrl}/query?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ArcGIS query failed with status: ${response.status}`);
    }
    
    const data = await response.json();
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
  return {
    type: 'FeatureCollection',
    features: arcgisFeatures.map(feature => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: feature.attributes
    }))
  };
};
