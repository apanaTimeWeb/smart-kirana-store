"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BillInputPaymentMode } from "@/lib/api";
import { GST_RATES, PAYMENT_MODES } from "./BillingTypes";

interface BillingCartAdvancedOptionsProps {
  showOptions: boolean;
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
}

export function BillingCartAdvancedOptions({
  showOptions,
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
}: BillingCartAdvancedOptionsProps) {
  return (
    <div className={cn("w-full flex-col gap-3", showOptions ? "flex" : "hidden")}>
      {/* Subtotal */}
      <div className="flex w-full justify-between text-sm">
        <span className="text-[var(--billing-muted-text)]">Subtotal</span>
        <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
      </div>

      {/* Discount */}
      <div className="flex w-full items-center gap-2">
        <span className="whitespace-nowrap text-sm text-[var(--billing-muted-text)]">Discount</span>
        <Input
          type="number"
          min="0"
          value={discount || ""}
          placeholder="0"
          onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
          className="h-8 text-right"
        />
      </div>

      {/* GST toggle */}
      <div className="flex w-full items-center justify-between border-t pt-2 border-[var(--billing-border)]">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox
            checked={enableGST}
            onCheckedChange={(checked) => setEnableGST(Boolean(checked))}
          />
          GST
        </label>
        {enableGST && (
          <Select value={gstRate.toString()} onValueChange={(v) => setGstRate(Number(v))}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GST_RATES.map((rate) => (
                <SelectItem key={rate} value={rate.toString()}>
                  {rate}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* GST amount row */}
      {enableGST && (
        <div className="flex w-full justify-between text-sm">
          <span className="text-[var(--billing-muted-text)]">GST Amount</span>
          <span className="font-medium">Rs {gstAmount.toFixed(2)}</span>
        </div>
      )}

      {/* Payment mode */}
      <div className="border-t border-[var(--billing-border)] pt-3">
        <Select
          value={paymentMode}
          onValueChange={(v) => {
            setPaymentMode(v as BillInputPaymentMode);
            if (v !== "khata") setSelectedCustomerId("");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_MODES.map((mode) => (
              <SelectItem key={mode.id} value={mode.id}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick WhatsApp phone */}
      {cartLength > 0 && !selectedCustomerId && (
        <div className="flex items-center rounded-md border border-[var(--billing-border)] px-3 bg-[var(--billing-background-bg)] focus-within:ring-1 focus-within:ring-ring">
          <span className="text-sm text-[var(--billing-muted-text)] mr-2">+91</span>
          <Input
            type="tel"
            placeholder="WhatsApp (Optional)"
            className="border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 shadow-none bg-transparent"
            value={quickPhone}
            onChange={(e) => setQuickPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </div>
      )}
    </div>
  );
}
