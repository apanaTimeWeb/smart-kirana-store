# Smart Kirana Store — Khata (Ledger) Module Documentation

> **AI Context Document** — This file is the authoritative map for this module. Before making any change to the Khata feature, read this file first. It tells you exactly which file to touch and why.

---

## 📁 Directory Structure

```
app/(app)/khata/
├── page.tsx                                    ← Root Server Component: KhataProvider + KhataCustomerListContainer
├── loading.tsx                                 ← Next.js skeleton loading UI (Server Component)
├── error.tsx                                   ← Next.js error boundary (Client Component, "use client")
├── khata.css                                   ← ALL color tokens for this module (single source of truth for theming)
├── khata_features.md                           ← THIS FILE — AI context & architecture map
│
└── khata_components/
    │
    │── ── LOGIC & STATE ─────────────────────────────────────────────────────
    ├── KhataContext.tsx                        ← Brain: all module-level UI state (search, dialogs, transaction mode)
    ├── KhataTypes.ts                           ← Central types: Zod schemas + re-exports of Customer, CustomerDetail, AppSettings
    ├── KhataConstants.ts                       ← Central data: ALL hardcoded UI strings and config (Single Source of Truth)
    ├── KhataPrintUtils.ts                      ← Pure functions: WhatsApp message builder + thermal print HTML generator
    │
    │── ── CUSTOMER LIST ─────────────────────────────────────────────────────
    ├── KhataCustomerListContainer.tsx          ← Smart container: fetches customers, handles delete, composes sub-components
    ├── KhataCustomerListHeader.tsx             ← Search bar + "Add Customer" button (page title row)
    ├── KhataCustomerListItem.tsx               ← One customer row: avatar, name, phone, due amount, delete button
    ├── KhataCustomerListSkeleton.tsx           ← Animated skeleton placeholders shown while customers are loading
    ├── KhataCustomerListEmptyState.tsx         ← Empty state UI shown when customer list has zero records
    │
    │── ── LEDGER ────────────────────────────────────────────────────────────
    ├── KhataLedgerDialog.tsx                   ← Dialog shell (open/close logic, sizing, title) for the customer ledger
    ├── KhataLedgerContainer.tsx                ← Smart container: fetches customer detail, computes ledger rows + filter
    ├── KhataLedgerHeader.tsx                   ← Customer info card with gradient background and total due display
    ├── KhataLedgerActions.tsx                  ← 4 action buttons: Payment Mila, Udhaar Diya, Reminder, Thermal Print
    ├── KhataLedgerSearch.tsx                   ← Search bar for filtering transactions inside the ledger
    ├── KhataLedgerTable.tsx                    ← Transaction table: desktop/mobile headers + maps rows to KhataLedgerTableRow
    ├── KhataLedgerTableRow.tsx                 ← One transaction row (desktop 4-col + mobile 3-col layouts)
    ├── KhataLedgerTransactionItemsList.tsx     ← Items sub-list under a credit row (purchased bill items breakdown)
    │
    │── ── FORMS & DIALOGS ───────────────────────────────────────────────────
    ├── KhataAddCustomerDialog.tsx              ← Dialog form: add a new customer (name, phone, address)
    ├── KhataTransactionForm.tsx                ← Inline form: record a Payment or Udhaar transaction
    └── KhataReminderDialog.tsx                 ← Dialog: preview + send WhatsApp reminder message to customer
```

---

## 🧠 State Management: `KhataContext.tsx`

**One file rules all shared state.** Every component that needs cross-component state pulls from `useKhata()` — zero prop drilling.

### What lives in context:

| State | Type | Purpose |
|---|---|---|
| `customerSearch` | `string` | Search query for the customer list |
| `ledgerSearch` | `string` | Search query inside the ledger transaction table |
| `selectedLedgerId` | `number \| null` | ID of the customer whose ledger is open (`null` = dialog closed) |
| `isAddCustomerOpen` | `boolean` | Controls Add Customer Dialog visibility |
| `transactionMode` | `"payment" \| "credit" \| null` | Which transaction form is active (`null` = form hidden) |
| `isReminderOpen` | `boolean` | Controls WhatsApp Reminder Dialog visibility |

### What does NOT live in context:

- Customer data (`Customer[]`, `CustomerDetail`) — fetched by TanStack Query in the container components
- Ledger row computation — derived via `useMemo` inside `KhataLedgerContainer`
- Form state — managed locally by `react-hook-form` inside each dialog/form component

---

## 📦 Centralized Data: `KhataTypes.ts` + `KhataConstants.ts`

**Single source of truth for ALL data in this module.** When the backend replaces hardcoded values with API calls, only these files change — zero UI component edits required.

### `KhataTypes.ts` — Type definitions

