import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

interface PendingKhataListProps {
  isLoading: boolean;
  customers: { id: number; name: string; phone: string; totalDue: number }[];
  moneyFormatter: (value: number) => string;
}

export function PendingKhataList({ isLoading, customers, moneyFormatter }: PendingKhataListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-[var(--reports-khata-color)]" />
          Pending Udhaar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
        ) : customers.length > 0 ? (
          <div className="divide-y">
            {customers.slice(0, 6).map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20"
                data-testid={`row-khata-${customer.id}`}
              >
                <div>
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                </div>
                <span className="text-sm font-bold text-[var(--reports-khata-color)]">
                  {moneyFormatter(customer.totalDue)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <BookOpen className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">Koi udhaar nahi, sab clear hai.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
