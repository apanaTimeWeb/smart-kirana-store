"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X, Check, ChevronsUpDown } from "lucide-react";
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
  const [open, setOpen] = useState(false);
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "flex-1 justify-between text-left font-normal px-3",
                !value && "text-muted-foreground",
                required && !value && "border-[var(--billing-picker-required-border)] bg-[var(--billing-picker-required-bg)] text-foreground"
              )}
            >
              <span className="truncate">
                {value
                  ? customers.find((c) => c.id.toString() === value)?.name || "Unknown Customer"
                  : required ? "Customer select karein" : "Customer optional"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 max-w-full" align="start">
            <Command>
              <CommandInput placeholder="Search customer (name/phone)..." />
              <CommandList>
                <CommandEmpty>No customer found.</CommandEmpty>
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={`${customer.name} ${customer.phone || ""}`}
                      onSelect={() => {
                        onChange(customer.id.toString());
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === customer.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {customer.name}{" "}
                      {customer.totalDue > 0 ? <span className="ml-1 text-destructive">(Due Rs {customer.totalDue.toFixed(0)})</span> : ""}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
