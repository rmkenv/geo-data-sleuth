
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToContent = () => {
    const content = document.getElementById('dashboard-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-background"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-primary/10 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center z-10 animate-fade-in">
        <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
          Discover Demographic Insights
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-slide-up">
          Explore <span className="text-gradient">Location-Based</span> Data Analytics
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
          Visualize and analyze US Census demographic data with powerful, intuitive tools that help you understand population trends and patterns.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
          <Button size="lg" className="rounded-full px-8">
            Explore the Data
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-float"
        onClick={scrollToContent}
      >
        <ChevronDown className="w-8 h-8 text-muted-foreground opacity-70" />
      </div>
    </section>
  );
};

export default HeroSection;
