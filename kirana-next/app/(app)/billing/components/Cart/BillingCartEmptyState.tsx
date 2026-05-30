"use client";

import React from "react";
import { PackageCheck } from "lucide-react";

export function BillingCartEmptyState() {
  return (
    <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-[var(--billing-muted-text)]">
      <PackageCheck className="h-10 w-10 opacity-20" />
      <p className="text-sm">Product tap karein</p>
    </div>
  );
}
