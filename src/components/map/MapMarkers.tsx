
import React from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

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

interface MapMarkersProps {
  searchResults: any[];
}

const MapMarkers = ({ searchResults }: MapMarkersProps) => {
  if (!searchResults.length) return null;
  
  return (
    <>
      {searchResults.map((result, index) => (
        <Marker
          key={`search-result-${index}`}
          position={[result.center[1], result.center[0]]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{result.place_name}</h3>
              <p>{result.text}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
