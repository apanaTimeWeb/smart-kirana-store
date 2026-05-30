"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Printer, MessageCircle } from "lucide-react";

interface HistoryBillDialogFooterActionsProps {
  /** Called when user clicks the Print button */
  onPrint: () => void;
  /** Called when user clicks the WhatsApp button */
  onWhatsApp: () => void;
  /** Called when user clicks the Close button */
  onClose: () => void;
  /** Called when user clicks the Confirm Return button */
  onConfirmReturn: () => void;
  /** True when at least one item has a non-zero return qty — controls button variant + disabled state */
  hasReturns: boolean;
  /** True while the return API mutation is in-flight — shows loading spinner */
  isPending: boolean;
}

/**
 * HistoryBillDialogFooterActions
 *
 * The sticky footer action bar shown at the bottom of the bill details dialog
 * (the non-success screen view). Renders four action buttons:
 *
 *   [ Print ]  [ WhatsApp ]  [ Close ]  [ Confirm Return / Select Qty ]
 *
 * All business logic (calculating totals, calling mutations) stays in the
 * parent HistoryBillDetailsDialog. This component is purely presentational.
 *
 * Button states:
 *   - "Confirm Return" → only enabled when hasReturns=true and isPending=false
 *   - Loading spinner  → shown inside confirm button while isPending=true
 *   - Secondary variant → when no return qty selected ("Select Return Qty" label)
 *   - Destructive variant → when returns are selected ("Confirm Return" label)
 */
export function HistoryBillDialogFooterActions({
  onPrint,
  onWhatsApp,
  onClose,
  onConfirmReturn,
  hasReturns,
  isPending,
}: HistoryBillDialogFooterActionsProps) {
  return (
    <div className="p-4 border-t border-[var(--history-border)] bg-[var(--history-card-bg)] shrink-0 flex gap-2 flex-wrap sm:flex-nowrap">
      {/* Print current bill */}
      <Button
        variant="outline"
        className="flex-1 min-w-[80px]"
        onClick={onPrint}
      >
        <Printer className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Print</span>
      </Button>

      {/* WhatsApp share */}
      <Button
        variant="outline"
        className="flex-1 min-w-[80px] text-[var(--history-success-text)] hover:text-[var(--history-success-text)] hover:bg-[var(--history-success-bg)]"
        onClick={onWhatsApp}
      >
        <MessageCircle className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>

      {/* Close dialog */}
      <Button
        variant="outline"
        className="flex-1 min-w-[80px]"
        onClick={onClose}
      >
        Close
      </Button>

      {/* Confirm return — primary CTA */}
      <Button
        className="flex-[2] min-w-[120px] gap-2"
        variant={hasReturns ? "destructive" : "secondary"}
        disabled={!hasReturns || isPending}
        onClick={onConfirmReturn}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
          </>
        ) : hasReturns ? (
          <>
            <Check className="h-4 w-4" /> Confirm Return
          </>
        ) : (
          "Select Return Qty"
        )}
      </Button>
    </div>
  );
}
