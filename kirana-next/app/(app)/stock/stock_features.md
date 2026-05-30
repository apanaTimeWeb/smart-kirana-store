# Smart Kirana Store — Stock Module Documentation

> **AI Context Map** — This document is the **first file** an AI should read before touching any file in `app/(app)/stock`. It precisely describes what every file does and where every piece of state lives.

## 📁 Module Location

`app/(app)/stock/`

---

## 🏗 Architecture Overview

This module follows a strict **"One File, One Component"** rule for extreme AI-isolation. It is designed so that tomorrow if an AI needs to fix a bug in the creator dialog's price fields, you hand it **exactly one file** (`Dialogs/ProductCreator/StockProductCreatorPriceFields.tsx`) and the risk of hallucination breaking other components is zero.

The directory is micro-modularized into feature-based subfolders.

### State Architecture (stock_context Folder)

```text
┌─────────────────────────────────────────────────────────┐
│  stock_context/StockContext.tsx         (Module-level state) │
│  • Product list (API)      • Search / Filter             │
│  • Pagination              • Modal open/close toggles    │
│  • CRUD mutations          • Stats                       │
├─────────────────────────────────────────────────────────┤
│  stock_context/StockProductCreatorContext.tsx (Dialog-local)  │
│  • 15 form fields           • Validation + errors        │
│  • Derived values (cfg)     • Submit + reset handlers    │
├─────────────────────────────────────────────────────────┤
│  stock_context/StockEditVariantDialogContext.tsx (Dialog-local)│
│  • Draft (VariantDraft)     • patchDraft handler         │
│  • Unit change auto-wire    • isLoss / margin / errors   │
└─────────────────────────────────────────────────────────┘
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
| `StockProductCreatorContext.tsx` | Owns all 15 form state fields + derived values + handlers for the Product Creator. |
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

> **Entry Point**: `StockProductCreator.tsx` — renders Dialog shell + sub-components.

| File | Responsibility |
|---|---|
| `StockProductCreator.tsx` | Dialog shell (~80 lines). Wraps `StockProductCreatorProvider` + composes sub-components. |
| `StockProductCreatorNameField.tsx` | "Product Name" labeled input with validation message. Triggers submit on Enter. |
| `StockProductCreatorUnitField.tsx` | Unit selector + auto-wired pills (Base, Conversion, Mode). |
| `StockProductCreatorPriceFields.tsx` | 2-column Buy Price + Sell Price grid. |
| `StockProductCreatorIdentitySection.tsx` | "Product Identity" card: Variant Name override, Category, Brand, Keywords, Shortcut Key. |
| `StockProductCreatorStockPricingSection.tsx` | "Stock & Pricing Extras" card: MRP, Opening Stock, Low Stock Alert, Expiry Date, Quick Select toggle. |
| `StockProductCreatorExtraVariantsSection.tsx` | "Extra Variants / Packs" section: Add Pack button + list of `StockExtraVariantRow`. |
| `StockExtraVariantRow.tsx` | Single extra variant/pack row inside the creator. Fully controlled via `onUpdate`/`onRemove` props. |
| `StockLivePreview.tsx` | Reusable live margin/loss preview card. Used inside the creator dialog. |
| `StockProductCreatorFooter.tsx` | Fixed footer: validation errors banner + variant count summary + Cancel/Save buttons. |

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

### Why TWO context files for the creator?

`StockContext` is module-level and shared by all components. The creator dialog has 15 local `useState` fields. Without a dedicated context, `StockProductCreator.tsx` would have had to prop-drill all 15 values down to 8 child components — creating a brittle prop chain.

Solution: `StockProductCreatorContext` is scoped strictly inside the creator dialog tree. It does not affect or pollute the module-level `StockContext` at all.

### Theme Independence

All hardcoded Tailwind utility colors (like `text-primary`, `bg-card`) have been replaced by CSS variables `var(--stock-...)` stored centrally in `stock.css`. This module can be dragged and dropped into a completely different project, and themed entirely from that single CSS file.

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
| Bulk CSV/Excel upload | New file: `StockBulkUploadDialog.tsx` + context |
| Stock movement history view | New file: `StockMovementHistoryPanel.tsx` |
| Master product info editing | New file: `StockEditMasterProductDialog.tsx` |
