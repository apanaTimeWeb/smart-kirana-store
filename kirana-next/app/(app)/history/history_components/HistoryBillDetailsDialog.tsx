"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Printer, MessageCircle } from "lucide-react";
import { useReturnBillItems } from "@/lib/api/bills";
import { useToast } from "@/hooks/use-toast";
import { useHistoryContext } from "./HistoryContext";
import { printHistoryReceipt } from "./HistoryPrintUtils";
import { sendHistoryWhatsAppBill } from "./HistoryWhatsAppUtils";
import { HistoryBillDetailsHeader } from "./HistoryBillDetailsHeader";
import { HistoryBillItemsReturnList } from "./HistoryBillItemsReturnList";
import { HistoryBillReturnSuccessScreen } from "./HistoryBillReturnSuccessScreen";
import type { HistoryBill } from "./HistoryTypes";

/**
 * HistoryBillDetailsDialog — Slim Shell
 *
 * Owns all local state for the bill detail & return flow and
 * composes it from three focused sub-components:
 *
 *   ┌─ Dialog ────────────────────────────────────────────────────┐
 *   │  isSuccess=false:                                           │
 *   │    <HistoryBillDetailsHeader />   ← bill #, date, badge    │
 *   │    <HistoryBillItemsReturnList /> ← items + return inputs  │
 *   │    <Footer action bar />          ← Print/WA/Close/Confirm │
 *   │                                                             │
 *   │  isSuccess=true:                                            │
 *   │    <HistoryBillReturnSuccessScreen /> ← success + send/print│
 *   └─────────────────────────────────────────────────────────────┘
 *
 * State owned here (not in sub-components):
 *   returnQtys   → passed to HistoryBillItemsReturnList
 *   isSuccess    → switches between detail view and success screen
 *   phoneNumber  → passed to HistoryBillReturnSuccessScreen
 *   updatedBill  → overrides selectedBill after return, for print/send
 *   searchQuery  → passed to HistoryBillItemsReturnList
 */
export function HistoryBillDetailsDialog() {
  const { toast } = useToast();
  const returnMutation = useReturnBillItems();
  const { selectedBill, isDialogOpen, setIsDialogOpen, currency, settings } =
    useHistoryContext();

  const [returnQtys, setReturnQtys] = useState<Record<number, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [updatedBill, setUpdatedBill] = useState<HistoryBill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset all local state when dialog opens or selected bill changes
  useEffect(() => {
    if (isDialogOpen) {
      setReturnQtys({});
      setIsSuccess(false);
      setPhoneNumber("");
      setUpdatedBill(null);
      setSearchQuery("");
    }
  }, [isDialogOpen, selectedBill]);

  if (!selectedBill) return null;

  const currentBill = updatedBill || selectedBill;

  // ── Return logic ──────────────────────────────────────────────
  const handleQtyChange = (productId: number, val: string, max: number) => {
    if (!/^\d*$/.test(val)) return;
    let numVal = parseInt(val || "0", 10);
    if (numVal > max) numVal = max;
    setReturnQtys((prev) => ({ ...prev, [productId]: val ? String(numVal) : "" }));
  };

  const calculateTotalRefund = () => {
    let total = 0;
    selectedBill.items.forEach((item) => {
      const qty = parseInt(returnQtys[item.productId] || "0", 10);
      if (qty > 0) total += qty * item.unitPrice;
    });
    return total;
  };

  const totalRefund = calculateTotalRefund();
  const hasReturns = totalRefund > 0;

  const handleConfirmReturn = () => {
    if (!hasReturns) return;
    const itemsToReturn = Object.entries(returnQtys)
      .map(([productId, qtyStr]) => ({
        productId: parseInt(productId, 10),
        quantityToReturn: parseInt(qtyStr || "0", 10),
      }))
      .filter((item) => item.quantityToReturn > 0);

    returnMutation.mutate(
      { data: { billId: selectedBill.id, items: itemsToReturn } },
      {
        onSuccess: (newBill) => {
          toast({ title: "✅ Return processed successfully!" });
          setUpdatedBill(newBill);
          setIsSuccess(true);
        },
        onError: () => {
          toast({ title: "❌ Failed to process return", variant: "destructive" });
        },
      }
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-md w-[95%] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {isSuccess ? (
          // ── Post-return success screen ──────────────────────────
          <HistoryBillReturnSuccessScreen
            phoneNumber={phoneNumber}
            onPhoneChange={setPhoneNumber}
            onSend={() => sendHistoryWhatsAppBill(currentBill, phoneNumber, settings)}
            onPrint={() => printHistoryReceipt(currentBill, currency, settings)}
            onClose={() => setIsDialogOpen(false)}
          />
        ) : (
          <>
            {/* ── Dialog header ─────────────────────────────────── */}
            <HistoryBillDetailsHeader />

            {/* ── Scrollable items body ─────────────────────────── */}
            <HistoryBillItemsReturnList
              returnQtys={returnQtys}
              onQtyChange={handleQtyChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalRefund={totalRefund}
            />

            {/* ── Footer action bar ─────────────────────────────── */}
            <div className="p-4 border-t border-[var(--history-border)] bg-[var(--history-card-bg)] shrink-0 flex gap-2 flex-wrap sm:flex-nowrap">
              <Button
                variant="outline"
                className="flex-1 min-w-[80px]"
                onClick={() => printHistoryReceipt(currentBill, currency, settings)}
              >
                <Printer className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[80px] text-[var(--history-success-text)] hover:text-[var(--history-success-text)] hover:bg-[var(--history-success-bg)]"
                onClick={() => sendHistoryWhatsAppBill(currentBill, phoneNumber, settings)}
              >
                <MessageCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[80px]"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                className="flex-[2] min-w-[120px] gap-2"
                variant={hasReturns ? "destructive" : "secondary"}
                disabled={!hasReturns || returnMutation.isPending}
                onClick={handleConfirmReturn}
              >
                {returnMutation.isPending ? (
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
