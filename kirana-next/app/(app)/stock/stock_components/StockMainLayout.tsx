"use client";

import React from "react";
import { StockHeader } from "./StockHeader";
import { StockStatsGrid } from "./StockStatsGrid";
import { StockSearchBar } from "./StockSearchBar";
import { StockFilterBar } from "./StockFilterBar";
import { StockMainTable } from "./StockMainTable";
import { StockMobileList } from "./StockMobileList";
import { StockProductCreator } from "./StockProductCreator";
import { StockPurchaseDialog } from "./StockPurchaseDialog";
import { StockEditVariantDialog } from "./StockEditVariantDialog";

export function StockMainLayout() {
  return (
    <div className="space-y-4">
      <StockHeader />
      <StockStatsGrid />
      <StockSearchBar />
      <StockFilterBar />
      <StockMainTable />
      <StockMobileList />
      
      <StockProductCreator />
      <StockPurchaseDialog />
      <StockEditVariantDialog />
    </div>
  );
}
