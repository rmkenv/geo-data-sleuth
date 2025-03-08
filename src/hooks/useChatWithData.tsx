
import { useState } from 'react';
import { CensusData } from '@/types/census';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function useChatWithData(data?: CensusData[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze and understand Census data. What would you like to know?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let responseContent = '';
      
      // Simple pattern matching for demonstration
      const lowercaseMessage = message.toLowerCase();
      
      if (lowercaseMessage.includes('income') || lowercaseMessage.includes('salary')) {
        responseContent = 'Based on the Census data, median household income varies significantly by region. Would you like me to show you specific income statistics for a particular area?';
      } else if (lowercaseMessage.includes('education') || lowercaseMessage.includes('college')) {
        responseContent = 'Education attainment levels show interesting patterns across different regions. The data indicates variation in college graduation rates by geography and demographics.';
      } else if (lowercaseMessage.includes('housing') || lowercaseMessage.includes('home')) {
        responseContent = 'Housing costs have been trending upward in many metropolitan areas. The Census data shows regional variations in homeownership rates and housing affordability.';
      } else if (lowercaseMessage.includes('demographics') || lowercaseMessage.includes('population')) {
        responseContent = 'Population demographics show changing patterns, with growing diversity in many urban areas and shifts in age distribution across regions.';
      } else if (lowercaseMessage.includes('compare') || lowercaseMessage.includes('difference')) {
        responseContent = 'Comparing regions can reveal interesting insights. The data shows significant variations between urban and rural areas in multiple demographic factors.';
      } else if (lowercaseMessage.includes('trend') || lowercaseMessage.includes('change')) {
        responseContent = 'Looking at trends over time, there are notable shifts in population distribution, income levels, and housing costs across different regions.';
      } else {
        responseContent = 'That\'s an interesting question about the Census data. Looking at the available information, I can help you analyze specific variables or regions if you provide more details.';
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing chat message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { messages, isLoading, sendMessage };
}
