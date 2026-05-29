# Smart Kirana Store - Stock Module Documentation

Yeh document `Smart Kirana Store` application ke **Stock (Inventory Management)** module ki detailed architectural aur functional information provide karta hai. Iska main purpose ek clear context dena hai taaki developers aur AI easily changes kar sakein.

## 📁 Directory Structure & Architecture

Stock module `app/(app)/stock` directory me hai.

- **`page.tsx`**: Main entry point jo `ProductList` component ko render karta hai.
- **`stock.css`**: Stock module ke specific UI variables (jaise status colors, stock levels, preview boxes) yahan define hote hain. **(Strictly No Inline Colors)**
- **`stock_components/`**: Yahan inventory manage karne wale saare components hain:
  - `ProductList.tsx`: Main table aur mobile-first cards jo sabhi variants, stock level aur rates dikhate hain. Isme smart search, quick filter buttons aur pagination shamil hai.
  - `ProductCreator.tsx`: Enterprise-level "Naya Product" builder. Ye sirf 5 fields (Name, Unit, Buy, Sell) se pura variant auto-wire karta hai. Isme "Advanced Options" (Brand, Keywords, Stock Quantity, Low Stock Alert, MRP, Expiry, Extra Packs) ka accordion bhi hai.
  - `PurchaseDialog.tsx`: "Purchase Entry" ka form, jahan kisi bhi variant me additional stock aur naya purchase rate/khata add kiya ja sakta hai.
  - `EditVariantDialog.tsx`: Kisi existing product variant ko edit karne ka form. Ye form exactly `ProductCreator` ki styling aur layout (mobile-first, variables-driven) ko follow karta hai.
  - `StockBadge.tsx`: Table aur cards me stock ki current status (OK, Low, Out) dikhane wala chota UI component.
  - `utils.ts` & `types.ts`: Base unit conversions, formatters, aur draft state definitions (e.g., converting display units like 1.5 Carton back to base units smoothly).

## 🛠 Core Features & Workflow

### 1. Smart Product Dashboard (`ProductList.tsx`)
- **Top Stats**: Ek nazar me dukaan ka haal bataane ke liye 4 dynamic cards (Total Variants, Khula Items, Quick Billing, Low/Out).
- **Search & Filter**: Naam/shortcut se turant search aur 1-click filters (All, Out, Low, In Stock, Khula, Bora, Quick).
- **Responsive Layout**: Desktop pe detail table aur mobile me neat cards jisme zaroori metrics visible rehte hain.

### 2. Enterprise-Level "Naya Product" (`ProductCreator.tsx`)
- **Auto-wiring Magic**: User bas unit choose kare (jaise "1kg Packet" ya "Kilogram"), aur backend ke liye Base Unit (gram), Base Quantity (1000), aur Selling Mode automatically wire-up ho jate hain. No manual math!
- **Live Margin Preview**: Rate daalte hi margin % calculate hota hai. Agar sell price buy price se kam ho toh "Loss" warning (via `--stock-preview-loss-bg` css variable) trigger hoti hai.
- **Advanced Options**: Brand, Category, Expiry, MRP, Stock, aur Low Stock Alert (in display units!) chhupa ke rakhe jate hain jab tak zaroorat na ho.
- **Extra Packs**: Agar aapko ek hi baar me "500g Packet" aur "1kg Packet" add karna hai, toh aap extra rows generate kar sakte hain. Har row ka apna alag buy price, sell price, stock, alert, aur MRP hota hai.

### 3. Consistency in Editing (`EditVariantDialog.tsx`)
- Edit form me bhi ab wahi **Stock Quantity**, **Low Stock Alert**, aur **MRP** ke options shamil hain jo Create time pe milte hain.
- Display Units ko edit karne pe backend ke base-units auto-calculate ho jate hain, taaki galti ka chance na rahe.

### 4. Purchase Entry (`PurchaseDialog.tsx`)
- Maal aane par purane rate ya naye rate pe stock entry karne ka 2-click form.
- Khata/Supplier attach karne ka option aur auto base-unit conversion show karta hai "Stock base me add hoga".

## 🧠 State Management & API
- **TanStack Query**: Data fetch aur mutations (`@/lib/api`) ke throw optimistic invalidate hote hain, jisse lists aur dashboard immediately refresh hote hain bina page reload kiye.
- **Data Shape**: Stock UI hamesha display unit dikhata hai, lekin backend me logic strictly `stockInBaseUnit` aur `baseQuantity` pe focus karta hai taaki reporting aur stock deduction perfectly work kare.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:
1. **Bulk Upload (Excel/CSV)**: Nayi dukaan setup karne ke liye ek saath 500+ products Excel se import karne ka feature.
2. **Stock History / Movement Log**: Ek aisi report jo dikhaye ki kis tareekh ko kitna stock kharida gaya (Purchase Entry) aur kitna becha gaya (Billing). Abhi siraf current stock pata chalta hai.
3. **Master Product Edit**: Filhal variant level properties easily edit hoti hain. Master product info (Category, Brand) update karne ka interface.

## 📌 Summary for Quick Handover
- **Mobile First**: Dialogs aur Lists dono chhote phone screens aur large desktops par smooth kaam karte hain.
- **No Inline Colors**: Tailwind ke arbitrary colors (`bg-red-500`) hata ke `stock.css` me semantically naam diye gaye hain (`--stock-preview-loss-bg`), taaki dark/light themes future-proof rahein.
- **Zero-Math for User**: User kabhi 5000g enter nahi karta agar use 5kg stock dalna ho. Woh hamesha "5" daalta hai aur system usko "5000g" me automatically convert karta hai.
