"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Radio, Quote } from "lucide-react";

interface QuoteItem {
  id: number;
  text: string;
  type: "quote" | "radio";
  context: string;
}

export default function HomePage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load quotes data
    const loadQuotes = async () => {
      try {
        const response = await fetch('/data/quotes.json');
        const quotesData = await response.json();
        setQuotes(quotesData);
      } catch (error) {
        console.error('Failed to load quotes:', error);
      }
    };
    loadQuotes();
  }, []);

  // Auto-carousel functionality
  useEffect(() => {
    if (!isAutoPlaying || quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, quotes.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (!mounted || quotes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Max Verstappen quotes...</p>
        </div>
      </div>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            MAX VERSTAPPEN
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light">
            Quotes & Radio Messages
          </p>
        </div>

        {/* Quote Carousel */}
        <div className="relative">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 min-h-[300px] flex items-center">
            <CardContent className="p-8 md:p-12 w-full">
              <div className="text-center space-y-6">
                {/* Quote Type Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant="secondary" 
                    className={`px-4 py-2 text-sm font-medium ${
                      currentQuote.type === 'radio' 
                        ? 'bg-orange-100 text-orange-800 border-orange-200' 
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {currentQuote.type === 'radio' ? (
                      <>
                        <Radio className="w-4 h-4 mr-2" />
                        Team Radio
                      </>
                    ) : (
                      <>
                        <Quote className="w-4 h-4 mr-2" />
                        Quote
                      </>
                    )}
                  </Badge>
                </div>

                {/* Quote Text */}
                <blockquote className="text-2xl md:text-4xl font-medium text-gray-800 leading-relaxed italic">
                  &ldquo;{currentQuote.text}&rdquo;
                </blockquote>

                {/* Context */}
                <p className="text-lg text-gray-600 font-light">
                  {currentQuote.context}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next quote"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <div className="text-center mt-6">
            <p className="text-white/70 text-sm">
              Auto-playing • Swipe or click to control
            </p>
          </div>
        )}
      </div>
    </div>
  );
}