"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Trophy, Calendar } from "lucide-react";

interface NewsAlertProps {
  title?: string;
  message: string;
  type?: "success" | "info" | "warning";
  dismissible?: boolean;
  showDate?: boolean;
}

export function NewsAlert({ 
  title = "Latest News",
  message, 
  type = "success", 
  dismissible = true,
  showDate = true 
}: NewsAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          cardClass: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
          badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          iconClass: "text-green-600 dark:text-green-400",
          textClass: "text-green-900 dark:text-green-100"
        };
      case "info":
        return {
          cardClass: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
          badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          iconClass: "text-blue-600 dark:text-blue-400",
          textClass: "text-blue-900 dark:text-blue-100"
        };
      case "warning":
        return {
          cardClass: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
          badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          iconClass: "text-yellow-600 dark:text-yellow-400",
          textClass: "text-yellow-900 dark:text-yellow-100"
        };
      default:
        return {
          cardClass: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
          badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          iconClass: "text-green-600 dark:text-green-400",
          textClass: "text-green-900 dark:text-green-100"
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Card className={`${styles.cardClass} border-2 shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <Trophy className={`h-5 w-5 ${styles.iconClass}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={`${styles.badgeClass} text-xs font-medium`}>
                  {title}
                </Badge>
                {showDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Aug 31, 2025</span>
                  </div>
                )}
              </div>
              
              <p className={`text-sm font-medium leading-relaxed ${styles.textClass}`}>
                {message}
              </p>
            </div>
          </div>
          
          {/* Dismiss Button */}
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Dismiss news alert"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
