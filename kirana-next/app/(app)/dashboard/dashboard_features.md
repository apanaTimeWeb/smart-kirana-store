# Smart Kirana Store — Dashboard Module Documentation

> **AI Context Document** — This file is the authoritative map for this module. Before making any change to the dashboard feature, read this file first. It tells you exactly which file to touch and why.

---

## 📁 Directory Structure

```text
app/(app)/dashboard/
├── page.tsx                             ← Shell only: CSS import + DashboardProvider + DashboardPageContent
├── loading.tsx                          ← Next.js skeleton loading UI (Server Component)
├── error.tsx                            ← Next.js error boundary (Client Component)
├── dashboard.css                        ← ALL color tokens for this module (single source of truth for theming)
├── dashboard_features.md                ← THIS FILE — AI context & architecture map
│
├── context/
│   └── DashboardContext.tsx             ← Data layer: fetches summary, exposes via memoized Context
├── types/
│   └── DashboardTypes.ts                ← TypeScript types for the dashboard
├── constants/
│   └── DashboardSharedConstants.ts      ← Central data: statically defined UI arrays and hardcoded configurations
│
└── components/
    ├── Layout/
    │   └── DashboardPageContent.tsx     ← Full dashboard UI: Maps config array to stat cards and places lists
    ├── StatCards/
    │   └── DashboardStatCard.tsx        ← Reusable metric card (Sale, Profit, Khata, Low Stock, Expiry)
    ├── Lists/
    │   ├── DashboardRecentBillsList.tsx ← Card: recent bills list with search + pagination
    │   ├── DashboardLowStockList.tsx    ← Card: low-stock products list with search + pagination
    │   └── DashboardExpiringSoonList.tsx← Card: expiring-soon products list with search + pagination
    └── Shared/
        ├── DashboardSearchFilter.tsx    ← Reusable search input with magnifier icon
        └── DashboardPagination.tsx      ← Reusable prev/next pagination controls
```

---

## 🧠 State Management: `DashboardContext.tsx`

A minimal Context that calls `useGetDashboardSummary()` (React Query) and exposes the result to all child components. **No prop drilling** — any component calls `useDashboardContext()` directly. The Context value is wrapped in `useMemo` to prevent large re-render chains across the dashboard sub-folders.

| Value | Type | Purpose |
|---|---|---|
| `summary` | `DashboardSummaryData \| undefined` | All dashboard data (stats + lists) |
| `isLoading` | `boolean` | True while data is fetching |
| `error` | `any` | Error from React Query (used by Next.js error.tsx) |

---

## 📦 Centralized Data: `DashboardSharedConstants.ts` & `DashboardTypes.ts`

**Single source of truth for all types and hardcoded data.** Tomorrow when backend replaces these, only this file changes.

| Export | Type | Purpose |
|---|---|---|
| **`DashboardTypes.ts`** | | |
| `DashboardStatSummary` | type | Numeric KPIs (sale, profit, khata, stock counts) |
| `LowStockProduct` | type | Shape of a low-stock product item |
| `ExpiringProduct` | type | Shape of an expiring product item |
| `RecentBill` | type | Shape of a recent bill row |
| `DashboardSummaryData` | type | Union of all above — the full API response shape |
| **`DashboardSharedConstants.ts`** | | |
| `DASHBOARD_CONSTANTS` | `const` | `{ ITEMS_PER_PAGE: 5 }` — pagination config |
| `PAYMENT_MODE_LABELS` | `Record<string, string>` | `{ cash: "Cash", upi: "UPI", khata: "Khata" }` — badge labels |
| `DASHBOARD_STAT_CARDS_CONFIG` | `const array` | Hardcoded configuration for stat cards, extracting UI logic from components |

---

## 🎨 Theming: `dashboard.css`

All colors are CSS variables here. To port to another project, only change this file.

### Full CSS Variable Reference

