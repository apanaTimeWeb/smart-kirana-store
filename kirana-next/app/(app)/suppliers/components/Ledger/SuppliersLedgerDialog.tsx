"use client";

/**
 * SuppliersLedgerDialog.tsx
 *
 * The main modal orchestrator for a selected supplier's full ledger view.
 * Opens when a supplier is selected (ledgerId is set in context). Closes when ledgerId is null.
 *
 * RESPONSIBILITIES (exactly one):
 * → Compose and lay out the sub-components of the ledger view within a dialog shell.
 *
 * CHILD COMPONENTS (each handles exactly one thing):
 * → SuppliersLedgerHeader         — Supplier name, phone, total due card
 * → SuppliersLedgerActions        — Payment / Udhaar / Reminder / Print buttons
 * → SuppliersTransactionForm      — Inline form for new entries
 * → SuppliersLedgerTableColumnHeaders — Sticky table column labels
 * → SuppliersLedgerTable          — Scrollable transaction rows
 * → SuppliersReminderDialog       — WhatsApp reminder modal (nested)
 */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSuppliers } from "../../context/SuppliersContext";
import { SuppliersLedgerHeader } from "./SuppliersLedgerHeader";
import { SuppliersLedgerActions } from "./SuppliersLedgerActions";
import { SuppliersLedgerTable } from "./SuppliersLedgerTable";
import { SuppliersTransactionForm } from "./SuppliersTransactionForm";
import { SuppliersReminderDialog } from "./SuppliersReminderDialog";
import { SuppliersLedgerTableColumnHeaders } from "./SuppliersLedgerTableColumnHeaders";

export function SuppliersLedgerDialog() {
  const { ledgerId, setLedgerId, isLoadingLedger, ledgerDetail } =
    useSuppliers();

  return (
    <>
      <Dialog
        open={ledgerId !== null}
        onOpenChange={(open) => !open && setLedgerId(null)}
      >
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-[var(--supplier-border)]">
            <DialogTitle>Supplier Ledger</DialogTitle>
          </DialogHeader>

          {/* Loading state */}
          {isLoadingLedger && (
            <div className="py-12 text-center text-[var(--supplier-muted-text)]">
              Loading...
            </div>
          )}

          {/* Loaded state */}
          {ledgerDetail && !isLoadingLedger && (
            <div className="flex flex-col h-full p-6 overflow-hidden">
              <SuppliersLedgerHeader />
              <SuppliersLedgerActions />
              <SuppliersTransactionForm />

              {/* Ledger table container */}
              <div className="flex-1 border border-[var(--supplier-border)] rounded-xl bg-[var(--supplier-ledger-bg)] flex flex-col overflow-hidden">
                <SuppliersLedgerTableColumnHeaders />
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
