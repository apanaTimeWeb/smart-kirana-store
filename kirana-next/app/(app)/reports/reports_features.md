# Smart Kirana Store — Reports Module Documentation

> **AI Context Document** — This file is the authoritative map for the Reports module.
> Before making any change to the Reports feature, read this file first.
> It tells you exactly which file to touch and why.

---

## 📁 Directory Structure (Feature-Based Micro-Modularization)

```
app/(app)/reports/
├── page.tsx                                       ← Root Server Component
├── loading.tsx                                    ← Next.js skeleton loading UI (Server Component)
├── error.tsx                                      ← Next.js error boundary (Client Component, "use client")
├── reports.css                                    ← ALL color tokens for this module (single source for theming)
├── reports_features.md                            ← THIS FILE — AI context & architecture map
│
├── reports_constants/
│   └── ReportsSharedConstants.ts                  ← ALL strings, labels, pagination config, formatMoney util
│
├── reports_context/
│   └── ReportsContext.tsx                         ← Module state: dateRange + calOpen (memoized context provider)
│
├── reports_types/
│   └── ReportsTypes.ts                            ← All TypeScript interfaces for this module
│
└── reports_components/
    │
    ├── Dashboard/                                 ← Core overview components and charts
    │   ├── ReportsDashboardContainer.tsx          ← Fetches all 4 APIs, derives summary values, composes layout
    │   ├── ReportsHeader.tsx                      ← Static title + subtitle row
    │   ├── ReportsDatePicker.tsx                  ← Date range popover with calendar + quick-date preset buttons
    │   ├── ReportsStatGrid.tsx                    ← Builds 4 card definitions, maps to ReportsStatCard
    │   ├── ReportsStatCard.tsx                    ← One metric card: label, value, icon, themed colors
    │   ├── ReportsSalesChart.tsx                  ← Bar chart (recharts): daily sales trend
    │   └── ReportsProfitChart.tsx                 ← Area chart (recharts): profit trend with gradient fill
    │
    ├── Khata/                                     ← Pending Khata feature
    │   ├── ReportsKhataContainer.tsx              ← Smart container: search state + pagination + composition
    │   ├── ReportsKhataSearchInput.tsx            ← Search input field for the Pending Udhaar list
    │   ├── ReportsKhataSkeletonList.tsx           ← 3 skeleton rows shown while khata API is loading
    │   ├── ReportsKhataEmptyState.tsx             ← "Koi udhaar nahi" icon + message (zero results)
    │   └── ReportsKhataItem.tsx                   ← One customer row: name, phone, total due amount
    │
    ├── Stock/                                     ← Low Stock feature
    │   ├── ReportsStockContainer.tsx              ← Smart container: search state + pagination + composition
    │   ├── ReportsStockSearchInput.tsx            ← Search input field for the Low Stock list
    │   ├── ReportsStockSkeletonList.tsx           ← 3 skeleton rows shown while stock API is loading
    │   ├── ReportsStockEmptyState.tsx             ← "Sab stock sahi" icon + message (zero results)
    │   └── ReportsStockItem.tsx                   ← One product row: name, category, stock badge
    │
    └── Shared/                                    ← Shared UI components across features
        └── ReportsPagination.tsx                  ← Prev/Next pagination bar shared by both list containers
```

---

## 🧠 State Management: `reports_context/ReportsContext.tsx`

**Only two cross-component state values live here** — date range and calendar open/close.
Everything else (search queries, pagination page numbers) is local state inside the container components.

### What lives in Context:

| State | Type | Purpose |
|---|---|---|
| `dateRange` | `DateRange` | The selected from/to date range — drives all 4 API queries |
| `calOpen` | `boolean` | Controls the date picker popover open/close state |

*Note: The context provider uses `useMemo` to prevent massive re-render chains across the sub-folders.*

### What does NOT live in Context:

