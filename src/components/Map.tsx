
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from './Loader';
import { formatValue } from '@/lib/census';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack/vite
// This is needed because Leaflet's default icons reference assets that aren't properly bundled
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  data?: any[];
  variable?: string;
  format?: string;
  isLoading?: boolean;
  title?: string;
  onRegionSelect?: (region: string, level: string) => void;
  selectedRegion?: string;
  geographyLevel?: string;
}

// Component to handle map center and zoom changes
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const Map = ({ 
  data, 
  variable, 
  format, 
  isLoading = false, 
  title = 'Geographic Distribution',
  onRegionSelect,
  selectedRegion,
  geographyLevel = 'state'
}: MapProps) => {
  const [usGeoJson, setUsGeoJson] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [zoomLevel, setZoomLevel] = useState(4);

  // Load appropriate GeoJSON data based on geography level
  useEffect(() => {
    let geoJsonUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
    
    if (geographyLevel === 'county' && selectedRegion) {
      // This is a placeholder URL - in a real app, we would load county data for the selected state
      geoJsonUrl = `https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/AL-01-alabama-counties.json`;
    } else if (geographyLevel === 'zip' && selectedRegion) {
      // Placeholder for ZIP code data
      geoJsonUrl = 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json';
    }
    
    fetch(geoJsonUrl)
      .then(response => response.json())
      .then(data => {
        setUsGeoJson(data);
        setIsMapLoaded(true);
      })
      .catch(error => {
        console.error(`Error loading GeoJSON for ${geographyLevel}:`, error);
      });
  }, [geographyLevel, selectedRegion]);

  // Update map center and zoom based on selected region
  useEffect(() => {
    if (selectedRegion) {
      // These would be replaced with actual coordinates for the selected region
      if (geographyLevel === 'state') {
        setZoomLevel(6);
        // Example coordinates for a state (e.g., California)
        setMapCenter([36.7783, -119.4179]);
      } else if (geographyLevel === 'county') {
        setZoomLevel(8);
        // Example coordinates for a county
        setMapCenter([37.7749, -122.4194]);
      } else if (geographyLevel === 'zip') {
        setZoomLevel(10);
        // Example coordinates for a ZIP code
        setMapCenter([37.7749, -122.4194]);
      }
    } else {
      // Reset to US view
      setMapCenter([39.8283, -98.5795]);
      setZoomLevel(4);
    }
  }, [selectedRegion, geographyLevel]);

  // Style function for regions
  const getRegionStyle = (feature: any) => {
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

  // Event handlers for features
  const onEachFeatureFunc = (feature: any, layer: any) => {
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

  return (
    <Card className="w-full h-full overflow-hidden animate-fade-in glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative overflow-hidden h-[calc(100%-3.5rem)]">
        {(isLoading || !isMapLoaded) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader />
          </div>
        ) : (
          <div className="h-full w-full">
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
                  pathOptions={getRegionStyle({})}
                  eventHandlers={{
                    eachFeature: onEachFeatureFunc
                  }}
                />
              )}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 p-3 glass rounded-lg z-[1000]">
              <div className="text-xs font-medium mb-2">Legend</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#b3e5fc] rounded-sm"></div>
                <span className="text-xs">Lowest</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#084c61] rounded-sm"></div>
                <span className="text-xs">Highest</span>
              </div>
            </div>
            
            {/* Geography level breadcrumb navigation */}
            {selectedRegion && (
              <div className="absolute top-4 left-4 p-2 glass rounded-lg z-[1000]">
                <div className="flex items-center space-x-2 text-xs">
                  <button 
                    onClick={() => onRegionSelect && onRegionSelect('', 'state')}
                    className="hover:underline"
                  >
                    USA
                  </button>
                  {geographyLevel !== 'state' && (
                    <>
                      <span>/</span>
                      <button 
                        onClick={() => onRegionSelect && onRegionSelect(selectedRegion.split('-')[0], 'state')}
                        className="hover:underline"
                      >
                        {selectedRegion.split('-')[0]}
                      </button>
                    </>
                  )}
                  {geographyLevel === 'zip' && (
                    <>
                      <span>/</span>
                      <button 
                        onClick={() => onRegionSelect && onRegionSelect(selectedRegion.split('-')[1], 'county')}
                        className="hover:underline"
                      >
                        {selectedRegion.split('-')[1]}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
