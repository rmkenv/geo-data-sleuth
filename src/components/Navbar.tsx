
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, Search, Map } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b backdrop-blur-lg animate-fade-in">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <ChartBar className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">GeoAnalytica</span>
        </Link>
        
        <div className="relative hidden md:block max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full pl-10 pr-4 py-1.5 text-sm bg-secondary/60 rounded-full border-0 focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Explore
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Compare
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex md:hidden">
          <button className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
