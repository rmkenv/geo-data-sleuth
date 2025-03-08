
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from './Loader';
import { formatValue } from '@/lib/census';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
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
}

const Map = ({ data, variable, format, isLoading = false, title = 'Geographic Distribution' }: MapProps) => {
  const [usGeoJson, setUsGeoJson] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load US GeoJSON data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(response => response.json())
      .then(data => {
        setUsGeoJson(data);
        setIsMapLoaded(true);
      })
      .catch(error => {
        console.error('Error loading US GeoJSON:', error);
      });
  }, []);

  // Style function for states
  const getStateStyle = (feature: any) => {
    if (!data || !variable) {
      return {
        fillColor: '#b3e5fc',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }

    // Find data for this state
    const stateData = data.find((item: any) => 
      item.NAME && feature.properties.name && 
      item.NAME.includes(feature.properties.name)
    );

    // Get value for choropleth
    const value = stateData ? stateData[variable] : 0;
    
    // Color scale based on value (simple implementation)
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

  // Handle feature properties
  const onEachFeature = (feature: any, layer: any) => {
    if (!data || !variable) return;

    const stateData = data.find((item: any) => 
      item.NAME && feature.properties.name && 
      item.NAME.includes(feature.properties.name)
    );

    if (stateData && stateData[variable]) {
      const formattedValue = formatValue(stateData[variable], format);
      layer.bindTooltip(`<strong>${feature.properties.name}</strong><br/>${formattedValue}`);
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
              center={[39.8283, -98.5795]} 
              zoom={3.5} 
              style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}
              zoomControl={true}
              attributionControl={true}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {usGeoJson && (
                <GeoJSON 
                  data={usGeoJson} 
                  style={getStateStyle}
                  onEachFeature={onEachFeature}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
