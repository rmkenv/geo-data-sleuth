
import React from 'react';

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex">
        <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow mr-1.5"></div>
        <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow animation-delay-200 mr-1.5"></div>
        <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow animation-delay-400"></div>
      </div>
    </div>
  );
};

export default Loader;
