import { format } from "date-fns";
import { HistoryBill } from "../shared/HistoryTypes";
import { AppSettings } from "@/lib/api/types";

export function printHistoryReceipt(
  currentBill: HistoryBill,
  currency: string,
  settings: AppSettings | undefined
) {
  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;

  let subtotal = 0;
  let totalReturns = 0;

  const rows = currentBill.items
    .map((item) => {
      const returnedQty = item.returnedQuantity ?? 0;
      const validQty = item.quantity - returnedQty;
      
      if (validQty <= 0 && returnedQty > 0) {
        totalReturns += item.totalPrice;
        return `
          <tr>
            <td class="history-returned-item" style="padding:3px 0;"><s>${item.productName} ${item.variantName || ""}</s><br/><small>Returned (${returnedQty})</small></td>
            <td class="history-returned-item" style="padding:3px 0; text-align:right;">-</td>
            <td class="history-returned-item" style="padding:3px 0; text-align:right;">-</td>
          </tr>
        `;
      }

      const effectiveTotal = validQty * item.unitPrice;
      subtotal += effectiveTotal;
      if (returnedQty > 0) {
        totalReturns += (returnedQty * item.unitPrice);
      }

      return `
        <tr>
          <td style="padding:3px 0;">${item.productName} ${item.variantName || ""}<br/><small>${validQty} ${item.unit || "pcs"}</small>
          ${returnedQty > 0 ? `<br/><small class="history-refund-amount">(-${returnedQty} returned)</small>` : ""}
          </td>
          <td style="padding:3px 0; text-align:right;">${currency} ${item.unitPrice.toFixed(2)}</td>
          <td style="padding:3px 0; text-align:right;">${currency} ${effectiveTotal.toFixed(0)}</td>
        </tr>
      `;
    })
    .join("");

  const shopName = settings?.shopName || "Smart Kirana";
  const shopAddress = settings?.shopAddress;
  const shopPhone = settings?.shopPhone;

  win.document.write(`
    <html><head><title>Updated Bill</title>
    <style>
      body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 4px 0; vertical-align: top; }
      hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
      small { color: #333; }
      .history-returned-item { color: var(--history-returned-item, #6B7280); }
      .history-refund-amount { color: var(--history-refund-amount, #E53535); }
    </style>
    </head><body>
      <div class="center bold">
        <h2>${shopName}</h2>
        <p>Retail Invoice (Updated)</p>
        ${shopAddress ? `<p>${shopAddress}</p>` : ""}
        ${shopPhone ? `<p>Phone: ${shopPhone}</p>` : ""}
      </div>
      <hr/>
      <p><strong>Bill No:</strong> #${currentBill.id}</p>
      <p><strong>Date:</strong> ${format(new Date(currentBill.createdAt), "dd MMM yyyy, hh:mm a")}</p>
      ${currentBill.customerName ? `<p><strong>Customer:</strong> ${currentBill.customerName}</p>` : ""}
      <hr/>
      <table>
        <thead><tr><th>Item</th><th style="text-align:right">Rate</th><th style="text-align:right">Amt</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <hr/>
      ${totalReturns > 0 ? `<div class="history-refund-amount" style="display:flex;justify-content:space-between;"><span>Total Refunds:</span><span>-${currency} ${totalReturns.toFixed(0)}</span></div><hr/>` : ""}
      <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Revised Total:</span><span>${currency} ${(currentBill.finalAmount - totalReturns).toFixed(0)}</span></div>
      <hr/>
      <div style="display:flex;justify-content:space-between;"><span>Payment:</span><span>${currentBill.paymentMode.toUpperCase()}</span></div>
      <div class="center" style="margin-top:15px;font-size:12px;">Thank You! Visit Again</div>
      <script>
        setTimeout(() => { window.print(); }, 100);
      </script>
    </body></html>
  `);
  win.document.close();
}
