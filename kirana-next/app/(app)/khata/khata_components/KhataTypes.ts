import * as z from "zod";
import { type BillItem } from "@/lib/api";

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
