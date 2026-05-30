"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BillInputPaymentMode, Customer } from "@/lib/api";
import type { CartItem as BillingCartItem } from "./BillingTypes";

import { BillingCartHeader } from "./BillingCartHeader";
import { BillingCartItemList } from "./BillingCartItemList";
import { BillingCartFooter } from "./BillingCartFooter";

interface BillingCartMainPanelProps {
  cart: BillingCartItem[];
  customers: Customer[];
  discount: number;
  setDiscount: (value: number) => void;
  paymentMode: BillInputPaymentMode | "";
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

export function BillingCartMainPanel({
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
}: BillingCartMainPanelProps) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-all bg-[var(--billing-cart-bg)] border-[var(--billing-border)]",
        billSuccess && "border-[var(--billing-cart-success-border)]"
      )}
    >
      <BillingCartHeader
        billSuccess={billSuccess}
        cartCount={cartCount}
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        setSelectedCustomerId={setSelectedCustomerId}
        paymentMode={paymentMode}
      />
      <BillingCartItemList
        cart={cart}
        onUpdateQty={onUpdateQty}
        onRemove={onRemove}
      />
      <BillingCartFooter
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
        cartLength={cart.length}
        selectedCustomerId={selectedCustomerId}
        quickPhone={quickPhone}
        setQuickPhone={setQuickPhone}
        finalAmount={finalAmount}
        billSuccess={billSuccess}
        isCheckoutPending={isCheckoutPending}
        onCheckout={onCheckout}
        onResetCart={onResetCart}
      />
    </Card>
  );
}
