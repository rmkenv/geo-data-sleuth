import { useState, useEffect } from 'react';
import { 
  TIGERWEB_SERVICES, 
  GEOGRAPHY_LEVELS,
  FALLBACK_GEOJSON,
  ARCGIS_SERVICES
} from '@/components/map/mapConstants';
import { toast } from '@/components/ui/use-toast';

export const useMapData = (
  selectedRegion: string | undefined,
  geographyLevel: string,
  selectedLayerService: string
) => {
  const [usGeoJson, setUsGeoJson] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching GeoJSON data for ${geographyLevel} from ${selectedLayerService}`);
        
        // Properly encode the where clause
        let whereClause = '1=1';
        if (selectedRegion && geographyLevel !== 'state') {
          if (geographyLevel === 'county') {
            whereClause = `STATE_FIPS='${selectedRegion}'`;
          } else if (geographyLevel === 'tract' || geographyLevel === 'blockGroup') {
            whereClause = `STATE='${selectedRegion}'`;
          } else if (geographyLevel === 'zip') {
            whereClause = `STATE_FIPS='${selectedRegion}'`;
          }
        }
        
        // Build the query URL with proper parameters
        const queryParams = new URLSearchParams({
          f: 'json', // Changed from 'geojson' to 'json' as some services might not support GeoJSON
          outFields: '*',
          where: whereClause,
          outSR: '4326', // Specify the spatial reference (WGS84)
          returnGeometry: 'true'
        });
        
        // Add geometry type and spatial reference
        const url = `${selectedLayerService}/query?${queryParams.toString()}`;
        console.log(`Request URL: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Convert ArcGIS JSON to GeoJSON format
        const geoJson = {
          type: 'FeatureCollection',
          features: data.features.map((feature: any) => ({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.attributes
          }))
        };
        
        console.log('GeoJSON data received:', geoJson.features ? `${geoJson.features.length} features` : 'No features');
        
        if (!geoJson.features || geoJson.features.length === 0) {
          throw new Error('No features found in response');
        }
        
        setUsGeoJson(geoJson);
        setIsMapLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        fetchFallbackGeoJson();
      }
    };
    
    const fetchFallbackGeoJson = () => {
      console.log('Using fallback GeoJSON source');
      let geoJsonUrl = FALLBACK_GEOJSON.states;
      
      if (geographyLevel === 'county') {
        geoJsonUrl = FALLBACK_GEOJSON.counties;
      } else if (geographyLevel === 'tract' || geographyLevel === 'blockGroup') {
        geoJsonUrl = FALLBACK_GEOJSON.tracts;
      } else if (geographyLevel === 'zip') {
        // No good fallback for zip codes, so we'll use states
        geoJsonUrl = FALLBACK_GEOJSON.states;
      }
      
      console.log(`Fetching fallback from: ${geoJsonUrl}`);
      
      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          console.log('Fallback data received:', data);
          setUsGeoJson(data);
          setIsMapLoaded(true);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(`Error loading fallback GeoJSON for ${geographyLevel}:`, error);
          setError(error instanceof Error ? error : new Error('Failed to load map data'));
          setIsLoading(false);
          
          // Create an empty GeoJSON as last resort
          setUsGeoJson({
            type: "FeatureCollection",
            features: []
          });
        });
    };
    
    fetchGeoJson();
  }, [selectedLayerService, geographyLevel, selectedRegion]);

  return { usGeoJson, isMapLoaded, isLoading, error };
};
