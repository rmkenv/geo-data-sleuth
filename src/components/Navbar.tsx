
import React from 'react';
import { Menu, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">Place Trends</span>
          </div>
          
          {!isMobile ? (
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Maps</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Comparisons</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
              <Button size="sm">Sign In</Button>
            </nav>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container mx-auto px-4 pb-4">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Maps</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Comparisons</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <Button size="sm" className="w-full">Sign In</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
