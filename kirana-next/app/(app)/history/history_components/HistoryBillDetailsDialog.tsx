"use client";

import React, { useState, useEffect } from "react";
import { HistoryBill, HISTORY_PAYMENT_MODE_STYLES } from "./HistoryTypes";
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
import { useToast } from "@/hooks/use-toast";
import { useHistoryContext } from "./HistoryContext";
import { printHistoryReceipt } from "./HistoryPrintUtils";
import { sendHistoryWhatsAppBill } from "./HistoryWhatsAppUtils";
import { HistorySearchFilter } from "./HistorySearchFilter";

export function HistoryBillDetailsDialog() {
  const { toast } = useToast();
  const returnMutation = useReturnBillItems();
  const { selectedBill, isDialogOpen, setIsDialogOpen, currency, settings } = useHistoryContext();
  
  // State for tracking return quantities keyed by productId
  const [returnQtys, setReturnQtys] = useState<Record<number, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [updatedBill, setUpdatedBill] = useState<HistoryBill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (isDialogOpen) {
      setReturnQtys({});
      setIsSuccess(false);
      setPhoneNumber("");
      setUpdatedBill(null);
      setSearchQuery("");
    }
  }, [isDialogOpen, selectedBill]);

  if (!selectedBill) return null;

  const handleQtyChange = (productId: number, val: string, max: number) => {
    if (!/^\d*$/.test(val)) return;
    let numVal = parseInt(val || "0", 10);
    if (numVal > max) numVal = max;
    setReturnQtys(prev => ({ ...prev, [productId]: val ? String(numVal) : "" }));
  };

  const calculateTotalRefund = () => {
    let total = 0;
    selectedBill.items.forEach(item => {
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
      { data: { billId: selectedBill.id, items: itemsToReturn } },
      {
        onSuccess: (newBill) => {
          toast({ title: "✅ Return processed successfully!" });
          setUpdatedBill(newBill);
          setIsSuccess(true);
        },
        onError: () => {
          toast({ title: "❌ Failed to process return", variant: "destructive" });
        }
      }
    );
  };

  const currentBill = updatedBill || selectedBill;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-md w-[95%] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-[var(--history-success-bg)] text-[var(--history-success-text)] rounded-full flex items-center justify-center shrink-0">
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
              <Button onClick={() => sendHistoryWhatsAppBill(currentBill, phoneNumber, settings)} className="w-full gap-2 bg-[var(--history-success-btn-bg)] hover:bg-[var(--history-success-btn-hover)] text-white">
                <MessageCircle className="h-5 w-5" /> Send Updated Bill
              </Button>
              <Button onClick={() => printHistoryReceipt(currentBill, currency, settings)} variant="outline" className="w-full gap-2">
                <Printer className="h-5 w-5" /> Print Thermal Receipt
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="w-full mt-2">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="p-4 md:p-5 border-b bg-muted/30 shrink-0">
              <DialogTitle className="flex justify-between items-center">
                <span>Bill #{selectedBill.id} Details</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${HISTORY_PAYMENT_MODE_STYLES[selectedBill.paymentMode] || HISTORY_PAYMENT_MODE_STYLES.cash}`}>
                  {selectedBill.paymentMode.toUpperCase()}
                </span>
              </DialogTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(selectedBill.createdAt), "dd MMM yyyy, hh:mm a")}
                {selectedBill.customerName && ` • 👤 ${selectedBill.customerName}`}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
              <div className="bg-[var(--history-primary-bg)] border border-[var(--history-primary-border)] rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--history-primary-text)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--history-primary-text)]">
                  Kisi item ko return karne ke liye uski 'Return Qty' box me number daalein. Stock aur Khata (agar applicable hai) auto-adjust ho jayega.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2 gap-2">
                  <h3 className="font-semibold text-sm whitespace-nowrap">Purchased Items</h3>
                  <HistorySearchFilter 
                    placeholder="Search items..." 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="relative max-w-[200px] w-full"
                    inputClassName="h-8 pl-8 text-xs"
                  />
                </div>
                {selectedBill.items.filter(item => 
                  !searchQuery || 
                  item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  item.variantName?.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="text-center py-4 text-xs text-muted-foreground">Koi item nahi mila</div>
                ) : (
                selectedBill.items
                  .filter(item => 
                    !searchQuery || 
                    item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    item.variantName?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, idx) => {
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
                          <p className="text-[10px] text-[var(--history-destructive-text)] mt-0.5 font-medium flex items-center gap-1">
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
                }))}
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Original Total:</span>
                  <span>{currency} {selectedBill.finalAmount}</span>
                </div>
                {hasReturns && (
                  <div className="flex justify-between items-center text-sm font-bold text-[var(--history-destructive-text)] mt-2 p-2 bg-[var(--history-destructive-bg)] rounded-md border border-[var(--history-destructive-border)]">
                    <span className="flex items-center gap-1"><RotateCcw className="h-4 w-4" /> Refund Amount:</span>
                    <span>{currency} {totalRefund.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-card shrink-0 flex gap-2 flex-wrap sm:flex-nowrap">
              <Button variant="outline" className="flex-1 min-w-[80px]" onClick={() => printHistoryReceipt(currentBill, currency, settings)}>
                <Printer className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" className="flex-1 min-w-[80px] text-[var(--history-success-text)] hover:text-[var(--history-success-text)] hover:bg-[var(--history-success-bg)]" onClick={() => sendHistoryWhatsAppBill(currentBill, phoneNumber, settings)}>
                <MessageCircle className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button variant="outline" className="flex-1 min-w-[80px]" onClick={() => setIsDialogOpen(false)}>
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
