
import React, { useState } from 'react';
import { useChatWithData } from '@/hooks/useChatWithData';
import { CensusData } from '@/types/census';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import Loader from '@/components/Loader';

interface ChatInterfaceProps {
  data?: CensusData[];
  className?: string;
}

const ChatInterface = ({ data, className }: ChatInterfaceProps) => {
  const { messages, isLoading, sendMessage } = useChatWithData(data);
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <div className={`flex flex-col h-full border rounded-lg overflow-hidden bg-card ${className}`}>
      <div className="p-4 bg-secondary font-medium border-b">
        <h3 className="text-lg">Chat with Census Data</h3>
        <p className="text-xs text-muted-foreground">Ask questions about trends, comparisons, or specific metrics</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground max-w-[80%] rounded-lg p-3">
              <Loader className="h-6" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Ask about Census data..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
