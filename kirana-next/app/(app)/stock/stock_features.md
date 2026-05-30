# Smart Kirana Store - Stock Module Documentation

Yeh document `Smart Kirana Store` application ke **Stock (Inventory Management)** module ki detailed architectural aur functional information provide karta hai. Iska main purpose ek clear context dena hai taaki developers aur AI easily changes kar sakein.

## 📁 Directory Structure & Architecture

Stock module `app/(app)/stock` directory me hai. Current architecture **Micro-Modularization & Client Components** par based hai, jahan har file ek single responsibility handle karti hai aur extreme isolation provide karti hai.

- **`page.tsx`**: Main entry point jo `StockProvider` (Context) ke andar `StockMainLayout` ko render karta hai.
- **`error.tsx`**: Next.js native error boundary specifically for the stock module.
- **`loading.tsx`**: Next.js native loading skeleton state for the stock module.
- **`stock.css`**: Stock module ke specific UI variables (jaise status colors, stock levels, preview boxes) yahan define hote hain. **(Strictly No Inline Colors)**

### 🧩 `stock_components/`

Yahan inventory manage karne wale saare micro-components hain:

#### 1. Data & State Management (Single Source of Truth)
- **`StockTypes.ts`**: Saare TypeScript interfaces aur types.
- **`StockConstants.ts`**: Static configurations (Units, Filters, Modes) aur labels.
- **`StockUtils.ts`**: Pure functions for data formatting aur defaults.
- **`StockContext.tsx`**: React Context Provider for managing module state (Search, Filter, Modals, Pagination) and API mutations. Prevents prop drilling and bloated parent components.

#### 2. Layout & UI Components
- **`StockMainLayout.tsx`**: Coordinates all UI components into a single view.
- **`StockHeader.tsx`**: Page title aur primary action buttons (Purchase, Naya Product).
- **`StockStatsGrid.tsx`**: 4 dynamic cards (Total Variants, Khula Items, Quick Billing, Low/Out).
- **`StockSearchBar.tsx` & `StockFilterBar.tsx`**: Inputs for filtering lists.
- **`StockMainTable.tsx` & `StockTableRow.tsx`**: Detailed desktop view of products.
- **`StockMobileList.tsx` & `StockMobileCard.tsx`**: Responsive mobile view of products.
- **`StockPagination.tsx`**: Component for managing paginated data.
- **`StockBadge.tsx`**: Stock ki current status (OK, Low, Out) dikhane wala component.

#### 3. Forms & Dialogs
- **`StockProductCreator.tsx`**: Enterprise-level "Naya Product" builder (Name, Unit, Buy, Sell) with advanced options.
- **`StockLivePreview.tsx`**: Live Margin Preview card shown inside creator/edit dialogs.
- **`StockExtraVariantRow.tsx`**: Sub-component for adding extra packs inside the creator.
- **`StockPurchaseDialog.tsx`**: "Purchase Entry" ka form for adding stock.
- **`StockEditVariantDialog.tsx`**: Existing product variant ko edit karne ka form.
- **`StockUnitSelector.tsx`**: Specialized dropdown for selecting units.

## 🛠 Core Features & Workflow

### 1. Smart Product Dashboard
- **Top Stats**: Ek nazar me dukaan ka haal bataane ke liye 4 dynamic cards.
- **Search & Filter**: Naam/shortcut se turant search aur 1-click filters.
- **Responsive Layout**: Desktop pe detail table aur mobile me neat cards.

### 2. Enterprise-Level "Naya Product"
- **Auto-wiring Magic**: User bas unit choose kare (jaise "1kg Packet" ya "Kilogram"), aur backend ke liye Base Unit (gram), Base Quantity (1000), aur Selling Mode automatically wire-up ho jate hain. No manual math!
- **Live Margin Preview**: Rate daalte hi margin % calculate hota hai. Agar sell price buy price se kam ho toh "Loss" warning (via `--stock-preview-loss-bg` css variable) trigger hoti hai.
- **Advanced Options**: Brand, Category, Expiry, MRP, Stock, aur Low Stock Alert chhupa ke rakhe jate hain.
- **Extra Packs**: Ek hi baar me multiple sizes ("500g Packet" aur "1kg Packet") create karein.

### 3. Consistency in Editing
- Edit form me bhi ab wahi **Stock Quantity**, **Low Stock Alert**, aur **MRP** ke options shamil hain jo Create time pe milte hain.
- Display Units ko edit karne pe backend ke base-units auto-calculate ho jate hain.

### 4. Purchase Entry
- Maal aane par purane rate ya naye rate pe stock entry karne ka 2-click form.
- Khata/Supplier attach karne ka option aur auto base-unit conversion show karta hai.

## 🧠 State Management & API
- **Context API (`StockContext.tsx`)**: Global state bloat ko rokne ke liye har module apna isolated Context Provider (jaise `BillingContext`, `StockContext`) use karta hai. Is wajah se components directly Context use karke lightweight rehte hain.
- **TanStack Query**: Data fetch aur mutations (`@/lib/api`) ke throw optimistic invalidate hote hain, jisse lists aur dashboard immediately refresh hote hain bina page reload kiye.
- **Data Shape**: Stock UI hamesha display unit dikhata hai, lekin backend me logic strictly `stockInBaseUnit` aur `baseQuantity` pe focus karta hai taaki reporting aur stock deduction perfectly work kare.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me aap ya AI isme naye features banana chahein:
1. **Bulk Upload (Excel/CSV)**: Nayi dukaan setup karne ke liye ek saath 500+ products Excel se import karne ka feature.
2. **Stock History / Movement Log**: Ek aisi report jo dikhaye ki kis tareekh ko kitna stock kharida gaya aur kitna becha gaya.
3. **Master Product Edit**: Filhal variant level properties easily edit hoti hain. Master product info update karne ka interface.

## 📌 Summary for Quick Handover
- **AI-Friendly Codebase**: The extreme isolation means AI will rarely hallucinate or break other files. Each feature (like the Pagination, SearchBar, Creator) has its very own file.
- **Mobile First**: Dialogs aur Lists dono chhote phone screens aur large desktops par smooth kaam karte hain.
- **No Inline Colors**: Tailwind ke arbitrary colors hata ke `stock.css` me semantically naam diye gaye hain.
- **Zero-Math for User**: User kabhi 5000g enter nahi karta agar use 5kg stock dalna ho. Woh hamesha "5" daalta hai aur system usko "5000g" me automatically convert karta hai.
