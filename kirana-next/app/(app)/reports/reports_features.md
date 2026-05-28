# Smart Kirana Store - Reports Module Documentation

Yeh document `Smart Kirana Store` application ke **Reports & Analytics** module ki detailed architectural aur functional information provide karta hai. Iska main purpose application ke data visualization aur business metrics ke logic ko samajhna hai.

## 📁 Directory Structure & Architecture

Reports module `app/(app)/reports` directory me sthit hai.

- **`page.tsx`**: Main entry point jahan poora dashboard layout, date picker aur sabhi child components render hote hain.
- **`reports.css`**: Reports dashboard ke specific UI colors (jaise charts aur cards ke theme colors) yahan define hote hain.
- **`reports_components/`**: Yahan specific visualization aur list components hain:
  - `StatCard.tsx`: Top level summary dikhane ke liye reusable card component (Total Revenue, Total Profit, Pending Khata, Low Stock).
  - `SalesChart.tsx`: `recharts` library ka use karke Daily Sales Trend dikhane wala Bar Chart.
  - `ProfitChart.tsx`: `recharts` ka use karke Profit Trend dikhane wala Line Chart.
  - `PendingKhataList.tsx`: Udhaar (dues) wale customers ki list search aur pagination ke sath.
  - `LowStockList.tsx`: Jin products ka stock khatam hone wala hai ya ho gaya hai, unki list search aur pagination ke sath.

## 🛠 Core Features & Workflow

### 1. Global Date Filter (Time Period Selection)
- Page ke top-right me ek Date Range picker hai.
- By default yeh pichle **14 dino** (2 weeks) ka data dikhata hai.
- **Quick Filters**: Calendar popover me "Aaj", "7 din", "15 din", aur "30 din" ke quick selection buttons hain.
- Date select karne par API calls (`useGetSalesReport`, `useGetProfitReport`) naye dates ke sath trigger hoti hain aur pura page naya data render karta hai.

### 2. High-Level Metrics (Stat Cards)
4 mukhya (main) business metrics highlight kiye gaye hain:
1. **Total Revenue**: Selected time period me total kitne rupaye ki sale hui.
2. **Total Profit**: Us sale par estimated profit kitna hua (aur profit margin percentage).
3. **Pending Khata**: Total kitne rupaye ka udhaar market me pending hai aur kitne customers ka baki hai.
4. **Low Stock**: Kitne items low stock alert par hain aur kitne bilkul "out of stock" ho chuke hain.

### 3. Data Visualizations (Charts)
- **Daily Sales Trend (Bar Chart)**: Har din ki sales ko bar chart ke roop me dikhata hai taaki peak sales day easily identify ho sake. Tooltips hover karne par exact amount dikhate hain.
- **Profit Trend (Line Chart)**: Har din ke profit ka trend dikhata hai (Smooth curve / Area chart) jisse business ki growth track ki ja sakti hai.

### 4. Actionable Lists
- **Pending Udhaar**: Jin customers ka udhaar baki hai unki list yahan dikhti hai. Isme ek search bar hai jisse customer ko naam ya phone number se turant dhunda ja sakta hai. Ye list 5 items per page ke hisaab se paginated hai.
- **Low Stock Alert**: Aise products jinki base quantity low stock threshold ke neeche chali gayi hai. Yahan bhi pagination aur search functionality di gayi hai taaki turant purchase order banaya ja sake.

## 🧠 State Management & API
- **TanStack Query Hooks**: Data fetching ke liye custom hooks (`useGetSalesReport`, `useGetProfitReport`, `useGetPendingKhataReport`, `useGetLowStockReport`) jo `@/lib/api` se aate hain, unka use hota hai.
- **Loading States**: Jab data fetch ho raha hota hai, toh charts aur lists ki jagah `Skeleton` loaders show hote hain jisse UI smooth lagta hai.

## 🚀 AI & Developer Context: Future Enhancements
Agar future me is module ko aur bada banana ho:

1. **Category Wise Sales (Pie Chart)**: Ek naya chart add kiya ja sakta hai jo bataye ki kis category (jaise Snacks, Oil, Dal) se sabse zyada revenue aa raha hai.
2. **Export to Excel/PDF**: Ek button jisse CA (Chartered Accountant) ko bhejne ke liye selected date range ki poori report CSV ya PDF format me download ho jaye.
3. **Top Customers List**: Aise customers ki list jinhone sabse zyada shopping ki hai taaki unhe special discount ya offers diye ja sakein.
4. **Expense Tracker Integration**: Agar future me dukan ke kharche (bijli bill, staff salary) track hote hain, toh unhe profit calculation se minus karke "Net Profit" dikhaya ja sakta hai.

## 📌 Summary for Quick Handover
- UI me `recharts` library ka heavily use hua hai charts banane ke liye, isliye chart components me changes karte waqt `recharts` ke docs (XAxis, YAxis, Tooltip) refer karna zaroori hai.
- Data presentation bilkul client-side (`"use client"`) state par dependent hai.
