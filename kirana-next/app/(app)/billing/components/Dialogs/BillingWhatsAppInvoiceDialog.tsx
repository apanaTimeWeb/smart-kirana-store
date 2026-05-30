"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildWhatsAppMessage, printThermalBill } from "../../utils/BillingWhatsAppUtils";
import { useBilling } from "../../context/BillingContext";

export function BillingWhatsAppInvoiceDialog() {
  const { whatsappBillData: billData, setWhatsappBillData, shopName, settings } = useBilling();
  const shopAddress = settings?.shopAddress;
  const shopPhone = settings?.shopPhone;
  const onClose = () => {
    if (billData) {
      printThermalBill(
        billData,
        shopName,
        shopAddress,
        shopPhone,
        settings?.gstNumber,
        settings?.gstEnabled
      );
    }
    setWhatsappBillData(null);
  };
  const { toast } = useToast();
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (billData?.customerPhone) {
      const cleaned = billData.customerPhone.replace(/\D/g, "");
      if (cleaned.length >= 10) {
        setPhone(cleaned.slice(-10));
      } else {
        setPhone(cleaned);
      }
    } else {
      setPhone("");
    }
  }, [billData]);

  if (!billData) return null;

  const handleSend = () => {
    if (phone.length !== 10) {
      toast({ title: "Valid 10 digit number daalein", variant: "destructive" });
      return;
    }
    const msg = buildWhatsAppMessage(billData, shopName, shopAddress, shopPhone);
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  return (
    <Dialog open={Boolean(billData)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[var(--billing-background-bg)] border-[var(--billing-border)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-6 w-6 text-[var(--billing-whatsapp-icon)]" />
            WhatsApp Bill
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--billing-foreground-text)]">
              Customer Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-[var(--billing-muted-text)]" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10 digit number"
                className="pl-10 h-12 text-lg bg-[var(--billing-card-bg)] border-[var(--billing-border)]"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-[var(--billing-border)] text-[var(--billing-foreground-text)] hover:bg-[var(--billing-muted-bg)]" onClick={onClose}>
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
