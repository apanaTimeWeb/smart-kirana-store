"use client";

import React from "react";
import { useBilling } from "../../billing_context/BillingContext";
import { BillingProductSearchBar } from "./BillingProductSearchBar";
import { BillingProductQuickPicks } from "./BillingProductQuickPicks";
import { BillingProductFilters } from "./BillingProductFilters";
import { BillingProductList } from "./BillingProductList";

export function BillingProductMainGrid() {
  const { search } = useBilling();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <BillingProductSearchBar />

      {!search && <BillingProductQuickPicks />}

      <BillingProductFilters />

      <div className="min-h-0 flex-1 overflow-auto">
        <BillingProductList />
      </div>
    </div>
  );
}
