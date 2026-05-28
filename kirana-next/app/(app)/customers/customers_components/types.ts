import * as z from "zod";

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

export const customerSchema = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(10, "Phone required"),
  address: z.string().optional(),
});

export const txSchema = z.object({
  type: z.enum(["credit", "payment"] as const),
  amount: z.coerce.number().min(0.01, "Amount must be > 0"),
  description: z.string().min(1, "Description required"),
});

// ─── Inferred Types ────────────────────────────────────────────────────────────

export type CustomerFormValues = z.infer<typeof customerSchema>;
export type TxFormValues = z.infer<typeof txSchema>;

// ─── Ledger Row (transaction + running balance) ────────────────────────────────

export type LedgerRow = {
  id: number;
  type: "credit" | "payment";
  amount: number;
  description: string;
  createdAt: string;
  balance: number;
};
