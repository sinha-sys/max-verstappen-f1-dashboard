import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import type { RecordItem } from "@/lib/types";

interface RecordsProps {
  records: RecordItem[];
}

export function Records({ records }: RecordsProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          {t('records.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record, index) => (
            <div
              key={index}
              className="flex flex-col space-y-2 p-3 sm:p-4 rounded-lg border bg-card/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm leading-tight">{record.category}</h3>
                {record.note && (
                  <Badge variant="secondary" className="text-xs">
                    {record.note}
                  </Badge>
                )}
              </div>
              <p className="text-base sm:text-lg font-bold text-primary">{record.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
