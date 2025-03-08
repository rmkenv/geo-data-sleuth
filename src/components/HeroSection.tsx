
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          Explore US Demographics & Economic Trends
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Place Trends delivers interactive visualization of population statistics, income patterns, and social indicators across American communities. Compare regional differences, track historical changes, and uncover actionable insights with comprehensive location-based data.
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
