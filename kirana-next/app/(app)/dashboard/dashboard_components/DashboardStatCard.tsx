import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  subtitle: string;
  value: string;
  note?: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  iconColorClass: string;
  onClick?: () => void;
}

export function DashboardStatCard({
  title,
  subtitle,
  value,
  note,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  iconColorClass,
  onClick,
}: DashboardStatCardProps) {
  return (
    <Card 
      className={`border ${borderClass} ${bgClass} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`rounded-lg p-2 ${bgClass} border ${borderClass}`}>
            <Icon className={`h-4 w-4 ${iconColorClass}`} />
          </div>
        </div>
        <div className={`mt-3 text-3xl font-extrabold ${colorClass}`}>{value}</div>
        {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
      </CardContent>
    </Card>
  );
}
