// KhataConstants.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single Source of Truth for ALL hardcoded UI strings and configuration in the
// Khata module. When the backend replaces these with API calls, only this file
// needs to change — zero UI component edits required.
// ─────────────────────────────────────────────────────────────────────────────

export const KhataConstants = {
  SHOP_NAME_DEFAULT: "Smart Kirana Store",

  MESSAGES: {
    PAYMENT_SUCCESS: "Payment recorded",
    CREDIT_SUCCESS: "Udhaar added",
    CUSTOMER_ADDED: "Customer add hua",
    CUSTOMER_DELETED: "Customer delete ho gaya",
    CUSTOMER_DELETE_FAILED: "Customer delete nahi hua",
    CONFIRM_DELETE_PREFIX: "\"",
    CONFIRM_DELETE_SUFFIX: "\" delete karna chahte hain?",
  },

  LABELS: {
    // ── Page Header ────────────────────────────────────────────────
    PAGE_TITLE: "Khata (खाता)",
    CUSTOMERS_COUNT_SUFFIX: "Customers",

    // ── Customer List Actions ──────────────────────────────────────
    PAYMENT_MILA: "Payment Mila",
    UDHAAR_DIYA: "Udhaar Diya",
    REMINDER: "Reminder",
    THERMAL_PRINT: "Thermal Print",
    ADD_CUSTOMER: "Add Customer",

    // ── Add Customer Dialog ────────────────────────────────────────
    ADD_CUSTOMER_DIALOG_TITLE: "Naya Customer Add Karein",
    FIELD_NAME: "Naam",
    FIELD_PHONE: "Phone Number",
    FIELD_ADDRESS: "Address (Optional)",

    // ── Ledger Dialog ─────────────────────────────────────────────
    LEDGER_DIALOG_TITLE: "Khata Ledger",

    // ── Ledger Header ─────────────────────────────────────────────
    TOTAL_DUE: "Total Due",

    // ── Ledger Table ──────────────────────────────────────────────
    TRANSACTIONS: "Transactions",
    DATE: "Date",
    DETAILS: "Details",
    DESCRIPTION: "Description",
    AMOUNT: "Amount",
    BALANCE: "Balance",
    AMT_BAL_MOBILE: "Amt / Bal",
    NO_TRANSACTIONS: "No transactions yet",

    // ── Transaction Form ──────────────────────────────────────────
    PAYMENT_ENTRY: "Payment Entry",
    UDHAAR_ENTRY: "Udhaar Entry",
    AMOUNT_INR: "Amount (₹)",
    NOTE: "Note",
    ITEM_REASON: "Item / Reason",
    SAVE_ENTRY: "Save Entry",
    SAVING: "Saving...",

    // ── Search Bars ───────────────────────────────────────────────
    SEARCH_PLACEHOLDER: "Naam ya phone...",
    SEARCH_ITEMS_PLACEHOLDER: "Search items or details...",

    // ── Customer List Item ────────────────────────────────────────
    CLEAR_DUE: "Clear",

    // ── Empty State ───────────────────────────────────────────────
    NO_CUSTOMERS: "Koi customer nahi mila",
    NO_CUSTOMERS_SUB: "Pehla customer add karein",

    // ── Loading ───────────────────────────────────────────────────
    LOADING: "Loading...",

    // ── Reminder Dialog ───────────────────────────────────────────
    WHATSAPP_REMINDER_TITLE: "WhatsApp Reminder",
    REMINDER_TEXT_ONLY: "Text Only",
    REMINDER_BILL_TEXT: "Bill + Text",
    CANCEL: "Cancel",
  },

  WHATSAPP_TEMPLATE: {
    HEADER: "Khata Statement",
    PLEASE_PAY: "Kripya jaldi payment kar dein.",
    THANK_YOU: "Thank You!",
    THERMAL_BILL_TITLE: "Khata Ledger",
  },
};
