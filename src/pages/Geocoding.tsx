
import React from 'react';
import Navbar from '@/components/Navbar';
import GeocodingMap from '@/components/geocoding/GeocodingMap';

const Geocoding = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Address Geocoding and Census Geography
          </h1>
          
          <GeocodingMap />
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              This tool uses the{' '}
              <a 
                href="https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Census Bureau Geocoding API
              </a>
              {' '}to convert addresses into geographic coordinates and display them on the map.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Geocoding;
