# Smart Kirana Store - Khata (Ledger) Module Documentation

Yeh document `Smart Kirana Store` application ke **Khata (Ledger / Udhaar)** module ki complete architectural aur functional details provide karta hai. Iska main purpose ek clear context dena hai taaki future me modifications aasani se kiye ja sakein bina kisi AI hallucination ke, jaisa ki strict "One Component, One File" rule ke tehat set kiya gaya hai.

## 📁 Directory Structure & Micro-Modular Architecture

Khata module `app/(app)/khata` directory me sthit hai aur ise completely **Micro-Modularize** kiya gaya hai.

- **`page.tsx`**: Main entry point jo `<KhataProvider>` aur `<KhataCustomerListContainer>` ko render karta hai.
- **`loading.tsx`**: Default Next.js loading state.
- **`error.tsx`**: Error boundary Next.js ke liye.
- **`khata.css`**: Khata module ke specific UI variables aur styles yahan define kiye gaye hain. Saari coloring (`bg-card`, `text-primary`) CSS variables ke through hoti hai for extreme Theme Independence.
- **`khata_components/`**: Yahan saare child components hain:
  - **State & Data**:
    - `KhataContext.tsx`: Module-level state (search strings, dialog visibility, transaction mode) handle karta hai taaki prop-drilling na ho.
    - `KhataConstants.ts`: Saare hardcoded UI strings, labels, aur default configurations (Single Source of Truth).
    - `KhataTypes.ts`: Zod schemas aur TypeScript interfaces.
    - `KhataPrintUtils.ts`: Pure functions for generating WhatsApp messages and Thermal Print HTML.
  - **Customer List Components**:
    - `KhataCustomerListContainer.tsx`: List ka wrapper jo API se data lata hai.
    - `KhataCustomerListHeader.tsx`: Search bar aur "Add Customer" button.
    - `KhataCustomerListItem.tsx`: Ek individual customer row.
  - **Ledger Components**:
    - `KhataLedgerContainer.tsx`: Kisi specific customer ka poora hisaab-kitab dialog.
    - `KhataLedgerHeader.tsx`: Customer detail aur Total Due dikhane wala gradient header.
    - `KhataLedgerActions.tsx`: Action buttons (Payment, Udhaar, Reminder, Print).
    - `KhataLedgerSearch.tsx`: Ledger transactions me search karne ke liye bar.
    - `KhataLedgerTable.tsx`: Transactions ki history ka table.
    - `KhataLedgerTableRow.tsx`: Ek individual transaction row jisme item list bhi hoti hai.
  - **Forms & Dialogs**:
    - `KhataAddCustomerDialog.tsx`: Naya customer add karne ka form.
    - `KhataTransactionForm.tsx`: 'Payment Mila' ya 'Udhaar Diya' ki entry karne ke liye form.
    - `KhataReminderDialog.tsx`: WhatsApp par udhaar ka reminder bhejne ka dialog.

## 🛠 Core Features & Workflow

### 1. Customer Management
- **List & Status**: Customers ki list show hoti hai. Agar kisi ka due baki hai toh colored amount aata hai.
- **Add & Delete**: Context state trigger karke naya grahak jod sakte hain, aur trash icon se use delete kar sakte hain (delete karne par confirmation aati hai).

### 2. Khata Ledger Dialog
Jab kisi customer par click karte hain, toh ek full-screen / large dialog khulta hai (`KhataLedgerContainer`). Iske andar:
- **Action Buttons**:
  - **Payment Mila (Cash In)** & **Udhaar Diya (Credit Out)**: State `transactionMode` set karta hai jo form (`KhataTransactionForm`) ko render karta hai.
  - **Reminder (WhatsApp)**: `KhataReminderDialog` open karta hai. Data `KhataPrintUtils` se generate hota hai.
  - **Thermal Print**: Custom print view generate karne ke liye `KhataPrintUtils.ts` call hota hai.

## 🧠 State Management & API
- **TanStack Query (React Query)**: Data fetching (`useListCustomers`, `useGetCustomer`) aur Mutations API layer se connected hain.
- **KhataContext**: Search inputs, dialog open/close states sab Context me rakhe gaye hain (e.g., `setCustomerSearch`, `setIsAddCustomerOpen`). Isse child components ekdum independent rehte hain.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:
1. **PDF Export**: `KhataPrintUtils.ts` me naya function banakar PDF export logic dala ja sakta hai.
2. **Bulk Reminder**: `KhataCustomerListHeader.tsx` me ek button banakar list iteration ki ja sakti hai.
3. **Transaction Edit/Delete**: `KhataLedgerTableRow.tsx` me edit/delete menu aasaani se add kiya ja sakta hai bina kisi doosre component ko effect kiye.

## 📌 Summary for Quick Handover
- Architecture ekdum "AI-Friendly" hai. Kisi specific cheez ko theek karne ke liye bas us ek chhoti file ko AI ko pass karein.
- Hardcoded data aur colors centralized hain (`KhataConstants.ts` & `khata.css`).
- State globally `KhataContext.tsx` se aati hai.
