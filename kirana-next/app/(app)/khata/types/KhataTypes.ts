// KhataTypes.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single import point for ALL types used in the Khata module.
//
// Rules:
//   - API types (Customer, CustomerDetail, AppSettings) are re-exported from
//     the central @/lib/api/types so that UI components only ever import from
//     THIS file — not from scattered lib paths.
//   - Module-specific Zod schemas and derived types are defined here.
// ─────────────────────────────────────────────────────────────────────────────

import * as z from "zod";
import { type BillItem } from "@/lib/api";

// ─── Re-exported API Types (Single Import Point) ───────────────────────────────
// Components import these from KhataTypes, NOT directly from @/lib/api/types.
// When the API shape changes, only this re-export reference needs updating.

export type { Customer, CustomerDetail, AppSettings } from "@/lib/api/types";

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

export const KhataCustomerSchema = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(10, "Phone required"),
  address: z.string().optional(),
});

export const KhataTransactionSchema = z.object({
  type: z.enum(["credit", "payment"] as const),
  amount: z.coerce.number().min(0.01, "Amount must be > 0"),
  description: z.string().min(1, "Description required"),
});

// ─── Inferred Types ────────────────────────────────────────────────────────────

export type KhataCustomerFormValues = z.infer<typeof KhataCustomerSchema>;
export type KhataTransactionFormValues = z.infer<typeof KhataTransactionSchema>;

// ─── Ledger Row (transaction + running balance) ────────────────────────────────

export type KhataLedgerRow = {
  id: number;
  type: "credit" | "payment";
  amount: number;
  description: string;
  createdAt: string;
  balance: number;
  items?: BillItem[];
};
