
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

interface LassoToolProps {
  map: L.Map | null;
  active: boolean;
  onAreaSelected?: (geojson: any) => void;
}

const LassoTool = ({ map, active, onAreaSelected }: LassoToolProps) => {
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // Initialize feature group for drawn items
    drawnItemsRef.current = new L.FeatureGroup();
    map.addLayer(drawnItemsRef.current);
    
    // Initialize the draw control
    drawControlRef.current = new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true
        },
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: true
      }
    });
    
    // Only add the control if lasso is active
    if (active) {
      map.addControl(drawControlRef.current);
    }
    
    // Event handlers for drawn items
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      if (drawnItemsRef.current) {
        // Clear existing shapes
        drawnItemsRef.current.clearLayers();
        // Add the new layer
        drawnItemsRef.current.addLayer(layer);
        
        // Convert to GeoJSON
        const geojson = layer.toGeoJSON();
        if (onAreaSelected) {
          onAreaSelected(geojson);
        }
      }
    });
    
    map.on(L.Draw.Event.DELETED, () => {
      if (onAreaSelected) {
        onAreaSelected(null);
      }
    });
    
    return () => {
      if (map && drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      
      if (map && drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
      }
      
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.DELETED);
    };
  }, [map]);
  
  // Toggle draw control based on active state
  useEffect(() => {
    if (!map || !drawControlRef.current) return;
    
    if (active) {
      map.addControl(drawControlRef.current);
      // Start drawing polygon right away
      new L.Draw.Polygon(map).enable();
    } else {
      map.removeControl(drawControlRef.current);
    }
  }, [active, map]);
  
  return null;
};

export default LassoTool;
