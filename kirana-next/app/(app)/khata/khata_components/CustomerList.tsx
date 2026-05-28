"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, ChevronRight, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useListCustomers,
  useDeleteCustomer,
  getListCustomersQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AddCustomerDialog } from "./AddCustomerDialog";
import { KhataLedger } from "./KhataLedger";

export function CustomerList() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useListCustomers({ search: search || undefined });
  const deleteCustomer = useDeleteCustomer();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [ledgerId, setLedgerId] = useState<number | null>(null);

  const onDelete = (id: number, name: string) => {
    if (!confirm(`"${name}" delete karna chahte hain?`)) return;
    deleteCustomer.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Customer delete ho gaya" });
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: () => toast({ title: "Customer delete nahi hua", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Khata (खाता)</h1>
          <p className="text-muted-foreground">{customers.length} Customers</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Naam ya phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Add customer dialog */}
      <AddCustomerDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      {/* Ledger dialog */}
      <Dialog open={ledgerId !== null} onOpenChange={(open) => !open && setLedgerId(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Khata Ledger</DialogTitle>
          </DialogHeader>
          {ledgerId && <KhataLedger customerId={ledgerId} />}
        </DialogContent>
      </Dialog>

      {/* Customer list */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {customers.map((customer: any) => (
              <div
                key={customer.id}
                className="px-6 py-5 flex items-center justify-between hover:bg-muted/60 cursor-pointer"
                onClick={() => setLedgerId(customer.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {customer.totalDue > 0 ? (
                      <p className="text-2xl font-bold text-[var(--khata-list-due-text)]">
                        ₹{customer.totalDue}
                      </p>
                    ) : (
                      <p className="text-[var(--khata-list-clear-text)]">Clear</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(customer.id, customer.name);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-[var(--khata-list-delete-hover)]" />
                  </button>
                  <ChevronRight className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
