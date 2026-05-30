"use client";

// KhataCustomerListContainer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Orchestrates the customer list page. Fetches customer data,
// handles delete mutations, and composes all sub-components into the list layout.
//
// This is the "smart" container — it owns the API calls and wires the data down
// to pure presentational sub-components. It does NOT render the skeleton,
// empty state, or ledger dialog itself — those are isolated in their own files.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  useListCustomers,
  useDeleteCustomer,
  getListCustomersQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type Customer } from "@/app/(app)/khata/types/KhataTypes";
import { useKhata } from "@/app/(app)/khata/context/KhataContext";
import { KhataConstants } from "@/app/(app)/khata/constants/KhataConstants";
import { KhataCustomerListHeader } from "@/app/(app)/khata/components/CustomerList/KhataCustomerListHeader";
import { KhataCustomerListItem } from "@/app/(app)/khata/components/CustomerList/KhataCustomerListItem";
import { KhataCustomerListSkeleton } from "@/app/(app)/khata/components/CustomerList/KhataCustomerListSkeleton";
import { KhataCustomerListEmptyState } from "@/app/(app)/khata/components/CustomerList/KhataCustomerListEmptyState";
import { KhataAddCustomerDialog } from "@/app/(app)/khata/components/Forms/KhataAddCustomerDialog";
import { KhataLedgerDialog } from "@/app/(app)/khata/components/Ledger/KhataLedgerDialog";

export function KhataCustomerListContainer() {
  const { customerSearch } = useKhata();
  const { data: customers = [], isLoading } = useListCustomers({ search: customerSearch || undefined });
  const deleteCustomer = useDeleteCustomer();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const onDelete = (id: number, name: string) => {
    if (!confirm(`${KhataConstants.MESSAGES.CONFIRM_DELETE_PREFIX}${name}${KhataConstants.MESSAGES.CONFIRM_DELETE_SUFFIX}`)) return;
    deleteCustomer.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: KhataConstants.MESSAGES.CUSTOMER_DELETED });
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: () => toast({ title: KhataConstants.MESSAGES.CUSTOMER_DELETE_FAILED, variant: "destructive" }),
      }
    );
  };

  const renderListContent = () => {
    if (isLoading) return <KhataCustomerListSkeleton />;
    if (customers.length === 0) return <KhataCustomerListEmptyState />;
    return (
      <div className="divide-y divide-[var(--khata-border)]">
        {(customers as Customer[]).map((customer) => (
          <KhataCustomerListItem key={customer.id} customer={customer} onDelete={onDelete} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <KhataCustomerListHeader totalCustomers={customers.length} />

      {/* Dialogs are rendered here so they are always mounted in the tree */}
      <KhataAddCustomerDialog />
      <KhataLedgerDialog />

      <div className="rounded-2xl border border-[var(--khata-border)] bg-[var(--khata-card-bg)] overflow-hidden">
        {renderListContent()}
      </div>
    </div>
  );
}