| Export | Source | Purpose |
|---|---|---|
| `Customer` | re-export from `@/lib/api/types` | Shape of a customer list item |
| `CustomerDetail` | re-export from `@/lib/api/types` | Customer + full transaction history |
| `AppSettings` | re-export from `@/lib/api/types` | Shop settings (name, address, phone, etc.) |
| `KhataCustomerSchema` | Zod schema | Validation for the Add Customer form |
| `KhataTransactionSchema` | Zod schema | Validation for the Transaction form |
| `KhataCustomerFormValues` | derived type | TypeScript type for Add Customer form values |
| `KhataTransactionFormValues` | derived type | TypeScript type for Transaction form values |
| `KhataLedgerRow` | local type | A transaction enriched with a running `balance` field |

### `KhataConstants.ts` — All hardcoded strings and config

| Key Path | Purpose |
|---|---|
| `SHOP_NAME_DEFAULT` | Default shop name for print/WhatsApp if settings unavailable |
| `MESSAGES.*` | Toast notification strings (success/error messages) |
| `LABELS.PAGE_TITLE` | "Khata (खाता)" heading |
| `LABELS.ADD_CUSTOMER_DIALOG_TITLE` | "Naya Customer Add Karein" |
| `LABELS.FIELD_NAME / FIELD_PHONE / FIELD_ADDRESS` | Form field labels for Add Customer |
| `LABELS.LEDGER_DIALOG_TITLE` | "Khata Ledger" dialog title |
| `LABELS.TOTAL_DUE` | Header label above the due amount |
| `LABELS.DATE / DESCRIPTION / AMOUNT / BALANCE / DETAILS` | Table column headers |
| `LABELS.AMT_BAL_MOBILE` | Combined "Amt / Bal" mobile column header |
| `LABELS.NO_TRANSACTIONS` | Empty state text for ledger table |
| `LABELS.NO_CUSTOMERS / NO_CUSTOMERS_SUB` | Empty state text for customer list |
| `LABELS.CLEAR_DUE` | "Clear" text shown when customer has ₹0 due |
| `LABELS.REMINDER_TEXT_ONLY / REMINDER_BILL_TEXT / CANCEL` | WhatsApp Reminder dialog buttons |
| `LABELS.WHATSAPP_REMINDER_TITLE` | "WhatsApp Reminder" dialog title |
| `LABELS.PAYMENT_ENTRY / UDHAAR_ENTRY` | Transaction form headings |
| `WHATSAPP_TEMPLATE.PLEASE_PAY` | "Kripya jaldi payment kar dein." (footer line) |
| `WHATSAPP_TEMPLATE.THANK_YOU` | "Thank You!" (last line) |
| `WHATSAPP_TEMPLATE.THERMAL_BILL_TITLE` | "Khata Ledger" used in print header |

---

## 🎨 Theming: `khata.css`

All colors are defined as CSS variables here. To port this module to another project, change only this file.

### Full CSS Variable Reference

| Variable | Purpose |
|---|---|
| `--khata-card-bg` | Card/panel backgrounds |
| `--khata-background` | Page and input field backgrounds |
| `--khata-border` | All border colors |
| `--khata-muted-bg` | Table header muted background |
| `--khata-muted-hover-bg` | Row hover state background |
| `--khata-muted-text` | Secondary/placeholder text color |
| `--khata-foreground` | Primary text color |
| `--khata-customer-avatar-bg` | Customer avatar circle background |
| `--khata-customer-avatar-text` | Customer avatar letter color |
| `--khata-header-bg-from / bg-to` | Ledger header gradient start/end |
| `--khata-header-border` | Ledger header border color |
| `--khata-header-avatar-bg / avatar-text` | Large avatar in ledger header |
| `--khata-header-due-amount` | Total due amount text color in header |
| `--khata-btn-panel-bg` | Action buttons panel background |
| `--khata-btn-payment-ring / active-bg` | "Payment Mila" button active state |
| `--khata-btn-credit-border / text / hover-bg / ring / active-bg` | "Udhaar Diya" button states |
| `--khata-btn-reminder-border / text / hover-bg` | "Reminder" button styles |
| `--khata-reminder-msg-bg / msg-border` | WhatsApp message preview box |
| `--khata-reminder-send-bg` | "Text Only" send button background |
| `--khata-reminder-bill-border / bill-text` | "Bill + Text" button styles |
| `--khata-form-panel-bg` | Transaction form panel background |
| `--khata-ledger-bg` | Ledger table background |
| `--khata-tx-credit-icon-bg / icon-text / amount` | Credit (Udhaar) transaction colors |
| `--khata-tx-payment-icon-bg / icon-text / amount` | Payment received transaction colors |
| `--khata-list-due-text` | Due amount text in customer list |
| `--khata-list-clear-text` | "Clear" text in customer list |
| `--khata-list-delete-hover` | Trash icon hover color |

