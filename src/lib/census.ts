import { CensusVariable, VariableCategory, EnergyPriceData } from "@/types/census";

// API Base URL and keys
const API_BASE_URL = 'https://api.census.gov/data';
const CENSUS_API_KEY = '33ff48a144036b88ae3dcec421c8bdf908501554';
const EIA_API_KEY = 'DEMO_KEY'; // Replace with actual key in production

// Key Census variables we want to highlight
export const CENSUS_VARIABLES: CensusVariable[] = [
  // Income variables
  { id: 'B19013_001E', name: 'Median Household Income', description: 'Median household income in the past 12 months', category: 'Income', format: 'currency' },
  { id: 'B19001_001E', name: 'Household Income', description: 'Total households with income data', category: 'Income', format: 'number' },
  { id: 'B19001_014E', name: 'High Income Households', description: 'Households with income $100,000 to $124,999', category: 'Income', format: 'number' },
  { id: 'B19001_002E', name: 'Low Income Households', description: 'Households with income less than $10,000', category: 'Income', format: 'number' },
  { id: 'B19083_001E', name: 'Income Inequality (Gini)', description: 'Gini Index of Income Inequality', category: 'Income', format: 'number' },
  
  // Education variables
  { id: 'B15003_001E', name: 'Total Population 25+', description: 'Population 25 years and over', category: 'Education', format: 'number' },
  { id: 'B15003_022E', name: 'Bachelor\'s Degree', description: 'Population with Bachelor\'s degree', category: 'Education', format: 'number' },
  { id: 'B15003_023E', name: 'Master\'s Degree', description: 'Population with Master\'s degree', category: 'Education', format: 'number' },
  { id: 'B15003_025E', name: 'Doctoral Degree', description: 'Population with Doctorate degree', category: 'Education', format: 'number' },
  { id: 'B15003_017E', name: 'High School Graduates', description: 'Population with high school diploma or equivalent', category: 'Education', format: 'number' },
  
  // Housing variables
  { id: 'B25077_001E', name: 'Median Home Value', description: 'Median value of owner-occupied housing units', category: 'Housing', format: 'currency' },
  { id: 'B25064_001E', name: 'Median Gross Rent', description: 'Median gross rent', category: 'Housing', format: 'currency' },
  { id: 'B25001_001E', name: 'Total Housing Units', description: 'Total housing units', category: 'Housing', format: 'number' },
  { id: 'B25003_002E', name: 'Owner Occupied Units', description: 'Owner occupied housing units', category: 'Housing', format: 'number' },
  { id: 'B25003_003E', name: 'Renter Occupied Units', description: 'Renter occupied housing units', category: 'Housing', format: 'number' },
  
  // Demographics variables
  { id: 'B01001_001E', name: 'Total Population', description: 'Total population', category: 'Demographics', format: 'number' },
  { id: 'B01001_002E', name: 'Male Population', description: 'Male population', category: 'Demographics', format: 'number' },
  { id: 'B01001_026E', name: 'Female Population', description: 'Female population', category: 'Demographics', format: 'number' },
  { id: 'B01002_001E', name: 'Median Age', description: 'Median age', category: 'Demographics', format: 'number' },
  
  // Race and Ethnicity variables
  { id: 'B03002_003E', name: 'White Population', description: 'White alone population', category: 'Race & Ethnicity', format: 'number' },
  { id: 'B03002_004E', name: 'Black Population', description: 'Black or African American alone population', category: 'Race & Ethnicity', format: 'number' },
  { id: 'B03002_006E', name: 'Asian Population', description: 'Asian alone population', category: 'Race & Ethnicity', format: 'number' },
  { id: 'B03002_012E', name: 'Hispanic Population', description: 'Hispanic or Latino population of any race', category: 'Race & Ethnicity', format: 'number' },
  { id: 'B03002_005E', name: 'Native American Population', description: 'American Indian and Alaska Native alone population', category: 'Race & Ethnicity', format: 'number' },
  
  // Employment variables
  { id: 'B23025_001E', name: 'Employment Status Population', description: 'Population 16 years and over', category: 'Employment', format: 'number' },
  { id: 'B23025_002E', name: 'Labor Force', description: 'In labor force', category: 'Employment', format: 'number' },
  { id: 'B23025_004E', name: 'Civilian Employed', description: 'Civilian labor force employed', category: 'Employment', format: 'number' },
  { id: 'B23025_005E', name: 'Civilian Unemployed', description: 'Civilian labor force unemployed', category: 'Employment', format: 'number' },
  { id: 'B23025_007E', name: 'Not in Labor Force', description: 'Not in labor force', category: 'Employment', format: 'number' },
  
  // Transportation variables
  { id: 'B08301_001E', name: 'Total Commuters', description: 'Workers 16 years and over', category: 'Transportation', format: 'number' },
  { id: 'B08301_003E', name: 'Drive Alone Commuters', description: 'Car, truck, or van - drove alone', category: 'Transportation', format: 'number' },
  { id: 'B08301_004E', name: 'Carpool Commuters', description: 'Car, truck, or van - carpooled', category: 'Transportation', format: 'number' },
  { id: 'B08301_010E', name: 'Public Transit Commuters', description: 'Public transportation (excluding taxicab)', category: 'Transportation', format: 'number' },
  { id: 'B08301_019E', name: 'Work From Home', description: 'Worked from home', category: 'Transportation', format: 'number' },
  
  // Internet Access variables
  { id: 'B28002_001E', name: 'Total Households (Internet)', description: 'Total households surveyed for internet access', category: 'Internet Access', format: 'number' },
  { id: 'B28002_002E', name: 'Households With Internet', description: 'Households with an Internet subscription', category: 'Internet Access', format: 'number' },
  { id: 'B28002_004E', name: 'Broadband Households', description: 'Households with a broadband Internet subscription', category: 'Internet Access', format: 'number' },
  { id: 'B28002_013E', name: 'No Internet Access', description: 'Households without Internet access', category: 'Internet Access', format: 'number' },
  { id: 'B28002_012E', name: 'Cellular Data Only', description: 'Households with cellular data plan only and no other type of Internet', category: 'Internet Access', format: 'number' },
  
  // Energy Price variables
  { id: 'ELEC_PRICE', name: 'Residential Electricity Price', description: 'Average residential electricity price (cents/kWh)', category: 'Energy Prices', format: 'currency' },
  { id: 'GAS_PRICE', name: 'Residential Natural Gas Price', description: 'Average residential natural gas price ($/thousand cubic feet)', category: 'Energy Prices', format: 'currency' },
  { id: 'ELEC_PRICE_YOY', name: 'Electricity Price YoY Change', description: 'Year-over-year change in electricity prices', category: 'Energy Prices', format: 'percent' },
  { id: 'GAS_PRICE_YOY', name: 'Natural Gas Price YoY Change', description: 'Year-over-year change in natural gas prices', category: 'Energy Prices', format: 'percent' },
];

