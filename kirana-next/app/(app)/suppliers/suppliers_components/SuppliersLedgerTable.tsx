"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LedgerRow } from "./SuppliersTypes";
import { useSuppliers } from "./SuppliersContext";

export function SuppliersLedgerTable() {
  const { ledgerDetail } = useSuppliers();

  const rows = useMemo((): LedgerRow[] => {
    if (!ledgerDetail?.transactions) return [];
    let balance = 0;
    return ledgerDetail.transactions.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    });
  }, [ledgerDetail?.transactions]);

  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--supplier-muted-text)]">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--supplier-border)]">
      {rows.map((tx) => (
        <div key={tx.id} className="hover:bg-[var(--supplier-muted-bg-30)] transition-colors">
          {/* Desktop row */}
          <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] items-center px-6 py-4">
            <div className="text-sm text-[var(--supplier-muted-text)]">
              {format(new Date(tx.createdAt), "dd MMM yyyy")}
            </div>
            <div className="flex items-start gap-3 pr-4">
              <div
                className={cn(
                  "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                  tx.type === "credit"
                    ? "bg-[var(--supplier-tx-credit-icon-bg)] text-[var(--supplier-tx-credit-icon-text)]"
                    : "bg-[var(--supplier-tx-payment-icon-bg)] text-[var(--supplier-tx-payment-icon-text)]"
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
                    ? "text-[var(--supplier-tx-credit-amount)]"
                    : "text-[var(--supplier-tx-payment-amount)]"
                }
              >
                {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toFixed(0)}
              </span>
            </div>
            <div className="text-right font-bold text-base">₹{tx.balance.toFixed(0)}</div>
          </div>

          {/* Mobile row */}
          <div className="sm:hidden grid grid-cols-[80px_1fr_90px] items-center px-3 py-3">
            <div className="text-xs text-[var(--supplier-muted-text)]">
              {format(new Date(tx.createdAt), "dd MMM")}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                  tx.type === "credit"
                    ? "bg-[var(--supplier-tx-credit-icon-bg)] text-[var(--supplier-tx-credit-icon-text)]"
                    : "bg-[var(--supplier-tx-payment-icon-bg)] text-[var(--supplier-tx-payment-icon-text)]"
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
                    ? "text-[var(--supplier-tx-credit-amount)]"
                    : "text-[var(--supplier-tx-payment-amount)]"
                )}
              >
                {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(0)}
              </div>
              <div className="text-xs font-bold">₹{tx.balance.toFixed(0)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
