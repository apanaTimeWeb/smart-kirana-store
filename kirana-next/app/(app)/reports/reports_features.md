# Smart Kirana Store - Reports Module Documentation

Yeh document `Smart Kirana Store` application ke **Reports** module ki complete architectural aur functional details provide karta hai. Ise AI-Friendly aur micro-modular banaya gaya hai.

## 📁 Directory Structure & Micro-Modular Architecture

Reports module `app/(app)/reports` directory me sthit hai.

- **`page.tsx`**: Main entry point jo sirf `<ReportsProvider>` aur `<ReportsDashboardContainer>` render karta hai.
- **`loading.tsx`**: Default Next.js loading state jo CSS variables use karta hai.
- **`error.tsx`**: Next.js error boundary component.
- **`reports.css`**: Reports module ke UI variables, colors aur layout styles.
- **`reports_components/`**: Yahan micro-components hain:
  - **State & Data**:
    - `ReportsContext.tsx`: Global date range state (`dateRange`, `calOpen`) ko manage karta hai.
    - `ReportsConstants.ts`: Saare hardcoded texts, labels, aur dropdown presets yahan hain.
    - `ReportsTypes.ts`: Interfaces (e.g., `ReportsProduct`, `ReportsSalesData`).
  - **Dashboard Components**:
    - `ReportsDashboardContainer.tsx`: API fetch karta hai aur layout coordinate karta hai.
    - `ReportsHeader.tsx`: Title aur description.
    - `ReportsDatePicker.tsx`: Date selection popover.
    - `ReportsStatGrid.tsx`: Maps 4 stat cards.
    - `ReportsStatCard.tsx`: Individual summary metric card.
  - **Charts**:
    - `ReportsSalesChart.tsx`: Bar chart for sales.
    - `ReportsProfitChart.tsx`: Area chart for profit.
  - **Lists**:
    - `ReportsKhataContainer.tsx` & `ReportsKhataItem.tsx`: Pending khata list with search & pagination.
    - `ReportsStockContainer.tsx` & `ReportsStockItem.tsx`: Low stock list with search & pagination.
    - `ReportsPagination.tsx`: Shared pagination UI.

## 🛠 Core Features

### 1. Unified Date Range Filter
- Sirf ek jagah (`ReportsDatePicker`) se date range milti hai, jo Context ke through poore module pe apply hoti hai.

### 2. High-Level Metrics (Stat Cards)
- Total Revenue, Total Profit & Margin, Pending Khata aur Low Stock count ek nazar me dikhta hai.

### 3. Visual Charts
- **Sales Trend**: Daily sales ka comparison.
- **Profit Trend**: Margin aur profit flow visualize karta hai.

### 4. Actionable Lists
- **Pending Udhaar**: Kaunse customers se paise lene hain.
- **Low Stock**: Kya samaan khatam hone wala hai.

## 📌 Theme Independence
Is module me `var(--reports-primary)`, `var(--reports-card-bg)` jaise pure CSS variables use kiye gaye hain. JSX me koi tailwind specific color class nahi hai, taaki themer ko control mil sake.
4. **Expense Tracker Integration**: Agar future me dukan ke kharche (bijli bill, staff salary) track hote hain, toh unhe profit calculation se minus karke "Net Profit" dikhaya ja sakta hai.

## 📌 Summary for Quick Handover
- UI me `recharts` library ka heavily use hua hai charts banane ke liye, isliye chart components me changes karte waqt `recharts` ke docs (XAxis, YAxis, Tooltip) refer karna zaroori hai.
- Data presentation bilkul client-side (`"use client"`) state par dependent hai.
