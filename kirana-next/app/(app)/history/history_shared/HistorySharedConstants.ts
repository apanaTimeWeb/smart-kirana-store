export const HISTORY_MESSAGES = {
  EMPTY_BILL_LIST: "Koi bill nahi mila.",
  EMPTY_ITEM_LIST: "Koi item nahi mila",
  RETURN_INFO_BANNER: "Kisi item ko return karne ke liye uski 'Return Qty' box me number daalein. Stock aur Khata (agar applicable hai) auto-adjust ho jayega.",
  RETURN_SUCCESS_TITLE: "Return Successful",
  RETURN_SUCCESS_DESC: "Stock aur Khata (agar applicable) adjust ho gaye hain.",
  SEARCH_BILLS_PLACEHOLDER: "Search by Bill # or Customer Name...",
  SEARCH_ITEMS_PLACEHOLDER: "Search items...",
  LOADING_HISTORY: "Loading history data...",
  ERROR_HEADING: "Failed to load History",
  ERROR_DESC: "There was a problem loading the bill history. Please try again.",
  FULLY_RETURNED_LABEL: "Fully Returned",
  ALREADY_RETURNED_PREFIX: "already returned",
  MAX_QTY_PLACEHOLDER_PREFIX: "Max",
  RETURN_QTY_LABEL: "Return Qty:",
  ORIGINAL_TOTAL_LABEL: "Original Total:",
  REFUND_AMOUNT_LABEL: "Refund Amount:",
  WHATSAPP_NUMBER_PLACEHOLDER: "WhatsApp Number (e.g. 9876543210)",
};

export const HISTORY_LABELS = {
  PRINT: "Print",
  WHATSAPP: "WhatsApp",
  CLOSE: "Close",
  CONFIRM_RETURN: "Confirm Return",
  SELECT_RETURN_QTY: "Select Return Qty",
  PROCESSING: "Processing...",
  SEND_UPDATED_BILL: "Send Updated Bill",
  PRINT_THERMAL_RECEIPT: "Print Thermal Receipt",
  PURCHASED_ITEMS: "Purchased Items",
  BILL_DETAILS: "Details",
};

/**
 * Default unit label shown when a bill item has no unit field set.
 * Change here to affect all item rows and print/WA receipts simultaneously.
 */
export const HISTORY_DEFAULT_UNIT = "pcs" as const;

/**
 * Payment mode badge styles keyed by paymentMode string from the API.
 * Uses CSS variables so all colors are controlled from history.css.
 */
export const HISTORY_PAYMENT_MODE_STYLES: Record<string, string> = {
  khata: "text-[var(--history-warning-text)] border-[var(--history-warning-border)] bg-[var(--history-warning-bg)]",
  upi: "text-[var(--history-primary-text)] border-[var(--history-primary-border)] bg-[var(--history-primary-bg)]",
  cash: "text-[var(--history-positive-text)] border-[var(--history-positive-border)] bg-[var(--history-positive-bg)]",
};
