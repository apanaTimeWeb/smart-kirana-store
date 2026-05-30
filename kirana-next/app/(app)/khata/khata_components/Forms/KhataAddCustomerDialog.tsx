"use client";

// KhataAddCustomerDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Responsibility: Renders the Dialog form for adding a new customer.
// Manages form state with react-hook-form + Zod validation, fires the
// createCustomer mutation, and invalidates the customer list cache on success.
//
// To change the "Add Customer" form fields, validations, or submission logic,
// touch ONLY this file.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCustomer, getListCustomersQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useKhata } from "@/app/(app)/khata/khata_context/KhataContext";
import { KhataConstants } from "@/app/(app)/khata/khata_constants/KhataConstants";
import { KhataCustomerSchema, type KhataCustomerFormValues } from "@/app/(app)/khata/khata_types/KhataTypes";

export function KhataAddCustomerDialog() {
  const { isAddCustomerOpen, setIsAddCustomerOpen } = useKhata();
  const createCustomer = useCreateCustomer();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<KhataCustomerFormValues>({
    resolver: zodResolver(KhataCustomerSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  const onSubmit = (values: KhataCustomerFormValues) => {
    createCustomer.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: KhataConstants.MESSAGES.CUSTOMER_ADDED });
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          setIsAddCustomerOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{KhataConstants.LABELS.ADD_CUSTOMER_DIALOG_TITLE}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{KhataConstants.LABELS.FIELD_NAME}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[var(--khata-background)]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{KhataConstants.LABELS.FIELD_PHONE}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[var(--khata-background)]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{KhataConstants.LABELS.FIELD_ADDRESS}</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[var(--khata-background)]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={createCustomer.isPending}>
              {createCustomer.isPending ? KhataConstants.LABELS.SAVING : KhataConstants.LABELS.ADD_CUSTOMER}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
