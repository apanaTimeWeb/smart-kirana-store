# Smart Kirana Store — Stock Module Documentation

> **AI Context Map** — This document is the **first file** an AI should read before touching any file in `app/(app)/stock`. It precisely describes what every file does and where every piece of state lives.

## 📁 Module Location

`app/(app)/stock/`

---

## 🏗 Architecture Overview

This module follows a strict **"One File, One Component"** rule for extreme AI-isolation. It is designed so that tomorrow if an AI needs to fix a bug in the creator dialog's price fields, you hand it **exactly one file** (`Dialogs/ProductCreator/StockProductCreator.tsx`) and the risk of hallucination breaking other components is zero.

The directory is micro-modularized into feature-based subfolders.

### State Architecture (stock_context Folder)

```text
┌─────────────────────────────────────────────────────────────┐
│  stock_context/StockContext.tsx          (Module-level state) │
│  • Product list (API)      • Search / Filter                 │
│  • Pagination              • Modal open/close toggles        │
│  • CRUD mutations          • Stats                           │
├─────────────────────────────────────────────────────────────┤
│  stock_context/StockProductCreatorContext.tsx (Dialog-local)  │
│  • 9 form fields (name, unitType, bulkConversionRate,        │
│    buyPrice, sellPrice, initialStock, expiryDate,            │
│    barcode, location, lowStockAlert)                         │
│  • Derived: actualBaseQuantity, stockInBase, lowStockInBase  │
│  • Validation errors array + isValid boolean                 │
│  • handleUnitChange, handleSubmit, reset, handleOpenChange   │
├─────────────────────────────────────────────────────────────┤
│  stock_context/StockEditVariantDialogContext.tsx (Dialog-local)│
│  • Draft (VariantDraft)     • patchDraft handler             │
│  • Unit change auto-wire    • isLoss / margin / errors       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Complete File Map

### 🟦 Route Files (Next.js)

| File | Type | Purpose |
|---|---|---|
| `page.tsx` | Server Component | Entry point. Wraps `StockProvider` → `StockMainLayout`. |
| `loading.tsx` | Server Component | Skeleton loading state for the stock route. |
| `error.tsx` | Server Component | Error boundary for the stock route. |
| `stock.css` | CSS | **All** CSS variables for the stock module. The single source of theme truth. Copy this file to another project and re-theme the entire module. |

---

### 🟨 Constants, Types & Utilities

These have been extracted to their own module-prefixed folders at the root:

| File | Location | Purpose |
|---|---|---|
| `StockSharedConstants.ts` | `stock_constants/` | All static data: `UNITS`, `BASE_UNITS`, `MODE_LABEL` etc. **Tomorrow's backend replaces these constants.** |
| `StockTypes.ts` | `stock_types/` | All TypeScript types: `SellingTypeKey`, `ProductFilter` etc. |
| `StockUtils.ts` | `stock_utils/` | **Pure utility functions only** (no business logic): `uid`, `numberValue`, `defaultBaseUnit` etc. |
| `StockDraftTemplates.ts` | `stock_utils/` | **Business logic**: `emptyDraft()` and `buildTemplate()` for constructing default VariantDraft shapes. |

### 🟨 Shared UI Components (`stock_components/Shared`)

| File | Purpose |
|---|---|
| `StockBadge.tsx` | Stock status badge (OK / Low / Out) shown in table rows and mobile cards. |
| `StockUnitSelector.tsx` | Reusable searchable unit dropdown (Popover + Command). Used by creator, edit dialog, and extra variant rows. |

---

### 🟩 State Management (`stock_context/`)

| File | Purpose |
|---|---|
| `StockContext.tsx` | React Context for module-wide state. Contains: product list, search, filter, pagination, modal toggles, mutations. |
| `StockProductCreatorContext.tsx` | Owns all 9 form state fields (name, unitType, bulkConversionRate, buyPrice, sellPrice, initialStock, expiryDate, barcode, location, lowStockAlert) + derived base-unit calculations + validation errors + submit/reset handlers. **Simplified from 15 fields to 9 in the 2-click refactor.** |
| `StockEditVariantDialogContext.tsx` | Syncs `draft` from the editing product, owns `patchDraft`, `handleUnitChange`, derived values, and `handleSave`. |

---

### 🟧 Layout & Dashboard (stock_components/Layout & stock_components/Dashboard)

| File | Purpose |
|---|---|
| `Layout/StockMainLayout.tsx` | Orchestrator: renders all top-level components in order. No logic. |
| `Layout/StockHeader.tsx` | Page title + "Purchase Entry" and "Naya Product" action buttons. |
| `Dashboard/StockStatsGrid.tsx` | 4 stat cards (Variants, Khula, Quick Billing, Low/Out). |

---

### 🟪 Search & Filter (stock_components/SearchAndFilter)

| File | Purpose |
|---|---|
| `StockSearchBar.tsx` | Product name/shortcut search input. |
| `StockFilterBar.tsx` | Filter pill buttons (All, Out, Low, In Stock, etc.). |

---

### 🟫 Table & Mobile View (stock_components/Table & stock_components/Mobile)

| File | Purpose |
|---|---|
| `Table/StockMainTable.tsx` | Desktop table (hidden on mobile). Renders `StockTableRow` for each paginated product. |
| `Table/StockTableRow.tsx` | Single row in the desktop table. |
| `Table/StockPagination.tsx` | Previous/Next page controls + page info. |
| `Mobile/StockMobileList.tsx` | Mobile card list (hidden on desktop). Renders `StockMobileCard` for each paginated product. |
| `Mobile/StockMobileCard.tsx` | Single card in the mobile list: name, variant, stock, sell price, mode, edit/delete actions. |

---

### 🟥 Product Creator Dialog (stock_components/Dialogs/ProductCreator)

> **Entry Point & Single File**: `StockProductCreator.tsx`
>
> **Refactored to a single-file "2-click" design** (May 2026). The old 8-sub-component architecture was replaced by one self-contained file that is simpler, faster to update, and easier to hand to an AI.

| File | Responsibility |
|---|---|
| `StockProductCreator.tsx` | **Complete creator UI in one file.** Contains: `FieldLabel`, `FieldInput`, `UnitButton` sub-components (file-local, not exported), the full form layout, and the exported `StockProductCreator` wrapper. All color tokens come from `stock.css` — zero hardcoded Tailwind color utilities. |

#### Form Fields & UX

| Section | Fields | Notes |
|---|---|---|
| **Required** | Product Name | Text input, auto-focused on open |
| **Required** | Unit Type | 3 tap-buttons: `PACKET` (blue), `KG/Khula` (amber), `BORA/Bulk` (purple) |
| **Conditional** | Bulk Conversion Rate | Appears only when `BORA` is selected. "1 Bora me kitna KG?" |
| **Required** | Buy Price + Sell Price | Side-by-side ₹ inputs with live **Margin Badge** (green=profit, red=loss) |
| **Required** | Current Stock | Number input; unit suffix auto-updates (Pcs / KG / Bora) |
| **Optional** | Expiry Date | Date picker; required for food alerts but optional for non-consumables |
| **Optional** | Barcode | Hidden inside collapsible "Extra Jankari" section |
| **Optional** | Location | Hidden inside collapsible "Extra Jankari" section |
| **Optional** | Low Stock Alert | Default = 5; hidden inside collapsible "Extra Jankari" section |

#### Key UX Behaviours

- **`hasAttempted` state**: Validation error messages are hidden on first open. They only appear after the user clicks "Product Save Karo" once. This prevents a cluttered empty-form experience.
- **Collapsible optional section**: Barcode, Location, and Low Stock Alert are collapsed by default under "+ Extra Jankari (Optional)" to maintain the 2-click fast flow.
- **Live Margin Badge**: Appears instantly after both Buy and Sell prices are typed. Shows % margin and ₹ profit-per-unit (green) or loss warning (red).
- **Unit suffix**: The stock input's right-side label dynamically shows `Pcs`, `KG`, or `Bora` based on selected unit type.

#### Conversion Logic (Inside `StockProductCreatorContext`)

| Unit Type | What user enters | How it's stored in DB |
|---|---|---|
| `PACKET` | e.g. 50 packets | `50 pieces` (1:1) |
| `KG` (Khula) | e.g. 10 KG | `10,000 grams` (×1000) |
| `BORA` | e.g. 2 Bora + rate 50 KG | `100,000 grams` (2 × 50 × 1000) |

> All stock is stored in a single **base unit** (grams, ml, or pieces) so the billing system can deduct any quantity accurately.

---

### 🟪 Edit Variant Dialog (stock_components/Dialogs/EditVariantDialog)

> **Entry Point**: `StockEditVariantDialog.tsx` — renders Dialog shell + sub-components.

| File | Responsibility |
|---|---|
| `StockEditVariantDialog.tsx` | Dialog shell (~60 lines). Wraps `StockEditVariantDialogProvider` + composes sub-components. |
| `StockEditVariantDialogNameExpiryRow.tsx` | 2-column top row: "Size Name" (required) + "Expiry Date" (optional). |
| `StockEditVariantDialogUnitSection.tsx` | Unit selector + auto-wired pills (identical behaviour to creator's unit field). |
| `StockEditVariantDialogPriceMarginSection.tsx` | Buy + Sell Price grid + inline margin/loss preview box. |
| `StockEditVariantDialogStockExtrasSection.tsx` | "Stock & Extras" card (Current Stock, Low Alert, MRP) + Quick Select toggle card. |
| `StockEditVariantDialogFooter.tsx` | Fixed footer: validation errors banner + Cancel/Save buttons. |

---

### 🔵 Purchase Entry Dialog (stock_components/Dialogs/PurchaseDialog)

> **No dedicated context** — the purchase form has only 5 local fields, so state is managed in the parent component and passed as props (one clean level).

| File | Responsibility |
|---|---|
| `StockPurchaseDialog.tsx` | Manages 5 local fields, composes sub-components, calls `purchase()` from `StockContext`. |
| `StockPurchaseDialogProductSelector.tsx` | "Product variant" dropdown — reads `allProducts` from StockContext. |
| `StockPurchaseDialogQuantityRateFields.tsx` | 2-column Qty + New Purchase Rate inputs. |
| `StockPurchaseDialogSupplierExpiryFields.tsx` | Supplier (Khata) dropdown (fetches suppliers internally) + Expiry Date input. |
| `StockPurchaseDialogStockPreview.tsx` | Preview box: shows base units to be added + current stock level. |

---

## 🔑 Key Design Decisions

### Why a Single-File Creator?

The original creator dialog was split into 8 sub-components (`StockProductCreatorNameField`, `StockProductCreatorPriceFields`, etc.) for maximum AI-isolation. However, the dialog was redesigned into a **"2-click" mobile-first flow** (May 2026) with a significantly smaller form surface (9 fields vs 15+). At this simpler scale, sub-components added overhead without isolation benefit — a single AI context window can now hold the entire creator. The file is kept **under ~430 lines** to stay within a single AI context window.

### Why TWO context files for the creator?

`StockContext` is module-level and shared by all components. The creator dialog has 9 local `useState` fields. Without a dedicated context, `StockProductCreator.tsx` would have had to prop-drill values down to child components — creating a brittle prop chain.

Solution: `StockProductCreatorContext` is scoped strictly inside the creator dialog tree. It does not affect or pollute the module-level `StockContext` at all.

### Theme Independence

All colors in the creator dialog come from CSS variables defined in `stock.css` under the `/* ── Creator Dialog ──*/` block. **Zero hardcoded Tailwind color utilities** exist in any TSX file (per `Development_frontend_prompt.md` Rule #4).

Key token groups in `stock.css`:
- `--stock-creator-header-*` — Header background, icon gradient (teal brand `--primary`), title/subtitle text
- `--stock-creator-unit-packet-*` / `khula-*` / `bora-*` — Active/inactive states for the 3 unit tap-buttons
- `--stock-creator-bora-*` — Purple conversion box that appears when Bora/Bulk is selected
- `--stock-creator-sell-input-*` — Teal soft highlight on the Sell Price field
- `--stock-creator-margin-profit-*` / `margin-loss-*` — Green/red live margin badge
- `--stock-creator-save-btn-bg` — **Teal (`--primary`)** — matches the rest of the app's brand
- `--stock-creator-error-*` — Red validation error banner

> To change the entire creator theme: edit only `stock.css`. No TSX changes needed.

### Why is `page.tsx` a Server Component?

`StockProvider` and `StockMainLayout` both have `"use client"` directives themselves. Next.js App Router automatically treats them as Client Components. `page.tsx` doesn't need `"use client"` — removing it allows Next.js to optimise the route entry point.

---

## 🚀 Future Enhancement Points

| Feature | Where to change |
|---|---|
| Replace hardcoded filter options with API | `stock_constants/StockSharedConstants.ts` → `STOCK_FILTER_OPTIONS` |
| Replace hardcoded stat cards with API | `stock_constants/StockSharedConstants.ts` → `STOCK_STAT_ITEMS` |
| Replace default product templates with API | `stock_utils/StockDraftTemplates.ts` → `emptyDraft()` |
| Replace unit config with API | `stock_constants/StockSharedConstants.ts` → `UNIT_CONFIG`, `UNIT_GROUPS` |
| Barcode camera scanner | Add camera scan handler in `StockProductCreator.tsx` (barcode field already exists) |
| Expiry date batch tracking (FIFO) | Extend `StockProductCreatorContext` to support multiple expiry entries per product |
| Low stock push notification | Hook into `lowStockAlert` field already saved via `StockProductCreatorContext` |
| Location-based product finder | Hook into `location` field (saved as `keywords`) — build a search/filter UI |
| Bulk CSV/Excel upload | New file: `StockBulkUploadDialog.tsx` + context |
| Stock movement history view | New file: `StockMovementHistoryPanel.tsx` |
| Master product info editing | New file: `StockEditMasterProductDialog.tsx` |
| **Shrinkage / Yield Loss (Sukhad)** | Add shrinkage % to `StockProductCreatorContext` to account for moisture loss/spillage when selling Bora items loose |
| **Stock Adjustments / Write-offs** | New dialog `StockAdjustmentDialog.tsx` to handle damaged, rat-bitten, or expired stock (minus stock without billing) |
| **Multi-Tier Wholesale (Strips/Ladi)**| Update `StockSharedConstants.ts` & logic to support Box -> Ladi -> Piece (2-tier conversion) for items like Shampoo/Medicines |
| **Packaging Material Tracking** | Automatically deduct 1 polybag inventory when selling Khula items in `BillingContext.tsx` |

---

## 📋 Changelog

| Date | Change |
|---|---|
| May 2026 | **Product Creator redesigned** — replaced 8-sub-component architecture with a single-file `StockProductCreator.tsx` (2-click mobile-first form). |
| May 2026 | **`StockProductCreatorContext` simplified** — from 15 fields to 9 fields matching the new simplified form. |
| May 2026 | **CSS tokens updated** — creator dialog tokens aligned with `color_code.md`: save button uses `--primary` (teal), sell price highlight uses teal, header icon uses teal, labels use `--foreground` for proper visibility in both dark/light mode. |
| May 2026 | **`hasAttempted` UX** — validation errors are hidden until first save attempt, preventing cluttered empty-form state. |
| May 2026 | **Collapsible optional section** — Barcode, Location, Low Stock Alert collapsed by default under "Extra Jankari". |
| May 2026 | **Live Margin Badge** — instant profit/loss % feedback after Buy + Sell price entry. |
| May 2026 | **Expiry Date Optional** — removed mandatory validation check so non-consumables (pens, buckets, batteries) can be added without an expiry date. Added helpful note in UI. |
