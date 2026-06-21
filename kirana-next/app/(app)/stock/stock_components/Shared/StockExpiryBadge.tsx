"use client";

// StockExpiryBadge.tsx
// Color-coded expiry badge for stock list rows and mobile cards.
// Shows: ⛔ Expired | 🔴 <3 days | 🟡 <7 days | 🟢 ≥7 days | nothing if no expiry

import React from "react";
import { Product } from "@/lib/api";

type ExpiryStatus = "expired" | "critical" | "warning" | "ok";

function getExpiryStatus(expiryDate: string): { status: ExpiryStatus; daysLeft: number } {
  const now = Date.now();
  const exp = new Date(expiryDate).getTime();
  const daysLeft = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { status: "expired", daysLeft };
  if (daysLeft < 3) return { status: "critical", daysLeft };
  if (daysLeft < 7) return { status: "warning", daysLeft };
  return { status: "ok", daysLeft };
}

const STATUS_CONFIG: Record<
  ExpiryStatus,
  { bg: string; text: string; border: string; label: (d: number) => string; emoji: string }
> = {
  expired: {
    bg: "hsl(0 76% 96%)",
    text: "hsl(0 72% 38%)",
    border: "hsl(0 76% 82%)",
    label: () => "Expired",
    emoji: "⛔",
  },
  critical: {
    bg: "hsl(0 76% 96%)",
    text: "hsl(0 72% 38%)",
    border: "hsl(0 76% 82%)",
    label: (d) => `${d}d left`,
    emoji: "🔴",
  },
  warning: {
    bg: "hsl(38 90% 95%)",
    text: "hsl(38 90% 30%)",
    border: "hsl(38 90% 76%)",
    label: (d) => `${d}d left`,
    emoji: "🟡",
  },
  ok: {
    bg: "hsl(142 60% 96%)",
    text: "hsl(142 60% 28%)",
    border: "hsl(142 60% 74%)",
    label: (d) => `${d}d`,
    emoji: "🟢",
  },
};

export function StockExpiryBadge({ product }: { product: Product }) {
  if (!product.expiryDate) return null;

  const { status, daysLeft } = getExpiryStatus(product.expiryDate);
  const cfg = STATUS_CONFIG[status];

  // Only show badge if expiring within 15 days or already expired
  if (status === "ok" && daysLeft > 15) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        borderColor: cfg.border,
      }}
    >
      <span>{cfg.emoji}</span>
      <span>{cfg.label(daysLeft)}</span>
    </span>
  );
}
