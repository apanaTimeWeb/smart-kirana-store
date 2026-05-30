"use client";

import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useKhata } from "./KhataContext";
import { generateReminderMessage } from "./KhataPrintUtils";
import { KhataConstants } from "./KhataConstants";
import { useGetSettings } from "@/lib/api";
import { KhataLedgerRow } from "./KhataTypes";

interface KhataReminderDialogProps {
  detail: any;
  ledgerRows: KhataLedgerRow[];
}

export function KhataReminderDialog({ detail, ledgerRows }: KhataReminderDialogProps) {
  const { isReminderOpen, setIsReminderOpen } = useKhata();
  const { data: settings } = useGetSettings();

  const reminderMessage = useMemo(() => {
    return generateReminderMessage(detail, ledgerRows, settings, KhataConstants.SHOP_NAME_DEFAULT);
  }, [detail, ledgerRows, settings]);

  const openWhatsApp = (includeBill: boolean) => {
    if (!detail) return;
    const phone = detail.phone.replace(/\D/g, "");
    // Normally includeBill would attach a PDF or image, but here we just send the text
    // as it's the same in original logic. The backend logic for sending an actual bill can be added here.
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(reminderMessage)}`, "_blank");
    setIsReminderOpen(false);
  };

  return (
    <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>WhatsApp Reminder</DialogTitle>
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
              Text Only
            </Button>
            <Button
              onClick={() => openWhatsApp(true)}
              variant="outline"
              className="h-11 border-[var(--khata-reminder-bill-border)] text-[var(--khata-reminder-bill-text)]"
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
