
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatValue } from '@/lib/census';
import { CensusVariable } from '@/types/census';

interface DataCardProps {
  title: string;
  value: number | null;
  previousValue?: number | null;
  format?: string;
  description?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const DataCard = ({
  title,
  value,
  previousValue,
  format,
  description,
  icon,
  isLoading = false
}: DataCardProps) => {
  const formattedValue = value !== null ? formatValue(value, format) : 'N/A';
  
  // Calculate percentage change if both values exist
  const percentChange = previousValue && value 
    ? ((value - previousValue) / previousValue) * 100
    : null;
  
  // Determine if change is positive, negative, or neutral
  let changeType = 'neutral';
  if (percentChange) {
    changeType = percentChange > 0 ? 'positive' : percentChange < 0 ? 'negative' : 'neutral';
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center space-x-2">
          {icon && <span>{icon}</span>}
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-2/3 bg-muted/50 animate-pulse rounded"></div>
        ) : (
          <div className="text-3xl font-bold text-foreground">{formattedValue}</div>
        )}
        
        {percentChange !== null && !isLoading && (
          <div className={`text-sm mt-1 
            ${changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'}`}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''}
            {' '}
            {Math.abs(percentChange).toFixed(1)}% from previous
          </div>
        )}
      </CardContent>
      {description && (
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          {description}
        </CardFooter>
      )}
    </Card>
  );
};

export default DataCard;
