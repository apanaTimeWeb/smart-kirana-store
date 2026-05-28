"use client";

import React, { useState, useEffect } from "react";
import { Bill } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { AlertCircle, RotateCcw, Check, Loader2, Printer, MessageCircle } from "lucide-react";
import { useReturnBillItems } from "@/lib/api/bills";
import { useGetSettings } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface BillDetailsDialogProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
}

export function BillDetailsDialog({ bill, open, onOpenChange, currency }: BillDetailsDialogProps) {
  const { toast } = useToast();
  const returnMutation = useReturnBillItems();
  const { data: settings } = useGetSettings();
  
  // State for tracking return quantities keyed by productId
  const [returnQtys, setReturnQtys] = useState<Record<number, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  useEffect(() => {
    if (open) {
      setReturnQtys({});
      setIsSuccess(false);
      setPhoneNumber("");
    }
  }, [open, bill]);

  if (!bill) return null;

  const handleQtyChange = (productId: number, val: string, max: number) => {
    // Only allow numbers and empty string
    if (!/^\d*$/.test(val)) return;
    
    let numVal = parseInt(val || "0", 10);
    if (numVal > max) numVal = max;
    
    setReturnQtys(prev => ({ ...prev, [productId]: val ? String(numVal) : "" }));
  };

  const calculateTotalRefund = () => {
    let total = 0;
    bill.items.forEach(item => {
      const qty = parseInt(returnQtys[item.productId] || "0", 10);
      if (qty > 0) {
        total += (qty * item.unitPrice);
      }
    });
    return total;
  };

  const totalRefund = calculateTotalRefund();
  const hasReturns = totalRefund > 0;

  const handleConfirmReturn = () => {
    if (!hasReturns) return;

    const itemsToReturn = Object.entries(returnQtys)
      .map(([productId, qtyStr]) => ({
        productId: parseInt(productId, 10),
        quantityToReturn: parseInt(qtyStr || "0", 10)
      }))
      .filter(item => item.quantityToReturn > 0);

    returnMutation.mutate(
      { data: { billId: bill.id, items: itemsToReturn } },
      {
        onSuccess: () => {
          toast({ title: "✅ Return processed successfully!" });
          setIsSuccess(true);
        },
        onError: () => {
          toast({ title: "❌ Failed to process return", variant: "destructive" });
        }
      }
    );
  };

  const handlePrintReceipt = () => {
    if (!bill) return;

    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    let subtotal = 0;
    let totalReturns = 0;

    const rows = bill.items
      .map((item) => {
        const returnedQty = item.returnedQuantity ?? 0;
        const validQty = item.quantity - returnedQty;
        
        if (validQty <= 0 && returnedQty > 0) {
          totalReturns += item.totalPrice;
          return `
            <tr>
              <td style="padding:3px 0; color: #888;"><s>${item.productName} ${item.variantName || ""}</s><br/><small>Returned (${returnedQty})</small></td>
              <td style="padding:3px 0; text-align:right; color: #888;">-</td>
              <td style="padding:3px 0; text-align:right; color: #888;">-</td>
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
            ${returnedQty > 0 ? `<br/><small style="color:red">(-${returnedQty} returned)</small>` : ""}
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
      </style>
      </head><body>
        <div class="center bold">
          <h2>${shopName}</h2>
          <p>Retail Invoice (Updated)</p>
          ${shopAddress ? `<p>${shopAddress}</p>` : ""}
          ${shopPhone ? `<p>Phone: ${shopPhone}</p>` : ""}
        </div>
        <hr/>
        <p><strong>Bill No:</strong> #${bill.id}</p>
        <p><strong>Date:</strong> ${format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}</p>
        ${bill.customerName ? `<p><strong>Customer:</strong> ${bill.customerName}</p>` : ""}
        <hr/>
        <table>
          <thead><tr><th>Item</th><th style="text-align:right">Rate</th><th style="text-align:right">Amt</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <hr/>
        ${totalReturns > 0 ? `<div style="display:flex;justify-content:space-between;color:red;"><span>Total Refunds:</span><span>-${currency} ${totalReturns.toFixed(0)}</span></div><hr/>` : ""}
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Revised Total:</span><span>${currency} ${(bill.finalAmount - totalReturns).toFixed(0)}</span></div>
        <hr/>
        <div style="display:flex;justify-content:space-between;"><span>Payment:</span><span>${bill.paymentMode.toUpperCase()}</span></div>
        <div class="center" style="margin-top:15px;font-size:12px;">Thank You! Visit Again</div>
        <script>
          setTimeout(() => { window.print(); }, 100);
        </script>
      </body></html>
    `);
    win.document.close();
  };

  const handleWhatsAppShare = () => {
    if (!bill) return;

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
    
    let msg = "```\n";
    msg += padCenter(shopName, W) + "\n";
    msg += padCenter("Updated Retail Invoice", W) + "\n";
    msg += "-".repeat(W) + "\n";
    msg += `Bill No: #${bill.id}\n`;
    msg += `Date: ${format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}\n`;
    if (bill.customerName) msg += `Customer: ${bill.customerName}\n`;
    msg += "-".repeat(W) + "\n";
    msg += padRight("Item", 18) + " " + padLeft("Rate", 8) + " " + padLeft("Amt", 6) + "\n";

    bill.items.forEach((item) => {
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
    msg += padRight("Revised Total:", 20) + padLeft(`Rs ${(bill.finalAmount - totalReturns).toFixed(0)}`, 14) + "\n";
    msg += "-".repeat(W) + "\n";
    msg += padCenter("Thank You! Visit Again", W) + "\n";
    msg += "```";

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95%] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Return Successful</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Stock aur Khata (agar applicable) adjust ho gaye hain.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-3 mt-4">
              <div className="space-y-1.5">
                <Input 
                  placeholder="WhatsApp Number (e.g. 9876543210)" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  className="w-full"
                />
              </div>
              <Button onClick={handleWhatsAppShare} className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-5 w-5" /> Send Updated Bill
              </Button>
              <Button onClick={handlePrintReceipt} variant="outline" className="w-full gap-2">
                <Printer className="h-5 w-5" /> Print Thermal Receipt
              </Button>
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full mt-2">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="p-4 md:p-5 border-b bg-muted/30 shrink-0">
              <DialogTitle className="flex justify-between items-center">
                <span>Bill #{bill.id} Details</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  bill.paymentMode === "khata" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                  bill.paymentMode === "upi" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                  {bill.paymentMode.toUpperCase()}
                </span>
              </DialogTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}
                {bill.customerName && ` • 👤 ${bill.customerName}`}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80">
                  Kisi item ko return karne ke liye uski 'Return Qty' box me number daalein. Stock aur Khata (agar applicable hai) auto-adjust ho jayega.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm border-b pb-2">Purchased Items</h3>
                {bill.items.map((item, idx) => {
                  const previousReturnQty = item.returnedQuantity ?? 0;
                  const maxReturnable = item.quantity - previousReturnQty;
                  const currentReturnVal = returnQtys[item.productId] ?? "";

                  return (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0 border-dashed">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-medium text-sm truncate" title={item.productName || item.variantName}>
                          {item.productName} {item.variantName && <span className="text-muted-foreground text-xs">({item.variantName})</span>}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.displayQuantity || `${item.quantity} ${item.unit || 'pcs'}`} x {currency} {item.unitPrice}
                        </p>
                        {previousReturnQty > 0 && (
                          <p className="text-[10px] text-destructive mt-0.5 font-medium flex items-center gap-1">
                            <RotateCcw className="h-3 w-3" />
                            {previousReturnQty} already returned
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="font-semibold text-sm">
                          {currency} {item.totalPrice}
                        </div>
                        {maxReturnable > 0 ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">Return Qty:</span>
                            <Input 
                              type="text" 
                              inputMode="numeric"
                              pattern="[0-9]*"
                              className="w-16 h-7 text-center text-xs px-1"
                              placeholder={`Max ${maxReturnable}`}
                              value={currentReturnVal}
                              onChange={(e) => handleQtyChange(item.productId, e.target.value, maxReturnable)}
                            />
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-sm mt-1">
                            Fully Returned
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Original Total:</span>
                  <span>{currency} {bill.finalAmount}</span>
                </div>
                {hasReturns && (
                  <div className="flex justify-between items-center text-sm font-bold text-destructive mt-2 p-2 bg-destructive/10 rounded-md border border-destructive/20">
                    <span className="flex items-center gap-1"><RotateCcw className="h-4 w-4" /> Refund Amount:</span>
                    <span>{currency} {totalRefund.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-card shrink-0 flex gap-2 flex-wrap sm:flex-nowrap">
              <Button variant="outline" className="flex-1 min-w-[80px]" onClick={handlePrintReceipt}>
                <Printer className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" className="flex-1 min-w-[80px] text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleWhatsAppShare}>
                <MessageCircle className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button variant="outline" className="flex-1 min-w-[80px]" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button 
                className="flex-[2] min-w-[120px] gap-2" 
                variant={hasReturns ? "destructive" : "secondary"}
                disabled={!hasReturns || returnMutation.isPending}
                onClick={handleConfirmReturn}
              >
                {returnMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : hasReturns ? (
                  <><Check className="h-4 w-4" /> Confirm Return</>
                ) : (
                  "Select Return Qty"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
