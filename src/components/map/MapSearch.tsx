
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import SearchBar from './SearchBar';
import ToolSelector from './ToolSelector';
import GranularitySelector from './GranularitySelector';

interface MapSearchProps {
  onSearchResults: (results: any[]) => void;
  onToolChange?: (tool: string) => void;
  onGranularityChange?: (granularity: string) => void;
}

const MapSearch = ({ 
  onSearchResults,
  onToolChange,
  onGranularityChange 
}: MapSearchProps) => {
  const [activeTool, setActiveTool] = useState('pan');
  const [granularity, setGranularity] = useState('tract');

  const handleSearchResults = (results: any[]) => {
    onSearchResults(results);
    
    // If we have block info, show it in a toast
    if (results[0]?.blockInfo) {
      const block = results[0].blockInfo;
      toast({
        title: "Location information",
        description: `Census Block: ${block.attributes?.GEOID || 'Unknown'}`,
        variant: "default",
      });
    }
  };

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId);
    if (onToolChange) {
      onToolChange(toolId);
    }
  };

  const handleGranularityChange = (value: string) => {
    setGranularity(value);
    if (onGranularityChange) {
      onGranularityChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <SearchBar onSearchResults={handleSearchResults} />
      
      <div className="flex justify-between items-center">
        <ToolSelector 
          activeTool={activeTool} 
          onToolChange={handleToolChange} 
        />
        
        <GranularitySelector 
          granularity={granularity} 
          onGranularityChange={handleGranularityChange} 
        />
      </div>
    </div>
  );
};

export default MapSearch;
