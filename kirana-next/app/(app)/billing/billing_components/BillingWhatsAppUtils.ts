import { format } from "date-fns";
import type { BillData } from "./BillingTypes";
import { lineLabel } from "./BillingUtils";

// ─── WhatsApp Message Builder ──────────────────────────────────────────────────

export function buildWhatsAppMessage(
  billData: BillData,
  shopName: string,
  shopAddress?: string,
  shopPhone?: string
) {
  const W = 28;

  const padCenter = (str: string, width: number) => {
    if (str.length >= width) return str.substring(0, width);
    const left = Math.floor((width - str.length) / 2);
    const right = width - str.length - left;
    return " ".repeat(left) + str + " ".repeat(right);
  };

  const padRight = (str: string, width: number) => {
    if (str.length >= width) return str.substring(0, width);
    return str + " ".repeat(width - str.length);
  };

  const padLeft = (str: string, width: number) => {
    if (str.length >= width) return str.substring(0, width);
    return " ".repeat(width - str.length) + str;
  };

  let msg = "```\n";
  msg += padCenter(shopName, W) + "\n";
  msg += padCenter("Retail Invoice", W) + "\n";
  if (shopAddress) msg += padCenter(shopAddress, W) + "\n";
  if (shopPhone) msg += padCenter(`Phone: ${shopPhone}`, W) + "\n";
  msg += "-".repeat(W) + "\n";

  msg += `Date: ${format(new Date(), "dd MMM yyyy, hh:mm a")}\n`;
  if (billData.customerName) msg += `Customer: ${billData.customerName}\n`;
  msg += "-".repeat(W) + "\n";

  // Header: Item on its own line, Qty/Rate/Amt on next line
  msg += padRight("Qty", 10) + "|" + padLeft("Rate", 8) + "|" + padLeft("Amt", 8) + "\n";
  msg += "-".repeat(W) + "\n";

  billData.items.forEach((item, index) => {
    const name = `${index + 1}. ${item.displayName}`;

    const rateStr =
      item.unitPrice % 1 === 0 ? item.unitPrice.toFixed(0) : item.unitPrice.toFixed(2);
    const totalStr = item.totalPrice.toFixed(0);
    const quantityLabel =
      item.quantity > 1 ? `${item.quantity} x ${item.displayQuantity}` : item.displayQuantity;

    msg += `${name}\n`;
    msg += padRight(quantityLabel, 10) + "|" + padLeft(`Rs ${rateStr}`, 8) + "|" + padLeft(`Rs ${totalStr}`, 8) + "\n";
    msg += "-".repeat(W) + "\n";
  });

  msg += padRight("Subtotal:", 14) + padLeft(`Rs ${billData.subtotal.toFixed(0)}`, 14) + "\n";
  if (billData.discount > 0) {
    msg += padRight("Discount:", 16) + padLeft(`-Rs ${billData.discount.toFixed(0)}`, 12) + "\n";
  }
  if (billData.enableGST) {
    msg +=
      padRight(`GST (${billData.gstRate}%):`, 16) +
      padLeft(`Rs ${billData.gstAmount.toFixed(0)}`, 12) +
      "\n";
  }
  msg += "-".repeat(W) + "\n";
  msg += padRight("Total:", 16) + padLeft(`Rs ${billData.finalAmount.toFixed(0)}`, 12) + "\n";
  msg += "-".repeat(W) + "\n";
  msg +=
    padRight("Payment:", 16) + padLeft(billData.paymentMode.toUpperCase(), 12) + "\n\n";
  msg += padCenter("Thank You! Visit Again", W) + "\n";
  msg += "```";

  return msg;
}

// ─── Thermal Print ─────────────────────────────────────────────────────────────

export function printThermalBill(
  billData: BillData,
  shopName: string,
  shopAddress?: string,
  shopPhone?: string,
  gstNumber?: string,
  gstEnabled?: boolean
) {
  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;

  const rows = billData.items
    .map(
      (item) => `
      <tr>
        <td style="padding:3px 0;">${item.displayName}<br/><small>${lineLabel(item)}</small></td>
        <td style="padding:3px 0; text-align:right;">Rs ${item.unitPrice.toFixed(2)}</td>
        <td style="padding:3px 0; text-align:right;">Rs ${item.totalPrice.toFixed(0)}</td>
      </tr>
    `
    )
    .join("");

  win.document.write(`
    <html><head><title>Bill</title>
    <style>
      body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 4px 0; vertical-align: top; }
      hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
      small { color: #333; }
    </style>
    </head><body>
      <div class="center bold">
        <h2>${shopName}</h2>
        <p>Retail Invoice</p>
        ${shopAddress ? `<p>${shopAddress}</p>` : ""}
        ${shopPhone ? `<p>Phone: ${shopPhone}</p>` : ""}
        ${gstEnabled && gstNumber ? `<p>GSTIN: ${gstNumber}</p>` : ""}
      </div>
      <hr/>
      <p><strong>Date:</strong> ${format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
      ${billData.customerName ? `<p><strong>Customer:</strong> ${billData.customerName}</p>` : ""}
      <hr/>
      <table>
        <thead><tr><th>Item</th><th style="text-align:right">Rate</th><th style="text-align:right">Amt</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <hr/>
      <div style="display:flex;justify-content:space-between;"><span>Subtotal:</span><span>Rs ${billData.subtotal.toFixed(0)}</span></div>
      ${billData.discount > 0 ? `<div style="display:flex;justify-content:space-between;"><span>Discount:</span><span>-Rs ${billData.discount.toFixed(0)}</span></div>` : ""}
      ${billData.enableGST ? `<div style="display:flex;justify-content:space-between;"><span>GST (${billData.gstRate}%):</span><span>Rs ${billData.gstAmount.toFixed(0)}</span></div>` : ""}
      <hr/>
      <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total:</span><span>Rs ${billData.finalAmount.toFixed(0)}</span></div>
      <hr/>
      <div style="display:flex;justify-content:space-between;"><span>Payment:</span><span>${billData.paymentMode}</span></div>
      <div class="center" style="margin-top:15px;font-size:12px;">Thank You! Visit Again</div>
      <script>
        setTimeout(() => { window.print(); }, 100);
      </script>
    </body></html>
  `);
  win.document.close();
}
