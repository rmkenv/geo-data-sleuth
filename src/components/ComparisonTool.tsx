
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CENSUS_VARIABLES, formatValue } from '@/lib/census';
import Loader from './Loader';

interface ComparisonToolProps {
  data?: any[];
  isLoading?: boolean;
}

const ComparisonTool = ({ data, isLoading = false }: ComparisonToolProps) => {
  const [selectedVariable, setSelectedVariable] = useState(CENSUS_VARIABLES[0].id);

  const variable = CENSUS_VARIABLES.find(v => v.id === selectedVariable);

  return (
    <Card className="w-full overflow-hidden animate-fade-in glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Comparison Tool</CardTitle>
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

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="relative h-64 border-l border-muted mt-4">
            {/* Placeholder for comparison chart */}
            <div className="absolute left-0 top-0 h-full w-full">
              <div className="flex flex-col justify-between h-full py-2">
                <div className="pl-2 text-xs text-muted-foreground">High</div>
                <div className="pl-2 text-xs text-muted-foreground">Low</div>
              </div>
            </div>
            
            <div className="absolute left-8 right-0 top-0 h-full flex items-end">
              {/* Placeholder bars */}
              <div className="flex-1 flex items-end justify-around h-full pb-6">
                {[0.7, 0.5, 0.9, 0.6, 0.3].map((height, i) => (
                  <div 
                    key={i}
                    className="relative group"
                    style={{ height: `${height * 100}%` }}
                  >
                    <div className="w-12 bg-primary/80 hover:bg-primary rounded-t-sm transition-all"></div>
                    <div className="text-xs mt-2 absolute -rotate-45 origin-left text-muted-foreground whitespace-nowrap">
                      Region {i + 1}
                    </div>
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {formatValue(height * 100000, variable?.format)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center max-w-xs">
                Select regions and variables to compare data across geographies
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonTool;
