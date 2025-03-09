
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
  const markersRef = useRef<L.Marker[]>([]);
  
  // Effect to manage markers
  useEffect(() => {
    console.log('MapMarkers: Processing search results', searchResults);

    // Find the map instance
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
      console.log('Map container not found');
      return;
    }
    
    // Access the map instance safely with type assertion
    const mapInstance = (mapContainer as any)._leaflet_instance;
    if (!mapInstance) {
      console.log('Leaflet map instance not found');
      return;
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.removeLayer(marker);
    });
    markersRef.current = [];
    
    if (!searchResults || searchResults.length === 0) {
      console.log('No search results to display');
      return;
    }
    
    // Add new markers
    searchResults.forEach((result, index) => {
      if (result.center && result.center.length === 2) {
        console.log(`Adding marker at ${result.center[1]}, ${result.center[0]}`);
        
        try {
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
        } catch (error) {
          console.error('Error adding marker:', error);
        }
      }
    });
    
    // If we have results, zoom to the first one
    if (searchResults.length > 0 && searchResults[0].center) {
      const [lng, lat] = searchResults[0].center;
      mapInstance.setView([lat, lng], 14);
      console.log(`Map view updated to ${lat}, ${lng} at zoom 14`);
    }
    
    // Cleanup
    return () => {
      if (mapInstance) {
        markersRef.current.forEach(marker => {
          mapInstance.removeLayer(marker);
        });
        markersRef.current = [];
        console.log('All markers removed');
      }
    };
  }, [searchResults]);
  
  return null;
};

export default MapMarkers;
