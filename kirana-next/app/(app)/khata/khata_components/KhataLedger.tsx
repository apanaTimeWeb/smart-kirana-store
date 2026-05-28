"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IndianRupee,
  CreditCard,
  MessageCircle,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetCustomer, useGetSettings } from "@/lib/api";
import { format } from "date-fns";
import { LedgerTable } from "./LedgerTable";
import { ReminderDialog } from "./ReminderDialog";
import { TransactionForm } from "./TransactionForm";
import { type LedgerRow } from "./types";

interface KhataLedgerProps {
  customerId: number;
}

export function KhataLedger({ customerId }: KhataLedgerProps) {
  const { data: detail, isLoading } = useGetCustomer(customerId);
  const { data: settings } = useGetSettings();

  const [mode, setMode] = useState<"payment" | "credit" | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const shopName = settings?.shopName?.trim() || "Smart Kirana Store";

  const ledgerRows = useMemo((): LedgerRow[] => {
    if (!detail?.transactions) return [];
    let balance = 0;
    return detail.transactions.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    });
  }, [detail?.transactions]);

  const reminderMessage = useMemo(() => {
    if (!detail) return "";
    return `Namaste ${detail.name} Ji,\n\nAapka balance ₹${detail.totalDue.toFixed(2)} pending hai.\n\nKripya jaldi payment kar dein.\n\nThank you\n${shopName}`;
  }, [detail, shopName]);

  const printThermalBill = () => {
    if (!detail) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    const rows = ledgerRows
      .map(
        (tx) => `
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
      <html><head><title>Khata Bill</title>
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
          <p>Khata Ledger</p>
          ${settings?.shopAddress ? `<p>${settings.shopAddress}</p>` : ""}
          ${settings?.shopPhone ? `<p>Phone: ${settings.shopPhone}</p>` : ""}
        </div>
        <hr/>
        <p><strong>Customer:</strong> ${detail.name}</p>
        <p><strong>Phone:</strong> ${detail.phone}</p>
        <hr/>
        <table><thead><tr><th>Date</th><th>Particulars</th><th style="text-align:right">Amt</th><th style="text-align:right">Bal</th></tr></thead><tbody>${rows}</tbody></table>
        <hr/>
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total Due :</span><span>₹${detail.totalDue.toFixed(2)}</span></div>
        <hr/>
        <div class="center" style="margin-top:15px;font-size:12px;">Thank You!</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  const openWhatsApp = () => {
    if (!detail) return;
    const phone = detail.phone.replace(/\D/g, "");
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(reminderMessage)}`, "_blank");
  };

  if (isLoading) return <div className="py-12 text-center">Loading...</div>;
  if (!detail) return null;

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      {/* Header */}
      <div className="rounded-xl border bg-gradient-to-br from-[var(--customers-header-bg-from)] to-[var(--customers-header-bg-to)] border-[var(--customers-header-border)] p-5 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[var(--customers-header-avatar-bg)] text-[var(--customers-header-avatar-text)] flex items-center justify-center text-2xl font-bold">
              {detail.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xl">{detail.name}</p>
              <p className="text-muted-foreground">{detail.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Due</p>
            <p className="text-4xl font-bold text-[var(--customers-header-due-amount)]">
              ₹{detail.totalDue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex flex-wrap gap-3 justify-center bg-[var(--customers-btn-panel-bg)] border rounded-xl p-2 shadow-sm">
          <Button
            size="sm"
            onClick={() => setMode("payment")}
            className={cn(
              "transition-all",
              mode === "payment" &&
                "ring-2 ring-offset-2 [--tw-ring-color:var(--customers-btn-payment-ring)] bg-[var(--customers-btn-payment-active-bg)]"
            )}
          >
            <IndianRupee className="mr-1.5 h-4 w-4" /> Payment Mila
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode("credit")}
            className={cn(
              "transition-all border-[var(--customers-btn-credit-border)] text-[var(--customers-btn-credit-text)] hover:bg-[var(--customers-btn-credit-hover-bg)]",
              mode === "credit" &&
                "ring-2 ring-offset-2 [--tw-ring-color:var(--customers-btn-credit-ring)] bg-[var(--customers-btn-credit-active-bg)]"
            )}
          >
            <CreditCard className="mr-1.5 h-4 w-4" /> Udhaar Diya
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsReminderOpen(true)}
            className="border-[var(--customers-btn-reminder-border)] text-[var(--customers-btn-reminder-text)] hover:bg-[var(--customers-btn-reminder-hover-bg)]"
          >
            <MessageCircle className="mr-1.5 h-4 w-4" /> Reminder
          </Button>

          <Button size="sm" variant="outline" onClick={printThermalBill}>
            <Printer className="mr-1.5 h-4 w-4" /> Thermal Print
          </Button>
        </div>
      </div>

      {/* Reminder dialog */}
      <ReminderDialog
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        reminderMessage={reminderMessage}
        onTextOnly={() => {
          openWhatsApp();
          setIsReminderOpen(false);
        }}
        onBillAndText={() => {
          printThermalBill();
          setTimeout(() => {
            openWhatsApp();
            setIsReminderOpen(false);
          }, 800);
        }}
      />

      {/* Transaction form */}
      {mode && (
        <TransactionForm
          customerId={customerId}
          mode={mode}
          onClose={() => setMode(null)}
        />
      )}

      {/* Ledger table */}
      <div className="flex-1 border rounded-xl bg-[var(--customers-ledger-bg)] flex flex-col overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[120px_1fr_130px_130px] bg-muted sticky top-0 text-xs font-semibold text-muted-foreground border-b">
          <div className="px-6 py-3.5">Date</div>
          <div className="px-6 py-3.5">Description</div>
          <div className="px-6 py-3.5 text-right">Amount</div>
          <div className="px-6 py-3.5 text-right">Balance</div>
        </div>
        {/* Mobile header */}
        <div className="sm:hidden grid grid-cols-[80px_1fr_90px] bg-muted sticky top-0 text-xs font-semibold text-muted-foreground border-b">
          <div className="px-3 py-3">Date</div>
          <div className="px-3 py-3">Details</div>
          <div className="px-3 py-3 text-right">Amt / Bal</div>
        </div>
        <div className="flex-1 overflow-auto">
          <LedgerTable rows={ledgerRows} />
        </div>
      </div>
    </div>
  );
}
