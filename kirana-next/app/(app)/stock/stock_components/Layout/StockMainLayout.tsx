"use client";

import React from "react";
import { StockHeader } from "./StockHeader";
import { StockStatsGrid } from "../Dashboard/StockStatsGrid";
import { StockSearchBar } from "../SearchAndFilter/StockSearchBar";
import { StockFilterBar } from "../SearchAndFilter/StockFilterBar";
import { StockMainTable } from "../Table/StockMainTable";
import { StockMobileList } from "../Mobile/StockMobileList";
import { StockProductCreator } from "../Dialogs/ProductCreator/StockProductCreator";
import { StockPurchaseDialog } from "../Dialogs/PurchaseDialog/StockPurchaseDialog";
import { StockEditVariantDialog } from "../Dialogs/EditVariantDialog/StockEditVariantDialog";
import { StockAdjustmentDialog } from "../Dialogs/StockAdjustmentDialog";

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
      <StockAdjustmentDialog />
    </div>
  );
}
