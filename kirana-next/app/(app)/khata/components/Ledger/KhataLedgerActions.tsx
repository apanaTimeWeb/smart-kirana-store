"use client";

// KhataLedgerActions.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders the 4 action buttons for a customer's ledger:
//   1. Payment Mila  — sets transactionMode = "payment" in context
//   2. Udhaar Diya   — sets transactionMode = "credit" in context
//   3. Reminder      — opens the WhatsApp Reminder Dialog
//   4. Thermal Print — triggers printThermalBill from KhataPrintUtils
//
// To add/remove/reorder ledger actions, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, MessageCircle, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CustomerDetail, KhataLedgerRow } from "@/app/(app)/khata/types/KhataTypes";
import { useKhata } from "@/app/(app)/khata/context/KhataContext";
import { KhataConstants } from "@/app/(app)/khata/constants/KhataConstants";
import { printThermalBill } from "@/app/(app)/khata/utils/KhataPrintUtils";
import { useGetSettings } from "@/lib/api";

interface KhataLedgerActionsProps {
  /** Full customer detail object including transactions. */
  detail: CustomerDetail;
  /** Computed ledger rows with running balance — passed in from the container. */
  ledgerRows: KhataLedgerRow[];
}

export function KhataLedgerActions({ detail, ledgerRows }: KhataLedgerActionsProps) {
  const { transactionMode, setTransactionMode, setIsReminderOpen } = useKhata();
  const { data: settings } = useGetSettings();

  const handlePrint = () => {
    printThermalBill(detail, ledgerRows, settings, KhataConstants.SHOP_NAME_DEFAULT);
  };

  const handleReminderClick = () => {
    setIsReminderOpen(true);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex flex-wrap gap-3 justify-center bg-[var(--khata-btn-panel-bg)] border rounded-xl p-2 shadow-sm">
        <Button
          size="sm"
          onClick={() => setTransactionMode("payment")}
          className={cn(
            "transition-all",
            transactionMode === "payment" &&
              "ring-2 ring-offset-2 [--tw-ring-color:var(--khata-btn-payment-ring)] bg-[var(--khata-btn-payment-active-bg)]"
          )}
        >
          <IndianRupee className="mr-1.5 h-4 w-4" /> {KhataConstants.LABELS.PAYMENT_MILA}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setTransactionMode("credit")}
          className={cn(
            "transition-all border-[var(--khata-btn-credit-border)] text-[var(--khata-btn-credit-text)] hover:bg-[var(--khata-btn-credit-hover-bg)]",
            transactionMode === "credit" &&
              "ring-2 ring-offset-2 [--tw-ring-color:var(--khata-btn-credit-ring)] bg-[var(--khata-btn-credit-active-bg)]"
          )}
        >
          <CreditCard className="mr-1.5 h-4 w-4" /> {KhataConstants.LABELS.UDHAAR_DIYA}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleReminderClick}
          className="border-[var(--khata-btn-reminder-border)] text-[var(--khata-btn-reminder-text)] hover:bg-[var(--khata-btn-reminder-hover-bg)]"
        >
          <MessageCircle className="mr-1.5 h-4 w-4" /> {KhataConstants.LABELS.REMINDER}
        </Button>

        <Button size="sm" variant="outline" onClick={handlePrint}>
          <Printer className="mr-1.5 h-4 w-4" /> {KhataConstants.LABELS.THERMAL_PRINT}
        </Button>
      </div>
    </div>
  );
}
