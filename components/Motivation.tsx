import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparkleIcon } from './icons/SparkleIcon';

export const Motivation: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMotivation = async () => {
      setIsLoading(true);
      setError(null);
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const cacheKey = `motivation-${today}`;

      try {
        const cachedQuote = localStorage.getItem(cacheKey);
        if (cachedQuote) {
          setQuote(cachedQuote);
          return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Provide a short, powerful motivational quote about health, fitness, or wellness. Just the quote, no extra text.',
            config: {
                temperature: 0.9,
            }
        });
        
        let newQuote = response.text.trim();
        // Clean up potential markdown or quotation marks from the response
        newQuote = newQuote.replace(/^"|"|^\*|\*$/g, '');

        if (newQuote) {
            setQuote(newQuote);
            localStorage.setItem(cacheKey, newQuote);
        } else {
             throw new Error("Failed to generate a quote.");
        }

      } catch (err) {
        console.error("Error fetching motivational quote:", err);
        setError("Could not fetch today's motivation.");
        // Fallback quote
        setQuote("Believe you can and you're halfway there.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotivation();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
        </div>
      );
    }
    
    if (error && !quote) {
      return <p className="text-center text-red-500">{error}</p>
    }

    return (
        <blockquote className="relative p-4 text-center text-gray-600 border-l-4 border-lime-300 bg-lime-50 rounded-r-lg">
            <p className="text-base italic">"{quote}"</p>
        </blockquote>
    );
  };

  return (
    <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <SparkleIcon className="h-6 w-6 text-lime-500 mr-2" />
            Daily Motivation
        </h2>
        <p className="text-gray-500 mb-6">Your daily spark of inspiration.</p>
        {renderContent()}
    </div>
  );
};