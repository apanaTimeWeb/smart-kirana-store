"use client";

/**
 * SuppliersLedgerActions.tsx
 *
 * Renders the action button panel inside the Supplier Ledger Dialog.
 * Buttons: "Payment Mila", "Udhaar Diya", "Reminder", "Thermal Print"
 *
 * RESPONSIBILITIES (exactly one):
 * → Render the 4 action buttons and handle their click dispatch.
 *
 * PRINT LOGIC: Delegated to SuppliersPrintUtils.ts (not here).
 * WHATSAPP URL: Built by buildWhatsAppUrl() in SuppliersConstants.ts (not here).
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, MessageCircle, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSuppliers } from "../../suppliers_context/SuppliersContext";
import { printSupplierThermalBill } from "../../suppliers_utils/SuppliersPrintUtils";

export function SuppliersLedgerActions() {
  const {
    ledgerDetail,
    shopSettings,
    transactionMode,
    setTransactionMode,
    setIsReminderOpen,
  } = useSuppliers();

  const handlePrint = () => {
    if (!ledgerDetail) return;
    printSupplierThermalBill(ledgerDetail, shopSettings);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex flex-wrap gap-3 justify-center bg-[var(--supplier-btn-panel-bg)] border border-[var(--supplier-border)] rounded-xl p-2 shadow-sm">
        <Button
          size="sm"
          onClick={() => setTransactionMode("payment")}
          className={cn(
            "transition-all",
            transactionMode === "payment" &&
              "ring-2 ring-offset-2 [--tw-ring-color:var(--supplier-btn-payment-ring)] bg-[var(--supplier-btn-payment-active-bg)]"
          )}
        >
          <IndianRupee className="mr-1.5 h-4 w-4" /> Payment Mila
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setTransactionMode("credit")}
          className={cn(
            "transition-all border-[var(--supplier-btn-credit-border)] text-[var(--supplier-btn-credit-text)] hover:bg-[var(--supplier-btn-credit-hover-bg)]",
            transactionMode === "credit" &&
              "ring-2 ring-offset-2 [--tw-ring-color:var(--supplier-btn-credit-ring)] bg-[var(--supplier-btn-credit-active-bg)]"
          )}
        >
          <CreditCard className="mr-1.5 h-4 w-4" /> Udhaar Diya
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsReminderOpen(true)}
          className="border-[var(--supplier-btn-reminder-border)] text-[var(--supplier-btn-reminder-text)] hover:bg-[var(--supplier-btn-reminder-hover-bg)]"
        >
          <MessageCircle className="mr-1.5 h-4 w-4" /> Reminder
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handlePrint}
          className="border-[var(--supplier-border)]"
        >
          <Printer className="mr-1.5 h-4 w-4" /> Thermal Print
        </Button>
      </div>
    </div>
  );
}
