import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapMarkersProps {
  searchResults: any[];
}

const MapMarkers = ({ searchResults }: MapMarkersProps) => {
  const [results, setResults] = useState<any[]>(searchResults || []);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Effect to manage markers
  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        marker.remove();
      });
      markersRef.current = [];
      return;
    }
    
    // Find the map instance
    document.querySelectorAll('.leaflet-container').forEach((container) => {
      const mapInstance = L.DomUtil.get(container as HTMLElement)?.__leaflet_instance__;
      
      if (mapInstance) {
        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapInstance.removeLayer(marker);
        });
        markersRef.current = [];
        
        // Add new markers
        searchResults.forEach((result, index) => {
          if (result.center && result.center.length === 2) {
            const marker = L.marker(
              [result.center[1], result.center[0]], 
              { icon: DefaultIcon }
            ).addTo(mapInstance);
            
            // Add popup to marker
            marker.bindPopup(`
              <div class="p-1">
                <h3 class="font-bold text-sm">${result.place_name || 'Location'}</h3>
                ${result.text ? `<p class="text-xs text-gray-600">${result.text}</p>` : ''}
                ${result.match_type ? `<p class="text-xs mt-1"><span class="font-semibold">Match type:</span> ${result.match_type}</p>` : ''}
              </div>
            `);
            
            markersRef.current.push(marker);
          }
        });
        
        // If we have results, zoom to the first one
        if (searchResults.length > 0 && searchResults[0].center) {
          const [lng, lat] = searchResults[0].center;
          mapInstance.setView([lat, lng], 14);
        }
      }
    });
    
    // Update state
    setResults(searchResults);
    
    // Cleanup
    return () => {
      markersRef.current.forEach(marker => {
        marker.remove();
      });
      markersRef.current = [];
    };
  }, [searchResults]);
  
  return null;
};

export default MapMarkers;
