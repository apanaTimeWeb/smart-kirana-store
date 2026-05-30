"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  useAddKhataTransaction,
  getGetCustomerQueryKey,
  getListCustomersQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useKhata } from "./KhataContext";
import { KhataConstants } from "./KhataConstants";
import { KhataTransactionSchema, type KhataTransactionFormValues } from "./KhataTypes";

interface KhataTransactionFormProps {
  customerId: number;
}

export function KhataTransactionForm({ customerId }: KhataTransactionFormProps) {
  const { transactionMode, setTransactionMode } = useKhata();
  const addTx = useAddKhataTransaction();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<KhataTransactionFormValues>({
    resolver: zodResolver(KhataTransactionSchema),
    defaultValues: { type: transactionMode || "payment", amount: 0, description: "" },
  });

  useEffect(() => {
    if (transactionMode) {
      form.setValue("type", transactionMode);
    }
  }, [transactionMode, form]);

  const onSubmit = (values: KhataTransactionFormValues) => {
    if (!transactionMode) return;
    const data = { ...values, type: transactionMode };
    addTx.mutate(
      { id: customerId, data },
      {
        onSuccess: () => {
          toast({
            title:
              data.type === "payment"
                ? KhataConstants.MESSAGES.PAYMENT_SUCCESS
                : KhataConstants.MESSAGES.CREDIT_SUCCESS,
          });
          queryClient.invalidateQueries({ queryKey: getGetCustomerQueryKey(customerId) });
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["reports"] });
          form.reset({ type: data.type, amount: 0, description: "" });
          setTransactionMode(null);
        },
      }
    );
  };

  if (!transactionMode) return null;

  return (
    <div className="rounded-xl border border-[var(--khata-border)] p-6 mb-6 bg-[var(--khata-form-panel-bg)] shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <p className="font-semibold text-lg text-[var(--khata-foreground)]">
          {transactionMode === "payment"
            ? KhataConstants.LABELS.PAYMENT_ENTRY
            : KhataConstants.LABELS.UDHAAR_ENTRY}
        </p>
        <button onClick={() => setTransactionMode(null)}>
          <X className="h-5 w-5 text-[var(--khata-muted-text)]" />
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormLabel>{KhataConstants.LABELS.AMOUNT_INR}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11 bg-[var(--khata-background)]" />
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
                <FormLabel>
                  {transactionMode === "payment" ? KhataConstants.LABELS.NOTE : KhataConstants.LABELS.ITEM_REASON}
                </FormLabel>
                <FormControl>
                  <Input {...field} className="h-11 bg-[var(--khata-background)]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="md:col-span-12 h-11" disabled={addTx.isPending}>
            {addTx.isPending ? KhataConstants.LABELS.SAVING : KhataConstants.LABELS.SAVE_ENTRY}
          </Button>
        </form>
      </Form>
    </div>
  );
}
