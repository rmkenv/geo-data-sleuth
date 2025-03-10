
import React from 'react';
import { MapIcon, ImageIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface BasemapToggleProps {
  currentBasemap: string;
  onBasemapChange: (basemap: string) => void;
}

const BasemapToggle = ({ currentBasemap, onBasemapChange }: BasemapToggleProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium mb-1">Basemap</span>
      <ToggleGroup 
        type="single" 
        value={currentBasemap} 
        onValueChange={(value) => value && onBasemapChange(value)}
        className="bg-white rounded border border-gray-200"
      >
        <ToggleGroupItem value="osm" aria-label="OpenStreetMap" className="flex items-center px-2 py-1">
          <MapIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">Map</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="satellite" aria-label="Satellite" className="flex items-center px-2 py-1">
          <ImageIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">Satellite</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default BasemapToggle;
