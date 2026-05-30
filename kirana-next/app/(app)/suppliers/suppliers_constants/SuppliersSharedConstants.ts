/**
 * SuppliersConstants.ts — Single Source of Truth for all static data in the Suppliers module.
 *
 * WHY THIS FILE EXISTS:
 * All hardcoded strings, labels, and message templates are centralized here.
 * Tomorrow, when a backend API replaces this data, only THIS file changes.
 * UI components remain untouched.
 *
 * WHAT'S HERE:
 *  1. Fallback strings
 *  2. UI Labels (transaction modes)
 *  3. Toast messages (all API success/error feedback)
 *  4. Confirmation dialog messages
 *  5. WhatsApp reminder message builder
 */

// ─── 1. Fallbacks ───────────────────────────────────────────────────────────────

/** Displayed as shop name on thermal bills when settings API has no shopName. */
export const SUPPLIER_SHOP_NAME_FALLBACK = "Smart Kirana Store";

// ─── 2. UI Labels ──────────────────────────────────────────────────────────────

/** Display labels for the two transaction modes, used on buttons and form headers. */
export const TX_MODE_LABELS = {
  payment: "Payment Mila",
  credit: "Udhaar Diya",
} as const;

/** Form title labels shown inside SuppliersTransactionForm based on active mode. */
export const TX_FORM_TITLES = {
  payment: "Payment Entry",
  credit: "Udhaar Entry",
} as const;

/** Field label for the description input, changes based on transaction mode. */
export const TX_DESCRIPTION_LABELS = {
  payment: "Note",
  credit: "Item / Reason",
} as const;

// ─── 3. Toast Messages ─────────────────────────────────────────────────────────

/** Toast messages shown after API mutations complete (success or error). */
export const SUPPLIER_TOASTS = {
  deleteSuccess: "Supplier delete ho gaya",
  deleteError: "Supplier delete nahi hua",
  createSuccess: "Supplier add hua",
  txPaymentSuccess: "Payment recorded",
  txCreditSuccess: "Udhaar added",
} as const;

// ─── 4. Confirmation Dialog Messages ───────────────────────────────────────────

/**
 * Builds the browser confirm() message for deleting a supplier.
 * @param name - The supplier's name
 */
export function buildDeleteConfirmMessage(name: string): string {
  return `"${name}" delete karna chahte hain?`;
}

// ─── 5. WhatsApp Reminder Message Builder ──────────────────────────────────────

/**
 * Builds the WhatsApp reminder message text for a supplier.
 * @param supplierName - The supplier's name
 * @param totalDue     - The outstanding balance amount
 * @param shopName     - The shop's name (from settings or fallback)
 */
export function buildSupplierReminderMessage(
  supplierName: string,
  totalDue: number,
  shopName: string
): string {
  return `Namaste ${supplierName} Ji,\n\nAapka balance ₹${totalDue.toFixed(2)} pending hai.\n\nKripya jaldi payment kar dein.\n\nThank you\n${shopName}`;
}

/**
 * Builds the WhatsApp deep-link URL for a supplier phone number and message.
 * @param phone   - Raw phone string (digits extracted internally)
 * @param message - The pre-built reminder message
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/91${digits}?text=${encodeURIComponent(message)}`;
}
