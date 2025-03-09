import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  buildCensusUrl, 
  processCensusResponse, 
  CENSUS_VARIABLES,
  ENERGY_PRICE_VARIABLES
} from '@/lib/census';
import { CensusData, EnergyPriceData, LocationComparison } from '@/types/census';

// Get variable IDs for API request (excluding energy price variables)
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
        console.log('Fetching census data from:', url);
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('Census API Error:', await response.text());
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

export function useEnergyPrices(
  state?: string,
  months: number = 12
) {
  const { 
    data: electricityData, 
    isLoading: isLoadingElectricity, 
    error: electricityError 
  } = useQuery({
    queryKey: ['energy-prices', 'electricity', state, months],
    queryFn: () => fetchEnergyPrices('electricity', state, months),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 1
  });

  const { 
    data: gasData, 
    isLoading: isLoadingGas, 
    error: gasError 
  } = useQuery({
    queryKey: ['energy-prices', 'natural-gas', state, months],
    queryFn: () => fetchEnergyPrices('natural-gas', state, months),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 1
  });

  return {
    electricityData,
    gasData,
    isLoading: isLoadingElectricity || isLoadingGas,
    error: electricityError || gasError
  };
}

export function useComparisonData(
  locations: LocationComparison[],
  variableId: string,
  year: number = 2021
) {
  const [comparisonData, setComparisonData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!locations.length) {
        setComparisonData({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const results = await Promise.all(
          locations.map(async (location) => {
            const url = buildCensusUrl(
              year, 
              [variableId], 
              location.level, 
              location.id
            );
            
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${location.name}`);
            }
            
            const data = await response.json();
            const processed = processCensusResponse(data, [variableId]);
            
            return {
              id: location.id,
              name: location.name,
              level: location.level,
              color: location.color,
              data: processed.length > 0 ? processed[0] : null
            };
          })
        );
        
        // Convert array to object with location ids as keys
        const dataObj = results.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as Record<string, any>);
        
        setComparisonData(dataObj);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locations, variableId, year]);

  return { data: comparisonData, isLoading, error };
}
