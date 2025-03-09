
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapController from './MapController';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import { getRegionStyle } from './mapStyles';
import { createFeatureHandlers } from './featureHandlers';
import MapSearch from './MapSearch';
import MapLayerSelector from './MapLayerSelector';

// Fix for default marker icons in Leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Census TIGERweb Services
export const TIGERWEB_SERVICES = {
  states: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1',
  counties: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/3',
  tracts: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/2',
  blockGroups: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/3',
  blocks: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/10'
};

export const GEOGRAPHY_LEVELS = [
  { id: 'state', name: 'States', service: TIGERWEB_SERVICES.states },
  { id: 'county', name: 'Counties', service: TIGERWEB_SERVICES.counties },
  { id: 'tract', name: 'Census Tracts', service: TIGERWEB_SERVICES.tracts },
  { id: 'blockGroup', name: 'Block Groups', service: TIGERWEB_SERVICES.blockGroups },
  { id: 'block', name: 'Census Blocks', service: TIGERWEB_SERVICES.blocks }
];

interface LeafletMapProps {
  data?: any[];
  variable?: string;
  format?: string;
  selectedRegion?: string;
  geographyLevel?: string;
  onRegionSelect?: (region: string, level: string) => void;
}

const LeafletMap = ({ 
  data, 
  variable, 
  format, 
  selectedRegion,
  geographyLevel = 'state',
  onRegionSelect
}: LeafletMapProps) => {
  const [usGeoJson, setUsGeoJson] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLayerService, setSelectedLayerService] = useState(TIGERWEB_SERVICES.states);

  // Get the current geography level service
  useEffect(() => {
    const currentLevel = GEOGRAPHY_LEVELS.find(level => level.id === geographyLevel);
    if (currentLevel) {
      setSelectedLayerService(currentLevel.service);
    }
  }, [geographyLevel]);

  // Load GeoJSON data from TIGERweb services
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        setIsMapLoaded(false);
        
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
        }
        
        const url = `${selectedLayerService}/query?${queryParams.toString()}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setUsGeoJson(data);
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        // Fallback to the original GitHub hosted files if the TIGERweb service fails
        fetchFallbackGeoJson();
      }
    };
    
    const fetchFallbackGeoJson = () => {
      let geoJsonUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
      
      if (geographyLevel === 'county' && selectedRegion) {
        geoJsonUrl = `https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/AL-01-alabama-counties.json`;
      } else if (geographyLevel === 'zip' && selectedRegion) {
        geoJsonUrl = 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json';
      }
      
      fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
          setUsGeoJson(data);
          setIsMapLoaded(true);
        })
        .catch(error => {
          console.error(`Error loading fallback GeoJSON for ${geographyLevel}:`, error);
        });
    };
    
    fetchGeoJson();
  }, [selectedLayerService, geographyLevel, selectedRegion]);

  // Update map center and zoom based on selected region
  useEffect(() => {
    if (selectedRegion) {
      // Zoom level based on geography level
      if (geographyLevel === 'state') {
        setZoomLevel(6);
        // Example coordinates for a state (e.g., California)
        setMapCenter([36.7783, -119.4179]);
      } else if (geographyLevel === 'county') {
        setZoomLevel(8);
        // Example coordinates for a county
        setMapCenter([37.7749, -122.4194]);
      } else if (geographyLevel === 'tract' || geographyLevel === 'blockGroup') {
        setZoomLevel(10);
        // Example coordinates for a tract/block group
        setMapCenter([37.7749, -122.4194]);
      } else if (geographyLevel === 'block') {
        setZoomLevel(12);
        setMapCenter([37.7749, -122.4194]);
      }
    } else {
      // Reset to US view
      setMapCenter([39.8283, -98.5795]);
      setZoomLevel(4);
    }
  }, [selectedRegion, geographyLevel]);

  // Handle search results
  const handleSearch = (results: any[]) => {
    setSearchResults(results);
    if (results.length > 0) {
      // Center map on first result
      const [lng, lat] = results[0].center;
      setMapCenter([lat, lng]);
      setZoomLevel(12);
    }
  };

  // Handle layer selection
  const handleLayerChange = (serviceUrl: string, level: string) => {
    setSelectedLayerService(serviceUrl);
    if (onRegionSelect) {
      // Reset the region selection when changing layers
      onRegionSelect('', level);
    }
  };

  if (!isMapLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get style function for regions
  const regionStyleFunction = getRegionStyle(data, variable, geographyLevel);
  
  // Get event handlers for features
  const onEachFeatureFunction = createFeatureHandlers(data, variable, format, geographyLevel, onRegionSelect);

  // These props are actually valid for react-leaflet v4, but TypeScript is not recognizing them properly
  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <MapController center={mapCenter} zoom={zoomLevel} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {usGeoJson && (
          <GeoJSON 
            key={`${variable}-${geographyLevel}-${selectedRegion}`} // Force re-render when these change
            data={usGeoJson}
            pathOptions={regionStyleFunction({})}
            eventHandlers={{
              click: (e) => {
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
              },
              mouseover: (e) => {
                const layer = e.sourceTarget;
                layer.setStyle({
                  weight: 2,
                  color: '#666',
                  dashArray: '',
                  fillOpacity: 0.9
                });
              },
              mouseout: (e) => {
                const layer = e.sourceTarget;
                layer.setStyle(regionStyleFunction(e.sourceTarget.feature));
              }
            }}
          />
        )}
        
        {/* Render search result markers */}
        {searchResults.map((result, index) => (
          <L.Marker
            key={`search-result-${index}`}
            position={[result.center[1], result.center[0]]}
            icon={DefaultIcon}
          >
            <L.Popup>
              <div>
                <h3 className="font-bold">{result.place_name}</h3>
                <p>{result.text}</p>
              </div>
            </L.Popup>
          </L.Marker>
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      <div className="absolute top-0 right-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md">
        <MapLayerSelector 
          levels={GEOGRAPHY_LEVELS}
          currentLevel={geographyLevel} 
          onLayerChange={handleLayerChange}
        />
      </div>
      
      <div className="absolute top-0 left-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md w-64">
        <MapSearch onSearchResults={handleSearch} />
      </div>

      <MapLegend />
      
      {selectedRegion && onRegionSelect && (
        <GeographyBreadcrumb 
          selectedRegion={selectedRegion} 
          geographyLevel={geographyLevel} 
          onRegionSelect={onRegionSelect} 
        />
      )}
    </div>
  );
};

export default LeafletMap;