// Get dataset name for a given year
export const getDataset = (year: number) => {
  return `acs/acs5`; // Using 5-year ACS data
};

// Build the Census API URL
export const buildCensusUrl = (
  year: number,
  variables: string[],
  geographyType: string,
  regionCode?: string
) => {
  const dataset = getDataset(year);
  const variableList = ['NAME', ...variables].join(',');
  let url = `${API_BASE_URL}/${year}/${dataset}?get=${variableList}&key=${CENSUS_API_KEY}`;
  
  // Add geography filter
  if (geographyType === 'state') {
    url += `&for=state:*`;
  } else if (geographyType === 'county' && regionCode) {
    url += `&for=county:*&in=state:${regionCode}`;
  } else if (geographyType === 'county') {
    url += `&for=county:*`;
  } else if (geographyType === 'place' && regionCode) {
    url += `&for=place:*&in=state:${regionCode}`;
  } else if (geographyType === 'metro') {
    url += `&for=metropolitan%20statistical%20area/micropolitan%20statistical%20area:*`;
  } else if (geographyType === 'zcta') {
    url += `&for=zip%20code%20tabulation%20area:*`;
  }
  
  return url;
};

// Format value based on the variable type
export const formatValue = (value: number, format?: string) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(value);
    case 'percent':
      return new Intl.NumberFormat('en-US', { 
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(value / 100);
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

// Calculate percentage
export const calculatePercentage = (numerator: number, denominator: number) => {
  if (!denominator) return 0;
  return (numerator / denominator) * 100;
};

// Process the raw Census API response
export const processCensusResponse = (data: any[], variables: string[]) => {
  if (!data || data.length <= 1) {
    return [];
  }

  const headers = data[0];
  const results = data.slice(1);

  return results.map(row => {
    const result: Record<string, any> = {};
    
    // Process each column in the row
    headers.forEach((header: string, index: number) => {
      let value = row[index];
      
      // Try to convert numeric values
      if (value && !isNaN(Number(value))) {
        value = Number(value);
      }
      
      result[header] = value;
    });
    
    // Create a GEOID from state and county/place codes if available
    if (result.state && result.county) {
      result.geoid = `${result.state}${result.county}`;
    } else if (result.state) {
      result.geoid = result.state;
    }
    
    return result;
  });
};

// Fetch energy prices from EIA API
export const fetchEnergyPrices = async (
  type: 'electricity' | 'natural-gas',
  stateCode?: string,
  months: number = 12
): Promise<EnergyPriceData[]> => {
  try {
    // Construct URL based on energy type and parameters
    let url: string;
    if (type === 'electricity') {
      url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${EIA_API_KEY}&frequency=monthly&data[]=price&facets[sectorid][]=RES&start=-${months}`;
      if (stateCode) {
        url += `&facets[stateid][]=${stateCode}`;
      }
    } else {
      url = `https://api.eia.gov/v2/natural-gas/pri/sum/data/?api_key=${EIA_API_KEY}&frequency=monthly&data[]=price&facets[sectorid][]=RES&start=-${months}`;
      if (stateCode) {
        url += `&facets[stateid][]=${stateCode}`;
      }
    }
    
    // Fetch data from EIA API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} data from EIA API`);
    }
    
    const data = await response.json();
    
    // Mock data structure for development until API key is properly set up
    if (!data.response || !data.response.data) {
      // Return mock data for demonstration purposes
      return generateMockEnergyData(type, stateCode, months);
    }
    
    // Process the API response
    return data.response.data.map((item: any) => ({
      period: item.period,
      value: Number(item.price),
      state: item.stateid || 'US',
      sector: item.sectorid,
      type
    }));
  } catch (error) {
    console.error(`Error fetching ${type} prices:`, error);
    // Return mock data in case of error for development
    return generateMockEnergyData(type, stateCode, months);
  }
};

// Generate mock energy data for development
const generateMockEnergyData = (
  type: 'electricity' | 'natural-gas',
  stateCode?: string,
  months: number = 12
): EnergyPriceData[] => {
  const data: EnergyPriceData[] = [];
  const basePrice = type === 'electricity' ? 13.5 : 15.2; // cents/kWh or $/thousand cubic feet
  const state = stateCode || 'US';
  
  // Generate last X months of data
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Add some random variation
    const randomFactor = 0.95 + (Math.random() * 0.2);
    const value = basePrice * randomFactor * (1 + (i * 0.01)); // Slight upward trend
    
    data.push({
      period,
      value,
      state,
      sector: 'RES',
      type
    });
  }
  
  // Sort by date ascending
  return data.sort((a, b) => a.period.localeCompare(b.period));
};

// Get variables by category
export const getVariablesByCategory = (category: VariableCategory) => {
  return CENSUS_VARIABLES.filter(variable => variable.category === category);
};

// Get all variable categories
export const getAllCategories = (): VariableCategory[] => {
  return ['Income', 'Education', 'Housing', 'Demographics', 'Race & Ethnicity', 'Employment', 'Transportation', 'Internet Access', 'Energy Prices'];
};

// Get variable by ID
export const getVariableById = (id: string): CensusVariable | undefined => {
  return CENSUS_VARIABLES.find(variable => variable.id === id);
};
