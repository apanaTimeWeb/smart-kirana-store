"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBilling } from "../../billing_context/BillingContext";

import { BillingCartHeader } from "./BillingCartHeader";
import { BillingCartItemList } from "./BillingCartItemList";
import { BillingCartFooter } from "./BillingCartFooter";

export function BillingCartMainPanel() {
  const { billSuccess } = useBilling();

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-all bg-[var(--billing-cart-bg)] border-[var(--billing-border)]",
        billSuccess && "border-[var(--billing-cart-success-border)]"
      )}
    >
      <BillingCartHeader />
      <BillingCartItemList />
      <BillingCartFooter />
    </Card>
  );
}
