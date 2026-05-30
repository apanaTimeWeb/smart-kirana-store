"use client";

import React from "react";
import { CardContent } from "@/components/ui/card";
import { BillingCartEmptyState } from "./BillingCartEmptyState";
import { BillingCartItemRow } from "./BillingCartItemRow";
import { useBilling } from "../../context/BillingContext";

export function BillingCartItemList() {
  const { cart, updateQty: onUpdateQty, removeFromCart: onRemove } = useBilling();
  return (
    <CardContent className="flex-1 overflow-auto p-0">
      {cart.length === 0 ? (
        <BillingCartEmptyState />
      ) : (
        <div className="divide-y divide-[var(--billing-border)]">
          {cart.map((item) => (
            <BillingCartItemRow
              key={item.lineId}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </CardContent>
  );
}
