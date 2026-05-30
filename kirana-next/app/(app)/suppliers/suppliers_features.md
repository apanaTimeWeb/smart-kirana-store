# Smart Kirana Store - Suppliers Module Documentation

Yeh document `Smart Kirana Store` application ke **Suppliers (Khata)** module ki detailed architectural aur functional information provide karta hai. Iska main purpose ek clear context dena hai taaki developers aur AI easily changes kar sakein.

## 📁 Directory Structure & Architecture

Suppliers module `app/(app)/suppliers` directory me hai. Architecture strictly **Micro-Modularization & Client Components** par based hai, jahan state aur UI completely separated hain.

- **`page.tsx`**: Main entry point jo `SuppliersProvider` ke andar `SuppliersMainLayout` ko render karta hai.
- **`error.tsx`**: Next.js native error boundary specifically for the suppliers module.
- **`loading.tsx`**: Next.js native loading skeleton using module-specific CSS variables.
- **`suppliers.css`**: Suppliers module ke specific UI variables yahan define hote hain. **(Strictly No Inline Tailwind Colors)**

### 🧩 `suppliers_components/`

Har function ek single micro-component me separated hai:

#### 1. Data & State Management (Single Source of Truth)
- **`SuppliersTypes.ts`**: Saare Zod schemas aur TypeScript interfaces.
- **`SuppliersConstants.ts`**: Static configurations aur UI labels.
- **`SuppliersContext.tsx`**: React Context Provider for managing all module state (search inputs, modal visibilities, active ledger selection, transaction mode) and TanStack Query mutations (`useAddSupplierTransaction`, `useCreateSupplier`, `useDeleteSupplier`).

#### 2. Layout & Primary View
- **`SuppliersMainLayout.tsx`**: Coordinates the list view components.
- **`SuppliersHeader.tsx`**: Page title aur "Add Supplier" button.
- **`SuppliersSearchBar.tsx`**: Search input (updates Context search state).
- **`SuppliersListTable.tsx`**: Main list of suppliers, mapping over Context data.
- **`SuppliersAddDialog.tsx`**: Dialog form to create a new supplier.

#### 3. Ledger View (Modal)
- **`SuppliersLedgerDialog.tsx`**: The main modal orchestrator for a selected supplier's ledger.
- **`SuppliersLedgerHeader.tsx`**: Top visual summary (Name, Total Due).
- **`SuppliersLedgerActions.tsx`**: Action buttons (Payment, Udhaar, Reminder, Print).
- **`SuppliersLedgerTable.tsx`**: The chronological table of transactions.
- **`SuppliersTransactionForm.tsx`**: Inline form for submitting new Payments or Udhaar.
- **`SuppliersReminderDialog.tsx`**: WhatsApp reminder format and dispatching.

## 🛠 Core Features & Workflow

### 1. Supplier Management
- Add new suppliers via the `SuppliersAddDialog` form.
- The list provides an immediate overview of total due amounts for each supplier.
- Instantly search through suppliers.

### 2. Transaction Ledger
- Selecting a supplier opens the `SuppliersLedgerDialog`.
- All past transactions (Udhaar given, Payments received) are rendered with a running balance.
- New transactions instantly update the balances across the UI without reloading.

### 3. Smart Reminders & Print
- Generate an instant WhatsApp text reminder directly opening the user's WhatsApp.
- Print a formatted Thermal Bill showing the ledger history.

## 🧠 State Management & API
- **Context API**: `SuppliersContext.tsx` holds the current `ledgerId`. When `ledgerId` is set, the modal opens automatically. When the modal is closed, `ledgerId` is set to `null`.
- API calls use TanStack Query for optimistic invalidations and caching.

## 📌 Summary for AI
- To fix a UI bug on the ledger table, look at `SuppliersLedgerTable.tsx`.
- To modify the WhatsApp message format, edit `SuppliersReminderDialog.tsx`.
- The architecture is extremely isolated, eliminating the risk of hallucinations breaking parallel functionality.
