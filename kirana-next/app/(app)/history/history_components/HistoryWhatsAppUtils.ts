import { format } from "date-fns";
import { HistoryBill } from "./HistoryTypes";
import { StoreSettings } from "@/lib/api/types";

export function sendHistoryWhatsAppBill(
  currentBill: HistoryBill,
  phoneNumber: string,
  settings: StoreSettings | undefined
) {
  let subtotal = 0;
  let totalReturns = 0;
  const W = 34;

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

  const shopName = settings?.shopName || "Smart Kirana";
  
  let msg = "\`\`\`\n";
  msg += padCenter(shopName, W) + "\n";
  msg += padCenter("Updated Retail Invoice", W) + "\n";
  msg += "-".repeat(W) + "\n";
  msg += `Bill No: #${currentBill.id}\n`;
  msg += `Date: ${format(new Date(currentBill.createdAt), "dd MMM yyyy, hh:mm a")}\n`;
  if (currentBill.customerName) msg += `Customer: ${currentBill.customerName}\n`;
  msg += "-".repeat(W) + "\n";
  msg += padRight("Item", 18) + " " + padLeft("Rate", 8) + " " + padLeft("Amt", 6) + "\n";

  currentBill.items.forEach((item) => {
    const returnedQty = item.returnedQuantity ?? 0;
    const validQty = item.quantity - returnedQty;
    
    let name = (item.productName + (item.variantName ? ` ${item.variantName}` : "")).substring(0, 18);

    if (validQty <= 0 && returnedQty > 0) {
      totalReturns += item.totalPrice;
      msg += padRight(`~${name}~`, 18) + " " + padLeft("-", 8) + " " + padLeft("-", 6) + "\n";
      msg += padRight(`Returned (${returnedQty})`, W) + "\n";
      return;
    }

    const effectiveTotal = validQty * item.unitPrice;
    subtotal += effectiveTotal;
    if (returnedQty > 0) {
      totalReturns += (returnedQty * item.unitPrice);
    }

    msg += padRight(name, 18) + " " + padLeft(`Rs ${item.unitPrice.toFixed(0)}`, 8) + " " + padLeft(`Rs ${effectiveTotal.toFixed(0)}`, 6) + "\n";
    let qtyStr = `${validQty} ${item.unit || "pcs"}`;
    if (returnedQty > 0) qtyStr += ` (-${returnedQty} ret)`;
    msg += padRight(qtyStr, W) + "\n";
  });

  msg += "-".repeat(W) + "\n";
  if (totalReturns > 0) {
    msg += padRight("Total Refunds:", 20) + padLeft(`-Rs ${totalReturns.toFixed(0)}`, 14) + "\n";
  }
  msg += "-".repeat(W) + "\n";
  msg += padRight("Revised Total:", 20) + padLeft(`Rs ${(currentBill.finalAmount - totalReturns).toFixed(0)}`, 14) + "\n";
  msg += "-".repeat(W) + "\n";
  msg += padCenter("Thank You! Visit Again", W) + "\n";
  msg += "\`\`\`";

  const encodedMsg = encodeURIComponent(msg);
  let waUrl = `https://wa.me/?text=${encodedMsg}`;
  
  // Clean phone number: remove non-digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.length >= 10) {
    // Assuming India code if 10 digits
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    waUrl = `https://wa.me/${finalPhone}?text=${encodedMsg}`;
  }

  window.open(waUrl, "_blank");
}
