# Smart Kirana Store — Billing Module Documentation

> **AI Context Document** — This file is the authoritative map for this module. Before making any change to the billing feature, read this file first. It tells you exactly which file to touch and why.

---

## 📁 Directory Structure

This module follows a strictly **Micro-Modularized, Feature-Based Architecture** designed for AI-friendliness and enterprise scale.

```
app/(app)/billing/
├── page.tsx                          ← Main entry: layout + BillingProvider wrapper
├── loading.tsx                       ← Next.js skeleton loading UI (Server Component)
├── error.tsx                         ← Next.js error boundary (Client Component)
├── billing.css                       ← ALL color tokens for this module (single source of truth for theming)
├── billing_features.md               ← THIS FILE — AI context & architecture map
│
├── billing_components/
│   ├── Cart/                         ← Everything related to the right-side cart panel
│   │   ├── BillingCartMainPanel.tsx
│   │   ├── BillingCartHeader.tsx
│   │   ├── BillingCartEmptyState.tsx
│   │   ├── BillingCartItemList.tsx
│   │   ├── BillingCartItemRow.tsx
│   │   ├── BillingCartAdvancedOptions.tsx
│   │   └── BillingCartFooter.tsx
│   │
│   ├── Products/                     ← Everything related to the left-side product grid
│   │   ├── BillingProductMainGrid.tsx
│   │   ├── BillingProductSearchBar.tsx
│   │   ├── BillingProductQuickPicks.tsx
│   │   ├── BillingProductFilters.tsx
│   │   ├── BillingProductList.tsx
│   │   └── BillingProductCard.tsx
│   │
│   ├── Customer/                     ← Customer selection logic
│   │   └── BillingCustomerSelector.tsx
│   │
│   ├── Dialogs/                      ← All modal windows
│   │   ├── BillingLooseItemQuantityPicker.tsx
│   │   └── BillingWhatsAppInvoiceDialog.tsx
│   │
│   └── Layout/                       ← Global responsive layout wrappers
│       └── BillingMobileResponsiveLayout.tsx
│
├── billing_context/
│   └── BillingContext.tsx            ← Brain: all state, API mutations, cart logic. Return value is heavily memoized.
│
├── billing_constants/
│   └── BillingSharedConstants.ts     ← Central data: types + hardcoded UI options (PAYMENT_MODES, GST_RATES, etc.)
│
└── billing_utils/
    ├── BillingSharedUtils.ts         ← Pure UI formatters, calculation helpers
    └── BillingWhatsAppUtils.ts       ← WhatsApp integration & thermal print helpers
```

---

## 🧠 State Management: `billing_context/BillingContext.tsx`

**One file rules all state.** Every component pulls data from `useBilling()` — zero prop drilling. The return object is strictly memoized to prevent massive re-render chains across the micro-folders.

### What lives in context:
| State | Type | Purpose |
|---|---|---|
| `cart` | `CartItem[]` | All items currently in the bill |
| `search` | `string` | Product search query |
| `filter` | `BillingFilter` | Active product filter chip |
| `discount` | `number` | Manual discount in rupees |
| `paymentMode` | `BillInputPaymentMode \| ""` | Cash / UPI / Khata |
| `selectedCustomerId` | `string` | For Khata mode |
| `quickPhone` | `string` | Optional WhatsApp number (non-customer) |
| `enableGST` | `boolean` | GST toggle |
| `gstRate` | `number` | GST % (from GST_RATES constant) |
| `khulaProduct` | `Product \| null` | Triggers quantity picker dialog |
| `whatsappBillData` | `BillData \| null` | Triggers post-checkout WhatsApp dialog |
| `mobileTab` | `"products" \| "cart"` | Mobile tab switcher |
| `billSuccess` | `boolean` | Shows success animation briefly |

### Derived values (computed, not stored):
- `subtotal`, `taxableValue`, `gstAmount`, `finalAmount`, `cartCount`
- `filteredProducts` (memoized from filter + search + products)
- `quickProducts` (memoized top-8 quickSelect items)

### Persistence:
Cart state is auto-saved to `localStorage` under key `"billing_draft_state"`. On page load, it restores automatically.

---

## 📦 Centralized Data: `billing_constants/BillingSharedConstants.ts`

**Single source of truth for all hardcoded data.** When the backend replaces these with API calls tomorrow, only this one file changes. All TS types are derived from these literal arrays.

| Export | Type | Purpose |
|---|---|---|
| `BILLING_FILTER_OPTIONS` | `const` array | Filter chip data (id + label). *Note: The 'Bora' filter was renamed to 'Bulk' to support `CARTON`, `BORA`, and `TIN` seamlessly.* |
| `BillingFilter` | derived type | Union of all filter ids |
| `PAYMENT_MODES` | `const` array | `[{id, label}]` for Cash, UPI, Khata |
| `GST_RATES` | `const` tuple | `[5, 12, 18, 28]` |
| `PRESETS_GRAM` | `const` tuple | Quantity presets for gram-based khula items |
| `PRESETS_ML` | `const` tuple | Quantity presets for ml-based khula items |
| `PRESETS_PCS` | `const` tuple | Quantity presets for piece-based khula items |
| `MODE_LABEL` | `Record` | Display labels for selling modes (`khula`, `fixed`, `variant`, `wholesale`) |

### Seamless Support for Expanded Stock Units
Thanks to the abstraction of `baseUnit` and `sellingMode` from the Stock module:
- **`LITRE`** items automatically use the Khula Keypad (because `sellingMode="khula"`) and display in `ml` / `Litre` using `PRESETS_ML`.
- **`CARTON` & `TIN`** items are automatically classified under the "Bulk" (`wholesale`) filter and treated as whole units during quick-add.
| `CartItem` | type | Shape of one cart line item |
| `BillData` | type | Shape of a completed bill (for WhatsApp/print) |

