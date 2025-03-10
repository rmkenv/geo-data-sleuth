
import React from 'react';
import { Button } from '../ui/button';
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
      <ToggleGroup type="single" value={currentBasemap} onValueChange={(value) => value && onBasemapChange(value)}>
        <ToggleGroupItem value="osm" aria-label="OpenStreetMap">
          <MapIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">Map</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="satellite" aria-label="Satellite">
          <ImageIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">Satellite</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default BasemapToggle;
