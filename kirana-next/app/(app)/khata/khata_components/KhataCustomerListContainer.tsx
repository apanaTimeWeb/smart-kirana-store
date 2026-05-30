"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useListCustomers,
  useDeleteCustomer,
  getListCustomersQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useKhata } from "./KhataContext";
import { KhataConstants } from "./KhataConstants";
import { KhataCustomerListHeader } from "./KhataCustomerListHeader";
import { KhataCustomerListItem } from "./KhataCustomerListItem";
import { KhataAddCustomerDialog } from "./KhataAddCustomerDialog";
import { KhataLedgerContainer } from "./KhataLedgerContainer";

export function KhataCustomerListContainer() {
  const { customerSearch, selectedLedgerId, setSelectedLedgerId } = useKhata();
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

  return (
    <div className="space-y-6">
      <KhataCustomerListHeader totalCustomers={customers.length} />

      <KhataAddCustomerDialog />

      <Dialog open={selectedLedgerId !== null} onOpenChange={(open) => !open && setSelectedLedgerId(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-[var(--khata-border)]">
            <DialogTitle>Khata Ledger</DialogTitle>
          </DialogHeader>
          {selectedLedgerId && <KhataLedgerContainer customerId={selectedLedgerId} />}
        </DialogContent>
      </Dialog>

      <div className="rounded-2xl border border-[var(--khata-border)] bg-[var(--khata-card-bg)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[var(--khata-border)]">
            {customers.map((customer: any) => (
              <KhataCustomerListItem key={customer.id} customer={customer} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
