"use client";

import React, { createContext, useContext, useState } from "react";
import { useListBills, useGetSettings } from "@/lib/api";
import { HistoryBill } from "./HistoryTypes";
import { StoreSettings } from "@/lib/api/types";

interface HistoryContextType {
  bills: HistoryBill[] | undefined;
  isLoadingBills: boolean;
  settings: StoreSettings | undefined;
  currency: string;
  selectedBill: HistoryBill | null;
  setSelectedBill: (bill: HistoryBill | null) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  openBillDetails: (bill: HistoryBill) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { data: bills, isLoading: isLoadingBills } = useListBills();
  const { data: settings } = useGetSettings();
  
  const [selectedBill, setSelectedBill] = useState<HistoryBill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currency = settings?.currency ?? "Rs";

  const openBillDetails = (bill: HistoryBill) => {
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

  return (
    <HistoryContext.Provider 
      value={{ 
        bills, 
        isLoadingBills, 
        settings, 
        currency,
        selectedBill,
        setSelectedBill,
        isDialogOpen,
        setIsDialogOpen,
        openBillDetails
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryContext() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  }
  return context;
}
