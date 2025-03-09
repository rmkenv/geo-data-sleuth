
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from './Loader';
import LeafletMap from './map/LeafletMap';

interface MapProps {
  data?: any[];
  variable?: string;
  format?: string;
  isLoading?: boolean;
  title?: string;
  onRegionSelect?: (region: string, level: string) => void;
  selectedRegion?: string;
  geographyLevel?: string;
}

const Map = ({ 
  data, 
  variable, 
  format, 
  isLoading = false, 
  title = 'Geographic Distribution',
  onRegionSelect,
  selectedRegion,
  geographyLevel = 'state'
}: MapProps) => {
  return (
    <Card className="w-full h-full overflow-hidden animate-fade-in glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative overflow-hidden h-[calc(100%-3.5rem)]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader />
          </div>
        ) : (
          <LeafletMap
            data={data}
            variable={variable}
            format={format}
            selectedRegion={selectedRegion}
            geographyLevel={geographyLevel}
            onRegionSelect={onRegionSelect}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
