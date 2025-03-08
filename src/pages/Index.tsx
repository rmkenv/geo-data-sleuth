
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <div className="container mx-auto px-4 mt-8 mb-16">
          {/* Dashboard is now full width to emphasize the map */}
          <Dashboard />
          
          {/* Chat interface moved to the bottom */}
          <div className="mt-8 h-[400px]">
            <ChatInterface />
          </div>
        </div>
      </main>
      
      <footer className="bg-secondary/30 py-10 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Data source: US Government Open Data</p>
            <p className="mt-2">© {new Date().getFullYear()} Place Trends. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
