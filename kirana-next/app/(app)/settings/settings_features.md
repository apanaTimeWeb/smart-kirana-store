# Smart Kirana Store — Settings Module Documentation

> **AI Session Map**: Yeh document Settings module ka complete architectural blueprint hai.
> Kisi bhi bug fix ya feature addition ke liye, neeche diye gaye "One File, One Component" map ko follow karein.
> Sirf relevant file provide karein — baaki kuch nahi tootega.

---

## 📁 Full Directory Structure

```
app/(app)/settings/
│
├── page.tsx                          ← Server Component entry point (no "use client")
├── loading.tsx                       ← Next.js native skeleton loader
├── error.tsx                         ← Next.js native error boundary
├── settings.css                      ← 🎨 SINGLE SOURCE OF TRUTH for all colors/tokens
│
└── settings_components/
    │
    ├── ── Data & Types ───────────────────────────────────────────────
    ├── SettingsTypes.ts              ← TypeScript types (DeviceType derived from SettingsConstants)
    ├── SettingsConstants.ts          ← ALL hardcoded data: texts, defaults, device types, mock sessions
    │
    ├── ── State (Context) ────────────────────────────────────────────
    ├── SettingsContext.tsx           ← Module-scoped React Context; holds form state + save logic
    │
    ├── ── Layout / Orchestrators ─────────────────────────────────────
    ├── SettingsDashboardContainer.tsx         ← Master layout; arranges all section cards
    ├── SettingsDashboardLoadingFallback.tsx   ← "Loading settings..." UI state
    ├── SettingsHeader.tsx                     ← Page title + subtitle
    ├── SettingsSaveAction.tsx                 ← "Save All Settings" button
    │
    ├── ── Dukaan Details Card ────────────────────────────────────────
    ├── SettingsShopDetails.tsx        ← Layout card; NO logic; composes the 5 inputs below
    ├── SettingsShopNameInput.tsx      ← ONLY: "Dukaan Ka Naam" input field
    ├── SettingsShopOwnerNameInput.tsx ← ONLY: "Malik Ka Naam" input field
    ├── SettingsShopAddressInput.tsx   ← ONLY: "Pata (Address)" input field
    ├── SettingsShopPhoneInput.tsx     ← ONLY: "Phone Number" input field (type="tel")
    ├── SettingsShopCurrencyInput.tsx  ← ONLY: "Currency Symbol" input field
    │
    ├── ── Config Cards ───────────────────────────────────────────────
    ├── SettingsGSTConfig.tsx          ← GST enable/disable toggle + GSTIN input
    ├── SettingsWhatsAppConfig.tsx     ← WhatsApp number input
    ├── SettingsPrinterConfig.tsx      ← Printer name / IP address input
    │
    └── ── Device Security Section ────────────────────────────────────
        ├── SettingsActiveDevices.tsx                  ← Orchestrator: fetches + lists sessions
        ├── SettingsActiveSessionsDataHook.ts          ← 🔁 BACKEND SWAP POINT: mock → real API here
        ├── SettingsActiveSessionCard.tsx              ← ONE session row (icon, info, logout btn)
        └── SettingsActiveSessionDeviceIconResolver.tsx ← Maps DeviceType → Lucide icon (pure util)
```

---

## 🏛 Architectural Rules (Strictly Enforced)

| Rule | Implementation |
|------|---------------|
| One File, One Component | Every `.tsx` exports exactly one component |
| No `"use client"` on Server Components | `page.tsx`, `SettingsShopDetails.tsx`, `SettingsHeader.tsx`, `SettingsDashboardLoadingFallback.tsx`, `SettingsActiveSessionDeviceIconResolver.tsx` are Server Components |
| No inline Tailwind colors | Every color uses `var(--settings-*)` from `settings.css` |
| No prop drilling | All form state flows via `SettingsContext.tsx` |
| Types derived from data | `DeviceType` is `typeof SETTINGS_DEVICE_TYPES[number]` — add a device type in constants, type updates automatically |

---

## 🛠 Core Data & State Flow

### Form State (`SettingsContext.tsx`)
```
SettingsProvider (wraps entire page)
  └── useGetSettings()       ← Fetches from backend on mount
  └── form: SettingsForm     ← Local state, synced from server
  └── isDirty: boolean       ← True when user changes anything
  └── updateForm(key, val)   ← Called by every input micro-component
  └── saveSettings()         ← Calls useUpdateSettings() mutation
```

Any component that needs form data calls `useSettings()` — no props needed.

### Session Data (`SettingsActiveSessionsDataHook.ts`)
```
useSettingsActiveSessions()
  └── Currently: returns SETTINGS_MOCK_ACTIVE_SESSIONS from SettingsConstants.ts
  └── Tomorrow: replace useState with useQuery/fetch call → zero UI changes needed
```

---

## 🎨 Theme System (`settings.css`)

All CSS variables are defined here. **Never add a hardcoded color to JSX.**

| Variable | Used By |
|----------|---------|
| `--settings-card-bg` | All card backgrounds |
| `--settings-background` | All input backgrounds |
| `--settings-border` | All borders and separators |
| `--settings-foreground` | All primary text |
| `--settings-muted-text` | All secondary/hint text |
| `--settings-muted-bg` | Security tip bg, skeleton bg |
| `--settings-muted-hover-bg` | Non-current session hover state |
| `--settings-primary` | Accent color, save button, section icons |
| `--settings-primary-bg` | Current device card background tint |
| `--settings-destructive` | Logout button |
| `--settings-whatsapp-icon` | WhatsApp section icon |
| `--settings-device-computer` | Computer session icon |
| `--settings-device-mobile` | Mobile session icon |
| `--settings-device-tablet` | Tablet session icon |

---

## 🚀 AI & Developer Guide: How to Make Changes

### Add a new settings field
1. Add field to `SettingsForm` in **`SettingsTypes.ts`**
2. Add default value in **`SettingsConstants.ts`** (`DEFAULTS`)
3. Add label/placeholder text in **`SettingsConstants.ts`** (`TEXTS`)
4. Create new `SettingsShop[FieldName]Input.tsx` micro-component
5. Add it to `SettingsShopDetails.tsx` (or relevant card)
6. Add it to `SettingsContext.tsx` sync logic

### Add a new config section card
1. Create `Settings[SectionName].tsx`
2. Import and add to `SettingsDashboardContainer.tsx`

### Add a new device type
1. Add to `SETTINGS_DEVICE_TYPES` array in **`SettingsConstants.ts`** — TypeScript type auto-updates
2. Add a `case` in **`SettingsActiveSessionDeviceIconResolver.tsx`**

### Integrate real session API
1. Edit **`SettingsActiveSessionsDataHook.ts`** ONLY — replace `useState(SETTINGS_MOCK_ACTIVE_SESSIONS)` with real API call

### Change a color/theme
1. Edit **`settings.css`** ONLY — all components pick it up automatically

---

## 📌 Business Logic Notes

- **Currency Symbol**: Whatever is saved here propagates to Dashboard, Billing, and Reports displays.
- **WhatsApp Number**: Default outbound number used for customer messages.
- **GST Toggle**: When disabled here, Billing page should hide the GST line-item UI.
- **lowStockThreshold**: Stored in `SettingsForm`, no visible input currently — reserved for future Inventory Alert feature.
