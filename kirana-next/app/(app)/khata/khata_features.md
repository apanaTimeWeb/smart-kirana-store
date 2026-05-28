# Smart Kirana Store - Khata (Ledger) Module Documentation

Yeh document `Smart Kirana Store` application ke **Khata (Ledger / Udhaar)** module ki complete architectural aur functional details provide karta hai. Iska main purpose ek clear context dena hai taaki future me modifications aasani se kiye ja sakein bina kisi KT ke.

## 📁 Directory Structure & Architecture

Khata module `app/(app)/khata` directory me sthit hai.

- **`page.tsx`**: Main entry point jo sirf `CustomerList` component ko render karta hai.
- **`khata.css`**: Khata module ke specific UI variables aur styles yahan define kiye gaye hain.
- **`khata_components/`**: Yahan saare child components hain:
  - `CustomerList.tsx`: Sabhi customers ki list, search aur delete function.
  - `AddCustomerDialog.tsx`: Naya customer add karne ka form.
  - `KhataLedger.tsx`: Kisi specific customer ka poora hisaab-kitab aur actions (Print, Reminder, etc.).
  - `LedgerTable.tsx`: Transactions ki history aur running balance show karne wala table.
  - `TransactionForm.tsx`: 'Payment Mila' ya 'Udhaar Diya' ki entry karne ke liye form.
  - `ReminderDialog.tsx`: WhatsApp par udhaar ka reminder bhejne ka dialog.

## 🛠 Core Features & Workflow

### 1. Customer Management (`CustomerList.tsx`)
- **List & Status**: Customers ki list show hoti hai. Agar kisi ka due baki hai toh red me amount aata hai, warna green me "Clear" likha aata hai.
- **Search**: Naam ya phone number se search karne ki suvidha.
- **Add & Delete**: "+ Add Customer" button se naya grahak jod sakte hain, aur trash icon se use delete kar sakte hain (delete karne par confirmation aati hai).

### 2. Khata Ledger Dialog (`KhataLedger.tsx`)
Jab kisi customer par click karte hain, toh ek full-screen / large dialog khulta hai. Iske andar:
- **Header**: Customer ka naam, avatar, phone number aur **Total Due** highlight hota hai.
- **Action Buttons**:
  - **Payment Mila (Cash In)**: Jab customer paise deta hai, ispe click karke amount aur description (e.g., "Cash received") enter kar sakte hain.
  - **Udhaar Diya (Credit Out)**: Jab naya udhaar diya jata hai, toh uski manual entry ke liye.
  - **Reminder (WhatsApp)**: Ispe click karne par ek pre-filled WhatsApp message banta hai ("Namaste Ji, aapka balance ₹X pending hai..."). Customer ko seedhe message ya Bill ke sath message bhej sakte hain.
  - **Thermal Print**: Customer ki statement ka chota HTML based thermal receipt print nikalne ke liye. `window.open` aur `window.print` ka use hua hai custom CSS ke saath.

### 3. Ledger Table (`LedgerTable.tsx`)
- Yeh table transaction history dikhata hai.
- Har transaction me: Date, Description, Amount (+ for credit, - for payment), aur **Running Balance** show hota hai.
- Responsive design: Mobile ke liye table columns chhote ho jate hain aur Desktop pe poore dikhte hain.

## 🧠 State Management & API
- **TanStack Query (React Query)**: Data fetching (e.g., `useListCustomers`, `useGetCustomer`) aur Mutations (e.g., `useDeleteCustomer`) sab API layer (`@/lib/api`) se connected hain.
- **Optimistic/Auto Updates**: Jab koi transaction ya delete action hota hai, toh automatically queries invalidate hoti hain taaki list aur Dashboard summary apne aap refresh ho jayein.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:

1. **PDF Export**: Thermal print ke alawa PDF download ka option add kiya ja sakta hai jisme dukaan ka logo bhi ho.
2. **Bulk Reminder**: `CustomerList` me ek button jisse sabhi due customers ko ek click me WhatsApp reminder chala jaye.
3. **Transaction Edit/Delete**: Abhi shayad purani transaction edit/delete karne ka option nahi hai, ise `LedgerTable` me har row ke aage ek three-dot menu lagakar banaya ja sakta hai.
4. **Date Filtering**: Ledger me pichle mahine ka hisaab dekhne ke liye date range filter lagaya ja sakta hai.

## 📌 Summary for Quick Handover
- Code flow simple hai: `CustomerList` -> Click Customer -> Opens `KhataLedger` dialog -> View table or add transaction via `TransactionForm`.
- Thermal printing ka logic directly frontend pe HTML string banakar kiya gaya hai (`KhataLedger.tsx` line 47 ke aas-paas dekhein). Isme koi external library use nahi hui hai.
- Sab kuch client-side hai, isliye turant updates aur notifications (toast) milte hain.
