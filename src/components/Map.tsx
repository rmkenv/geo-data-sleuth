
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from './Loader';
import { formatValue } from '@/lib/census';

interface MapProps {
  data?: any[];
  variable?: string;
  format?: string;
  isLoading?: boolean;
  title?: string;
}

// Placeholder component for the map - in a real app, you'd use a mapping library like Mapbox or Leaflet
const Map = ({ data, variable, format, isLoading = false, title = 'Geographic Distribution' }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full h-full overflow-hidden animate-fade-in glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative overflow-hidden h-[calc(100%-3.5rem)]">
        {(isLoading || !isMapLoaded) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-blue-50">
              {/* Map placeholder with gradient */}
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 rounded-b-lg"
                ref={mapContainerRef}
              >
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <p className="text-center max-w-xs">
                    Interactive map visualization will appear here with geographic data
                  </p>
                </div>
                
                {/* State outlines (simplified placeholder) */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 800 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <path d="M200,100 L300,120 L350,180 L290,250 L180,240 L150,190 Z" 
                          className="fill-primary/20 stroke-primary/40" strokeWidth="2" />
                    <path d="M350,180 L410,160 L470,200 L450,270 L370,290 L290,250 Z" 
                          className="fill-primary/30 stroke-primary/40" strokeWidth="2" />
                    <path d="M180,240 L290,250 L370,290 L340,370 L220,340 L160,290 Z" 
                          className="fill-primary/40 stroke-primary/40" strokeWidth="2" />
                    <path d="M410,160 L520,140 L580,190 L560,260 L470,200 Z" 
                          className="fill-primary/25 stroke-primary/40" strokeWidth="2" />
                    <path d="M470,200 L560,260 L540,330 L450,370 L370,290 L450,270 Z" 
                          className="fill-primary/35 stroke-primary/40" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 p-3 glass rounded-lg">
              <div className="text-xs font-medium mb-2">Legend</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary/20 rounded-sm"></div>
                <span className="text-xs">Lowest</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary/40 rounded-sm"></div>
                <span className="text-xs">Highest</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
