"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Radio, Quote, Trophy } from "lucide-react";

interface QuoteItem {
  id: number;
  text: string;
  value?: string;
  type: "quote" | "radio" | "stat";
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
        const response = await fetch('/quotes.json');
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-800 border-t-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-400 font-light tracking-wide">Loading Max Verstappen quotes...</p>
        </div>
      </div>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Gradient Accent */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-3 tracking-tight">
            MAX VERSTAPPEN
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mb-4"></div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-6 bg-gradient-to-b from-red-500 via-white to-blue-500 rounded-sm shadow-lg border border-gray-600"></div>
            <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide">
              DUTCH F1 DRIVER
            </p>
          </div>
        </div>

        {/* Quote Carousel */}
        <div className="relative">
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 shadow-2xl min-h-[350px] flex items-center">
            <CardContent className="p-8 md:p-16 w-full">
              <div className="text-center space-y-8">
                {/* Content Type Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant="secondary" 
                    className={`px-6 py-2 text-sm font-medium border-0 ${
                      currentQuote.type === 'radio' 
                        ? 'bg-orange-500/20 text-orange-300 backdrop-blur-sm' 
                        : currentQuote.type === 'stat'
                        ? 'bg-green-500/20 text-green-300 backdrop-blur-sm'
                        : 'bg-blue-500/20 text-blue-300 backdrop-blur-sm'
                    }`}
                  >
                    {currentQuote.type === 'radio' ? (
                      <>
                        <Radio className="w-4 h-4 mr-2" />
                        TEAM RADIO
                      </>
                    ) : currentQuote.type === 'stat' ? (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        CAREER STAT
                      </>
                    ) : (
                      <>
                        <Quote className="w-4 h-4 mr-2" />
                        QUOTE
                      </>
                    )}
                  </Badge>
                </div>

                {/* Content Display */}
                {currentQuote.type === 'stat' ? (
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-300 tracking-wide">
                      {currentQuote.text}
                    </h3>
                    <div className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
                      {currentQuote.value}
                    </div>
                  </div>
                ) : (
                  <blockquote className="text-xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed tracking-wide">
                    &ldquo;{currentQuote.text}&rdquo;
                  </blockquote>
                )}

                {/* Context */}
                <p className="text-base md:text-lg text-gray-400 font-light tracking-wide">
                  {currentQuote.context}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-4 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-gray-600"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full p-4 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:scale-110 hover:border-gray-600"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full'
                  : 'w-2 h-2 bg-gray-600 hover:bg-gray-500 rounded-full'
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm font-light tracking-wider uppercase">
              Auto-playing • Swipe or click to control
            </p>
          </div>
        )}
      </div>
    </div>
  );
}