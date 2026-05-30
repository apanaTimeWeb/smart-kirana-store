"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useGetDashboardSummary } from "@/lib/api";
import { DashboardSummaryData } from "../types/DashboardTypes";

interface DashboardContextType {
  summary: DashboardSummaryData | undefined;
  isLoading: boolean;
  error: any;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: summary, isLoading, error } = useGetDashboardSummary();

  const value = useMemo(
    () => ({ summary, isLoading, error }),
    [summary, isLoading, error]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}
