"use client";

import React, { createContext, useContext, useState } from "react";
import {
  useListSuppliers,
  useDeleteSupplier,
  useGetSupplier,
  useAddSupplierTransaction,
  useCreateSupplier,
  useGetSettings,
  getListSuppliersQueryKey,
  getGetDashboardSummaryQueryKey,
  getGetSupplierQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  SUPPLIER_TOASTS,
  buildDeleteConfirmMessage,
} from "./SuppliersConstants";

interface SuppliersContextType {
  // Search state
  search: string;
  setSearch: (s: string) => void;
  
  // Modals state
  isAddOpen: boolean;
  setIsAddOpen: (o: boolean) => void;
  
  ledgerId: number | null;
  setLedgerId: (id: number | null) => void;
  
  isReminderOpen: boolean;
  setIsReminderOpen: (o: boolean) => void;
  
  transactionMode: "payment" | "credit" | null;
  setTransactionMode: (mode: "payment" | "credit" | null) => void;

  // Global hooks data (derived)
  suppliers: any[];
  isLoadingSuppliers: boolean;
  deleteSupplier: (id: number, name: string) => void;
  createSupplierMutation: ReturnType<typeof useCreateSupplier>;
  
  // Ledger hooks data (derived from ledgerId)
  ledgerDetail: any;
  isLoadingLedger: boolean;
  addTxMutation: ReturnType<typeof useAddSupplierTransaction>;
  shopSettings: any;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [ledgerId, setLedgerId] = useState<number | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [transactionMode, setTransactionMode] = useState<"payment" | "credit" | null>(null);

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useListSuppliers({ search: search || undefined });
  const { data: ledgerDetail, isLoading: isLoadingLedger } = useGetSupplier(ledgerId ?? 0, { enabled: !!ledgerId });
  const { data: shopSettings } = useGetSettings();
  
  const deleteMutation = useDeleteSupplier();
  const createSupplierMutation = useCreateSupplier();
  const addTxMutation = useAddSupplierTransaction();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteSupplier = (id: number, name: string) => {
    if (!confirm(buildDeleteConfirmMessage(name))) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: SUPPLIER_TOASTS.deleteSuccess });
          queryClient.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: () =>
          toast({ title: SUPPLIER_TOASTS.deleteError, variant: "destructive" }),
      }
    );
  };

  return (
    <SuppliersContext.Provider
      value={{
        search, setSearch,
        isAddOpen, setIsAddOpen,
        ledgerId, setLedgerId,
        isReminderOpen, setIsReminderOpen,
        transactionMode, setTransactionMode,
        suppliers, isLoadingSuppliers, deleteSupplier,
        createSupplierMutation,
        ledgerDetail, isLoadingLedger, addTxMutation, shopSettings
      }}
    >
      {children}
    </SuppliersContext.Provider>
  );
}

export function useSuppliers() {
  const ctx = useContext(SuppliersContext);
  if (!ctx) throw new Error("useSuppliers must be used within a SuppliersProvider");
  return ctx;
}
