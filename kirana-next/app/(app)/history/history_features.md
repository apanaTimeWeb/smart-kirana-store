# Smart Kirana Store — History Module Documentation

> **AI Context Document** — This file is the authoritative map for this module. Before making any change to the history feature, read this file first. It tells you exactly which file to touch and why.

---

## 📁 Directory Structure

```
app/(app)/history/
├── page.tsx                                  ← Main entry: layout + HistoryProvider wrapper (Server Component)
├── loading.tsx                               ← Next.js skeleton loading UI (Server Component)
├── error.tsx                                 ← Next.js error boundary (Client Component)
├── history.css                               ← ALL color tokens for this module (single source of truth for theming)
├── history_features.md                       ← THIS FILE — AI context & architecture map
│
└── history_components/
    │
    │── ── LOGIC & STATE ────────────────────────────────────────────────
    ├── HistoryTypes.ts                       ← Central data: all types + shared constants
    ├── HistoryContext.tsx                    ← Brain: bills API call, selectedBill, dialog open state
    │
    │── ── BILL LIST VIEW ───────────────────────────────────────────────
    ├── HistoryBillListContainer.tsx          ← Orchestrator: reads context, manages searchQuery, renders correct state
    ├── HistoryBillCard.tsx                   ← Single tappable bill row card (bill #, date, customer, amount, badge)
    ├── HistoryBillListEmptyState.tsx         ← Empty state UI (FileText icon + "Koi bill nahi mila")
    ├── HistorySearchFilter.tsx               ← Reusable search input (used in list + inside dialog)
    │
    │── ── BILL DETAILS DIALOG ──────────────────────────────────────────
    ├── HistoryBillDetailsDialog.tsx          ← Dialog shell: owns return flow state, composes sub-components
    ├── HistoryBillDetailsHeader.tsx          ← Dialog sticky header: bill #, date, customer, payment badge
    ├── HistoryBillDialogFooterActions.tsx    ← Footer button bar: Print / WhatsApp / Close / Confirm Return
    │
    │── ── RETURN FLOW ──────────────────────────────────────────────────
    ├── HistoryBillItemsReturnList.tsx        ← Slim orchestrator: composes the 3 return sub-components
    ├── HistoryReturnInfoBanner.tsx           ← AlertCircle info box explaining the return process
    ├── HistoryBillItemReturnRow.tsx          ← Single item row: name, qty, price, return input / "Fully Returned"
    ├── HistoryReturnRefundSummary.tsx        ← Original total + refund amount highlighted block
    │
    │── ── SUCCESS SCREEN ───────────────────────────────────────────────
    ├── HistoryBillReturnSuccessScreen.tsx    ← Post-return success UI: phone input, Send/Print/Close buttons
    │
    │── ── UTILITIES ────────────────────────────────────────────────────
    ├── HistoryPrintUtils.ts                  ← Pure function: generates thermal print HTML in a new window
    └── HistoryWhatsAppUtils.ts               ← Pure function: builds monospace invoice text + opens wa.me link
```

---

## 🧠 State Management: `HistoryContext.tsx`

**Module-scoped brain.** Every component reads from `useHistoryContext()` — zero prop drilling for shared state.

### What lives in context:
| State | Type | Purpose |
|---|---|---|
| `bills` | `HistoryBill[] \| undefined` | All bills fetched from API |
| `isLoadingBills` | `boolean` | API loading state |
| `settings` | `StoreSettings \| undefined` | Store settings (currency, shop name) |
| `currency` | `string` | Derived from settings, default `"Rs"` |
| `selectedBill` | `HistoryBill \| null` | Bill currently shown in the detail dialog |
| `setSelectedBill` | `fn` | Setter for selectedBill |
| `isDialogOpen` | `boolean` | Controls Dialog open/close |
| `setIsDialogOpen` | `fn` | Setter for isDialogOpen |
| `openBillDetails` | `fn(bill)` | Sets selectedBill + opens dialog in one call |

### What is NOT in context (intentionally local):
| State | Lives In | Why |
|---|---|---|
| `searchQuery` (list) | `HistoryBillListContainer` | Only consumed by one component |
| `returnQtys` | `HistoryBillDetailsDialog` | Return flow state; resets on every dialog open |
| `isSuccess` | `HistoryBillDetailsDialog` | Post-return UI toggle |
| `phoneNumber` | `HistoryBillDetailsDialog` | WhatsApp phone input |
| `searchQuery` (dialog) | `HistoryBillDetailsDialog` | Item search inside dialog only |

---

## 📦 Centralized Data: `HistoryTypes.ts`

**Single source of truth for all shared types and constants.** When the backend replaces these with API calls tomorrow, only this one file changes.

| Export | Kind | Purpose |
|---|---|---|
| `HistoryBill` | type alias | Re-export of `Bill` from `@/lib/api/types` for module-local convenience |
| `HistoryReturnQtys` | type alias | `Record<number, string>` — per-item return qty map (productId → qty string) |
| `HISTORY_DEFAULT_UNIT` | const | `"pcs"` — fallback unit label when item has no unit field |
| `HISTORY_PAYMENT_MODE_STYLES` | const record | Tailwind classes for payment mode badges (cash/upi/khata) keyed by paymentMode string |

---

## 🎨 Theming: `history.css`

All colors are defined as CSS variables in this file. To port this module to another project, only change this file.

### Full CSS Variable Reference

