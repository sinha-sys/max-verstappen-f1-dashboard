"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Filter } from "lucide-react";
import type { FilterState } from "@/lib/types";

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  minYear: number;
  maxYear: number;
}

export function FilterControls({ filters, onFiltersChange, minYear, maxYear }: FilterControlsProps) {
  const handleYearRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      yearRange: [value[0], value[1]],
    });
  };

  const handleReset = () => {
    onFiltersChange({
      yearRange: [minYear, maxYear],
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Filter Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Season Range</label>
              <span className="text-xs text-muted-foreground">
                {filters.yearRange[0]} - {filters.yearRange[1]}
              </span>
            </div>
            <Slider
              min={minYear}
              max={maxYear}
              step={1}
              value={filters.yearRange}
              onValueChange={handleYearRangeChange}
              className="w-full touch-manipulation"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{minYear}</span>
              <span>{maxYear}</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full touch-manipulation"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
