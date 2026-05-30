"use client";

import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { type Customer } from "@/lib/api";
import { BillingCustomerSelector } from "./BillingCustomerSelector";
import type { BillInputPaymentMode } from "@/lib/api";

interface BillingCartHeaderProps {
  billSuccess: boolean;
  cartCount: number;
  customers: Customer[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  paymentMode: BillInputPaymentMode | "";
}

export function BillingCartHeader({
  billSuccess,
  cartCount,
  customers,
  selectedCustomerId,
  setSelectedCustomerId,
  paymentMode,
}: BillingCartHeaderProps) {
  return (
    <CardHeader className="border-b px-3 py-3 md:px-4 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full">
        <CardTitle className="flex items-center gap-1.5 text-base sm:pt-2 shrink-0 whitespace-nowrap">
          <ShoppingCart className="h-4 w-4 text-[var(--billing-primary)]" />
          Bill
          {billSuccess && (
            <CheckCircle2 className="h-4 w-4 text-[var(--billing-cart-success-icon)]" />
          )}
          {cartCount > 0 && !billSuccess && (
            <Badge className="bg-[var(--billing-cart-badge-bg)] text-[var(--billing-cart-badge-text)] ml-1">
              {cartCount}
            </Badge>
          )}
        </CardTitle>
        <div className="w-full sm:flex-1 sm:max-w-[220px]">
          <BillingCustomerSelector
            customers={customers}
            value={selectedCustomerId}
            onChange={setSelectedCustomerId}
            required={paymentMode === "khata"}
          />
        </div>
      </div>
    </CardHeader>
  );
}
