
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
        <div className="container mx-auto px-4 mt-8 mb-16 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Dashboard />
          </div>
          <div className="lg:col-span-1 h-[600px]">
            <ChatInterface />
          </div>
        </div>
      </main>
      
      <footer className="bg-secondary/30 py-10 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Data source: US Census Bureau</p>
            <p className="mt-2">© {new Date().getFullYear()} Place Trends. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
