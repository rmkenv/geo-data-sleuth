
import { useState, useEffect } from 'react';
import { TIGERWEB_SERVICES, GEOGRAPHY_LEVELS } from '@/components/map/mapConstants';

export const useMapData = (
  selectedRegion: string | undefined,
  geographyLevel: string,
  selectedLayerService: string
) => {
  const [usGeoJson, setUsGeoJson] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load GeoJSON data from TIGERweb services
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        setIsMapLoaded(false);
        console.log(`Fetching GeoJSON data for ${geographyLevel} from ${selectedLayerService}`);
        
        // Build the query URL for the ArcGIS REST service
        const queryParams = new URLSearchParams({
          f: 'geojson',
          outFields: '*',
          where: '1=1' // Get all features
        });
        
        if (selectedRegion && geographyLevel !== 'state') {
          // If a region is selected and we're not at the state level,
          // filter by the parent geography
          queryParams.set('where', `STATE='${selectedRegion}'`);
          console.log(`Filtering by STATE=${selectedRegion}`);
        }
        
        const url = `${selectedLayerService}/query?${queryParams.toString()}`;
        console.log(`Request URL: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GeoJSON data received:', data.features ? `${data.features.length} features` : 'No features');
        setUsGeoJson(data);
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        // Fallback to the original GitHub hosted files if the TIGERweb service fails
        fetchFallbackGeoJson();
      }
    };
    
    const fetchFallbackGeoJson = () => {
      console.log('Using fallback GeoJSON source');
      let geoJsonUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
      
      if (geographyLevel === 'county' && selectedRegion) {
        geoJsonUrl = `https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/AL-01-alabama-counties.json`;
      } else if (geographyLevel === 'tract' && selectedRegion) {
        geoJsonUrl = 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json';
      }
      
      console.log(`Fetching fallback from: ${geoJsonUrl}`);
      
      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          console.log('Fallback data received:', data);
          setUsGeoJson(data);
          setIsMapLoaded(true);
        })
        .catch(error => {
          console.error(`Error loading fallback GeoJSON for ${geographyLevel}:`, error);
        });
    };
    
    fetchGeoJson();
  }, [selectedLayerService, geographyLevel, selectedRegion]);

  return { usGeoJson, isMapLoaded };
};
