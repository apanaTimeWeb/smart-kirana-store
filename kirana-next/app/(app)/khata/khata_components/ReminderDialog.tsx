"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminderMessage: string;
  onTextOnly: () => void;
  onBillAndText: () => void;
}

export function ReminderDialog({
  open,
  onOpenChange,
  reminderMessage,
  onTextOnly,
  onBillAndText,
}: ReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>WhatsApp Reminder</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="bg-[var(--khata-reminder-msg-bg)] border-[var(--khata-reminder-msg-border)] border rounded-xl p-4 text-sm whitespace-pre-line">
            {reminderMessage}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={onTextOnly}
              className="h-11 bg-[var(--khata-reminder-send-bg)]"
            >
              Text Only
            </Button>
            <Button
              onClick={onBillAndText}
              variant="outline"
              className="h-11 border-[var(--khata-reminder-bill-border)] text-[var(--khata-reminder-bill-text)]"
            >
              Bill + Text
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
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
