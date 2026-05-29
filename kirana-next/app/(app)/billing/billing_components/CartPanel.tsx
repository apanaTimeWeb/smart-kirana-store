"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle2,
  PackageCheck,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Settings2
} from "lucide-react";
import { type BillInputPaymentMode, type Customer } from "@/lib/api";
import { cn } from "@/lib/utils";
import { type CartItem } from "./types";
import { CartItemRow } from "./CartItemRow";
import { CustomerPicker } from "./CustomerPicker";

interface CartPanelProps {
  cart: CartItem[];
  customers: Customer[];
  discount: number;
  setDiscount: (value: number) => void;
  paymentMode: BillInputPaymentMode;
  setPaymentMode: (mode: BillInputPaymentMode) => void;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  quickPhone: string;
  setQuickPhone: (phone: string) => void;
  billSuccess: boolean;
  enableGST: boolean;
  setEnableGST: (value: boolean) => void;
  gstRate: number;
  setGstRate: (rate: number) => void;
  subtotal: number;
  taxableValue: number;
  gstAmount: number;
  finalAmount: number;
  cartCount: number;
  isCheckoutPending: boolean;
  onUpdateQty: (lineId: string, delta: number) => void;
  onRemove: (lineId: string) => void;
  onCheckout: () => void;
  onResetCart: () => void;
}

export function CartPanel({
  cart,
  customers,
  discount,
  setDiscount,
  paymentMode,
  setPaymentMode,
  selectedCustomerId,
  setSelectedCustomerId,
  quickPhone,
  setQuickPhone,
  billSuccess,
  enableGST,
  setEnableGST,
  gstRate,
  setGstRate,
  subtotal,
  gstAmount,
  finalAmount,
  cartCount,
  isCheckoutPending,
  onUpdateQty,
  onRemove,
  onCheckout,
  onResetCart,
}: CartPanelProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-all",
        billSuccess && "border-[var(--billing-cart-success-border)]"
      )}
    >
      {/* Header */}
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Current Bill
          {billSuccess && (
            <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--billing-cart-success-icon)]" />
          )}
          {cartCount > 0 && !billSuccess && (
            <Badge className="ml-auto bg-[var(--billing-cart-badge-bg)] text-[var(--billing-cart-badge-text)]">
              {cartCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      {/* Items */}
      <CardContent className="flex-1 overflow-auto p-0">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <PackageCheck className="h-10 w-10 opacity-20" />
            <p className="text-sm">Product tap karein</p>
          </div>
        ) : (
          <div className="divide-y">
            {cart.map((item) => (
              <CartItemRow
                key={item.lineId}
                item={item}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-col gap-3 border-t bg-[var(--billing-cart-footer-bg)] px-3 py-3 md:px-4 md:py-4">
        
        {/* Toggle for Advanced Options (All Screens) */}
        <div className="w-full flex justify-between items-center pb-2 border-b">
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Settings2 className="h-4 w-4" />
            Billing Options
          </span>
          <Button variant="ghost" size="sm" onClick={() => setShowOptions(!showOptions)} className="h-7 px-2">
            {showOptions ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            <span className="ml-1 text-xs">{showOptions ? "Hide" : "Show"}</span>
          </Button>
        </div>

        {/* Advanced Options Container */}
        <div className={cn(
          "w-full flex-col gap-3",
          showOptions ? "flex" : "hidden"
        )}>
          {/* Subtotal */}
          <div className="flex w-full justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
          </div>

          {/* Discount */}
          <div className="flex w-full items-center gap-2">
            <span className="whitespace-nowrap text-sm text-muted-foreground">Discount</span>
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
          <div className="flex w-full items-center justify-between border-t pt-2">
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
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* GST amount row */}
          {enableGST && (
            <div className="flex w-full justify-between text-sm">
              <span className="text-muted-foreground">GST Amount</span>
              <span className="font-medium">Rs {gstAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Payment mode */}
          <div className="border-t pt-3">
            <Select
              value={paymentMode}
              onValueChange={(v) => {
                setPaymentMode(v as BillInputPaymentMode);
                if (v !== "khata") setSelectedCustomerId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="khata">Khata</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer picker */}
          {(paymentMode === "khata" || cart.length > 0) && (
            <CustomerPicker
              customers={customers}
              value={selectedCustomerId}
              onChange={setSelectedCustomerId}
              required={paymentMode === "khata"}
            />
          )}

          {/* Quick WhatsApp phone */}
          {cart.length > 0 && !selectedCustomerId && (
            <div className="flex items-center rounded-md border px-3 bg-background focus-within:ring-1 focus-within:ring-ring">
              <span className="text-sm text-muted-foreground mr-2">+91</span>
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

        {/* Total (Always Visible) */}
        <div className="flex w-full justify-between items-center border-t pt-3 mt-1 md:mt-0">
          <span className="font-bold">Total</span>
          <span className="text-xl font-extrabold text-[var(--billing-cart-total-text)]">
            Rs {finalAmount.toFixed(2)}
          </span>
        </div>

        {/* Checkout button (Always Visible) */}
        <Button
          className="h-12 w-full text-base font-bold"
          disabled={cart.length === 0 || isCheckoutPending || billSuccess}
          onClick={onCheckout}
        >
          {billSuccess ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Bill Hua
            </span>
          ) : (
            `Bill Karo - Rs ${finalAmount.toFixed(0)}`
          )}
        </Button>

        {/* Clear cart */}
        {cart.length > 0 && (
          <button
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-destructive"
            onClick={onResetCart}
          >
            Cart clear karein
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
