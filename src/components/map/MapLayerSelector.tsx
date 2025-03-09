
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layers } from 'lucide-react';

interface MapLayerSelectorProps {
  levels: Array<{
    id: string;
    name: string;
    service: string;
  }>;
  currentLevel: string;
  onLayerChange: (serviceUrl: string, level: string) => void;
}

const MapLayerSelector = ({ 
  levels, 
  currentLevel, 
  onLayerChange 
}: MapLayerSelectorProps) => {
  const handleChange = (value: string) => {
    const selectedLevel = levels.find(level => level.id === value);
    if (selectedLevel) {
      onLayerChange(selectedLevel.service, selectedLevel.id);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground flex items-center gap-1">
        <Layers className="h-3 w-3" />
        Geography Level
      </label>
      <Select
        value={currentLevel}
        onValueChange={handleChange}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Select geography level" />
        </SelectTrigger>
        <SelectContent>
          {levels.map((level) => (
            <SelectItem key={level.id} value={level.id} className="text-sm">
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapLayerSelector;