All variables have both `:root` (light) and `.dark` overrides defined.

---

## 🔄 Data Flow: Opening a Customer Ledger

```
User clicks KhataCustomerListItem
  → setSelectedLedgerId(customer.id)  [via useKhata()]
    → KhataLedgerDialog detects selectedLedgerId !== null
      → Dialog opens
        → KhataLedgerContainer fetches useGetCustomer(selectedLedgerId)
          → Computes ledgerRows (transactions + running balance) via useMemo
          → Renders: KhataLedgerHeader + KhataLedgerActions + KhataLedgerTable
            → KhataLedgerTable maps rows → KhataLedgerTableRow
              → KhataLedgerTableRow renders items → KhataLedgerTransactionItemsList
```

---

## ⚠️ Known Gotchas (Fixed)

> These issues were found during the enterprise audit and have been resolved. Documented here to prevent regression.

1. **`KhataConstants.ts` had a corrupted key: `KIRP कृपया:`**
   Mixed Hindi Unicode characters in a JavaScript key name. `KhataPrintUtils.ts` referenced it as `.KIRP` by accident. **Fixed: renamed to `PLEASE_PAY`** with a clean descriptive key.

2. **`page.tsx` had `"use client"` unnecessarily.**
   In Next.js App Router, Server Components CAN render Client Components — the boundary belongs in the children (`KhataContext.tsx`). Adding `"use client"` to `page.tsx` prevents Next.js from server-rendering the page shell. **Fixed: removed `"use client"` from `page.tsx`.**

3. **`KhataCustomerListContainer.tsx` had 3 responsibilities.**
   It rendered the Dialog (ledger open/close), Skeleton (loading state), and the list — all inline. Violated One Component, One Responsibility. **Fixed: extracted to `KhataLedgerDialog`, `KhataCustomerListSkeleton`, `KhataCustomerListEmptyState`.**

4. **`KhataLedgerTableRow.tsx` inlined the items sub-list.**
   Lines 82–95 were a complete separate component embedded inside the row. **Fixed: extracted to `KhataLedgerTransactionItemsList.tsx`.**

5. **`customer: any` / `detail: any` / `settings: any` throughout.**
   Five files used `any` for API data, silently breaking TypeScript's type safety. **Fixed: all replaced with `Customer`, `CustomerDetail`, `AppSettings` from `KhataTypes.ts`.**

6. **Multiple hardcoded JSX strings not in constants.**
   `"Naya Customer Add Karein"`, `"Text Only"`, `"Bill + Text"`, `"Cancel"`, `"WhatsApp Reminder"`, `"Amt / Bal"`, `"Clear"` were in JSX components. **Fixed: all moved to `KhataConstants.LABELS`.**

---

## 🚀 Future Enhancements

| Feature | Where to touch | Notes |
|---|---|---|
| **PDF Export** | `KhataPrintUtils.ts` | Add a new `exportPDF()` function; zero component changes needed |
| **Bulk Reminder** | `KhataCustomerListHeader.tsx` | Add a "Send All Reminders" button; iterate customers from context |
| **Transaction Edit/Delete** | `KhataLedgerTableRow.tsx` | Add a context menu or edit icon; touch only this file |
| **Backend API for customers** | `KhataTypes.ts` | Update `Customer` / `CustomerDetail` re-exports; zero UI changes |
| **Multi-language support** | `KhataConstants.ts` | All strings centralized here; swap to i18n object tomorrow |
| **Customer balance history chart** | New `KhataLedgerBalanceChart.tsx` | Add to `KhataLedgerContainer` next to the table |
| **Customer notes / tags** | `KhataCustomerListItem.tsx` + `KhataTypes.ts` | Add `notes?: string` to `Customer` type; render in list item |

---

## 📌 Quick Handover Summary

- **Brain**: `KhataContext.tsx` — all shared UI state. No prop drilling anywhere.
- **Data**: `KhataTypes.ts` (types) + `KhataConstants.ts` (strings). One place to swap in API data tomorrow.
- **Theming**: `khata.css` — all CSS variables with light + dark mode. Copy this folder to any project and theme from here only.
- **Customer Ledger flow**: `KhataLedgerDialog` → `KhataLedgerContainer` → sub-components. Dialog open/close is in context (`selectedLedgerId`).
- **Print/WhatsApp**: All generation logic in `KhataPrintUtils.ts` — pure functions, no React.
- **Architecture**: 20 files total, each with exactly ONE responsibility. To fix any bug, identify the one file from this map and provide only that file to an AI.
