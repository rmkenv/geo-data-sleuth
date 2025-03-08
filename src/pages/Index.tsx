
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <Dashboard />
      </main>
      
      <footer className="bg-secondary/30 py-10 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Data source: US Census Bureau, American Community Survey</p>
            <p className="mt-2">© {new Date().getFullYear()} GeoAnalytica. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
