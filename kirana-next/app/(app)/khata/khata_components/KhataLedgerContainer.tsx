"use client";

import React, { useMemo } from "react";
import { useGetCustomer } from "@/lib/api";
import { useKhata } from "./KhataContext";
import { KhataLedgerHeader } from "./KhataLedgerHeader";
import { KhataLedgerActions } from "./KhataLedgerActions";
import { KhataLedgerSearch } from "./KhataLedgerSearch";
import { KhataLedgerTable } from "./KhataLedgerTable";
import { KhataTransactionForm } from "./KhataTransactionForm";
import { KhataReminderDialog } from "./KhataReminderDialog";
import { KhataLedgerRow } from "./KhataTypes";

interface KhataLedgerContainerProps {
  customerId: number;
}

export function KhataLedgerContainer({ customerId }: KhataLedgerContainerProps) {
  const { data: detail, isLoading } = useGetCustomer(customerId);
  const { ledgerSearch, transactionMode } = useKhata();

  const ledgerRows = useMemo((): KhataLedgerRow[] => {
    if (!detail?.transactions) return [];
    let balance = 0;
    return detail.transactions.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    });
  }, [detail?.transactions]);

  const filteredRows = useMemo(() => {
    if (!ledgerSearch.trim()) return ledgerRows;
    const lowerQuery = ledgerSearch.toLowerCase();
    return ledgerRows.filter((tx) => {
      if (tx.description.toLowerCase().includes(lowerQuery)) return true;
      if (tx.items) {
        return tx.items.some(
          (item) =>
            item.productName?.toLowerCase().includes(lowerQuery) ||
            item.variantName?.toLowerCase().includes(lowerQuery)
        );
      }
      return false;
    });
  }, [ledgerRows, ledgerSearch]);

  if (isLoading) return <div className="py-12 text-center text-[var(--khata-muted-text)]">Loading...</div>;
  if (!detail) return null;

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <KhataLedgerHeader name={detail.name} phone={detail.phone} totalDue={detail.totalDue} />
      <KhataLedgerActions detail={detail} ledgerRows={ledgerRows} />

      {transactionMode && <KhataTransactionForm customerId={customerId} />}
      <KhataReminderDialog detail={detail} ledgerRows={ledgerRows} />

      <div className="flex-1 border border-[var(--khata-border)] rounded-xl bg-[var(--khata-card-bg)] flex flex-col overflow-hidden min-h-[300px]">
        <KhataLedgerSearch />
        <div className="flex-1 overflow-auto">
          <KhataLedgerTable rows={filteredRows} />
        </div>
      </div>
    </div>
  );
}
