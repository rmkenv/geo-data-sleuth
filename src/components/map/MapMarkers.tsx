
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { toast } from '@/components/ui/use-toast';

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
    const mapElements = document.querySelectorAll('.leaflet-container');
    if (!mapElements || mapElements.length === 0) {
      console.log('No map containers found on the page');
      return;
    }
    
    // Try to find the map container with _leaflet_instance
    let mapInstance: L.Map | null = null;
    
    for (let i = 0; i < mapElements.length; i++) {
      const element = mapElements[i] as any;
      if (element._leaflet_instance) {
        mapInstance = element._leaflet_instance;
        break;
      }
    }
    
    if (!mapInstance) {
      console.error('Leaflet map instance not found');
      return;
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance?.removeLayer(marker);
    });
    markersRef.current = [];
    
    if (!searchResults || searchResults.length === 0) {
      console.log('No search results to display');
      return;
    }
    
    // Add new markers
    searchResults.forEach((result, index) => {
      if (result.center && result.center.length === 2) {
        console.log(`Adding marker at coordinates: [${result.center[1]}, ${result.center[0]}]`);
        
        try {
          // Ensure we're using [lat, lng] for markers (Leaflet convention)
          const marker = L.marker(
            [result.center[1], result.center[0]], 
            { icon: DefaultIcon }
          ).addTo(mapInstance!);
          
          // Add popup to marker
          marker.bindPopup(`
            <div class="p-1">
              <h3 class="font-bold text-sm">${result.place_name || 'Location'}</h3>
              ${result.text ? `<p class="text-xs text-gray-600">${result.text}</p>` : ''}
              ${result.match_type ? `<p class="text-xs mt-1"><span class="font-semibold">Match type:</span> ${result.match_type}</p>` : ''}
              <p class="text-xs mt-1">Coordinates: ${result.center[1].toFixed(4)}, ${result.center[0].toFixed(4)}</p>
            </div>
          `);
          
          markersRef.current.push(marker);
          marker.openPopup(); // Automatically open the popup for the first result
        } catch (error) {
          console.error('Error adding marker:', error);
          toast({
            title: "Error adding marker",
            description: "There was a problem displaying the location on the map",
            variant: "destructive",
          });
        }
      } else {
        console.error('Invalid coordinates in search result:', result);
      }
    });
    
    // If we have results, zoom to the first one
    if (searchResults.length > 0 && searchResults[0].center) {
      const [lng, lat] = searchResults[0].center;
      try {
        mapInstance.setView([lat, lng], 12);
        console.log(`Map view updated to ${lat}, ${lng} at zoom 12`);
      } catch (error) {
        console.error('Error updating map view:', error);
      }
    }
    
    // Cleanup
    return () => {
      if (mapInstance) {
        markersRef.current.forEach(marker => {
          try {
            mapInstance?.removeLayer(marker);
          } catch (error) {
            console.error('Error removing marker:', error);
          }
        });
        markersRef.current = [];
        console.log('All markers removed');
      }
    };
  }, [searchResults]);
  
  return null;
};

export default MapMarkers;
