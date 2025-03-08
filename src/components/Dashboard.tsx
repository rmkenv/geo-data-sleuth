
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import DataCard from './DataCard';
import Map from './Map';
import ComparisonTool from './ComparisonTool';
import { 
  useCensusData,
  useEnergyPrices
} from '@/hooks/useCensusData';
import { 
  getVariablesByCategory, 
  getAllCategories,
  getVariableById
} from '@/lib/census';
import Loader from './Loader';
import { LocationComparison } from '@/types/census';
import { 
  BarChart3, 
  Home, 
  GraduationCap, 
  DollarSign, 
  Users, 
  Briefcase,
  Car,
  Wifi,
  Zap
} from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Income':
      return <DollarSign className="w-4 h-4" />;
    case 'Education':
      return <GraduationCap className="w-4 h-4" />;
    case 'Housing':
      return <Home className="w-4 h-4" />;
    case 'Demographics':
      return <Users className="w-4 h-4" />;
    case 'Race & Ethnicity':
      return <Users className="w-4 h-4" />;
    case 'Employment':
      return <Briefcase className="w-4 h-4" />;
    case 'Transportation':
      return <Car className="w-4 h-4" />;
    case 'Internet Access':
      return <Wifi className="w-4 h-4" />;
    case 'Energy Prices':
      return <Zap className="w-4 h-4" />;
    default:
      return <BarChart3 className="w-4 h-4" />;
  }
};

const LOCATION_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#65a30d'
];

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2021);
  const [geography, setGeography] = useState('state');
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [selectedLocations, setSelectedLocations] = useState<LocationComparison[]>([]);
  
  // Get census data
  const { data, isLoading, error } = useCensusData(selectedYear, geography, region);
  
  // Get energy price data
  const { 
    electricityData, 
    gasData, 
    isLoading: isLoadingEnergy 
  } = useEnergyPrices(region);
  
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  // Get variables for selected category
  const categoryVariables = getVariablesByCategory(selectedCategory);
  
  // Handle a region selection in the map
  const handleRegionSelect = (regionId: string, level: string) => {
    if (!regionId) {
      // Clear region selection
      setRegion(undefined);
      setGeography('state');
      return;
    }
    
    setRegion(regionId);
    setGeography(level);
  };
  
  // Add a location to comparison
  const handleAddLocation = (location: any) => {
    // Check if we already have 5 locations
    if (selectedLocations.length >= 5) {
      // Could show a toast message here
      return;
    }
    
    // Check if this location is already selected
    if (selectedLocations.find(loc => loc.id === location.id && loc.level === location.level)) {
      return;
    }
    
    const newLocation: LocationComparison = {
      id: location.id,
      name: location.name,
      level: location.level,
      color: LOCATION_COLORS[selectedLocations.length]
    };
    
    setSelectedLocations([...selectedLocations, newLocation]);
  };
  
  // Remove a location from comparison
  const handleRemoveLocation = (locationId: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.id !== locationId));
  };
  
  return (
    <section id="dashboard-content" className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Demographics & Economic Trends Dashboard</h2>
        <p className="text-muted-foreground">
          Explore and analyze demographic data across the United States
        </p>
      </div>
      
      {/* Map and Comparison Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-3 h-[600px]">
          <Map 
            data={data}
            variable={categoryVariables[0]?.id}
            format={categoryVariables[0]?.format}
            isLoading={isLoading}
            title={`Geographic Distribution: ${categoryVariables[0]?.name}`}
            onRegionSelect={handleRegionSelect}
            selectedRegion={region}
            geographyLevel={geography}
          />
        </div>
        <div className="lg:col-span-1">
          <ComparisonTool 
            data={data}
            isLoading={isLoading}
            locations={selectedLocations}
            onAddLocation={handleAddLocation}
            onRemoveLocation={handleRemoveLocation}
          />
        </div>
      </div>
      
      {/* Category Tabs */}
      <Tabs defaultValue={categories[0]} value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)}>
        <div className="mb-6 overflow-x-auto">
          <TabsList className="bg-muted/50 p-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="flex items-center gap-2 data-[state=active]:glass"
              >
                {getCategoryIcon(category)}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-destructive">
                <p>Error loading data. Please try again later.</p>
              </div>
            ) : (
              <>
                {/* Data Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                  {categoryVariables.map((variable) => {
                    // Special handling for energy prices
                    let value = null;
                    if (category === 'Energy Prices' && !isLoadingEnergy) {
                      if (variable.id === 'ELEC_PRICE' && electricityData?.length) {
                        value = electricityData[electricityData.length - 1].value;
                      } else if (variable.id === 'GAS_PRICE' && gasData?.length) {
                        value = gasData[gasData.length - 1].value;
                      } else if (variable.id === 'ELEC_PRICE_YOY' && electricityData?.length > 1) {
                        const current = electricityData[electricityData.length - 1].value;
                        const previous = electricityData[0].value;
                        value = ((current - previous) / previous) * 100;
                      } else if (variable.id === 'GAS_PRICE_YOY' && gasData?.length > 1) {
                        const current = gasData[gasData.length - 1].value;
                        const previous = gasData[0].value;
                        value = ((current - previous) / previous) * 100;
                      }
                    } else {
                      value = data && data[0] ? (data[0] as any)[variable.id] as number : null;
                    }
                    
                    return (
                      <DataCard
                        key={variable.id}
                        title={variable.name}
                        value={value}
                        format={variable.format}
                        description={variable.description}
                        icon={getCategoryIcon(category)}
                        isLoading={category === 'Energy Prices' ? isLoadingEnergy : isLoading}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default Dashboard;
