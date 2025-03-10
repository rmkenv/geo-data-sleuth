
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

  // Load GeoJSON data from ArcGIS services
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching GeoJSON data for ${geographyLevel} from ${selectedLayerService}`);
        
        // Build the query URL for the service
        const queryParams = new URLSearchParams({
          f: 'geojson',
          outFields: '*',
          where: '1=1' // Get all features
        });
        
        if (selectedRegion && geographyLevel !== 'state') {
          // If a region is selected and we're not at the state level,
          // filter by the parent geography
          if (geographyLevel === 'county') {
            queryParams.set('where', `STATE_FIPS='${selectedRegion}'`);
          } else if (geographyLevel === 'tract' || geographyLevel === 'blockGroup') {
            queryParams.set('where', `STATE='${selectedRegion}'`);
          } else if (geographyLevel === 'block') {
            queryParams.set('where', `STATE='${selectedRegion}'`);
          } else if (geographyLevel === 'zip') {
            // ZIP codes don't usually have state field in the same way
            queryParams.set('where', `STATE_FIPS='${selectedRegion}'`);
          }
          console.log(`Filtering by STATE=${selectedRegion}`);
        }
        
        // Limit the number of features to avoid performance issues
        queryParams.set('resultRecordCount', '1000');
        
        const url = `${selectedLayerService}/query?${queryParams.toString()}`;
        console.log(`Request URL: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GeoJSON data received:', data.features ? `${data.features.length} features` : 'No features');
        
        if (!data.features || data.features.length === 0) {
          throw new Error('No features found in response');
        }
        
        setUsGeoJson(data);
        setIsMapLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        // Show a toast notification
        toast({
          title: "Geographic data service unavailable",
          description: "Using fallback data sources",
          variant: "default",
        });
        // Fallback to the original GitHub hosted files if the service fails
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
