export const ReportsConstants = {
  TEXTS: {
    TITLE: "Reports",
    SUBTITLE: "Sales, profit, khata aur stock ka live snapshot.",
    SELECT_DATE_RANGE: "Select date range",
    DATE_RANGE: "Date Range",
    DATE_RANGE_DESC: "Ek date ya range select karein.",
    DONE: "Done",
    NO_SALES: "Is period mein koi sales nahi.",
    NO_PROFIT: "Is period mein koi profit data nahi.",
    PENDING_UDHAAR: "Pending Udhaar",
    SEARCH_CUSTOMER: "Search by customer name or phone...",
    NO_UDHAAR: "Koi udhaar nahi, sab clear hai.",
    LOW_STOCK_ALERT: "Low Stock Alert",
    SEARCH_PRODUCT: "Search by product or category...",
    OUT_OF_STOCK: "Out of Stock",
    LEFT: "left",
    ALL_STOCK_GOOD: "Sab stock sahi level par hai.",
    PAGE: "Page",
    OF: "of",
  },

  QUICK_DATES: [
    { label: "Aaj", days: 0 },
    { label: "7 din", days: 6 },
    { label: "15 din", days: 14 },
    { label: "30 din", days: 29 },
  ],

  LABELS: {
    TOTAL_REVENUE: "Total Revenue",
    SELECTED_PERIOD_SALE: "Selected period sale",
    TOTAL_PROFIT: "Total Profit",
    ESTIMATED_MARGIN: "Estimated margin",
    PENDING_KHATA: "Pending Khata",
    CUSTOMER_DUES: "Customer dues",
    LOW_STOCK: "Low Stock",
    NEEDS_PURCHASE: "Needs purchase",
    SALES_TREND: "Daily Sales Trend",
    PROFIT_TREND: "Profit Trend",
  },

  /**
   * Pagination config — single source of truth.
   * Change ITEMS_PER_PAGE here to affect both the Khata and Stock lists.
   * Tomorrow, replace with a user-preference API call in this one place.
   */
  PAGINATION: {
    ITEMS_PER_PAGE: 5,
  },

  /**
   * Utility functions — pure, no React dependencies.
   * Centralised here so they can be replaced by backend-driven formatting
   * (e.g., locale-aware currency) without touching any UI component.
   */
  UTILS: {
    /**
     * Formats a numeric rupee value for display.
     * Example: 1500.75 → "Rs 1501"
     */
    formatMoney: (value: number): string => `Rs ${value.toFixed(0)}`,
  },
};
