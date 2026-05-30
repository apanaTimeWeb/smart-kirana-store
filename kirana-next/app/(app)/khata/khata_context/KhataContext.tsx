"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface KhataContextType {
  customerSearch: string;
  setCustomerSearch: (val: string) => void;
  ledgerSearch: string;
  setLedgerSearch: (val: string) => void;
  selectedLedgerId: number | null;
  setSelectedLedgerId: (id: number | null) => void;
  isAddCustomerOpen: boolean;
  setIsAddCustomerOpen: (open: boolean) => void;
  transactionMode: "payment" | "credit" | null;
  setTransactionMode: (mode: "payment" | "credit" | null) => void;
  isReminderOpen: boolean;
  setIsReminderOpen: (open: boolean) => void;
}

const KhataContext = createContext<KhataContextType | undefined>(undefined);

export function KhataProvider({ children }: { children: ReactNode }) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [transactionMode, setTransactionMode] = useState<"payment" | "credit" | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const value = useMemo(
    () => ({
      customerSearch,
      setCustomerSearch,
      ledgerSearch,
      setLedgerSearch,
      selectedLedgerId,
      setSelectedLedgerId,
      isAddCustomerOpen,
      setIsAddCustomerOpen,
      transactionMode,
      setTransactionMode,
      isReminderOpen,
      setIsReminderOpen,
    }),
    [
      customerSearch,
      ledgerSearch,
      selectedLedgerId,
      isAddCustomerOpen,
      transactionMode,
      isReminderOpen,
    ]
  );

  return (
    <KhataContext.Provider value={value}>
      {children}
    </KhataContext.Provider>
  );
}

export function useKhata() {
  const context = useContext(KhataContext);
  if (context === undefined) {
    throw new Error("useKhata must be used within a KhataProvider");
  }
  return context;
}
