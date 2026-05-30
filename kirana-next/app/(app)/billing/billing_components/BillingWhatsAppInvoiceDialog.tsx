"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BillData } from "./BillingTypes";
import { buildWhatsAppMessage } from "./BillingWhatsAppUtils";

interface BillingWhatsAppInvoiceDialogProps {
  billData: BillData | null;
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  onClose: () => void;
}

export function BillingWhatsAppInvoiceDialog({
  billData,
  shopName,
  shopAddress,
  shopPhone,
  onClose,
}: BillingWhatsAppInvoiceDialogProps) {
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (billData) {
      const rawPhone = (billData.customerPhone ?? "")
        .replace(/\D/g, "")
        .replace(/^91/, "")
        .slice(0, 10);
      setPhone(rawPhone);
    }
  }, [billData]);

  const handleSend = () => {
    if (phone.length < 10) {
      toast({ title: "Valid 10-digit number daalo", variant: "destructive" });
      return;
    }
    if (!billData) return;
    const msg = buildWhatsAppMessage(billData, shopName, shopAddress, shopPhone);
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    setPhone("");
    onClose();
  };

  const handleClose = () => {
    setPhone("");
    onClose();
  };

  return (
    <Dialog open={Boolean(billData)} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-sm pointer-events-auto bg-[var(--billing-card-bg)] border-[var(--billing-border)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--billing-foreground-text)]">
            <MessageCircle className="h-5 w-5 text-[var(--billing-whatsapp-icon)]" />
            Bill WhatsApp pe bhejein?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--billing-whatsapp-border)] bg-[var(--billing-whatsapp-info-bg)] p-4">
            <p className="text-sm text-[var(--billing-muted-text)]">
              Customer ko bill ka summary WhatsApp pe directly bhej sakte hain.
              Ek click mein WhatsApp open hoga message ke saath.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--billing-foreground-text)]">
              <Phone className="h-4 w-4 text-[var(--billing-muted-text)]" />
              WhatsApp Number
            </label>
            <div className="flex">
              <div className="flex h-10 items-center rounded-l-md border border-[var(--billing-border)] border-r-0 bg-[var(--billing-muted-bg)] px-3 text-sm text-[var(--billing-muted-text)] select-none">
                +91
              </div>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="rounded-l-none flex-1 border-[var(--billing-border)] bg-[var(--billing-background-bg)] text-[var(--billing-foreground-text)]"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-[var(--billing-border)] text-[var(--billing-foreground-text)] hover:bg-[var(--billing-muted-bg)]" onClick={handleClose}>
              Skip
            </Button>
            <Button
              className="flex-1 gap-2 bg-[var(--billing-whatsapp-btn-bg)] text-[var(--billing-whatsapp-btn-text)] hover:bg-[var(--billing-whatsapp-btn-hover)] active:scale-[0.98]"
              onClick={handleSend}
              disabled={phone.length < 10}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp pe Bhejo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