- API data (`salesReport`, `profitReport`, `khataReport`, `lowStockProducts`) — fetched by TanStack Query in `ReportsDashboardContainer`
- Search query for khata/stock — local `useState` inside each Container
- Pagination page number — local `useState` inside each Container
- Money formatter — pure function exported from `ReportsSharedConstants.UTILS`, not state at all

---

## 📦 Centralized Data: `reports_constants/ReportsSharedConstants.ts`

**Single source of truth for ALL data in this module.** When the backend replaces hardcoded values with API calls, only these files change — zero UI component edits required.

### `ReportsSharedConstants.ts` — All hardcoded data and utilities

| Key Path | Purpose |
|---|---|
| `TEXTS.TITLE` | "Reports" — page heading |
| `TEXTS.SUBTITLE` | Subtitle description line |
| `TEXTS.SELECT_DATE_RANGE` | Placeholder text for the date picker trigger button |
| `TEXTS.DATE_RANGE / DATE_RANGE_DESC / DONE` | Date popover header labels and Done button |
| `TEXTS.NO_SALES / NO_PROFIT` | Empty state messages for charts |
| `TEXTS.PENDING_UDHAAR` | Khata section card title |
| `TEXTS.SEARCH_CUSTOMER` | Placeholder for khata search input |
| `TEXTS.NO_UDHAAR` | Empty state for khata section |
| `TEXTS.LOW_STOCK_ALERT` | Stock section card title |
| `TEXTS.SEARCH_PRODUCT` | Placeholder for stock search input |
| `TEXTS.OUT_OF_STOCK / LEFT / ALL_STOCK_GOOD` | Stock item badge labels |
| `TEXTS.PAGE / OF` | Pagination display strings |
| `QUICK_DATES` | Array of `{ label, days }` preset buttons (Aaj, 7 din, 15 din, 30 din) |
| `LABELS.*` | Stat card labels (Total Revenue, Total Profit, Pending Khata, Low Stock, etc.) |
| `PAGINATION.ITEMS_PER_PAGE` | Items per page for both Khata and Stock lists (currently `5`) |
| `UTILS.formatMoney` | Pure function: `(value: number) => "Rs 1234"` — used by all money displays |

### `reports_types/ReportsTypes.ts` — TypeScript interfaces

| Interface | Purpose |
|---|---|
| `ReportsProduct` | Shape of a low-stock product from the API |
| `ReportsKhataCustomer` | Shape of a pending khata customer from the API |
| `ReportsSalesData` | One day's sales data point `{ date, sales }` |
| `ReportsProfitData` | One day's profit data point `{ date, profit }` |
| `ReportsStatCardDefinition` | Shape of each stat card config in `ReportsStatGrid` |
| `ReportsQuickDate` | One entry in the `QUICK_DATES` preset array `{ label, days }` |

---

## 🎨 Theming: `reports.css`

All colors are defined as CSS variables here. To port this module to another project, change **only this file**. Zero JSX edits needed.

### Full CSS Variable Reference

| Variable | Purpose |
|---|---|
| `--reports-card-bg` | Card/panel backgrounds |
| `--reports-background` | Page and input field backgrounds |
| `--reports-border` | All border colors |
| `--reports-muted-bg` | Muted area backgrounds (chart cursor) |
| `--reports-muted-hover-bg` | Row hover state background |
| `--reports-muted-text` | Secondary/placeholder text color |
| `--reports-foreground` | Primary text color |
| `--reports-primary` | Brand primary color (used for sales bar fill) |
| `--reports-destructive` | Error/danger color (used for stock alert title) |
| `--reports-destructive-bg / border` | Light background/border for destructive elements |
| `--reports-sale-color / bg / border` | Revenue stat card theme colors |
| `--reports-profit-color / bg / border` | Profit stat card theme colors |
| `--reports-khata-color / bg / border` | Khata stat card theme colors |
| `--reports-lowstock-color / bg / border` | Low stock stat card theme colors |
| `--reports-timebar-*` | Date picker trigger bar theme (bg, border, icon, label, input, ring) |
| `--reports-profit-chart-stroke / grad` | Profit area chart line and gradient colors |
| `--reports-badge-out-bg / text / border` | "Out of Stock" badge colors |
| `--reports-badge-low-bg / text / border` | "Low Stock" badge colors |

