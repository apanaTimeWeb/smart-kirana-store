"use client";

// StockPurchaseDialogProductSelector.tsx
// Renders the "Product variant" labeled dropdown inside the Purchase Entry dialog.
// Uses a searchable Combobox (Popover + Command) for easier product selection.

import React, { useState } from "react";
import { useStock } from "../../../stock_context/StockContext";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StockPurchaseDialogProductSelectorProps {
  variantId: string;
  onVariantChange: (id: string) => void;
}

export function StockPurchaseDialogProductSelector({
  variantId,
  onVariantChange,
}: StockPurchaseDialogProductSelectorProps) {
  const { allProducts } = useStock();
  const [open, setOpen] = useState(false);

  const selectedProduct = allProducts.find((p) => p.id.toString() === variantId);

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Product variant</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedProduct
              ? `${selectedProduct.productName} - ${selectedProduct.variantName}`
              : "Select Product..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] max-w-[90vw] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search product..." />
            <CommandList>
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandGroup>
                {allProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.productName} ${product.variantName}`}
                    onSelect={() => {
                      onVariantChange(product.id.toString());
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        variantId === product.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{product.productName} - {product.variantName}</span>
                      <span className="text-xs text-muted-foreground">
                        Stock: {product.currentStock} {product.unitType} | Rate: ₹{product.sellingPrice}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
