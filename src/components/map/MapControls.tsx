
import React from 'react';
import MapSearch from './MapSearch';
import MapLegend from './MapLegend';
import GeographyBreadcrumb from './GeographyBreadcrumb';
import { toast } from '@/components/ui/use-toast';
import { ARCGIS_SERVICES } from './mapConstants';
import BasemapToggle from './BasemapToggle';

interface MapControlsProps {
  geographyLevel: string;
  selectedRegion?: string;
  onRegionSelect?: (region: string, level: string) => void;
  onLayerChange: (serviceUrl: string, level: string) => void;
  onSearch: (results: any[]) => void;
  onToolChange: (tool: string) => void;
  onGranularityChange: (granularity: string) => void;
  onBasemapChange: (basemap: string) => void;
  currentBasemap: string;
}

const MapControls = ({
  geographyLevel,
  selectedRegion,
  onRegionSelect,
  onLayerChange,
  onSearch,
  onToolChange,
  onGranularityChange,
  onBasemapChange,
  currentBasemap
}: MapControlsProps) => {
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
      {/* Map search */}
      <div className="absolute top-0 left-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md w-64">
        <MapSearch 
          onSearchResults={onSearch}
          onToolChange={onToolChange}
          onGranularityChange={handleGranularityChange}
        />
      </div>

      {/* Basemap toggle */}
      <div className="absolute top-0 right-0 z-[1000] bg-white bg-opacity-90 p-2 m-2 rounded shadow-md">
        <BasemapToggle 
          currentBasemap={currentBasemap}
          onBasemapChange={onBasemapChange}
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
