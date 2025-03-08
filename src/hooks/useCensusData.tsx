
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  buildCensusUrl, 
  processCensusResponse, 
  CENSUS_VARIABLES 
} from '@/lib/census';
import { CensusData } from '@/types/census';

// Get variable IDs for API request
const variableIds = CENSUS_VARIABLES.map(v => v.id);

export function useCensusData(
  year: number = 2021,
  geographyType: string = 'state',
  regionCode?: string
) {
  // Use React Query for data fetching with caching
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['census-data', year, geographyType, regionCode],
    queryFn: async () => {
      const url = buildCensusUrl(year, variableIds, geographyType, regionCode);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch census data');
        }
        
        const data = await response.json();
        return processCensusResponse(data, variableIds);
      } catch (error) {
        console.error('Error fetching census data:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  return { 
    data: data as CensusData[], 
    isLoading, 
    error 
  };
}

export function useComparisonData(
  variableId: string,
  years: number[] = [2016, 2021],
  geographyType: string = 'state',
  regionCode?: string
) {
  const [comparisonData, setComparisonData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          years.map(async (year) => {
            const url = buildCensusUrl(year, [variableId], geographyType, regionCode);
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch census data for ${year}`);
            }
            
            const data = await response.json();
            const processed = processCensusResponse(data, [variableId]);
            
            return {
              year,
              data: processed
            };
          })
        );
        
        setComparisonData(results);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [variableId, years, geographyType, regionCode]);

  return { data: comparisonData, isLoading, error };
}
