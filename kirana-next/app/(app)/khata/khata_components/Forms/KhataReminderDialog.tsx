"use client";

// KhataReminderDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders the WhatsApp Reminder Dialog for a customer.
// Generates a formatted reminder message, previews it, and provides buttons
// to open WhatsApp with the message pre-filled.
//
// The reminder message generation logic lives in KhataPrintUtils.ts.
// To change button labels or dialog appearance, touch ONLY this file.
// To change the message format, touch KhataPrintUtils.ts.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type CustomerDetail, KhataLedgerRow } from "@/app/(app)/khata/khata_types/KhataTypes";
import { useKhata } from "@/app/(app)/khata/khata_context/KhataContext";
import { generateReminderMessage } from "@/app/(app)/khata/khata_utils/KhataPrintUtils";
import { KhataConstants } from "@/app/(app)/khata/khata_constants/KhataConstants";
import { useGetSettings } from "@/lib/api";

interface KhataReminderDialogProps {
  /** Full customer detail object including transactions. */
  detail: CustomerDetail;
  /** Computed ledger rows with running balance — passed in from the container. */
  ledgerRows: KhataLedgerRow[];
}

export function KhataReminderDialog({ detail, ledgerRows }: KhataReminderDialogProps) {
  const { isReminderOpen, setIsReminderOpen } = useKhata();
  const { data: settings } = useGetSettings();

  const reminderMessage = useMemo(() => {
    return generateReminderMessage(detail, ledgerRows, settings, KhataConstants.SHOP_NAME_DEFAULT);
  }, [detail, ledgerRows, settings]);

  const openWhatsApp = (_includeBill: boolean) => {
    if (!detail) return;
    const phone = detail.phone.replace(/\D/g, "");
    // Note: includeBill=true is a placeholder for future PDF/image attachment logic.
    // Currently both buttons send the same text message via WhatsApp web.
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(reminderMessage)}`, "_blank");
    setIsReminderOpen(false);
  };

  return (
    <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{KhataConstants.LABELS.WHATSAPP_REMINDER_TITLE}</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="bg-[var(--khata-reminder-msg-bg)] border-[var(--khata-reminder-msg-border)] border rounded-xl p-4 text-sm whitespace-pre-line text-[var(--khata-foreground)]">
            {reminderMessage}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => openWhatsApp(false)}
              className="h-11 bg-[var(--khata-reminder-send-bg)]"
            >
              {KhataConstants.LABELS.REMINDER_TEXT_ONLY}
            </Button>
            <Button
              onClick={() => openWhatsApp(true)}
              variant="outline"
              className="h-11 border-[var(--khata-reminder-bill-border)] text-[var(--khata-reminder-bill-text)]"
            >
              {KhataConstants.LABELS.REMINDER_BILL_TEXT}
            </Button>
            <Button
              onClick={() => setIsReminderOpen(false)}
              variant="destructive"
              className="h-11"
            >
              {KhataConstants.LABELS.CANCEL}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
