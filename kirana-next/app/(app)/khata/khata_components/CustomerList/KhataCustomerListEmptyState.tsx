// KhataCustomerListEmptyState.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders a helpful empty-state UI when the customer list has
// no records — either on first use (no customers yet) or when the search
// query matches nobody.
//
// Pure presentational component — no hooks, no state, no context.
// To change the empty-state appearance, touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Users } from "lucide-react";
import { KhataConstants } from "@/app/(app)/khata/khata_constants/KhataConstants";

export function KhataCustomerListEmptyState() {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="h-16 w-16 rounded-full bg-[var(--khata-customer-avatar-bg)] flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-[var(--khata-customer-avatar-text)]" />
      </div>
      <p className="font-semibold text-[var(--khata-foreground)]">
        {KhataConstants.LABELS.NO_CUSTOMERS}
      </p>
      <p className="text-sm text-[var(--khata-muted-text)] mt-1">
        {KhataConstants.LABELS.NO_CUSTOMERS_SUB}
      </p>
    </div>
  );
}
