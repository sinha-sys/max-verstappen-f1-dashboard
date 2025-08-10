"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";
import type { FilterState } from "@/lib/types";

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  minYear: number;
  maxYear: number;
}

export function FilterControls({ 
  filters, 
  onFiltersChange, 
  minYear, 
  maxYear 
}: FilterControlsProps) {
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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Year Range</label>
            <span className="text-sm text-muted-foreground">
              {filters.yearRange[0]} - {filters.yearRange[1]}
            </span>
          </div>
          <Slider
            value={filters.yearRange}
            onValueChange={handleYearRangeChange}
            max={maxYear}
            min={minYear}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
