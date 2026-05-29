"use client";

import React from "react";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LedgerRow } from "./types";

interface LedgerTableProps {
  rows: LedgerRow[];
}

export function LedgerTable({ rows }: LedgerTableProps) {
  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {rows.map((tx) => (
        <div key={tx.id} className="hover:bg-muted/30">
          {/* Desktop row */}
          <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] items-center px-6 py-4">
            <div className="text-sm text-muted-foreground">
              {format(new Date(tx.createdAt), "dd MMM yyyy")}
            </div>
            <div className="flex items-start gap-3 pr-4">
              <div
                className={cn(
                  "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                  tx.type === "credit"
                    ? "bg-[var(--khata-tx-credit-icon-bg)] text-[var(--khata-tx-credit-icon-text)]"
                    : "bg-[var(--khata-tx-payment-icon-bg)] text-[var(--khata-tx-payment-icon-text)]"
                )}
              >
                {tx.type === "credit" ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              </div>
              <p className="text-sm leading-tight">{tx.description}</p>
            </div>
            <div className="text-right font-semibold">
              <span
                className={
                  tx.type === "credit"
                    ? "text-[var(--khata-tx-credit-amount)]"
                    : "text-[var(--khata-tx-payment-amount)]"
                }
              >
                {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toFixed(0)}
              </span>
            </div>
            <div className="text-right font-bold text-base">₹{tx.balance.toFixed(0)}</div>
          </div>

          {/* Mobile row */}
          <div className="sm:hidden grid grid-cols-[80px_1fr_90px] items-center px-3 py-3">
            <div className="text-xs text-muted-foreground">
              {format(new Date(tx.createdAt), "dd MMM")}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                  tx.type === "credit"
                    ? "bg-[var(--khata-tx-credit-icon-bg)] text-[var(--khata-tx-credit-icon-text)]"
                    : "bg-[var(--khata-tx-payment-icon-bg)] text-[var(--khata-tx-payment-icon-text)]"
                )}
              >
                {tx.type === "credit" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              </div>
              <p className="text-xs truncate">{tx.description}</p>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "text-xs font-semibold",
                  tx.type === "credit"
                    ? "text-[var(--khata-tx-credit-amount)]"
                    : "text-[var(--khata-tx-payment-amount)]"
                )}
              >
                {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(0)}
              </div>
              <div className="text-xs font-bold text-foreground">₹{tx.balance.toFixed(0)}</div>
            </div>
          </div>
          
          {/* Purchased Items List */}
          {tx.items && tx.items.length > 0 && (
            <div className="bg-muted/10 px-4 sm:px-[140px] py-2 text-xs border-t border-dashed">
              <div className="space-y-1">
                {tx.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-muted-foreground">
                    <span>
                      {item.productName} {item.variantName ? `(${item.variantName})` : ""} x {item.displayQuantity || item.quantity}
                    </span>
                    <span>₹{item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
