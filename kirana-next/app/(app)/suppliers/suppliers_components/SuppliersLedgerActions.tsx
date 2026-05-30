"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { IndianRupee, CreditCard, MessageCircle, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSuppliers } from "./SuppliersContext";
import { SUPPLIER_SHOP_NAME_FALLBACK } from "./SuppliersConstants";

export function SuppliersLedgerActions() {
  const { ledgerDetail, shopSettings, transactionMode, setTransactionMode, setIsReminderOpen } = useSuppliers();

  const printThermalBill = () => {
    if (!ledgerDetail) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    let balance = 0;
    const ledgerRows = ledgerDetail.transactions?.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    }) || [];

    const shopName = shopSettings?.shopName?.trim() || SUPPLIER_SHOP_NAME_FALLBACK;

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

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex flex-wrap gap-3 justify-center bg-[var(--supplier-btn-panel-bg)] border border-[var(--supplier-border)] rounded-xl p-2 shadow-sm">
        <Button
          size="sm"
          onClick={() => setTransactionMode("payment")}
          className={cn(
            "transition-all",
            transactionMode === "payment" &&
              "ring-2 ring-offset-2 [--tw-ring-color:var(--supplier-btn-payment-ring)] bg-[var(--supplier-btn-payment-active-bg)]"
          )}
        >
          <IndianRupee className="mr-1.5 h-4 w-4" /> Payment Mila
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setTransactionMode("credit")}
          className={cn(
            "transition-all border-[var(--supplier-btn-credit-border)] text-[var(--supplier-btn-credit-text)] hover:bg-[var(--supplier-btn-credit-hover-bg)]",
            transactionMode === "credit" &&
              "ring-2 ring-offset-2 [--tw-ring-color:var(--supplier-btn-credit-ring)] bg-[var(--supplier-btn-credit-active-bg)]"
          )}
        >
          <CreditCard className="mr-1.5 h-4 w-4" /> Udhaar Diya
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsReminderOpen(true)}
          className="border-[var(--supplier-btn-reminder-border)] text-[var(--supplier-btn-reminder-text)] hover:bg-[var(--supplier-btn-reminder-hover-bg)]"
        >
          <MessageCircle className="mr-1.5 h-4 w-4" /> Reminder
        </Button>

        <Button size="sm" variant="outline" onClick={printThermalBill} className="border-[var(--supplier-border)]">
          <Printer className="mr-1.5 h-4 w-4" /> Thermal Print
        </Button>
      </div>
    </div>
  );
}
