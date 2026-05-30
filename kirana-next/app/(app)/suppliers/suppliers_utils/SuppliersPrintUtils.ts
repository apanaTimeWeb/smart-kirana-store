/**
 * SuppliersPrintUtils.ts
 *
 * Pure utility functions for generating thermal-print bills for a supplier ledger.
 * This file is intentionally free of React and has ZERO UI dependencies.
 *
 * WHY THIS FILE EXISTS:
 * The printThermalBill logic was previously copy-pasted in both SuppliersLedgerActions.tsx
 * and SuppliersReminderDialog.tsx. By extracting it here, a single fix propagates everywhere.
 *
 * TO MODIFY THE BILL LAYOUT: Only edit THIS file. No other file needs to change.
 */

import { format } from "date-fns";
import { SUPPLIER_SHOP_NAME_FALLBACK } from "../suppliers_constants/SuppliersSharedConstants";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PrintTransaction {
  createdAt: string;
  type: "credit" | "payment";
  amount: number;
  description: string;
}

interface PrintSupplierDetail {
  name: string;
  phone: string;
  totalDue: number;
  transactions?: PrintTransaction[];
}

interface PrintShopSettings {
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Computes each transaction's running balance and returns the enriched rows.
 */
function buildLedgerRows(
  transactions: PrintTransaction[]
): (PrintTransaction & { balance: number })[] {
  let balance = 0;
  return transactions.map((tx) => {
    balance += tx.type === "credit" ? tx.amount : -tx.amount;
    return { ...tx, balance };
  });
}

/**
 * Converts a list of enriched ledger rows into an HTML <tr> string.
 */
function buildTableRowsHtml(
  rows: (PrintTransaction & { balance: number })[]
): string {
  return rows
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
}

// ─── Main Export ───────────────────────────────────────────────────────────────

/**
 * Opens a new browser window and prints a 300px-wide thermal-format supplier ledger bill.
 *
 * @param supplierDetail - The full supplier object (name, phone, totalDue, transactions)
 * @param shopSettings   - Optional shop branding details from settings API
 */
export function printSupplierThermalBill(
  supplierDetail: PrintSupplierDetail,
  shopSettings?: PrintShopSettings | null
): void {
  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;

  const shopName =
    shopSettings?.shopName?.trim() || SUPPLIER_SHOP_NAME_FALLBACK;
  const transactions = supplierDetail.transactions ?? [];
  const ledgerRows = buildLedgerRows(transactions);
  const tableRowsHtml = buildTableRowsHtml(ledgerRows);

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
      <p><strong>Supplier:</strong> ${supplierDetail.name}</p>
      <p><strong>Phone:</strong> ${supplierDetail.phone}</p>
      <hr/>
      <table><thead><tr><th>Date</th><th>Particulars</th><th style="text-align:right">Amt</th><th style="text-align:right">Bal</th></tr></thead><tbody>${tableRowsHtml}</tbody></table>
      <hr/>
      <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total Due :</span><span>₹${supplierDetail.totalDue.toFixed(2)}</span></div>
      <hr/>
      <div class="center" style="margin-top:15px;font-size:12px;">Thank You!</div>
    </body></html>
  `);
  win.document.close();
  setTimeout(() => win.print(), 600);
}
