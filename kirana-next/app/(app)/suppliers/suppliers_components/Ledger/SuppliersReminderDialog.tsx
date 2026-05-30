"use client";

/**
 * SuppliersReminderDialog.tsx
 *
 * Dialog that shows a WhatsApp reminder message preview for a supplier and provides
 * two dispatch options: "Text Only" (WhatsApp only) or "Bill + Text" (print + WhatsApp).
 *
 * RESPONSIBILITIES (exactly one):
 * → Render the reminder preview dialog and handle its two dispatch actions.
 *
 * PRINT LOGIC:   Delegated to SuppliersPrintUtils.ts (not here).
 * MESSAGE TEXT:  Built by buildSupplierReminderMessage() in SuppliersConstants.ts.
 * WHATSAPP URL:  Built by buildWhatsAppUrl() in SuppliersConstants.ts.
 */

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSuppliers } from "../../suppliers_context/SuppliersContext";
import { printSupplierThermalBill } from "../../suppliers_utils/SuppliersPrintUtils";
import {
  SUPPLIER_SHOP_NAME_FALLBACK,
  buildSupplierReminderMessage,
  buildWhatsAppUrl,
} from "../../suppliers_constants/SuppliersSharedConstants";

export function SuppliersReminderDialog() {
  const { isReminderOpen, setIsReminderOpen, ledgerDetail, shopSettings } =
    useSuppliers();

  const shopName =
    shopSettings?.shopName?.trim() || SUPPLIER_SHOP_NAME_FALLBACK;

  // Build the reminder message once whenever the ledger or shop name changes
  const reminderMessage = useMemo(() => {
    if (!ledgerDetail) return "";
    return buildSupplierReminderMessage(
      ledgerDetail.name,
      ledgerDetail.totalDue,
      shopName
    );
  }, [ledgerDetail, shopName]);

  const openWhatsApp = () => {
    if (!ledgerDetail) return;
    window.open(buildWhatsAppUrl(ledgerDetail.phone, reminderMessage), "_blank");
  };

  const onTextOnly = () => {
    openWhatsApp();
    setIsReminderOpen(false);
  };

  const onBillAndText = () => {
    if (ledgerDetail) {
      printSupplierThermalBill(ledgerDetail, shopSettings);
    }
    setTimeout(() => {
      openWhatsApp();
      setIsReminderOpen(false);
    }, 800);
  };

  return (
    <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>WhatsApp Reminder</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          {/* Reminder message preview */}
          <div className="bg-[var(--supplier-reminder-msg-bg)] border-[var(--supplier-reminder-msg-border)] border rounded-xl p-4 text-sm whitespace-pre-line text-[var(--supplier-muted-text)]">
            {reminderMessage}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={onTextOnly}
              className="h-11 bg-[var(--supplier-reminder-send-bg)] text-[var(--supplier-primary-text)]"
            >
              Text Only
            </Button>
            <Button
              onClick={onBillAndText}
              variant="outline"
              className="h-11 border-[var(--supplier-reminder-bill-border)] text-[var(--supplier-reminder-bill-text)]"
            >
              Bill + Text
            </Button>
            <Button
              onClick={() => setIsReminderOpen(false)}
              variant="destructive"
              className="h-11"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
