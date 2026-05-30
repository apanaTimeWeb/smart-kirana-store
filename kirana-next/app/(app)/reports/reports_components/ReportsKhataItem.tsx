"use client";

import React from "react";
import type { ReportsKhataCustomer } from "./ReportsTypes";

interface ReportsKhataItemProps {
  customer: ReportsKhataCustomer;
  moneyFormatter: (value: number) => string;
}

export function ReportsKhataItem({ customer, moneyFormatter }: ReportsKhataItemProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3 hover:bg-[var(--reports-muted-hover-bg)]"
      data-testid={`row-khata-${customer.id}`}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--reports-foreground)]">{customer.name}</p>
        <p className="text-xs text-[var(--reports-muted-text)]">{customer.phone}</p>
      </div>
      <span className="text-sm font-bold text-[var(--reports-khata-color)]">
        {moneyFormatter(customer.totalDue)}
      </span>
    </div>
  );
}
