# Smart Kirana Store - Billing Module Documentation

Yeh document `Smart Kirana Store` application ke **Billing / POS (Point of Sale)** module ki detailed architectural aur functional information provide karta hai. Iska main purpose ek clear context dena hai taaki future me modifications aur feature enhancements aasani se kiye ja sakein bina kisi KT (Knowledge Transfer) ke.

## 📁 Directory Structure & Architecture

Billing module `app/(app)/billing` directory me sthit hai aur yeh poori tarah se Client-side (`"use client"`) state-driven module hai.

- **`page.tsx`**: Main entry point. Yeh layout manage karta hai (Desktop ke liye two-column grid aur Mobile ke liye `MobileBillingView`), aur `use-billing.ts` hook se saara state receive karke components ko pass karta hai.
- **`billing.css`**: Billing module ke custom UI variables yahan define hote hain.
- **`billing_components/`**: Yeh folder sabhi isolated child components aur utility hooks store karta hai:
  - `use-billing.ts`: Core state management hook.
  - `ProductGrid.tsx` & `ProductCard.tsx`: Products ko render aur filter karne ka logic.
  - `CartPanel.tsx` & `CartItemRow.tsx`: Current bill ka UI (Subtotal, GST, Discount, Checkout).
  - `CustomerPicker.tsx` & `KhulaPicker.tsx`: Customer select karne aur loose item (khula) ki quantity pick karne ke dialogs.
  - `WhatsAppDialog.tsx` & `whatsapp-utils.ts`: Bill generation ke baad WhatsApp par message bhejna aur thermal print nikalne ke utils.
  - `MobileBillingView.tsx`: Mobile devices ke liye tabbed UI (Products vs Cart).

## 🛠 Core Features & Workflow

### 1. Product Grid & Search
- **Smart Search**: Dukandaar products ko naam, category, brand, ya **Shortcuts/Barcodes** (e.g. `att`, `chi`) type karke jaldi dhoondh sakta hai.
- **Filters**: Products ko alag-alag filters (All, Khula, Fixed, Variant, Bora, Low Stock, In Stock) ke basis pe dekha ja sakta hai.
- **Quick Select (Top Products)**: Jo items zyada bikte hain un par "Top" ka badge aata hai aur wo list me pehle dikhte hain.

### 2. Cart & Billing Panel
- **Calculations**: `subtotal`, `discount`, `taxableValue`, aur `gstAmount` real-time me calculate hote hain.
- **GST Support**: Ek checkbox hai "GST" add karne ke liye, jiske saath 5%, 12%, 18%, 28% ka dropdown diya gaya hai.
- **Payment Modes**:
  - **Cash** & **UPI**: Default fast modes.
  - **Khata**: Agar Khata select kiya hai, toh Customer select karna mandatory (required) ho jata hai.
- **Customer & WhatsApp**: 'CustomerPicker' se existing customer select kar sakte hain, ya directly 10-digit number enter kar sakte hain jispe bill banne ke baad automatic WhatsApp invoice link chala jaye.

### 3. Add to Cart Mechanism
- **Fixed/Packet items**: Ek baar click karne par direct 1 quantity cart me add ho jati hai.
- **Khula Items (Loose)**: Jab dukandaar kisi 'khula' item (jaise chini, chawal) par click karta hai, toh `KhulaPicker` popup khulta hai jisme weight (e.g., 250g, 500g, 1kg) select karne ka option aata hai.

### 4. Checkout & Post-Billing Actions
- Jab "Bill Karo" par click hota hai:
  - `useCreateBill` mutation ke through API call hoti hai.
  - Success par cart reset ho jati hai aur related queries (Dashboards, Products) invalidate/refresh hoti hain.
  - Customer ke WhatsApp par message bhej diya jata hai (`buildWhatsAppMessage`).
  - Thermal Printer connect hone par automatically receipt print ka function call hota hai (`printThermalBill`).

## 🧠 State Management (`use-billing.ts`)
- Yeh file is module ka "Brain" hai. React Query (TanStack Query) se data fetch hota hai (`useListProducts`, `useListCustomers`).
- Saara cart modification (`updateQty`, `removeFromCart`, `addKhula`, `addFixed`), total calculations, aur API triggers issi ek hook me rakhe gaye hain taaki UI components (CartPanel, ProductGrid) dumb / presentational rahein.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:

1. **Barcode Scanner Integration**: Keyboard listener banakar physical barcode scanner ka input capture karke directly cart me item add kiya ja sakta hai.
2. **Offline Mode Support**: Abhi ye online API pe dependent hai. IndexedDB lagakar offline bil banne par sync-queue banai ja sakti hai.
3. **Advanced Customer Creation**: Abhi existing customer select hota hai. `CustomerPicker` me ek "+ New Customer" ka dialog modal add karke on-the-fly customer register kiya ja sakta hai.
4. **Dynamic Offers**: Buy 1 Get 1 (BOGO) ya specific product pe discount logic `use-billing.ts` ke calculation pipeline me inject kiya ja sakta hai.

## 📌 Summary for Quick Handover
- UI do hisso me bati hai: Left side me `ProductGrid` aur right side me `CartPanel`. (Mobile par yeh Tabs me badal jaata hai).
- Logic ko UI se alag rakhne ke liye `use-billing.ts` ka prayog kiya gaya hai.
- Bill generation ke baad WhatsApp invoice aur Thermal Print ka flow already set hai (`whatsapp-utils.ts` dekhein).
- Kisi bhi calculation me badlaav karna ho (jaise GST calculation ka tarika), toh direct `use-billing.ts` me changes karein.
