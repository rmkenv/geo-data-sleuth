
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          Unlock Insights with US Census Data
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Place Trends helps you analyze and visualize demographic, economic, and social trends across the United States. Discover patterns, make comparisons, and gain valuable insights from comprehensive Census data.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg">Explore Dashboard</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
