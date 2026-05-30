"use client";

// KhataLedgerDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders the full-screen Dialog that wraps the Khata Ledger
// for a selected customer. Manages its own open/close state via KhataContext.
//
// Why isolated? The Dialog shell (open/close, sizing, title) is completely
// independent from both the Customer List and the Ledger content inside it.
// Isolating it means: to change how the dialog opens/closes, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useKhata } from "./KhataContext";
import { KhataConstants } from "./KhataConstants";
import { KhataLedgerContainer } from "./KhataLedgerContainer";

export function KhataLedgerDialog() {
  const { selectedLedgerId, setSelectedLedgerId } = useKhata();

  return (
    <Dialog
      open={selectedLedgerId !== null}
      onOpenChange={(open) => !open && setSelectedLedgerId(null)}
    >
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-[var(--khata-border)]">
          <DialogTitle>{KhataConstants.LABELS.LEDGER_DIALOG_TITLE}</DialogTitle>
        </DialogHeader>
        {selectedLedgerId && <KhataLedgerContainer customerId={selectedLedgerId} />}
      </DialogContent>
    </Dialog>
  );
}
