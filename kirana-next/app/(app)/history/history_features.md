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

### 2.1. `BillHistoryList`
**File:** `history_components/BillHistoryList.tsx`
- Yeh component saare bills ko fetch karta hai (`useListBills` hook ka use karke).
- **Search Bar:** Real-time search by `id` ya `customerName`.
- **Card UI:** Mobile-first design me har ek bill ek tappable card ki tarah dikhta hai jisme amount, date, payment mode aur customer name hota hai.

### 2.2. `BillDetailsDialog`
**File:** `history_components/BillDetailsDialog.tsx`
- Jab kisi bill par click hota hai, toh yeh dialog open hota hai.
- Isme bill ke saare items listed hote hain.
- **Return Logic:** Har item ke samne ek input box hota hai, jisme maximum purchased quantity tak ki value daali ja sakti hai.
- **Total Refunds:** Automatically calculate hota hai.
- **Success Screen:** Return confirm hone ke baad ek success screen aati hai jisme "WhatsApp" aur "Print" ke options hote hain.

## 3. Data Flow & State Management

### 3.1. Returning Items (`storeReturnBillItems` in `store.ts`)
- **Stock Adjustment:** Jab bhi koi item return hota hai, uski `quantityToReturn` utni base unit quantity wapas product stock me add ho jati hai (`stockInBaseUnit + stockDelta`).
- **Khata Adjustment:** Agar original bill `khata` (Udhaar) mode par tha, toh total refund amount customer ke `totalDue` me se deduct ho jata hai aur unke ledger me ek "Payment/Refund" transaction ki entry add ho jati hai.
- **Daily Metrics:** Return date (original bill date) par based sales aur profit dono report se minus ho jate hain.

## 4. UI & Styling (CSS & Design Tokens)
- Is module me `history.css` ka use kiya gaya hai jisme `@app/color_code.md` ke hisaab se colors mapping ki gayi hai:
  - `.history-returned-item`: Muted text (Color: `#6B7280`)
  - `.history-refund-amount`: Destructive text (Color: `#E53535`)
- Baki components Tailwind CSS ka standard use karte hain (jaise `text-destructive`, `text-muted-foreground`).

## 5. WhatsApp & Print Utility
- **Print Receipt:** Ek naye browser window (`window.open`) me HTML table generate hoti hai. Isme original bill, returns (strikethrough ke sath), aur updated total dikhaya jata hai.
- **WhatsApp Share:** `encodeURIComponent` ka use karke ek text-based invoice banaya jata hai aur `https://wa.me/` link ke zariye customer ko message bheja jata hai. Phone number explicitly success screen par maanga jata hai ya blank chhodne par default WhatsApp app contact selection dikhata hai.

---
**Summary:** History module business workflow ka ek crucial hissa hai jo ensure karta hai ki returns ke baad inventory aur accountancy (Udhaar) humesha accurate rahein.
