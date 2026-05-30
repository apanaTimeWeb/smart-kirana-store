"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useBilling } from "./BillingContext";

interface BillingMobileResponsiveLayoutProps {
  productGrid: React.ReactNode;
  cartPanel: React.ReactNode;
}

export function BillingMobileResponsiveLayout({
  productGrid,
  cartPanel,
}: BillingMobileResponsiveLayoutProps) {
  const { mobileTab, setMobileTab, cartCount, finalAmount } = useBilling();

  return (
    <div className="flex h-[calc(100dvh-2*1.5rem)] flex-col gap-4 md:hidden">
      <div className="flex rounded-md border border-[var(--billing-border)] bg-[var(--billing-card-bg)] p-1">
        <button
          onClick={() => setMobileTab("products")}
          className={cn(
            "flex-1 rounded-sm py-1.5 text-sm font-medium transition-all",
            mobileTab === "products"
              ? "bg-[var(--billing-primary-bg)] text-[var(--billing-primary-foreground)] shadow-sm"
              : "text-[var(--billing-muted-text)]"
          )}
        >
          Products
        </button>
        <button
          onClick={() => setMobileTab("cart")}
          className={cn(
            "flex-1 rounded-sm py-1.5 text-sm font-medium transition-all flex items-center justify-center gap-1",
            mobileTab === "cart"
              ? "bg-[var(--billing-primary-bg)] text-[var(--billing-primary-foreground)] shadow-sm"
              : "text-[var(--billing-muted-text)]"
          )}
        >
          <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
          {cartCount > 0 && <span className="font-extrabold ml-1">- Rs {finalAmount.toFixed(0)}</span>}
        </button>
      </div>

      <div className={cn("min-h-0 flex-1", mobileTab === "products" ? "block" : "hidden")}>
        {productGrid}
      </div>
      <div className={cn("min-h-0 flex-1", mobileTab === "cart" ? "block" : "hidden")}>
        {cartPanel}
      </div>
    </div>
  );
}
