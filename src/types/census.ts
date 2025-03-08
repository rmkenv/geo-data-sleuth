
export interface CensusVariable {
  id: string;
  name: string;
  description: string;
  category: VariableCategory;
  format?: 'percent' | 'currency' | 'number';
}

export type VariableCategory = 
  | 'Income' 
  | 'Education' 
  | 'Housing' 
  | 'Demographics' 
  | 'Race & Ethnicity'
  | 'Employment'
  | 'Transportation'
  | 'Internet Access'
  | 'Energy Prices';

export interface CensusData {
  geoid: string;
  name: string;
  state: string;
  variables: Record<string, number>;
  year: number;
}

export interface CensusDataResponse {
  data: CensusData[];
  status: 'success' | 'error';
  message?: string;
}

export interface GeographyLevel {
  id: string;
  name: string;
  description: string;
}

export interface MapFeature {
  type: 'Feature';
  properties: {
    geoid: string;
    name: string;
    state?: string;
    value?: number;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface MapData {
  type: 'FeatureCollection';
  features: MapFeature[];
}

export interface ComparisonData {
  variable: CensusVariable;
  geographies: {
    geoid: string;
    name: string;
    value: number;
  }[];
}

export interface EnergyPriceData {
  period: string;
  value: number;
  state: string;
  sector: string;
  type: 'electricity' | 'natural-gas';
}

export interface LocationComparison {
  id: string;
  name: string;
  level: string;
  color: string;
  data?: Record<string, number>;
}
