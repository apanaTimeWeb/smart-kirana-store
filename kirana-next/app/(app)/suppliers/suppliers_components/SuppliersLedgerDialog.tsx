"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSuppliers } from "./SuppliersContext";
import { SuppliersLedgerHeader } from "./SuppliersLedgerHeader";
import { SuppliersLedgerActions } from "./SuppliersLedgerActions";
import { SuppliersLedgerTable } from "./SuppliersLedgerTable";
import { SuppliersTransactionForm } from "./SuppliersTransactionForm";
import { SuppliersReminderDialog } from "./SuppliersReminderDialog";

export function SuppliersLedgerDialog() {
  const { ledgerId, setLedgerId, isLoadingLedger, ledgerDetail } = useSuppliers();

  return (
    <>
      <Dialog open={ledgerId !== null} onOpenChange={(open) => !open && setLedgerId(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-[var(--supplier-border)]">
            <DialogTitle>Supplier Ledger</DialogTitle>
          </DialogHeader>
          
          {isLoadingLedger && <div className="py-12 text-center text-[var(--supplier-muted-text)]">Loading...</div>}
          
          {ledgerDetail && !isLoadingLedger && (
            <div className="flex flex-col h-full p-6 overflow-hidden">
              <SuppliersLedgerHeader />
              <SuppliersLedgerActions />
              <SuppliersTransactionForm />

              <div className="flex-1 border border-[var(--supplier-border)] rounded-xl bg-[var(--supplier-ledger-bg)] flex flex-col overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] bg-[var(--supplier-muted-bg)] sticky top-0 text-xs font-semibold text-[var(--supplier-muted-text)] border-b border-[var(--supplier-border)]">
                  <div className="px-6 py-3.5">Date</div>
                  <div className="px-6 py-3.5">Description</div>
                  <div className="px-6 py-3.5 text-right">Amount</div>
                  <div className="px-6 py-3.5 text-right">Balance</div>
                </div>
                {/* Mobile header */}
                <div className="sm:hidden grid grid-cols-[80px_1fr_90px] bg-[var(--supplier-muted-bg)] sticky top-0 text-xs font-semibold text-[var(--supplier-muted-text)] border-b border-[var(--supplier-border)]">
                  <div className="px-3 py-3">Date</div>
                  <div className="px-3 py-3">Details</div>
                  <div className="px-3 py-3 text-right">Amt / Bal</div>
                </div>
                <div className="flex-1 overflow-auto">
                  <SuppliersLedgerTable />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <SuppliersReminderDialog />
    </>
  );
}
