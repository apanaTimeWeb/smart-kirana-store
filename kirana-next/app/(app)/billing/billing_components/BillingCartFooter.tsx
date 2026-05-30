"use client";

import React, { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { BillingCartAdvancedOptions } from "./BillingCartAdvancedOptions";
import type { BillInputPaymentMode } from "@/lib/api";

interface BillingCartFooterProps {
  subtotal: number;
  discount: number;
  setDiscount: (value: number) => void;
  enableGST: boolean;
  setEnableGST: (value: boolean) => void;
  gstRate: number;
  setGstRate: (rate: number) => void;
  gstAmount: number;
  paymentMode: BillInputPaymentMode | "";
  setPaymentMode: (mode: BillInputPaymentMode) => void;
  setSelectedCustomerId: (id: string) => void;
  cartLength: number;
  selectedCustomerId: string;
  quickPhone: string;
  setQuickPhone: (phone: string) => void;
  finalAmount: number;
  billSuccess: boolean;
  isCheckoutPending: boolean;
  onCheckout: () => void;
  onResetCart: () => void;
}

export function BillingCartFooter({
  subtotal,
  discount,
  setDiscount,
  enableGST,
  setEnableGST,
  gstRate,
  setGstRate,
  gstAmount,
  paymentMode,
  setPaymentMode,
  setSelectedCustomerId,
  cartLength,
  selectedCustomerId,
  quickPhone,
  setQuickPhone,
  finalAmount,
  billSuccess,
  isCheckoutPending,
  onCheckout,
  onResetCart,
}: BillingCartFooterProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <CardFooter className="flex-col gap-3 border-t border-[var(--billing-border)] bg-[var(--billing-cart-footer-bg)] px-3 py-3 md:px-4 md:py-4">
      {/* Toggle for Advanced Options */}
      <div className="w-full flex justify-between items-center pb-2 border-b border-[var(--billing-border)]">
        <span className="text-sm font-semibold text-[var(--billing-muted-text)] flex items-center gap-1.5">
          <Settings2 className="h-4 w-4" />
          Billing Options
        </span>
        <Button variant="ghost" size="sm" onClick={() => setShowOptions(!showOptions)} className="h-7 px-2 text-[var(--billing-foreground-text)]">
          {showOptions ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          <span className="ml-1 text-xs">{showOptions ? "Hide" : "Show"}</span>
        </Button>
      </div>

      <BillingCartAdvancedOptions
        showOptions={showOptions}
        subtotal={subtotal}
        discount={discount}
        setDiscount={setDiscount}
        enableGST={enableGST}
        setEnableGST={setEnableGST}
        gstRate={gstRate}
        setGstRate={setGstRate}
        gstAmount={gstAmount}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        setSelectedCustomerId={setSelectedCustomerId}
        cartLength={cartLength}
        selectedCustomerId={selectedCustomerId}
        quickPhone={quickPhone}
        setQuickPhone={setQuickPhone}
      />

      {/* Total (Always Visible) */}
      <div className="flex w-full justify-between items-center border-t border-[var(--billing-border)] pt-3 mt-1 md:mt-0">
        <span className="font-bold">Total</span>
        <span className="text-xl font-extrabold text-[var(--billing-cart-total-text)]">
          Rs {finalAmount.toFixed(2)}
        </span>
      </div>

      {/* Checkout button */}
      <Button
        className="h-12 w-full text-base font-bold bg-[var(--billing-primary-bg)] text-[var(--billing-primary-foreground)]"
        disabled={cartLength === 0 || isCheckoutPending || billSuccess || (showOptions && !paymentMode)}
        onClick={() => {
          if (!showOptions) {
            setShowOptions(true);
          } else {
            onCheckout();
          }
        }}
      >
        {billSuccess ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Bill Hua
          </span>
        ) : !showOptions ? (
          `Bill Karo - Rs ${finalAmount.toFixed(0)}`
        ) : (
          `Confirm Bill - Rs ${finalAmount.toFixed(0)}`
        )}
      </Button>

      {/* Clear cart */}
      {cartLength > 0 && (
        <button
          className="text-xs text-[var(--billing-muted-text)] underline underline-offset-2 hover:text-[var(--billing-destructive-text)]"
          onClick={onResetCart}
        >
          Cart clear karein
        </button>
      )}
    </CardFooter>
  );
}
