# Smart Kirana Store — Suppliers Module Documentation

> **AI CONTEXT DOCUMENT** — This file is the single source of truth for navigating the Suppliers module.
> When an AI receives a bug report, it should read this file first to identify **exactly one file** to fix.

---

## 📐 Architecture Philosophy

This module follows strict **"One File, One Responsibility"** micro-modularization.

- **No inline logic in UI files** — business utilities live in dedicated `*Utils.ts` / `*Constants.ts` files.
- **No hardcoded strings in components** — all labels, messages, and templates live in `SuppliersConstants.ts`.
- **No duplicated logic** — the thermal print function exists in exactly ONE place (`SuppliersPrintUtils.ts`).
- **Theme independence** — ZERO Tailwind color classes in JSX. All colors are `var(--supplier-*)` CSS variables defined in `suppliers.css`.
- **Isolated state** — `SuppliersContext.tsx` is the only shared state; no global store is polluted.

---

## 📂 Complete File Map

### 🟦 Route Files (Next.js)

| File | Purpose |
|------|---------|
| `page.tsx` | Entry point — wraps `<SuppliersProvider>` around `<SuppliersMainLayout>` |
| `loading.tsx` | Next.js skeleton shown during initial page load |
| `error.tsx` | Next.js error boundary with a retry button |
| `suppliers.css` | **All** CSS color variables for this module (`:root` + `.dark` overrides) |

---

### 🟩 Data Layer (Single Source of Truth)

| File | Purpose |
|------|---------|
| `SuppliersTypes.ts` | Zod schemas (`supplierSchema`, `txSchema`) and all inferred TypeScript types (`SupplierFormValues`, `TxFormValues`, `LedgerRow`) |
| `SuppliersConstants.ts` | **ALL** static strings, labels, toast messages, confirm builders, reminder message builder, and WhatsApp URL builder |
| `SuppliersPrintUtils.ts` | Pure utility — `printSupplierThermalBill()` function. Opens a thermal-format bill in a new window. **To change the bill layout, only edit this file.** |

---

### 🟧 State Layer

| File | Purpose |
|------|---------|
| `SuppliersContext.tsx` | React Context Provider. Holds: `search`, `isAddOpen`, `ledgerId`, `isReminderOpen`, `transactionMode`. Runs TanStack Query hooks: `useListSuppliers`, `useGetSupplier`, `useCreateSupplier`, `useDeleteSupplier`, `useAddSupplierTransaction`, `useGetSettings`. Exposes `useSuppliers()` hook. |

---

### 🟨 Layout & Primary List View

| File | Purpose |
|------|---------|
| `SuppliersMainLayout.tsx` | Orchestrator — composes `Header`, `SearchBar`, `ListTable`, `AddDialog`, `LedgerDialog` |
| `SuppliersHeader.tsx` | Page `<h1>` title, supplier count, and "Add Supplier" button |
| `SuppliersSearchBar.tsx` | Search `<Input>` — updates `search` in context |
| `SuppliersListTable.tsx` | Container for the supplier list. Manages loading skeleton and empty state. Renders `SuppliersListTableRow` for each supplier. |
| `SuppliersListTableRow.tsx` | **One supplier row**: avatar initial, name, phone, due amount (or "Clear"), delete button, chevron. Pure presentational — receives typed props. |
| `SuppliersAddDialog.tsx` | Dialog form (react-hook-form + Zod) to create a new supplier. |

---

### 🟪 Ledger View (Modal)

| File | Purpose |
|------|---------|
| `SuppliersLedgerDialog.tsx` | Main modal orchestrator. Opens when `ledgerId !== null`. Composes all ledger sub-components. |
| `SuppliersLedgerHeader.tsx` | Top card showing supplier avatar initial, name, phone, and Total Due amount. |
| `SuppliersLedgerActions.tsx` | Four action buttons: "Payment Mila", "Udhaar Diya", "Reminder", "Thermal Print". Delegates print to `SuppliersPrintUtils`. |
| `SuppliersTransactionForm.tsx` | Inline form for submitting new Payment or Udhaar entries. Shown/hidden by `transactionMode` in context. |
| `SuppliersLedgerTableColumnHeaders.tsx` | Static sticky column headers (desktop 4-col + mobile 3-col). No props, no state. |
| `SuppliersLedgerTable.tsx` | Computes running balances via `useMemo`. Handles empty state. Renders `SuppliersLedgerTableRow` for each transaction. |
| `SuppliersLedgerTableRow.tsx` | **One transaction row**: date, type icon, description, amount (colored), running balance. Handles both desktop and mobile grid layouts. Pure presentational. |
| `SuppliersReminderDialog.tsx` | WhatsApp reminder dialog. Shows preview of reminder message. Dispatches via `buildWhatsAppUrl()` from Constants. Optionally prints via `SuppliersPrintUtils`. |

