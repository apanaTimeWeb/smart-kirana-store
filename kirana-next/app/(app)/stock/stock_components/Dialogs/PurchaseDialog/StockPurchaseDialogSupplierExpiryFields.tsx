"use client";

// StockPurchaseDialogSupplierExpiryFields.tsx
// Renders the 2-column Supplier (Khata) dropdown + Expiry Date input row
// inside the Purchase Entry dialog.

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useListSuppliers } from "@/lib/api";

interface StockPurchaseDialogSupplierExpiryFieldsProps {
  supplierId: string;
  expiryDate: string;
  onSupplierChange: (id: string) => void;
  onExpiryDateChange: (date: string) => void;
}

export function StockPurchaseDialogSupplierExpiryFields({
  supplierId,
  expiryDate,
  onSupplierChange,
  onExpiryDateChange,
}: StockPurchaseDialogSupplierExpiryFieldsProps) {
  const { data: suppliers = [] } = useListSuppliers();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Supplier Selector */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Supplier (Khata)</label>
        <Select value={supplierId} onValueChange={onSupplierChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Supplier (Cash)</SelectItem>
            {suppliers.map((sup) => (
              <SelectItem key={sup.id} value={sup.id.toString()}>
                {sup.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expiry Date */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Expiry Date (Batch)</label>
        <Input
          type="date"
          value={expiryDate}
          onChange={(e) => onExpiryDateChange(e.target.value)}
          placeholder="optional"
        />
      </div>
    </div>
  );
}
