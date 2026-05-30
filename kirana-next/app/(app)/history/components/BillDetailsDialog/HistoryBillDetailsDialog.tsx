"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useReturnBillItems } from "@/lib/api/bills";
import { useToast } from "@/hooks/use-toast";
import { useHistoryContext } from "../../context/HistoryContext";
import { printHistoryReceipt } from "../../utils/HistoryPrintUtils";
import { sendHistoryWhatsAppBill } from "../../utils/HistoryWhatsAppUtils";
import { HistoryBillDetailsHeader } from "./HistoryBillDetailsHeader";
import { HistoryBillItemsReturnList } from "../Returns/HistoryBillItemsReturnList";
import { HistoryBillDialogFooterActions } from "./HistoryBillDialogFooterActions";
import { HistoryBillReturnSuccessScreen } from "../Returns/HistoryBillReturnSuccessScreen";
import type { HistoryBill, HistoryReturnQtys } from "../../shared/HistoryTypes";

/**
 * HistoryBillDetailsDialog — Slim Shell
 *
 * Owns all local state for the bill detail & return flow and
 * composes it from focused sub-components:
 *
 *   ┌─ Dialog ────────────────────────────────────────────────────┐
 *   │  isSuccess=false:                                           │
 *   │    <HistoryBillDetailsHeader />      ← bill #, date, badge  │
 *   │    <HistoryBillItemsReturnList />    ← items + return inputs│
 *   │    <HistoryBillDialogFooterActions />← Print/WA/Close/Confirm│
 *   │                                                             │
 *   │  isSuccess=true:                                            │
 *   │    <HistoryBillReturnSuccessScreen />← success + send/print │
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

  const [returnQtys, setReturnQtys] = useState<HistoryReturnQtys>({});
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
            <HistoryBillDialogFooterActions
              onPrint={() => printHistoryReceipt(currentBill, currency, settings)}
              onWhatsApp={() => sendHistoryWhatsAppBill(currentBill, phoneNumber, settings)}
              onClose={() => setIsDialogOpen(false)}
              onConfirmReturn={handleConfirmReturn}
              hasReturns={hasReturns}
              isPending={returnMutation.isPending}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
