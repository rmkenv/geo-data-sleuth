
import React from 'react';

interface GeographyBreadcrumbProps {
  selectedRegion: string | undefined;
  geographyLevel: string;
  onRegionSelect: (region: string, level: string) => void;
}

const GeographyBreadcrumb = ({ 
  selectedRegion, 
  geographyLevel, 
  onRegionSelect 
}: GeographyBreadcrumbProps) => {
  if (!selectedRegion) return null;
  
  return (
    <div className="absolute top-4 left-4 p-2 glass rounded-lg z-[1000]">
      <div className="flex items-center space-x-2 text-xs">
        <button 
          onClick={() => onRegionSelect('', 'state')}
          className="hover:underline"
        >
          USA
        </button>
        {geographyLevel !== 'state' && (
          <>
            <span>/</span>
            <button 
              onClick={() => onRegionSelect(selectedRegion.split('-')[0], 'state')}
              className="hover:underline"
            >
              {selectedRegion.split('-')[0]}
            </button>
          </>
        )}
        {geographyLevel === 'zip' && (
          <>
            <span>/</span>
            <button 
              onClick={() => onRegionSelect(selectedRegion.split('-')[1], 'county')}
              className="hover:underline"
            >
              {selectedRegion.split('-')[1]}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GeographyBreadcrumb;
