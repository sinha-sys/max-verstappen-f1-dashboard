"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatNumber, formatPoints, formatOrdinal } from "@/lib/format";
import type { SeasonStat } from "@/lib/types";

interface SeasonTableProps {
  seasons: SeasonStat[];
}

type SortField = keyof SeasonStat;
type SortDirection = "asc" | "desc" | null;

export function SeasonTable({ seasons }: SeasonTableProps) {
  const [sortField, setSortField] = useState<SortField>("season");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSeasons = [...seasons].sort((a, b) => {
    if (!sortDirection) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (aValue < bValue) return -1 * modifier;
    if (aValue > bValue) return 1 * modifier;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const columns = [
    { key: "season" as SortField, label: "Season", align: "left" },
    { key: "starts" as SortField, label: "Starts", align: "center" },
    { key: "wins" as SortField, label: "Wins", align: "center" },
    { key: "podiums" as SortField, label: "Podiums", align: "center" },
    { key: "poles" as SortField, label: "Poles", align: "center" },
    { key: "fastestLaps" as SortField, label: "Fastest Laps", align: "center" },
    { key: "points" as SortField, label: "Points", align: "center" },
    { key: "rank" as SortField, label: "Championship", align: "center" },
  ];

  return (
    <Card className="mobile-tap-highlight">
      <CardHeader className="pb-3 iphone:pb-4">
        <CardTitle className="text-base iphone:text-lg">Season-by-Season Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mobile-scroll-container">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(({ key, label, align }) => (
                  <TableHead 
                    key={key} 
                    className={`${align === "center" ? "text-center" : "text-left"} sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(key)}
                      className="h-6 iphone:h-8 p-1 iphone:p-2 hover:bg-transparent text-xs iphone:text-sm mobile-touch-action"
                    >
                      <span className="truncate">{label}</span>
                      {getSortIcon(key)}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSeasons.map((season) => (
                <TableRow key={season.season} className="hover:bg-muted/50 mobile-tap-highlight">
                  <TableCell className="font-medium text-xs iphone:text-sm p-2 iphone:p-4">{season.season}</TableCell>
                  <TableCell className="text-center text-xs iphone:text-sm p-2 iphone:p-4">{formatNumber(season.starts)}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-yellow-600">
                      {formatNumber(season.wins)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-green-600">
                      {formatNumber(season.podiums)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-purple-600">
                      {formatNumber(season.poles)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{formatNumber(season.fastestLaps)}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold">
                      {formatPoints(season.points)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {season.rank ? (
                      <Badge variant={season.rank === 1 ? "default" : "secondary"}>
                        {formatOrdinal(season.rank)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
