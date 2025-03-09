
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapController from './MapController';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import { getRegionStyle } from './mapStyles';
import { createFeatureHandlers } from './featureHandlers';

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

  if (!isMapLoaded) {
    return null;
  }

  // Get style function for regions
  const regionStyleFunction = getRegionStyle(data, variable, geographyLevel);
  
  // Get event handlers for features
  const onEachFeatureFunction = createFeatureHandlers(data, variable, format, geographyLevel, onRegionSelect);

  return (
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
            pathOptions={regionStyleFunction({})}
            eventHandlers={{
              eachFeature: onEachFeatureFunction
            }}
          />
        )}
      </MapContainer>

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
