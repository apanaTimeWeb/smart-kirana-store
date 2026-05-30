"use client";

import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSuppliers } from "./SuppliersContext";
import { format } from "date-fns";
import { SUPPLIER_SHOP_NAME_FALLBACK } from "./SuppliersConstants";

export function SuppliersReminderDialog() {
  const { isReminderOpen, setIsReminderOpen, ledgerDetail, shopSettings } = useSuppliers();

  const shopName = shopSettings?.shopName?.trim() || SUPPLIER_SHOP_NAME_FALLBACK;

  const reminderMessage = useMemo(() => {
    if (!ledgerDetail) return "";
    return `Namaste ${ledgerDetail.name} Ji,\n\nAapka balance ₹${ledgerDetail.totalDue.toFixed(2)} pending hai.\n\nKripya jaldi payment kar dein.\n\nThank you\n${shopName}`;
  }, [ledgerDetail, shopName]);

  const openWhatsApp = () => {
    if (!ledgerDetail) return;
    const phone = ledgerDetail.phone.replace(/\D/g, "");
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(reminderMessage)}`, "_blank");
  };

  const printThermalBill = () => {
    if (!ledgerDetail) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    let balance = 0;
    const ledgerRows = ledgerDetail.transactions?.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    }) || [];

    const rows = ledgerRows
      .map(
        (tx: any) => `
      <tr>
        <td style="padding:3px 0;">${format(new Date(tx.createdAt), "dd/MM")}</td>
        <td style="padding:3px 0;">${tx.description}</td>
        <td style="padding:3px 0; text-align:right;">${tx.type === "credit" ? "+" : "-"}₹${tx.amount}</td>
        <td style="padding:3px 0; text-align:right;">₹${tx.balance}</td>
      </tr>
    `
      )
      .join("");

    win.document.write(`
      <html><head><title>Supplier Bill</title>
      <style>
        body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 4px 0; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
      </style>
      </head><body>
        <div class="center bold">
          <h2>${shopName}</h2>
          <p>Supplier Ledger</p>
          ${shopSettings?.shopAddress ? `<p>${shopSettings.shopAddress}</p>` : ""}
          ${shopSettings?.shopPhone ? `<p>Phone: ${shopSettings.shopPhone}</p>` : ""}
        </div>
        <hr/>
        <p><strong>Supplier:</strong> ${ledgerDetail.name}</p>
        <p><strong>Phone:</strong> ${ledgerDetail.phone}</p>
        <hr/>
        <table><thead><tr><th>Date</th><th>Particulars</th><th style="text-align:right">Amt</th><th style="text-align:right">Bal</th></tr></thead><tbody>${rows}</tbody></table>
        <hr/>
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total Due :</span><span>₹${ledgerDetail.totalDue.toFixed(2)}</span></div>
        <hr/>
        <div class="center" style="margin-top:15px;font-size:12px;">Thank You!</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  const onTextOnly = () => {
    openWhatsApp();
    setIsReminderOpen(false);
  };

  const onBillAndText = () => {
    printThermalBill();
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
          <div className="bg-[var(--supplier-reminder-msg-bg)] border-[var(--supplier-reminder-msg-border)] border rounded-xl p-4 text-sm whitespace-pre-line text-[var(--supplier-primary-text)]">
            {reminderMessage}
          </div>
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
              className="h-11 bg-[var(--supplier-destructive-bg)] text-[var(--supplier-destructive-text)]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
