"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { type Customer, useCreateCustomer } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { getListCustomersQueryKey } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CustomerPickerProps {
  customers: Customer[];
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
}

export function CustomerPicker({ customers, value, onChange, required }: CustomerPickerProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const createCustomer = useCreateCustomer();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addCustomer = () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Customer naam aur phone zaroori hai", variant: "destructive" });
      return;
    }
    createCustomer.mutate(
      { data: { name: name.trim(), phone: phone.trim() } },
      {
        onSuccess: (customer) => {
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          onChange(customer.id.toString());
          setName("");
          setPhone("");
          setAddOpen(false);
        },
      }
    );
  };

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              "flex-1",
              required && !value && "border-[var(--billing-picker-required-border)] bg-[var(--billing-picker-required-bg)]"
            )}
          >
            <SelectValue placeholder={required ? "Customer select karein" : "Customer optional"} />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.name}{" "}
                {customer.totalDue > 0 ? `(Due Rs ${customer.totalDue.toFixed(0)})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setAddOpen((open) => !open)}
        >
          {addOpen ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        </Button>
      </div>

      {addOpen && (
        <div className="grid gap-2 rounded-lg border bg-card p-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
          <Button
            type="button"
            size="sm"
            onClick={addCustomer}
            disabled={createCustomer.isPending}
          >
            {createCustomer.isPending ? "Saving..." : "Customer Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
