"use client";

import React, { createContext, useContext } from "react";
import { useGetDashboardSummary } from "@/lib/api";
import { DashboardSummaryData } from "./DashboardTypes";

interface DashboardContextType {
  summary: DashboardSummaryData | undefined;
  isLoading: boolean;
  error: any;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: summary, isLoading, error } = useGetDashboardSummary();

  return (
    <DashboardContext.Provider value={{ summary, isLoading, error }}>
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
