# Smart Kirana Store - Billing Module Documentation

Yeh document `Smart Kirana Store` application ke **Billing / POS (Point of Sale)** module ki detailed architectural aur functional information provide karta hai. Iska main purpose ek clear context dena hai taaki future me modifications aur feature enhancements aasani se kiye ja sakein bina kisi KT (Knowledge Transfer) ke.

## 📁 Directory Structure & Architecture

Billing module `app/(app)/billing` directory me sthit hai aur yeh poori tarah se Client-side (`"use client"`) state-driven module hai.
Is module ko strict **"one file, one component, one functionality"** pattern se design kiya gaya hai jisse reusability aur maintainability aasan ho jaye.

- **`page.tsx`**: Main entry point. Yeh layout manage karta hai (Desktop ke liye two-column grid aur Mobile ke liye `BillingMobileResponsiveLayout`), aur `BillingStateHook.ts` hook se saara state receive karke components ko pass karta hai.
- **`billing.css`**: Billing module ke sabhi custom UI variables yahan define hote hain. Isme saare colors aur theme mappings hain taaki kisi aur project me copy-paste karke reuse kiya ja sake.
- **`billing_components/`**: Yeh folder sabhi isolated child components aur utility files ko store karta hai, har ek ka ek specific aur descriptive naam hai:

### Logic & Utilities
- `BillingStateHook.ts`: Core state management hook (with `localStorage` persistence).
- `BillingTypes.ts`: TypeScript types and interfaces used across the module.
- `BillingUtils.ts`: General formatting, price calculation, and preset logic.
- `BillingWhatsAppUtils.ts`: Bill generation ke baad WhatsApp par message bhejna aur thermal print nikalne ke utils.

### Product Selection Components
- `BillingProductMainGrid.tsx`: Main container for products.
- `BillingProductSearchBar.tsx`: Search input.
- `BillingProductQuickPicks.tsx`: Horizontal scroll of top products.
- `BillingProductFilters.tsx`: Filter chips (All, Khula, Fixed, etc.).
- `BillingProductList.tsx`: Grid of product cards and skeleton loaders.
- `BillingProductCard.tsx`: Individual product card.

### Cart & Billing Panel Components
- `BillingCartMainPanel.tsx`: Main container for the cart UI.
- `BillingCartHeader.tsx`: Contains title, badge, and customer selector.
- `BillingCartEmptyState.tsx`: Empty cart view placeholder.
- `BillingCartItemList.tsx`: Container for cart items list.
- `BillingCartItemRow.tsx`: Individual cart item row.
- `BillingCartAdvancedOptions.tsx`: Subtotal, Discount, GST, Payment Mode, and quick WhatsApp input.
- `BillingCartFooter.tsx`: Total amount and checkout button.

### Popups & Dialogs
- `BillingCustomerSelector.tsx`: Customer select karne (searchable combobox + add new).
- `BillingLooseItemQuantityPicker.tsx`: Khula (loose) items ki quantity pick karne ka dialog.
- `BillingWhatsAppInvoiceDialog.tsx`: Checkout ke baad quick WhatsApp invoice dialog.
- `BillingMobileResponsiveLayout.tsx`: Mobile devices ke liye tabbed UI (Products vs Cart).

## 🛠 Core Features & Workflow

### 1. Product Grid & Search
- **Smart Search**: Dukandaar products ko naam, category, brand, ya **Shortcuts/Barcodes** (e.g. `att`, `chi`) type karke jaldi dhoondh sakta hai.
- **Filters**: Products ko alag-alag filters (All, Khula, Fixed, Variant, Bora, Low Stock, In Stock) ke basis pe dekha ja sakta hai.
- **Quick Select (Top Products)**: Jo items zyada bikte hain un par "Top" ka badge aata hai aur wo list me pehle dikhte hain.

### 2. Cart & Billing Panel
- **Calculations**: `subtotal`, `discount`, `taxableValue`, aur `gstAmount` real-time me calculate hote hain.
- **GST Support**: Ek checkbox hai "GST" add karne ke liye, jiske saath 5%, 12%, 18%, 28% ka dropdown diya gaya hai.
- **Payment Modes**:
  - **Cash** (Default) & **UPI**: Default fast modes.
  - **Khata**: Agar Khata select kiya hai, toh Customer select karna mandatory (required) ho jata hai.

### 3. Add to Cart Mechanism
- **Fixed/Packet items**: Product card par pehli baar click karne par 1 quantity add hoti hai. Dobara click karne se uski quantity increase (+1) hoti hai. Cart se item ko remove karne ke liye, card ke upar bane "Red Cross (X)" icon par click karna hota hai.
- **Khula Items (Loose)**: Jab dukandaar kisi 'khula' item (jaise chini, chawal) par click karta hai, toh `BillingLooseItemQuantityPicker` popup khulta hai jisme weight (e.g., 250g, 500g, 1kg) select karne ka option aata hai.

### 4. Checkout & Post-Billing Actions
- Jab "Bill Karo" par click hota hai:
  - `useCreateBill` mutation ke through API call hoti hai.
  - Success par cart reset ho jati hai aur related queries (Dashboards, Products) invalidate/refresh hoti hain.
  - Customer ke WhatsApp par message bhej diya jata hai (`buildWhatsAppMessage`).
  - Thermal Printer connect hone par automatically receipt print ka function call hota hai (`printThermalBill`).

## 🧠 State Management (`BillingStateHook.ts`)
- Yeh hook is module ka "Brain" hai. React Query (TanStack Query) se data fetch hota hai.
- **Auto Save (Persistence)**: Cart ka poora data browser ke `localStorage` me save hota rehta hai. Agar user galti se page refresh kar de ya kisi aur page (jaise Dashboard) par switch karke wapas aaye, toh uska cart automatically restore ho jata hai.
- Saara cart modification (`updateQty`, `removeFromCart`, `addKhula`, `addFixed`), total calculations, aur API triggers issi ek hook me rakhe gaye hain taaki baaki UI components presentational rahein.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:

1. **Barcode Scanner Integration**: Keyboard listener banakar physical barcode scanner ka input capture karke directly cart me item add kiya ja sakta hai.
2. **Offline Mode Support**: Abhi ye online API pe dependent hai. IndexedDB lagakar offline bil banne par sync-queue banai ja sakti hai.
3. **Dynamic Offers**: Buy 1 Get 1 (BOGO) ya specific product pe discount logic `BillingStateHook.ts` ke calculation pipeline me inject kiya ja sakta hai.

## 📌 Summary for Quick Handover
- UI do hisso me bati hai: Left side me `BillingProductMainGrid` aur right side me `BillingCartMainPanel`. (Mobile par yeh Tabs me badal jaata hai).
- Logic ko UI se alag rakhne ke liye `BillingStateHook.ts` ka prayog kiya gaya hai (jisme persistent cart data ki kshamata shamil hai).
- Bill generation ke baad WhatsApp invoice aur Thermal Print ka flow already set hai (`BillingWhatsAppUtils.ts` dekhein).
- **Theming & Reusability**: Sabhi components me styling ke liye `billing.css` se variables (e.g., `var(--billing-primary-bg)`) use kiye gaye hain. Standard Tailwind color utilities hata diye gaye hain taaki is folder ko kisi bhi naye project me paste kiya ja sake.
