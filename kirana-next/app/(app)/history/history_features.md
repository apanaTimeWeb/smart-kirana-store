# Smart Kirana Store - History Module Documentation

Yeh document `Smart Kirana Store` application ke **History & Returns** module ki complete architectural aur functional details provide karta hai. Iska main purpose purane bills ko dekhna aur usme se specific items ko return karke stock aur khata ko adjust karna hai.

## 1. Module Overview
**Path:** `app/(app)/history`
History module dukandar ko allow karta hai:
- Purane saare bills ki list dekhna.
- Bill No. ya Customer Name se search karna.
- Kisi bhi bill par click karke uski details (items, total, payment mode) dekhna.
- Items ki return quantity daalkar unhe return karna.
- Updated (Refunded) bill ko Thermal Printer par print karna.
- Updated bill customer ko WhatsApp par bhejna.

## 2. Key Components

### 2.1. `HistoryContext.tsx`
- Is module ka apna private state store.
- Yeh `useListBills` ko call karta hai, aur `selectedBill`, `isDialogOpen` ka state maintain karta hai jisse prop drilling puri tarah se khatam ho jati hai.

### 2.2. `HistoryBillList.tsx`
- Yeh component saare bills ki list dikhata hai.
- **Card UI:** Mobile-first design me har ek bill ek tappable card ki tarah dikhta hai. Is component me data `HistoryContext` se aata hai.

### 2.3. `HistoryBillDetailsDialog.tsx`
- Jab kisi bill par click hota hai, toh yeh dialog open hota hai. Context se `selectedBill` milta hai.
- Isme bill ke saare items listed hote hain aur **Return Logic** hota hai.

### 2.4. `HistoryPrintUtils.ts` & `HistoryWhatsAppUtils.ts`
- **Thermal Print Logic:** HTML invoice generator function `printHistoryReceipt` alag utility me extract kiya gaya hai.
- **WhatsApp Logic:** `sendHistoryWhatsAppBill` jo ki invoice formatting aur URL generation karta hai, woh bhi alag utility me rakha gaya hai taaki Dialog component bloat na ho.

## 3. Data Flow & State Management

### 3.1. Returning Items (`storeReturnBillItems` in `store.ts`)
- **Stock Adjustment:** Jab bhi koi item return hota hai, uski `quantityToReturn` utni base unit quantity wapas product stock me add ho jati hai (`stockInBaseUnit + stockDelta`).
- **Khata Adjustment:** Agar original bill `khata` (Udhaar) mode par tha, toh total refund amount customer ke `totalDue` me se deduct ho jata hai aur unke ledger me ek "Payment/Refund" transaction ki entry add ho jati hai.
- **Daily Metrics:** Return date (original bill date) par based sales aur profit dono report se minus ho jate hain.

## 4. UI & Styling (CSS & Design Tokens)
- Is module me `history.css` ka use kiya gaya hai jisme saare colors CSS variables ke roop me define kiye gaye hain taaki theme independence bani rahe:
  - `--history-returned-item`, `--history-refund-amount`
  - `--history-success-bg`, `--history-success-text`
- Ab components me hardcoded Tailwind colors ki jagah in variables ka use ho raha hai.

## 5. WhatsApp & Print Utility
- **Print Receipt:** Ab yeh logic `HistoryPrintUtils.ts` me hai. Ek naye browser window (`window.open`) me HTML table generate hoti hai. 
- **WhatsApp Share:** Ab yeh logic `HistoryWhatsAppUtils.ts` me hai. `encodeURIComponent` ka use karke ek text-based invoice banaya jata hai aur `https://wa.me/` link ke zariye customer ko message bheja jata hai.

---
**Summary:** History module business workflow ka ek crucial hissa hai jo ensure karta hai ki returns ke baad inventory aur accountancy (Udhaar) humesha accurate rahein.
