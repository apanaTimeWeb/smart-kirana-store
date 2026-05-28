"use client";

import React, { useState } from "react";
import { useListBills } from "@/lib/api";
import { Bill } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { BillDetailsDialog } from "./BillDetailsDialog";
import { useGetSettings } from "@/lib/api";

export function BillHistoryList() {
  const { data: bills, isLoading } = useListBills();
  const { data: settings } = useGetSettings();
  const currency = settings?.currency ?? "Rs";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by Bill # or Customer Name..." 
          className="pl-9 h-11"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-6 space-y-3">
        {filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <FileText className="h-10 w-10 mb-2 opacity-20" />
            <p>Koi bill nahi mila.</p>
          </div>
        ) : (
          filteredBills.map((bill) => (
            <Card 
              key={bill.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleBillClick(bill)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base">Bill #{bill.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      bill.paymentMode === "khata" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      bill.paymentMode === "upi" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
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
                    <div className="font-bold text-base text-primary">
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

      <BillDetailsDialog 
        bill={selectedBill} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        currency={currency}
      />
    </div>
  );
}
