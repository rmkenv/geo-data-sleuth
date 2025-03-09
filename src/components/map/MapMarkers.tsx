
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { Marker, Popup, useMap } from 'react-leaflet';

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
  const [results, setResults] = useState<any[]>(searchResults || []);
  const map = useMap();
  
  // Listen for custom events with search results
  useEffect(() => {
    const handleSearchResults = (e: CustomEvent) => {
      if (e.detail && Array.isArray(e.detail)) {
        setResults(e.detail);
        
        // If we have results, zoom to the first one
        if (e.detail.length > 0 && e.detail[0].center) {
          const [lng, lat] = e.detail[0].center;
          map.setView([lat, lng], 14);
        }
      }
    };
    
    window.addEventListener('map-search-results', handleSearchResults as EventListener);
    
    return () => {
      window.removeEventListener('map-search-results', handleSearchResults as EventListener);
    };
  }, [map]);
  
  // Update when props change
  useEffect(() => {
    if (searchResults && searchResults.length) {
      setResults(searchResults);
    }
  }, [searchResults]);
  
  if (!results.length) return null;
  
  return (
    <>
      {results.map((result, index) => (
        <Marker
          key={`search-result-${result.id || index}`}
          position={[result.center[1], result.center[0]]}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-sm">{result.place_name}</h3>
              {result.text && <p className="text-xs text-gray-600">{result.text}</p>}
              {result.match_type && (
                <p className="text-xs mt-1">
                  <span className="font-semibold">Match type:</span> {result.match_type}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
