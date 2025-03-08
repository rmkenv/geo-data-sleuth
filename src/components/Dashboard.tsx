
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import DataCard from './DataCard';
import Map from './Map';
import ComparisonTool from './ComparisonTool';
import { 
  useCensusData
} from '@/hooks/useCensusData';
import { 
  getVariablesByCategory, 
  getAllCategories,
  getVariableById
} from '@/lib/census';
import Loader from './Loader';
import { 
  BarChart3, 
  Home, 
  GraduationCap, 
  DollarSign, 
  Users, 
  Briefcase,
  Car,
  Wifi
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
    default:
      return <BarChart3 className="w-4 h-4" />;
  }
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2021);
  const [geography, setGeography] = useState('state');
  const [region, setRegion] = useState<string | undefined>(undefined);
  
  const { data, isLoading, error } = useCensusData(selectedYear, geography, region);
  
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  // Get variables for selected category
  const categoryVariables = getVariablesByCategory(selectedCategory);
  
  return (
    <section id="dashboard-content" className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">Demographics & Economic Trends Dashboard</h2>
        <p className="text-muted-foreground">
          Explore and analyze demographic data across the United States
        </p>
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
                  {categoryVariables.map((variable) => (
                    <DataCard
                      key={variable.id}
                      title={variable.name}
                      value={data && data[0] ? (data[0] as any)[variable.id] as number : null}
                      format={variable.format}
                      description={variable.description}
                      icon={getCategoryIcon(category)}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
                
                {/* Map and Comparison Tool */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-[500px]">
                    <Map 
                      data={data}
                      variable={categoryVariables[0]?.id}
                      format={categoryVariables[0]?.format}
                      isLoading={isLoading}
                      title={`Geographic Distribution: ${categoryVariables[0]?.name}`}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <ComparisonTool 
                      data={data}
                      isLoading={isLoading}
                    />
                  </div>
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
