"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BillingMobileResponsiveLayoutProps {
  mobileTab: "products" | "cart";
  setMobileTab: (tab: "products" | "cart") => void;
  cartCount: number;
  finalAmount: number;
  productGrid: React.ReactNode;
  cartPanel: React.ReactNode;
}

export function BillingMobileResponsiveLayout({
  mobileTab,
  setMobileTab,
  cartCount,
  finalAmount,
  productGrid,
  cartPanel,
}: BillingMobileResponsiveLayoutProps) {
  return (
    <div className="flex h-[calc(100dvh-3.5rem-4rem)] flex-col gap-3 md:hidden">
      {/* Tab bar */}
      <div className="flex shrink-0 gap-1 rounded-lg border border-[var(--billing-border)] bg-[var(--billing-tab-bar-bg)] p-1">
        <button
          onClick={() => setMobileTab("products")}
          className={cn(
            "flex-1 rounded-md py-2 text-sm font-bold",
            mobileTab === "products"
              ? "bg-[var(--billing-tab-active-bg)] text-[var(--billing-tab-active-text)] shadow-sm"
              : "text-[var(--billing-tab-inactive-text)] hover:bg-[var(--billing-muted-bg)]"
          )}
        >
          Products
        </button>
        <button
          onClick={() => setMobileTab("cart")}
          className={cn(
            "flex-1 rounded-md py-2 text-sm font-bold",
            mobileTab === "cart"
              ? "bg-[var(--billing-tab-active-bg)] text-[var(--billing-tab-active-text)] shadow-sm"
              : "text-[var(--billing-tab-inactive-text)] hover:bg-[var(--billing-muted-bg)]"
          )}
        >
          Cart {cartCount > 0 ? `(${cartCount})` : ""}
        </button>
      </div>

      {/* Content */}
      {mobileTab === "products" ? productGrid : <div className="min-h-0 flex-1">{cartPanel}</div>}

      {/* Sticky cart button */}
      {mobileTab === "products" && cartCount > 0 && (
        <button
          onClick={() => setMobileTab("cart")}
          className="flex shrink-0 items-center justify-between rounded-lg bg-[var(--billing-sticky-btn-bg)] px-4 py-3 text-[var(--billing-sticky-btn-text)] shadow-lg"
        >
          <span className="font-bold">{cartCount} items</span>
          <span className="font-extrabold">Rs {finalAmount.toFixed(0)}</span>
        </button>
      )}
    </div>
  );
}
