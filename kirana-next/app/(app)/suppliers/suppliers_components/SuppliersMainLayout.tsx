"use client";

import React from "react";
import { SuppliersHeader } from "./SuppliersHeader";
import { SuppliersSearchBar } from "./SuppliersSearchBar";
import { SuppliersListTable } from "./SuppliersListTable";
import { SuppliersAddDialog } from "./SuppliersAddDialog";
import { SuppliersLedgerDialog } from "./SuppliersLedgerDialog";

export function SuppliersMainLayout() {
  return (
    <div className="space-y-6">
      <SuppliersHeader />
      
      <div className="flex">
        <SuppliersSearchBar />
      </div>

      <SuppliersListTable />
      
      <SuppliersAddDialog />
      <SuppliersLedgerDialog />
    </div>
  );
}
