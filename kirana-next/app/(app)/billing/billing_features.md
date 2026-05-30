# Smart Kirana Store — Billing Module Documentation

> **AI Context Document** — This file is the authoritative map for this module. Before making any change to the billing feature, read this file first. It tells you exactly which file to touch and why.

---

## 📁 Directory Structure

```
app/(app)/billing/
├── page.tsx                          ← Main entry: layout + BillingProvider wrapper
├── loading.tsx                       ← Next.js skeleton loading UI (Server Component)
├── error.tsx                         ← Next.js error boundary (Client Component)
├── billing.css                       ← ALL color tokens for this module (single source of truth for theming)
├── billing_features.md               ← THIS FILE — AI context & architecture map
│
└── billing_components/
    │
    │── ── LOGIC & STATE ─────────────────────────────────────────────────
    ├── BillingContext.tsx             ← Brain: all state, API calls, derived values, cart logic
    ├── BillingTypes.ts               ← Central data: all types + hardcoded constants (PAYMENT_MODES, GST_RATES, etc.)
    ├── BillingUtils.ts               ← Pure utility functions: formatting, price calc, preset helpers
    ├── BillingWhatsAppUtils.ts       ← WhatsApp message builder + thermal print trigger
    │
    │── ── PRODUCT PANEL (left side) ─────────────────────────────────────
    ├── BillingProductMainGrid.tsx    ← Container: composes search + quick picks + filters + list
    ├── BillingProductSearchBar.tsx   ← Search input with Enter-to-add-first-product shortcut
    ├── BillingProductQuickPicks.tsx  ← Horizontal scroll strip of quickSelect=true products
    ├── BillingProductFilters.tsx     ← Filter chip row (All, Khula, Fixed, Variant, Bora, Low, In Stock)
    ├── BillingProductList.tsx        ← Product grid with skeleton loaders & empty state
    ├── BillingProductCard.tsx        ← Individual product card (in-cart ring, stock status, remove button)
    │
    │── ── CART PANEL (right side) ───────────────────────────────────────
    ├── BillingCartMainPanel.tsx      ← Container: composes header + item list + footer
    ├── BillingCartHeader.tsx         ← Cart title, item count badge, customer selector slot
    ├── BillingCartEmptyState.tsx     ← Empty cart illustration & prompt
    ├── BillingCartItemList.tsx       ← Scrollable list of cart item rows
    ├── BillingCartItemRow.tsx        ← One cart item: name, qty +/-, price, remove
    ├── BillingCartAdvancedOptions.tsx ← Subtotal, discount, GST toggle+rate, payment mode, WhatsApp phone
    ├── BillingCartFooter.tsx         ← Collapsible billing options + total + "Bill Karo" checkout button
    │
    │── ── DIALOGS & MOBILE ──────────────────────────────────────────────
    ├── BillingCustomerSelector.tsx   ← Combobox popover: search & select customer, add new inline
    ├── BillingLooseItemQuantityPicker.tsx ← Khula item dialog: preset qty chips + custom input
    ├── BillingWhatsAppInvoiceDialog.tsx   ← Post-checkout dialog: enter phone, send WhatsApp bill
    └── BillingMobileResponsiveLayout.tsx  ← Mobile tabbed UI switching between Products and Cart views
```

---

## 🧠 State Management: `BillingContext.tsx`

**One file rules all state.** Every component pulls data from `useBilling()` — zero prop drilling.

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
Cart state is auto-saved to `localStorage` under key `"billing_draft_state"`. On page load, it restores: cart, discount, paymentMode, selectedCustomerId, quickPhone, enableGST, gstRate.

---

## 📦 Centralized Data: `BillingTypes.ts`

**Single source of truth for all hardcoded data.** When the backend replaces these with API calls tomorrow, only this one file changes.

| Export | Type | Purpose |
|---|---|---|
| `BILLING_FILTER_OPTIONS` | `const` array | Filter chip data (id + label) |
| `BillingFilter` | derived type | Union of all filter ids |
| `PAYMENT_MODES` | `const` array | `[{id, label}]` for Cash, UPI, Khata |
| `GST_RATES` | `const` tuple | `[5, 12, 18, 28]` |
| `PRESETS_GRAM` | `const` tuple | Quantity presets for gram-based khula items |
| `PRESETS_ML` | `const` tuple | Quantity presets for ml-based khula items |
| `PRESETS_PCS` | `const` tuple | Quantity presets for piece-based khula items |
| `MODE_LABEL` | `Record` | Display labels for selling modes |
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

## ⚠️ Known Gotchas (Fixed)

> These issues were found during the enterprise audit and have been resolved. Documented here to prevent regression.

1. **`BillingMobileResponsiveLayout.tsx` — `"use client"` was missing.**
   This file calls `useBilling()` (a React Context hook) and renders `<button>` elements. In Next.js App Router, all files are Server Components by default. Without `"use client"`, the hook call would throw a Runtime Error. **Fixed: `"use client"` added as first line.**

2. **`--billing-primary-border` CSS variable was undefined.**
   Three components (`BillingProductCard`, `BillingProductFilters`, `BillingProductQuickPicks`) referenced `var(--billing-primary-border)` for hover states, but the variable was never declared in `billing.css`. This caused hover borders to silently render as nothing. **Fixed: variable declared in both `:root` and `.dark` in `billing.css`.**

3. **`error.tsx` used hardcoded Tailwind colors (`bg-red-100`, `text-red-600`, `text-gray-500`).**
   These violated theme independence — the error UI couldn't be themed from `billing.css`. **Fixed: replaced with `--billing-error-icon-bg`, `--billing-error-icon-text`, `--billing-error-body-text` CSS variables.**

4. **`BillingWhatsAppInvoiceDialog.tsx` used `text-green-500` for the MessageCircle icon.**
   The variable `--billing-whatsapp-icon` was already defined for this exact purpose. **Fixed: replaced with `text-[var(--billing-whatsapp-icon)]`.**

---

## 🚀 Future Enhancements

| Feature | Where to touch | Notes |
|---|---|---|
| **Backend API for constants** | `BillingTypes.ts` only | Replace hardcoded arrays with API calls; zero UI changes needed |
| **Barcode Scanner** | `BillingProductSearchBar.tsx` | Add `keydown` listener for scanner input (fast typing) |
| **Offline Mode** | `BillingContext.tsx` | Replace API calls with IndexedDB; add sync-queue on reconnect |
| **Dynamic Offers (BOGO)** | `BillingContext.tsx` → `handleCheckout` / `addFixed` | Inject discount logic before cart total calculation |
| **Multi-printer support** | `BillingWhatsAppUtils.ts` | Add printer profile selection before `printThermalBill()` |
| **Split payment** | `BillingCartAdvancedOptions.tsx` + `BillingContext.tsx` | Add partial cash + UPI fields; extend `BillData` type |

---

## 📌 Quick Handover Summary

- **Two-panel layout**: Left = `BillingProductMainGrid`, Right = `BillingCartMainPanel`. On mobile: tabs via `BillingMobileResponsiveLayout`.
- **Brain**: `BillingContext.tsx` — all state, cart logic, API mutations, localStorage persistence. No prop drilling anywhere.
- **Data**: `BillingTypes.ts` — all constants. One place to swap in API data tomorrow.
- **Theming**: `billing.css` — all CSS variables. Copy this folder to any project and theme from here only.
- **Post-checkout flow**: WhatsApp message → `BillingWhatsAppUtils.ts::buildWhatsAppMessage`. Thermal print → `BillingWhatsAppUtils.ts::printThermalBill`.
