
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Lasso } from 'lucide-react';

interface ToolSelectorProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const ToolSelector = ({ activeTool, onToolChange }: ToolSelectorProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant={activeTool === 'pan' ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange('pan')}
        className="px-2 py-1 h-8"
      >
        <Maximize2 className="h-4 w-4 mr-1" />
        <span className="text-xs">Pan</span>
      </Button>
      <Button
        variant={activeTool === 'lasso' ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange('lasso')}
        className="px-2 py-1 h-8"
      >
        <Lasso className="h-4 w-4 mr-1" />
        <span className="text-xs">Lasso</span>
      </Button>
    </div>
  );
};

export default ToolSelector;
