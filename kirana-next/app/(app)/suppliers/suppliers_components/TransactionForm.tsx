"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  useAddSupplierTransaction,
  getGetSupplierQueryKey,
  getListSuppliersQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { txSchema, type TxFormValues } from "./types";

interface TransactionFormProps {
  supplierId: number;
  mode: "payment" | "credit";
  onClose: () => void;
}

export function TransactionForm({ supplierId, mode, onClose }: TransactionFormProps) {
  const addTx = useAddSupplierTransaction();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<TxFormValues>({
    resolver: zodResolver(txSchema),
    defaultValues: { type: mode, amount: 0, description: "" },
  });

  const onSubmit = (values: TxFormValues) => {
    const data = { ...values, type: mode };
    addTx.mutate(
      { id: supplierId, data },
      {
        onSuccess: () => {
          toast({ title: data.type === "payment" ? "Payment recorded" : "Udhaar added" });
          queryClient.invalidateQueries({ queryKey: getGetSupplierQueryKey(supplierId) });
          queryClient.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["reports"] });
          form.reset({ type: data.type, amount: 0, description: "" });
          onClose();
        },
      }
    );
  };

  return (
    <div className="rounded-xl border p-6 mb-6 bg-[var(--supplier-form-panel-bg)] shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <p className="font-semibold text-lg">
          {mode === "payment" ? "Payment Entry" : "Udhaar Entry"}
        </p>
        <button onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-8">
                <FormLabel>{mode === "payment" ? "Note" : "Item / Reason"}</FormLabel>
                <FormControl>
                  <Input {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="md:col-span-12 h-11" disabled={addTx.isPending}>
            {addTx.isPending ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