---

## 🎨 Theming: `billing.css`

All colors are defined as CSS variables here. To port this module to another project, only change this file.

### Full CSS Variable Reference

| Variable | Purpose | Light Value |
|---|---|---|
| `--billing-primary` | Primary accent color | `hsl(var(--primary))` |
| `--billing-primary-foreground` | Text on primary bg | `hsl(var(--primary-foreground))` |
| `--billing-primary-bg` | Primary background (buttons, active states) | `hsl(var(--primary))` |
| `--billing-primary-border` | Hover/active card & filter borders | `hsl(var(--primary))` |
| `--billing-muted-bg` | Muted background | `hsl(var(--muted))` |
| `--billing-muted-text` | Secondary/placeholder text | `hsl(var(--muted-foreground))` |
| `--billing-card-bg` | Card backgrounds | `hsl(var(--card))` |
| `--billing-background-bg` | Page/input backgrounds | `hsl(var(--background))` |
| `--billing-foreground-text` | Primary text | `hsl(var(--foreground))` |
| `--billing-destructive-text` | Error/remove text | `hsl(var(--destructive))` |
| `--billing-border` | All borders | `hsl(var(--border))` |
| `--billing-error-icon-bg` | Error boundary icon circle background | `hsl(0 62% 95%)` |
| `--billing-error-icon-text` | Error boundary SVG icon color | `hsl(0 62% 45%)` |
| `--billing-error-body-text` | Error boundary description text | `hsl(var(--muted-foreground))` |
| `--billing-product-price` | Selling price on product card | `hsl(var(--primary))` |
| `--billing-product-in-cart-bg` | Card background when in cart | `hsl(174 25% 95%)` |
| `--billing-product-in-cart-border` | Card ring when in cart | `hsl(var(--primary))` |
| `--billing-stock-ok` | In stock text | `hsl(142 60% 28%)` |
| `--billing-stock-low` | Low stock text | `hsl(38 90% 42%)` |
| `--billing-stock-out` | Out of stock text | `hsl(var(--destructive))` |
| `--billing-cart-bg` | Cart panel card background | `hsl(var(--card))` |
| `--billing-cart-footer-bg` | Cart footer area background | `hsl(var(--muted) / 0.30)` |
| `--billing-cart-success-border` | Cart panel border on bill success | `hsl(142 60% 60%)` |
| `--billing-cart-success-icon` | CheckCircle icon on success | `hsl(142 60% 28%)` |
| `--billing-cart-badge-bg` | Cart count badge background | `hsl(var(--primary))` |
| `--billing-cart-total-text` | Total amount text | `hsl(var(--primary))` |
| `--billing-picker-required-border` | Customer selector border when Khata & empty | `hsl(38 90% 52%)` |
| `--billing-picker-required-bg` | Customer selector bg when required & empty | `hsl(38 90% 95%)` |
| `--billing-payment-cash-*` | Cash payment mode chip colors | (green tones) |
| `--billing-payment-upi-*` | UPI payment mode chip colors | (teal tones) |
| `--billing-payment-khata-*` | Khata payment mode chip colors | (amber tones) |
| `--billing-whatsapp-btn-bg` | WhatsApp send button background | `hsl(142 72% 50%)` |
| `--billing-whatsapp-btn-hover` | WhatsApp send button hover | `hsl(142 72% 43%)` |
| `--billing-whatsapp-icon` | MessageCircle icon color | `hsl(142 72% 50%)` |
| `--billing-quick-bg` | Quick picks chip background | `hsl(38 90% 95%)` |
| `--billing-khula-chip-bg` | Khula preset chip background | `hsl(174 25% 95%)` |

---

## 🚀 Future Enhancements

| Feature | Where to touch | Notes |
|---|---|---|
| **Backend API for constants** | `billing_constants/BillingSharedConstants.ts` only | Replace hardcoded arrays with API calls; zero UI changes needed |
| **Barcode Scanner** | `billing_components/Products/BillingProductSearchBar.tsx` | Add `keydown` listener for scanner input (fast typing) |
| **Offline Mode** | `billing_context/BillingContext.tsx` | Replace API calls with IndexedDB; add sync-queue on reconnect |
| **Dynamic Offers (BOGO)** | `billing_context/BillingContext.tsx` → `handleCheckout` / `addFixed` | Inject discount logic before cart total calculation |
| **Multi-printer support** | `billing_utils/BillingWhatsAppUtils.ts` | Add printer profile selection before `printThermalBill()` |
| **Split payment** | `billing_components/Cart/BillingCartAdvancedOptions.tsx` + `billing_context/BillingContext.tsx` | Add partial cash + UPI fields; extend `BillData` type |

---

## 📌 Quick Handover Summary

- **Micro-Modular Layout**: Components split into specific domain folders (`billing_components/Cart/`, `billing_components/Products/`, etc.).
- **Brain**: `billing_context/BillingContext.tsx` — heavily memoized state controller. No prop drilling anywhere.
- **Data**: `billing_constants/BillingSharedConstants.ts` — all constants. One place to swap in API data tomorrow.
- **Theming**: `billing.css` — all CSS variables. Copy this folder to any project and theme from here only.
- **Post-checkout flow**: WhatsApp message → `billing_utils/BillingWhatsAppUtils.ts`. Thermal print → `billing_utils/BillingWhatsAppUtils.ts`.
