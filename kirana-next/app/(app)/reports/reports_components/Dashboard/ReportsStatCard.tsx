"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportsStatCardProps {
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

export function ReportsStatCard({
  label,
  sublabel,
  value,
  note,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  isLoading,
}: ReportsStatCardProps) {
  return (
    <Card className={`border ${borderClass} ${bgClass}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--reports-muted-text)]">
              {label}
            </p>
            <p className="text-[10px] text-[var(--reports-muted-text)]">{sublabel}</p>
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
        {note && <p className="mt-1 text-xs text-[var(--reports-muted-text)]">{note}</p>}
      </CardContent>
    </Card>
  );
}