| Variable | Purpose | Light Value |
|---|---|---|
| `--dashboard-sale-value` | Today's Sale card — value text | `hsl(var(--primary))` |
| `--dashboard-sale-bg` | Today's Sale card — background | `hsl(174 25% 95%)` |
| `--dashboard-sale-border` | Today's Sale card — border | `hsl(174 25% 85%)` |
| `--dashboard-sale-icon` | Today's Sale card — icon | `hsl(var(--primary))` |
| `--dashboard-profit-value` | Today's Profit card — value | `hsl(142 60% 28%)` |
| `--dashboard-profit-bg` | Today's Profit card — bg | `hsl(142 60% 97%)` |
| `--dashboard-profit-border` | Today's Profit card — border | `hsl(142 60% 85%)` |
| `--dashboard-profit-icon` | Today's Profit card — icon | `hsl(142 60% 28%)` |
| `--dashboard-khata-value` | Pending Khata card — value | `hsl(38 90% 42%)` |
| `--dashboard-khata-bg` | Pending Khata card — bg | `hsl(38 90% 95%)` |
| `--dashboard-khata-border` | Pending Khata card — border | `hsl(38 90% 85%)` |
| `--dashboard-khata-icon` | Pending Khata card — icon | `hsl(38 90% 42%)` |
| `--dashboard-lowstock-value` | Low Stock card — value | `hsl(var(--destructive))` |
| `--dashboard-lowstock-bg` | Low Stock card — bg | `hsl(0 84% 97%)` |
| `--dashboard-lowstock-border` | Low Stock card — border | `hsl(0 84% 88%)` |
| `--dashboard-lowstock-icon` | Low Stock card — icon | `hsl(var(--destructive))` |
| `--dashboard-expiry-value` | Expiring Soon card — value | `hsl(32 95% 44%)` |
| `--dashboard-expiry-bg` | Expiring Soon card — bg | `hsl(32 100% 96%)` |
| `--dashboard-expiry-border` | Expiring Soon card — border | `hsl(32 95% 85%)` |
| `--dashboard-expiry-icon` | Expiring Soon card — icon | `hsl(32 95% 44%)` |
| `--dashboard-badge-khata-*` | Recent Bills — Khata badge (text/border/bg) | amber tones |
| `--dashboard-badge-upi-*` | Recent Bills — UPI badge (text/border/bg) | teal tones |
| `--dashboard-badge-cash-*` | Recent Bills — Cash badge (text/border/bg) | green tones |
| `--dashboard-primary-icon` | Generic icon color (ShoppingBag in bills list) | `hsl(var(--primary))` |
| `--dashboard-destructive-text` | Low Stock list — card title color | `hsl(var(--destructive))` |
| `--dashboard-destructive-icon` | Generic destructive icon | `hsl(var(--destructive))` |
| `--dashboard-muted-text` | All secondary/helper text (replaces `text-muted-foreground`) | `hsl(var(--muted-foreground))` |
| `--dashboard-row-hover-bg` | Row hover bg in all 3 lists (replaces `hover:bg-muted/30`) | `hsl(var(--muted) / 0.35)` |
| `--dashboard-card-header-bg` | Expiring Soon CardHeader bg (replaces `bg-muted/20`) | `hsl(var(--muted) / 0.20)` |
| `--dashboard-error-icon-bg` | Error boundary icon circle background | `hsl(var(--destructive) / 0.10)` |
| `--dashboard-error-icon-text` | Error boundary AlertTriangle icon color | `hsl(var(--destructive))` |

---

## ⚠️ Known Gotchas (Fixed)

> Documented to prevent regression.

1. **`DashboardStatCard.tsx` was missing `"use client"`.**
   This component accepts an `onClick` prop (an event listener) which requires a Client Component. **Fixed: `"use client"` added.**

2. **`page.tsx` had TWO components defined (`Dashboard` + `DashboardContent`).**
   This violated the "One File, One Component" rule. `DashboardContent` has been extracted to `DashboardPageContent.tsx`. `page.tsx` is now a clean provider shell. **Fixed.**

3. **Widespread hardcoded Tailwind semantic tokens (`text-muted-foreground`, `hover:bg-muted/30`, `bg-muted/20`, `bg-destructive/10`, `text-destructive`) across 7 files.**
   All replaced with `--dashboard-*` CSS variables defined in `dashboard.css`. **Fixed.**

---

## 🚀 Future Enhancements

| Feature | Where to touch | Notes |
|---|---|---|
| **Backend API swap** | `DashboardTypes.ts` + `DashboardContext.tsx` | Replace `useGetDashboardSummary` with a custom hook; type changes only in `DashboardTypes.ts` |
| **Date range filter** | `DashboardContext.tsx` + `DashboardPageContent.tsx` | Add date state to context; pass to API query |
| **Interactive charts** | New file: `DashboardSalesChart.tsx` | Use Recharts; read from context; add to grid in `DashboardPageContent.tsx` |
| **WebSocket / real-time** | `DashboardContext.tsx` | Add WebSocket listener that calls `queryClient.invalidateQueries(...)` on new bill event |
| **Actionable row buttons** | `DashboardRecentBillsList.tsx`, `DashboardLowStockList.tsx` | Add "View" / "Reorder" buttons inside each row |

---

## 📌 Quick Handover Summary

- **Entry**: `page.tsx` — provider shell only (~20 lines).
- **UI**: `DashboardPageContent.tsx` — all layout, heading, stat cards, lists grid.
- **Data**: `DashboardContext.tsx` — single fetch, shared via context with `useMemo`. Zero prop drilling.
- **Types/Constants**: `DashboardTypes.ts` & `DashboardSharedConstants.ts` — change here only when API integrates.
- **Theming**: `dashboard.css` — all color variables. Copy folder to any project, retheme from here.
- **Reusable micro-components**: `DashboardStatCard`, `DashboardSearchFilter`, `DashboardPagination` — organized in feature-based sub-folders.
