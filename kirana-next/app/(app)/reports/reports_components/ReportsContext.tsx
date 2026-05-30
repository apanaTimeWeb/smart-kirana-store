"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

interface ReportsContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  calOpen: boolean;
  setCalOpen: (open: boolean) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(today, 14),
    to: today,
  });
  const [calOpen, setCalOpen] = useState(false);

  return (
    <ReportsContext.Provider
      value={{
        dateRange,
        setDateRange,
        calOpen,
        setCalOpen,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
