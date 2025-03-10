
import React from 'react';
import { GEOGRAPHY_LEVELS } from './mapConstants';
import MapLayerSelector from './MapLayerSelector';
import MapSearch from './MapSearch';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import { toast } from '@/components/ui/use-toast';
import { ARCGIS_SERVICES } from './mapConstants';

interface MapControlsProps {
  geographyLevel: string;
  selectedRegion?: string;
  onRegionSelect?: (region: string, level: string) => void;
  onLayerChange: (serviceUrl: string, level: string) => void;
  onSearch: (results: any[]) => void;
  onToolChange: (tool: string) => void;
  onGranularityChange: (granularity: string) => void;
}

const MapControls = ({
  geographyLevel,
  selectedRegion,
  onRegionSelect,
  onLayerChange,
  onSearch,
  onToolChange,
  onGranularityChange
}: MapControlsProps) => {
  // Handle layer selection
  const handleLayerChange = (serviceUrl: string, level: string) => {
    console.log(`Layer changed to ${level} with service: ${serviceUrl}`);
    onLayerChange(serviceUrl, level);
    if (onRegionSelect) {
      onRegionSelect('', level);
    }
  };

  // Handle granularity change
  const handleGranularityChange = (granularity: string) => {
    onGranularityChange(granularity);
    
    // Notification
    toast({
      title: "Data granularity changed",
      description: `Data will be displayed at ${granularity === 'zip' ? 'ZIP code' : 'Census tract'} level`,
      variant: "default",
    });
  };

  return (
    <>
      {/* Map layer selector */}
      <div className="absolute top-0 right-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md">
        <MapLayerSelector 
          levels={GEOGRAPHY_LEVELS}
          currentLevel={geographyLevel} 
          onLayerChange={handleLayerChange}
        />
      </div>
      
      {/* Map search */}
      <div className="absolute top-0 left-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md w-64">
        <MapSearch 
          onSearchResults={onSearch}
          onToolChange={onToolChange}
          onGranularityChange={handleGranularityChange}
        />
      </div>

      {/* Map legend */}
      <MapLegend />
      
      {/* Geography breadcrumb */}
      {selectedRegion && onRegionSelect && (
        <GeographyBreadcrumb 
          selectedRegion={selectedRegion} 
          geographyLevel={geographyLevel} 
          onRegionSelect={onRegionSelect} 
        />
      )}
    </>
  );
};

export default MapControls;