All variables have both `:root` (light) and `.dark` overrides defined.

---

## 🔄 Data Flow

### Date Range → API Calls

```
User interacts with ReportsDatePicker
  → setDateRange(range)  [via useReports() from ReportsContext]
    → ReportsDashboardContainer reads dateRange from context
      → Derives `from` / `to` strings for query params
        → useGetSalesReport({ from, to })   → ReportsSalesChart
        → useGetProfitReport({ from, to })  → ReportsProfitChart
        → useGetPendingKhataReport()        → ReportsKhataContainer
        → useGetLowStockReport()            → ReportsStockContainer
```

### Khata Search + Pagination Flow

```
User types in ReportsKhataSearchInput
  → onChange fires → setSearchQuery in ReportsKhataContainer
    → filteredCustomers recomputed
      → setCurrentPage(1) resets to page 1
        → currentCustomers slice computed
          → ReportsKhataItem rendered for each visible customer
```

### Stock Search + Pagination Flow

```
(Identical pattern to Khata, but inside ReportsStockContainer)
User types in ReportsStockSearchInput
  → onChange fires → setSearchQuery in ReportsStockContainer
    → filteredProducts recomputed → currentProducts slice
      → ReportsStockItem rendered for each visible product
```

---

## 🚀 Future Enhancements

| Feature | Where to Touch | Notes |
|---|---|---|
| **Export Reports as PDF** | New `ReportsPdfExport.ts` | Pure function; zero UI changes. Add button in `ReportsHeader.tsx` |
| **CSV Export** | New `ReportsCsvExport.ts` | Same pattern as PDF |
| **Change items per page** | `ReportsSharedConstants.PAGINATION.ITEMS_PER_PAGE` | One number to change; affects both Khata and Stock lists |
| **Backend API for currency format** | `ReportsSharedConstants.UTILS.formatMoney` | One function to swap; zero UI edits |
| **Add expense tracking to profit** | `ReportsDashboardContainer.tsx` | New API hook + pass to `ReportsProfitChart` |
| **Sales breakdown by category** | New `ReportsSalesByCategoryChart.tsx` | Add to dashboard grid; zero other file changes |
| **Multi-language support** | `ReportsSharedConstants.TEXTS` | All strings centralized; swap to i18n object tomorrow |
| **User-configurable date default** | `ReportsContext.tsx` | Change the `subDays(today, 14)` default; one place only |
| **Khata customer click → navigate** | `ReportsKhataItem.tsx` | Add `onClick` + `useRouter`; touch only this file |

---

## 📌 Quick Handover Summary

- **Brain**: `reports_context/ReportsContext.tsx` — only `dateRange` and `calOpen`. Proper `useMemo` implemented.
- **Data**: `reports_types/ReportsTypes.ts` (interfaces) + `reports_constants/ReportsSharedConstants.ts` (strings, pagination, formatMoney). One place to swap in API data tomorrow.
- **Theming**: `reports.css` — all CSS variables with light + dark mode. Copy this folder to any project and theme from here only.
- **API layer**: `ReportsDashboardContainer` is the only file that calls APIs. All data flows down via props.
- **Charts**: `recharts` library. When modifying charts, refer to recharts docs for `XAxis`, `YAxis`, `Tooltip` props.
- **Lists**: Both Khata and Stock sections follow identical patterns — Container (owns state) → SearchInput + SkeletonList + EmptyState + Item.
- **Architecture**: 21 component files, structured into distinct feature sub-folders. To fix any bug, identify the exact feature folder and provide only the necessary micro-file to an AI.
