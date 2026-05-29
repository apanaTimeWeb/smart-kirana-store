# Smart Kirana Store - Dashboard Documentation

Yeh document `Smart Kirana Store` application ke **Dashboard** module ki complete architectural aur functional details provide karta hai. Iska main purpose kisi bhi naye developer ya AI assistant ko ek comprehensive context dena hai taaki future me bina kisi Knowledge Transfer (KT) ke, aasani se modifications aur naye features add kiye ja sakein.

## 📁 Directory Structure & Architecture

Dashboard ka code `app/(app)/dashboard` directory ke andar maintain kiya gaya hai. Is module me Client-side rendering ka use kiya gaya hai (`"use client"`).

- **`page.tsx`**: Dashboard ka main entry point. Yeh saara logic handle karta hai, data ko aggregate karta hai, aur baaki child components ko props pass karta hai.
- **`dashboard.css`**: Dashboard ke specific CSS variables aur styles (e.g., colors, borders, backgrounds) ko define karta hai.
- **`loading.tsx`**: Next.js ka default loading state, jab tak dashboard render ho raha hota hai tab tak loader dikhane ke liye.
- **`dashboard_components/`**: Yahan saare child components hain jo dashboard me use hote hain:
  - `StatCard.tsx`: Metric cards ke liye reusable component (Sale, Profit, Khata, etc.).
  - `LowStockList.tsx`: Kam stock waale items ko list, search, aur paginate karne wala component.
  - `RecentBillsList.tsx`: Haal hi me banaye gaye bills ko list, search, aur paginate karne wala component.
  - `ExpiringSoonList.tsx`: Jaldi expire hone wale items ko list, search, aur paginate karne wala component.

## 🛠 Core Features & Components

### 1. Main Dashboard Page (`page.tsx`)
- **Data Source**: Abhi ke liye `data.json` se mock data fetch kar raha hai. (Future me API call replace hogi).
- **Data Aggregation**: Yahan calculations hoti hain:
  - **Today's Sale & Profit**: Aakhri din ke `salesReportData` aur `profitReportData` se fetch karta hai.
  - **Pending Khata**: Jin customers ka `totalDue > 0` hai, unka amount sum up hota hai.
  - **Low Stock Items**: Jo products apne `lowStockThreshold` se kam ya barabar hain, unko filter karta hai aur 'Out of Stock' (count = 0) alag calculate karta hai.
- Yeh page 5 `StatCard`, 1 `RecentBillsList`, 1 `LowStockList` aur 1 `ExpiringSoonList` component ko render karta hai.

### 2. StatCard Component (`StatCard.tsx`)
- Ek highly reusable, pure UI component hai.
- **Props**: `title`, `subtitle`, `value`, `note`, `icon`, aur CSS variable based color classes (`colorClass`, `bgClass`, `borderClass`, `iconColorClass`).
- 5 instances use hote hain dashboard me:
  - **आज की बिक्री (Today's Sale)**: IndianRupee icon ke sath.
  - **आज का मुनाफा (Today's Profit)**: TrendingUp icon ke sath.
  - **उधार बाकी (Pending Khata)**: BookOpen icon ke sath.
  - **कम स्टॉक (Low Stock Alert)**: AlertTriangle icon ke sath.
  - **एक्सपायरी अलर्ट (Expiring Soon)**: Clock icon ke sath.

### 3. Recent Bills List (`RecentBillsList.tsx`)
- **UI**: Haal ki bikri (Recent Bills) ki list dikhata hai. Card view me `ShoppingBag` icon ke sath ata hai.
- **Features**:
  - **Search**: Customer ke naam ya bill ID ke basis pe filter kar sakte hain. Default naam "Walk-in Customer" hota hai agar name missing ho.
  - **Pagination**: Ek baar me 5 items dikhata hai. Prev/Next buttons hain. Page switch hone par state update hoti hai.
  - **Payment Mode Badges**: Payment mode (Khata, UPI, Cash) ke basis par alag-alag color ki `Badge` dikhata hai. Iske colors bhi CSS variables se aate hain.

### 4. Low Stock List (`LowStockList.tsx`)
- **UI**: Kam stock wale products ko dikhata hai, taaki dukandaar ko inventory update karne me aasani ho.
- **Features**:
  - **Search**: Product ke naam ya category se item dhoondh sakte hain.
  - **Pagination**: 5 items per page show karta hai.
  - **Alerts**: Agar product ki stock `0` ho gayi hai toh usko red color me "Out of Stock" dikhata hai, warna "X unit left" dikhata hai. Item ka `lowStockThreshold` (Min value) bhi dikhta hai.
  - **Mock Data**: UI testing ke liye API (store.ts) me hardcoded dummy data add kiya gaya hai agar actual low stock items na ho.

### 5. Expiring Soon List (`ExpiringSoonList.tsx`)
- **UI**: Jaldi expire hone wale (agle 15 din me) products ki list dikhata hai.
- **Features**:
  - **Search**: Product ya variant ke naam se item dhoondh sakte hain.
  - **Pagination**: Ek baar me 5 items dikhata hai. Prev/Next buttons hain.
  - **Alerts**: Expired items par "Expired" ka tag aur kitne din baaki hain ye batata hai.
  - **Mock Data**: Agar koi item expiry ke kareeb nahi hai, toh UI visualization ke liye dummy hardcoded products inject kiye jate hain (via API layer).

## 🎨 Styling Approach
- **Tailwind CSS**: Utility classes ka mainly use hua hai. Shadcn UI (`Card`, `Input`, `Button`, `Badge`) library internally use ho rahi hai.
- **CSS Variables**: `dashboard.css` ke through custom colors define kiye gaye hain. Jaise `bg-[var(--dashboard-sale-bg)]` jisse theme change karne me easily consistency maintain hoti hai. Colors values design system se connected hain.

## 🚀 AI & Developer Context: Future Enhancements (Kya kya ho sakta hai)
Agar kal ko koi naya feature banana ho ya AI se code likhwana ho, toh yahan kuch ideas aur scope of improvements hain:

1. **Real API Integration**: Abhi `lib/data.json` use ho raha hai. Isko `useEffect` + `fetch` / `axios` ya Next.js App Router API fetch se replace karna padega. SWR ya React Query lagaya ja sakta hai state management ke liye.
2. **Date Range Filters**: Ek Global Date Picker add kiya ja sakta hai `page.tsx` me, jisse `StatCard` aur lists us timeframe ke according update hon.
3. **Interactive Charts**: Dashboard me "Aaj ka hisaab" ke neeche Recharts ya Chart.js use karke pichle 7 din ka sales vs profit graph dikhaya ja sakta hai.
4. **WebSocket / Real-time**: Agar naya bill banta hai POS se, toh dashboard auto-refresh ho without manual reload.
5. **Actionable Buttons**: Low Stock list me sidhe "Reorder" ka button ho, aur Recent bills me "View Invoice" ka action icon ho.

## 📌 Summary for Quick Handover
- Code `app/(app)/dashboard` folder me hai.
- Architecture simple hai: 1 Parent (`page.tsx`) aur multiple presentational/stateful children (`dashboard_components/`).
- Kisi bhi naye chart ya list ko banane ke liye `dashboard_components` me naya file create karein aur use `page.tsx` me grid system (`grid gap-4 md:grid-cols-2`) ke andar inject karein.
- Search aur pagination har list me locally (client-side) managed hai `useState` ki madad se. Jab actual API aayegi, toh ise server-side pagination se replace kiya ja sakta hai agar data bahut bada ho.
