"use client";

import React, { useState } from "react";
import { FileText, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useHistoryContext } from "./HistoryContext";
import { HistoryBill, HISTORY_PAYMENT_MODE_STYLES } from "./HistoryTypes";
import { HistorySearchFilter } from "./HistorySearchFilter";
import { HistoryBillDetailsDialog } from "./HistoryBillDetailsDialog";

export function HistoryBillList() {
  const { bills, isLoadingBills, currency, openBillDetails } = useHistoryContext();
  const [searchQuery, setSearchQuery] = useState("");

  const formatMoney = (amount: number) => `${currency} ${amount.toFixed(2)}`;

  const filteredBills = React.useMemo(() => {
    if (!bills) return [];
    let list = [...bills].reverse(); // latest first
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b => 
        String(b.id).includes(q) || 
        (b.customerName && b.customerName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [bills, searchQuery]);

  if (isLoadingBills) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--history-primary-text)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HistorySearchFilter 
        placeholder="Search by Bill # or Customer Name..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="space-y-3">
        {filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
            <FileText className="h-10 w-10 mb-2 opacity-20" />
            <p>Koi bill nahi mila.</p>
          </div>
        ) : (
          filteredBills.map((bill: HistoryBill) => (
            <Card 
              key={bill.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => openBillDetails(bill)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base">Bill #{bill.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${HISTORY_PAYMENT_MODE_STYLES[bill.paymentMode] || HISTORY_PAYMENT_MODE_STYLES.cash}`}>
                      {bill.paymentMode.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}
                  </div>
                  {bill.customerName && (
                    <div className="text-sm font-medium text-foreground">
                      👤 {bill.customerName}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-base text-[var(--history-primary-text)]">
                      {formatMoney(bill.finalAmount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bill.items.length} items
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <HistoryBillDetailsDialog />
    </div>
  );
}