| Variable | Purpose |
|---|---|
| `--history-warning-text/border/bg` | Khata payment mode badge + warning states |
| `--history-primary-text/border/bg` | UPI badge, info banner, loading spinner, hover states |
| `--history-positive-text/border/bg` | Cash payment mode badge |
| `--history-destructive-text/border/bg` | Error states, "already returned" text, refund summary highlight |
| `--history-success-text/bg` | Return success screen icon + WhatsApp button hover |
| `--history-success-btn-bg/hover/text` | WhatsApp "Send Updated Bill" button (green) |
| `--history-returned-item` | Struck-through item text in thermal print receipt |
| `--history-refund-amount` | Refund line text in thermal print receipt |
| `--history-card-bg/text` | Bill card and dialog content backgrounds |
| `--history-muted-bg/text` | Secondary text, dialog header background, "Fully Returned" badge |
| `--history-border` | All dividers and card borders |

---

## 🔄 Data Flow: Bill Return Process

```
User taps HistoryBillCard
    → openBillDetails(bill) [HistoryContext]
        → setSelectedBill(bill) + setIsDialogOpen(true)
            → HistoryBillDetailsDialog renders

User enters return qty
    → handleQtyChange() [HistoryBillDetailsDialog]
        → setReturnQtys() → calculateTotalRefund() → hasReturns=true

User clicks "Confirm Return"
    → handleConfirmReturn() [HistoryBillDetailsDialog]
        → returnMutation.mutate({ billId, items })
            → onSuccess: setUpdatedBill(newBill) + setIsSuccess(true)
                → <HistoryBillReturnSuccessScreen /> renders

User clicks "Send Updated Bill" (WhatsApp)
    → sendHistoryWhatsAppBill(currentBill, phoneNumber, settings) [HistoryWhatsAppUtils]
        → opens wa.me link with monospace invoice text

User clicks "Print Thermal Receipt"
    → printHistoryReceipt(currentBill, currency, settings) [HistoryPrintUtils]
        → opens new window with HTML invoice, auto-triggers window.print()
```

### Backend Adjustment Logic (Server Side)
When a return is processed (`POST /bills/:id/return`):
- **Stock:** `returnedQty × baseUnit` added back to product stock
- **Khata:** If original bill was `khata` mode, refund amount deducted from customer `totalDue`, ledger entry added
- **Daily Metrics:** Sales and profit adjusted on the return date

---

## ⚠️ Known Gotchas

> These issues were resolved during the enterprise refactor. Documented here to prevent regression.

1. **`"use client"` is required on every component that uses hooks.**
   Next.js App Router treats all files as Server Components by default. Files using `useState`, `useEffect`, `useContext`, or event handlers (`onClick`) MUST have `"use client"` as their first line. All components in this module comply.

2. **`returnQtys` key is `productId` (number), not array index.**
   The return qty map uses `productId` as the key (not the item's position in the array). This ensures correctness when items are filtered/reordered by the search query inside the dialog.

3. **`updatedBill` overrides `selectedBill` for print/send after a return.**
   After a successful return, the API returns a new bill object (`newBill`) with updated `returnedQuantity` values. `HistoryBillDetailsDialog` stores this as `updatedBill` and uses `currentBill = updatedBill || selectedBill` for all print/send actions.

4. **WhatsApp uses `Rs` hardcoded in message body, not `currency` variable.**
   In `HistoryWhatsAppUtils.ts` line 62, the rate column uses `Rs ${item.unitPrice}` directly (not the `currency` parameter). This is a pre-existing behaviour; if the store uses a different currency symbol, `HistoryWhatsAppUtils.ts` needs to be updated.

---

## 🚀 Future Enhancements

| Feature | Where to Touch | Notes |
|---|---|---|
| **Backend API for constants** | `HistoryTypes.ts` only | Replace `HISTORY_PAYMENT_MODE_STYLES` with API-driven config |
| **Date range filter** | `HistoryBillListContainer.tsx` | Add date picker; filter in `filteredBills` useMemo |
| **Payment mode filter chip** | `HistoryBillListContainer.tsx` | Add filter state; filter in `filteredBills` useMemo |
| **Export bills to CSV** | New `HistoryExportUtils.ts` | Follow same pattern as Print/WhatsApp utils |
| **Partial return history** | `HistoryBillItemReturnRow.tsx` | Show full return history timeline, not just count |
| **Confirm dialog before return** | `HistoryBillDetailsDialog.tsx` | Add `AlertDialog` wrapper around `handleConfirmReturn` |

---

## 📌 Quick Handover Summary

- **Brain**: `HistoryContext.tsx` — all API calls and shared dialog state. Zero prop drilling.
- **Data**: `HistoryTypes.ts` — all shared types and constants. One place to swap API data tomorrow.
- **Theming**: `history.css` — all CSS variables. Copy this folder to any project and theme from here only.
- **Bill list**: `HistoryBillListContainer` → renders `HistoryBillCard` × N or `HistoryBillListEmptyState`.
- **Return flow**: `HistoryBillDetailsDialog` → owns state → composes `HistoryBillItemsReturnList` → which composes `HistoryReturnInfoBanner` + `HistoryBillItemReturnRow` × N + `HistoryReturnRefundSummary`.
- **Post-return**: `HistoryBillReturnSuccessScreen` → `HistoryPrintUtils` / `HistoryWhatsAppUtils`.
