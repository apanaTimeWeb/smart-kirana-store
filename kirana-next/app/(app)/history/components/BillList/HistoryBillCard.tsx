"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { HistoryBill } from "../../shared/HistoryTypes";
import { HISTORY_PAYMENT_MODE_STYLES } from "../../shared/HistorySharedConstants";

interface HistoryBillCardProps {
  /** The bill data to display in this card row */
  bill: HistoryBill;
  /** Currency symbol from store settings (e.g. "Rs") */
  currency: string;
  /** Called when the user taps/clicks this card to open the bill detail dialog */
  onOpen: (bill: HistoryBill) => void;
}

/**
 * HistoryBillCard
 *
 * Renders a single tappable bill row in the bill list.
 * Displays:
 *   - Bill number + payment mode badge (Cash / UPI / Khata)
 *   - Date/time formatted as "dd MMM yyyy, hh:mm a"
 *   - Customer name (if present)
 *   - Final amount + item count (right side)
 *   - Chevron affordance
 *
 * Receives all data as props — no context reads here.
 * Purely a presentational component; zero side effects.
 */
export function HistoryBillCard({ bill, currency, onOpen }: HistoryBillCardProps) {
  const formatMoney = (amount: number) => `${currency} ${amount.toFixed(2)}`;
  const badgeStyle =
    HISTORY_PAYMENT_MODE_STYLES[bill.paymentMode] || HISTORY_PAYMENT_MODE_STYLES.cash;

  return (
    <Card
      className="cursor-pointer bg-[var(--history-card-bg)] text-[var(--history-card-text)] border-[var(--history-border)] hover:border-[var(--history-primary-border)] transition-colors"
      onClick={() => onOpen(bill)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        {/* Left: bill meta */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-base">Bill #{bill.id}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${badgeStyle}`}
            >
              {bill.paymentMode.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-[var(--history-muted-text)] mb-1">
            {format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}
          </div>
          {bill.customerName && (
            <div className="text-sm font-medium text-foreground">
              👤 {bill.customerName}
            </div>
          )}
        </div>

        {/* Right: amount + chevron */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-bold text-base text-[var(--history-primary-text)]">
              {formatMoney(bill.finalAmount)}
            </div>
            <div className="text-xs text-[var(--history-muted-text)]">
              {bill.items.length} items
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--history-muted-text)] opacity-50" />
        </div>
      </CardContent>
    </Card>
  );
}
