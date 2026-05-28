import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  sublabel: string;
  value: string;
  note?: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  isLoading?: boolean;
}

export function StatCard({
  label,
  sublabel,
  value,
  note,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  isLoading,
}: StatCardProps) {
  return (
    <Card className={`border ${borderClass} ${bgClass}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="text-[10px] text-muted-foreground">{sublabel}</p>
          </div>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-24" />
        ) : (
          <div className={`mt-3 text-2xl font-extrabold ${colorClass}`}>
            {value}
          </div>
        )}
        {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
      </CardContent>
    </Card>
  );
}
