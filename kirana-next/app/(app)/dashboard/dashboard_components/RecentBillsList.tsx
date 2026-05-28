import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShoppingBag } from "lucide-react";

type RecentBill = {
  id: number;
  customerName?: string;
  finalAmount: number;
  paymentMode: string;
  createdAt: string;
};

interface RecentBillsListProps {
  bills: RecentBill[];
}

export function RecentBillsList({ bills }: RecentBillsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingBag className="h-4 w-4 text-primary" />
          हाल की बिक्री
          <span className="text-sm font-normal text-muted-foreground ml-1">(Recent Bills)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {bills.length > 0 ? (
          <div className="divide-y">
            {bills.slice(0, 6).map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                data-testid={`row-bill-${bill.id}`}
              >
                <div>
                  <p className="font-semibold text-sm">{bill.customerName || "Walk-in Customer"}</p>
                  <p className="text-xs text-muted-foreground">
                    Bill #{bill.id} · {format(new Date(bill.createdAt), "hh:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹{bill.finalAmount.toFixed(0)}</p>
                  <Badge
                    variant="outline"
                    className={
                      bill.paymentMode === "khata"
                        ? "text-[var(--dashboard-badge-khata-text)] border-[var(--dashboard-badge-khata-border)] bg-[var(--dashboard-badge-khata-bg)] text-[10px]"
                        : bill.paymentMode === "upi"
                        ? "text-[var(--dashboard-badge-upi-text)] border-[var(--dashboard-badge-upi-border)] bg-[var(--dashboard-badge-upi-bg)] text-[10px]"
                        : "text-[var(--dashboard-badge-cash-text)] border-[var(--dashboard-badge-cash-border)] bg-[var(--dashboard-badge-cash-bg)] text-[10px]"
                    }
                  >
                    {bill.paymentMode === "khata" ? "Khata" : bill.paymentMode === "upi" ? "UPI" : "Cash"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">Aaj abhi koi bill nahi</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
