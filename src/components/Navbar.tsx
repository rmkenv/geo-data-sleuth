
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar = () => {
  return (
    <nav className="bg-primary text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            Place Trends
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary-foreground/80 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
