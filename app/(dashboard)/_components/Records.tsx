import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame } from "lucide-react";
import type { RecordItem } from "@/lib/types";

interface RecordsProps {
  records: RecordItem[];
}

export function Records({ records }: RecordsProps) {
  const getRecordIcon = (category: string) => {
    if (category.toLowerCase().includes("championship")) return Trophy;
    if (category.toLowerCase().includes("record")) return Flame;
    return Star;
  };

  const getRecordVariant = (record: RecordItem) => {
    if (record.note?.toLowerCase().includes("record")) return "destructive";
    if (record.category.toLowerCase().includes("championship")) return "default";
    return "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notable Records & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record, index) => {
            const Icon = getRecordIcon(record.category);
            return (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <Icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-medium text-sm">{record.category}</h3>
                    <p className="text-lg font-bold">{record.value}</p>
                  </div>
                  {record.note && (
                    <Badge variant={getRecordVariant(record)} className="text-xs">
                      {record.note}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
