"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { type CartItem as CartItemType } from "./types";
import { lineLabel } from "./utils";

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQty: (lineId: string, delta: number) => void;
  onRemove: (lineId: string) => void;
}

export function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.displayName}</p>
        <p className="text-xs text-muted-foreground">
          {lineLabel(item)} / Rs {item.unitPrice.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted"
          onClick={() => onUpdateQty(item.lineId, -1)}
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted"
          onClick={() => onUpdateQty(item.lineId, 1)}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <p className="w-16 text-right text-sm font-bold">Rs {item.totalPrice.toFixed(0)}</p>

      <button
        className="text-muted-foreground hover:text-[var(--billing-cart-item-remove-hover)]"
        onClick={() => onRemove(item.lineId)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
