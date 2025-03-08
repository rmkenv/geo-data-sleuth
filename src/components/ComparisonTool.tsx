
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CENSUS_VARIABLES, formatValue } from '@/lib/census';
import { LocationComparison } from '@/types/census';
import { useComparisonData } from '@/hooks/useCensusData';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from './Loader';
import { X } from 'lucide-react';

interface ComparisonToolProps {
  data?: any[];
  isLoading?: boolean;
  locations?: LocationComparison[];
  onAddLocation?: (location: any) => void;
  onRemoveLocation?: (locationId: string) => void;
}

// Color palette for different locations
const LOCATION_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#65a30d'
];

const ComparisonTool = ({ 
  data, 
  isLoading = false,
  locations = [],
  onAddLocation,
  onRemoveLocation
}: ComparisonToolProps) => {
  const [selectedVariable, setSelectedVariable] = useState(CENSUS_VARIABLES[0].id);

  const variable = CENSUS_VARIABLES.find(v => v.id === selectedVariable);
  
  // Fetch comparison data
  const { 
    data: comparisonData, 
    isLoading: isLoadingComparison 
  } = useComparisonData(locations, selectedVariable);
  
  // Format data for chart
  const chartData = Object.values(comparisonData || {}).map((item: any) => {
    if (!item || !item.data) return null;
    
    return {
      name: item.name,
      value: item.data[selectedVariable],
      id: item.id,
      color: item.color
    };
  }).filter(Boolean);

  return (
    <Card className="w-full overflow-hidden animate-fade-in glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Location Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select Variable</label>
          <Select value={selectedVariable} onValueChange={setSelectedVariable}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {CENSUS_VARIABLES.map((variable) => (
                <SelectItem key={variable.id} value={variable.id}>
                  {variable.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Locations */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Comparing {locations.length} Locations</h4>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <div 
                key={location.id} 
                className="px-2 py-1 rounded-md text-xs flex items-center gap-1"
                style={{ backgroundColor: `${location.color}20`, color: location.color }}
              >
                <span>{location.name}</span>
                <button
                  onClick={() => onRemoveLocation && onRemoveLocation(location.id)}
                  className="ml-1 hover:bg-background/30 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {locations.length === 0 && (
              <div className="text-xs text-muted-foreground">
                Click on regions in the map to add them for comparison (up to 5)
              </div>
            )}
          </div>
        </div>

        {(isLoading || isLoadingComparison) ? (
          <div className="h-64 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      {
                        name: 'Current',
                        ...chartData.reduce((acc, item) => {
                          if (item) {
                            acc[item.id] = item.value;
                          }
                          return acc;
                        }, {} as Record<string, number>)
                      }
                    ]}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatValue(value, variable?.format)}
                    />
                    <Legend />
                    {locations.map((location, index) => (
                      <Line
                        key={location.id}
                        type="monotone"
                        dataKey={location.id}
                        stroke={location.color}
                        name={location.name}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center max-w-xs">
                  Select regions on the map to compare data across locations
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonTool;
