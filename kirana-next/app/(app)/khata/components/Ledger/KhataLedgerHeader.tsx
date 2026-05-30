"use client";

import React from "react";
import { KhataConstants } from "@/app/(app)/khata/constants/KhataConstants";

interface KhataLedgerHeaderProps {
  name: string;
  phone: string;
  totalDue: number;
}

export function KhataLedgerHeader({ name, phone, totalDue }: KhataLedgerHeaderProps) {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-[var(--khata-header-bg-from)] to-[var(--khata-header-bg-to)] border-[var(--khata-header-border)] p-5 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--khata-header-avatar-bg)] text-[var(--khata-header-avatar-text)] flex items-center justify-center text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-xl">{name}</p>
            <p className="text-[var(--khata-muted-text)]">{phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-[var(--khata-muted-text)]">
            {KhataConstants.LABELS.TOTAL_DUE}
          </p>
          <p className="text-4xl font-bold text-[var(--khata-header-due-amount)]">
            ₹{totalDue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
