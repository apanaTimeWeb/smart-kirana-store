"use client";

import React from "react";
import { SuppliersHeader } from "../List/SuppliersHeader";
import { SuppliersSearchBar } from "../List/SuppliersSearchBar";
import { SuppliersListTable } from "../List/SuppliersListTable";
import { SuppliersAddDialog } from "../List/SuppliersAddDialog";
import { SuppliersLedgerDialog } from "../Ledger/SuppliersLedgerDialog";

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
