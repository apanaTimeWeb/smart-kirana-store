// KhataPrintUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions for generating WhatsApp reminder messages and
// thermal print HTML for the Khata ledger.
//
// These functions are side-effect-free formatters — they take data in and
// return strings/HTML out. No React, no hooks.
// ─────────────────────────────────────────────────────────────────────────────

import { format } from "date-fns";
import { type CustomerDetail, type AppSettings, KhataLedgerRow } from "./KhataTypes";
import { KhataConstants } from "./KhataConstants";

// ─── generateReminderMessage ───────────────────────────────────────────────────
// Builds a monospace-formatted WhatsApp message string for the customer ledger.

export function generateReminderMessage(
  detail: CustomerDetail,
  ledgerRows: KhataLedgerRow[],
  settings: AppSettings | undefined,
  shopName: string = KhataConstants.SHOP_NAME_DEFAULT
): string {
  if (!detail) return "";

  const W = 28;
  const padRight = (str: string, width: number) => {
    if (str.length >= width) return str.substring(0, width);
    return str + " ".repeat(width - str.length);
  };
  const padLeft = (str: string, width: number) => {
    if (str.length >= width) return str.substring(0, width);
    return " ".repeat(width - str.length) + str;
  };

  let msg = "```\n";
  msg += shopName + "\n";
  msg += KhataConstants.WHATSAPP_TEMPLATE.HEADER + "\n";
  if (settings?.shopAddress) msg += settings.shopAddress + "\n";
  if (settings?.shopPhone) msg += `Phone: ${settings.shopPhone}\n`;
  msg += "-".repeat(W) + "\n";
  msg += `Customer: ${detail.name}\n`;
  msg += `Date: ${format(new Date(), "dd MMM yyyy")}\n`;
  msg += "-".repeat(W) + "\n";

  msg += padRight("Date", 6) + "|" + padRight("Details", 10) + "|" + padLeft("Amt", 10) + "\n";
  msg += "-".repeat(W) + "\n";

  ledgerRows.forEach((tx) => {
    const dateStr = format(new Date(tx.createdAt), "dd/MM");
    let desc = tx.description;
    if (desc.length > 10) desc = desc.substring(0, 10);
    const amtStr = (tx.type === "credit" ? "+" : "-") + tx.amount.toFixed(0);

    msg += padRight(dateStr, 6) + "|" + padRight(desc, 10) + "|" + padLeft(amtStr, 10) + "\n";

    if (tx.items && tx.items.length > 0) {
      tx.items.forEach((item) => {
        const itemText = `  - ${item.productName} ${
          item.variantName ? `(${item.variantName})` : ""
        } x ${item.displayQuantity || item.quantity} (Rs ${item.totalPrice})`;
        msg += itemText + "\n";
      });
    }

    msg += "-".repeat(W) + "\n";
  });

  msg +=
    padRight("Total Due:", 14) +
    padLeft(`Rs ${detail.totalDue.toFixed(0)}`, 14) +
    "\n";
  msg += "-".repeat(W) + "\n\n";

  msg += KhataConstants.WHATSAPP_TEMPLATE.PLEASE_PAY + "\n";
  msg += KhataConstants.WHATSAPP_TEMPLATE.THANK_YOU + "\n";
  msg += "```";

  return msg;
}

// ─── printThermalBill ──────────────────────────────────────────────────────────
// Opens a new browser window with a thermal-print-optimized HTML layout and
// triggers the browser print dialog after a short delay.

export function printThermalBill(
  detail: CustomerDetail,
  ledgerRows: KhataLedgerRow[],
  settings: AppSettings | undefined,
  shopName: string = KhataConstants.SHOP_NAME_DEFAULT
) {
  if (!detail) return;
  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;

  const rows = ledgerRows
    .map(
      (tx) => `
      <tr>
        <td style="padding:3px 0;">${format(new Date(tx.createdAt), "dd/MM")}</td>
        <td style="padding:3px 0;">${tx.description}</td>
        <td style="padding:3px 0; text-align:right;">${
          tx.type === "credit" ? "+" : "-"
        }₹${tx.amount}</td>
        <td style="padding:3px 0; text-align:right;">₹${tx.balance}</td>
      </tr>
      ${
        tx.items && tx.items.length > 0
          ? `
      <tr>
        <td colspan="4" style="padding: 0 0 5px 15px; font-size: 11px; color: #555;">
          ${tx.items
            .map(
              (item) =>
                `<div style="padding:1px 0">- ${item.productName} ${
                  item.variantName ? `(${item.variantName})` : ""
                } x ${item.displayQuantity || item.quantity} (₹${item.totalPrice})</div>`
            )
            .join("")}
        </td>
      </tr>
      `
          : ""
      }
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
          <p>${KhataConstants.WHATSAPP_TEMPLATE.THERMAL_BILL_TITLE}</p>
          ${settings?.shopAddress ? `<p>${settings.shopAddress}</p>` : ""}
          ${settings?.shopPhone ? `<p>Phone: ${settings.shopPhone}</p>` : ""}
        </div>
        <hr/>
        <p><strong>Customer:</strong> ${detail.name}</p>
        <p><strong>Phone:</strong> ${detail.phone}</p>
        <hr/>
        <table><thead><tr><th>Date</th><th>Particulars</th><th style="text-align:right">Amt</th><th style="text-align:right">Bal</th></tr></thead><tbody>${rows}</tbody></table>
        <hr/>
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total Due :</span><span>₹${detail.totalDue.toFixed(
          2
        )}</span></div>
        <hr/>
        <div class="center" style="margin-top:15px;font-size:12px;">${KhataConstants.WHATSAPP_TEMPLATE.THANK_YOU}</div>
      </body></html>
    `);
  win.document.close();
  setTimeout(() => win.print(), 600);
}
