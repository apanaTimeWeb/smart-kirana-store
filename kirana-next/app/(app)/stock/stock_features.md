# Smart Kirana Store - Stock Module Documentation

Yeh document `Smart Kirana Store` application ke **Stock (Inventory Management)** module ki detailed architectural aur functional information provide karta hai. Iska main purpose ek clear context dena hai taaki developers aur AI easily changes kar sakein.

## 📁 Directory Structure & Architecture

Stock module `app/(app)/stock` directory me hai.

- **`page.tsx`**: Main entry point jo `ProductList` component ko render karta hai.
- **`stock.css`**: Stock module ke specific UI variables (jaise status colors, icon colors) yahan define hote hain.
- **`stock_components/`**: Yahan inventory manage karne wale saare components hain:
  - `ProductList.tsx`: Main table jo sabhi variants, stock level aur rates dikhati hai. Isme search, filter aur pagination shamil hai.
  - `ProductCreator.tsx`: "Naya Product" add karne ka dialog. Isme product detail ke sath multiple variants add karne ka option hai.
  - `PurchaseDialog.tsx`: "Purchase Entry" ka form, jahan existing variant me additional stock aur naya purchase rate add kiya ja sakta hai.
  - `EditVariantDialog.tsx`: Kisi existing product variant ko edit karne ka form.
  - `StockBadge.tsx`: Table me stock ki current status (OK, Low, Out) dikhane wala chota UI component.
  - `utils.ts` & `types.ts`: Conversion, formatting aur interface definitions (jaise base unit conversion calculations).

## 🛠 Core Features & Workflow

### 1. Product Master Dashboard (`ProductList.tsx`)
- **Top Stats**: Ek nazar me dukaan ka haal bataane ke liye 4 cards hain:
  - Total Variants
  - Khula Items (Loose items)
  - Quick Billing Items (Jo billing me jaldi add hone chahiye)
  - Low/Out of Stock Items
- **Smart Filters & Search**: Aap product ko naam ya shortcut se search kar sakte hain. Saath hi quick filters (All, Out, Low, In Stock, Khula, Bora/Wholesale, Quick) lagaye ja sakte hain.
- **Table Data**: Har row me Product Name, Variant, Selling Mode (Khula, Variant, Fixed), Conversion (e.g., 1 packet = 5 kg), Current Stock, aur Rates (Purchase & Selling) hote hain.

### 2. Naya Product Add Karna (`ProductCreator.tsx`)
Jab "Naya Product" button par click hota hai:
- **Product Info**: Naam, Category, Brand, Keywords, aur Shortcut pucha jata hai.
- **Selling Type**: 
  - *Khula*: Jise gram/kg ya ml/litre me becha jata hai.
  - *Fixed Pack*: Jiska ek fixed packet hota hai.
  - *Multiple Variant*: Ek hi product ke alag-alag sizes (jaise 100g, 250g, 500g).
- **Variant Details**: Stock hamesha "Base Unit" (jaise gram, ml, piece) me save hota hai. Form me Base Qty, Purchase Rate, Selling Rate, aur Low Stock Alert set karne ke options hain. "Quick" checkbox tick karne se woh item billing dashboard pe prominently dikhega.

### 3. Purchase Entry (`PurchaseDialog.tsx`)
Jab stock khatam hone lagta hai aur naya maal aata hai:
- "Purchase Entry" button click karein.
- Searchable dropdown se product variant select karein.
- Quantity daalein aur (optional) Naya Purchase Rate update karein.
- "Stock Add Karein" par click karte hi API ke through current stock me utni quantity add ho jati hai.

## 🧠 State Management & API
- **TanStack Query**: Data fetch (`useListProducts`) aur mutations (`useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`, `useAddPurchaseEntry`) `@/lib/api` se handle hote hain.
- **Optimistic Invalidation**: Koi bhi naya product ya purchase entry aane par query invalidate hoti hai, jisse Dashboard aur Stock List dono apne aap refresh ho jate hain bina page reload kiye.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:

1. **Bulk Upload**: Excel ya CSV se ek saath hazaron products add karne ka feature.
2. **Bulk Upload (Excel/CSV)**: Nayi dukaan setup karne ke liye ek saath 500+ products Excel se import karne ka feature.
3. **Stock History / Movement Log**: Ek aisi report jo dikhaye ki kis tareekh ko kitna stock kharida gaya (Purchase Entry) aur kitna becha gaya (Billing). Abhi siraf current stock pata chalta hai.
4. **Supplier Management**: Purchase entry ke waqt ye record karna ki maal kis wholesaler (supplier) se aaya hai.

## 📌 Summary for Quick Handover
- Khula/Loose item ka flow base unit (gram/ml) pe dependent hai, isliye calculation ka khass dhyan `utils.ts` aur API level pe rakha gaya hai.
- UI me Next.js ke server components ka nahi balki React ke Client Components (`"use client"`) ka zyadatar use hua hai.