---

## 🗂 Directory Tree

```
app/(app)/suppliers/
├── page.tsx
├── loading.tsx
├── error.tsx
├── suppliers.css
├── suppliers_features.md                       ← (this file)
└── suppliers_components/
    │
    │  ── DATA LAYER ──────────────────────────────────────────
    ├── SuppliersTypes.ts
    ├── SuppliersConstants.ts
    ├── SuppliersPrintUtils.ts
    │
    │  ── STATE LAYER ─────────────────────────────────────────
    ├── SuppliersContext.tsx
    │
    │  ── LIST VIEW ───────────────────────────────────────────
    ├── SuppliersMainLayout.tsx
    ├── SuppliersHeader.tsx
    ├── SuppliersSearchBar.tsx
    ├── SuppliersListTable.tsx
    ├── SuppliersListTableRow.tsx               ← NEW
    ├── SuppliersAddDialog.tsx
    │
    │  ── LEDGER VIEW (MODAL) ─────────────────────────────────
    ├── SuppliersLedgerDialog.tsx
    ├── SuppliersLedgerHeader.tsx
    ├── SuppliersLedgerActions.tsx
    ├── SuppliersTransactionForm.tsx
    ├── SuppliersLedgerTableColumnHeaders.tsx   ← NEW
    ├── SuppliersLedgerTable.tsx
    ├── SuppliersLedgerTableRow.tsx             ← NEW
    └── SuppliersReminderDialog.tsx
```

---

## 🛠 Core Features & Workflow

### 1. Supplier Management
- Add new suppliers via `SuppliersAddDialog` (name, phone, address).
- The list (`SuppliersListTable`) shows all suppliers with their total due at a glance.
- Search via `SuppliersSearchBar` filters suppliers in real-time through the API.
- Delete a supplier from the list row (with confirm dialog).

### 2. Transaction Ledger
- Clicking a supplier row sets `ledgerId` in context → `SuppliersLedgerDialog` opens.
- `SuppliersLedgerTable` computes a running balance across all transactions in `useMemo`.
- New transactions are submitted via `SuppliersTransactionForm` (shown when `transactionMode` is set).
- Invalidates `listSuppliers`, `getSupplier`, `dashboardSummary`, and `reports` queries on success.

### 3. Thermal Print
- Click "Thermal Print" in `SuppliersLedgerActions` → calls `printSupplierThermalBill()` from `SuppliersPrintUtils.ts`.
- Also callable from `SuppliersReminderDialog` via "Bill + Text" button.
- **To change the thermal bill layout/format: edit only `SuppliersPrintUtils.ts`.**

### 4. WhatsApp Reminder
- Click "Reminder" → `isReminderOpen = true` → `SuppliersReminderDialog` opens.
- Message is built by `buildSupplierReminderMessage()` from `SuppliersConstants.ts`.
- WhatsApp URL is built by `buildWhatsAppUrl()` from `SuppliersConstants.ts`.
- **To change the reminder message template: edit only `SuppliersConstants.ts`.**

---

## 🧠 State Management

```
SuppliersContext.tsx
├── search: string                → drives useListSuppliers({ search })
├── isAddOpen: boolean            → controls SuppliersAddDialog
├── ledgerId: number | null       → controls SuppliersLedgerDialog (null = closed)
├── isReminderOpen: boolean       → controls SuppliersReminderDialog
├── transactionMode: "payment" | "credit" | null → controls SuppliersTransactionForm
├── suppliers[]                   → from useListSuppliers
├── ledgerDetail                  → from useGetSupplier(ledgerId)
├── shopSettings                  → from useGetSettings
└── mutations: createSupplier, deleteSupplier, addTransaction
```

---

## 📌 AI Quick-Reference: Where to Look

| Task | File to Edit |
|------|-------------|
| Fix thermal bill layout / content | `SuppliersPrintUtils.ts` |
| Change WhatsApp reminder message text | `SuppliersConstants.ts` → `buildSupplierReminderMessage()` |
| Change toast messages | `SuppliersConstants.ts` → `SUPPLIER_TOASTS` |
| Fix supplier list row UI (avatar, name, due) | `SuppliersListTableRow.tsx` |
| Fix ledger transaction row UI (amount, icon, colors) | `SuppliersLedgerTableRow.tsx` |
| Fix ledger column headers | `SuppliersLedgerTableColumnHeaders.tsx` |
| Add/remove an action button in ledger | `SuppliersLedgerActions.tsx` |
| Change transaction form fields | `SuppliersTransactionForm.tsx` |
| Change Zod validation rules | `SuppliersTypes.ts` |
| Change theme colors | `suppliers.css` |
| Fix API query/mutation logic | `SuppliersContext.tsx` |
