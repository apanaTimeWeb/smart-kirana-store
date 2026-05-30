"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getListSuppliersQueryKey } from "@/lib/api";
import { useSuppliers } from "../../suppliers_context/SuppliersContext";
import { supplierSchema, type SupplierFormValues } from "../../suppliers_types/SuppliersTypes";

export function SuppliersAddDialog() {
  const { isAddOpen, setIsAddOpen, createSupplierMutation } = useSuppliers();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  const onSubmit = (values: SupplierFormValues) => {
    createSupplierMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Supplier add hua" });
          queryClient.invalidateQueries({ queryKey: getListSuppliersQueryKey() });
          setIsAddOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Naya Supplier Add Karein</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[var(--supplier-primary-bg)] text-[var(--supplier-primary-text)]" disabled={createSupplierMutation.isPending}>
              {createSupplierMutation.isPending ? "Saving..." : "Add Supplier"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
