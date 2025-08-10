"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatPoints } from "@/lib/format";
import { ChevronUp, ChevronDown, Calendar } from "lucide-react";
import type { SeasonStat } from "@/lib/types";

interface SeasonTableProps {
  seasons: SeasonStat[];
}

type SortKey = keyof SeasonStat;
type SortOrder = "asc" | "desc";

export function SeasonTable({ seasons }: SeasonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("season");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedSeasons = [...seasons].sort((a, b) => {
    const aValue = a[sortKey] ?? 0;
    const bValue = b[sortKey] ?? 0;
    
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const SortButton = ({ column, children }: { column: SortKey; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 hover:text-foreground font-medium"
    >
      {children}
      {sortKey === column && (
        sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      )}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Season by Season Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-left">
                  <SortButton column="season">Season</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="starts">Starts</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="wins">Wins</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="podiums">Podiums</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="poles">Poles</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="fastestLaps">FL</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="points">Points</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton column="rank">Rank</SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSeasons.map((season) => (
                <TableRow key={season.season} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{season.season}</TableCell>
                  <TableCell className="text-center">{formatNumber(season.starts)}</TableCell>
                  <TableCell className="text-center">
                    <span className={season.wins > 0 ? "text-yellow-600 font-semibold" : ""}>
                      {formatNumber(season.wins)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={season.podiums > 0 ? "text-green-600 font-semibold" : ""}>
                      {formatNumber(season.podiums)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={season.poles > 0 ? "text-purple-600 font-semibold" : ""}>
                      {formatNumber(season.poles)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={season.fastestLaps > 0 ? "text-pink-600 font-semibold" : ""}>
                      {formatNumber(season.fastestLaps)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-indigo-600 font-semibold">
                      {formatPoints(season.points)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {season.rank ? (
                      <Badge 
                        variant={season.rank === 1 ? "default" : "secondary"}
                        className={season.rank === 1 ? "bg-amber-600" : ""}
                      >
                        P{season.rank}
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
