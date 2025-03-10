
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface GranularitySelectorProps {
  granularity: string;
  onGranularityChange: (granularity: string) => void;
}

const GranularitySelector = ({ 
  granularity, 
  onGranularityChange 
}: GranularitySelectorProps) => {
  const handleGranularityChange = (value: string) => {
    if (value) {
      onGranularityChange(value);
    }
  };

  return (
    <ToggleGroup 
      type="single" 
      value={granularity}
      onValueChange={handleGranularityChange}
      className="gap-1"
    >
      <ToggleGroupItem value="zip" size="sm" className="text-xs px-2 py-1 h-8">
        ZIP Code
      </ToggleGroupItem>
      <ToggleGroupItem value="tract" size="sm" className="text-xs px-2 py-1 h-8">
        Census Tract
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default GranularitySelector;
