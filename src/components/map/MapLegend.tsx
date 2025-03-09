
import React from 'react';

const MapLegend = () => {
  return (
    <div className="absolute bottom-4 right-4 p-3 glass rounded-lg z-[1000]">
      <div className="text-xs font-medium mb-2">Legend</div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-[#b3e5fc] rounded-sm"></div>
        <span className="text-xs">Lowest</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-[#084c61] rounded-sm"></div>
        <span className="text-xs">Highest</span>
      </div>
    </div>
  );
};

export default MapLegend;
