# Smart Kirana Store - Settings Module Documentation

Yeh document `Smart Kirana Store` application ke **Settings** module ki complete architectural aur functional details provide karta hai. Iska main purpose application ke configuration, preferences, aur security settings ko samajhna aur extend karna hai. Ise strictly AI-Friendly aur micro-modular architecture par banaya gaya hai.

## 📁 Directory Structure & Micro-Modular Architecture

Settings module `app/(app)/settings` directory me sthit hai.

- **`page.tsx`**: Main entry point jo sirf `<SettingsProvider>` aur `<SettingsDashboardContainer>` render karta hai.
- **`loading.tsx`**: Default Next.js loading state jo CSS variables use karta hai taaki strict theme compatibility bani rahe.
- **`error.tsx`**: Next.js error boundary component.
- **`settings.css`**: Settings module ke UI variables, structure, aur colors yahan define hote hain.
- **`settings_components/`**: Yahan specific cards aur micro-components hain:
  - **State & Data**:
    - `SettingsTypes.ts`: TypeScript interfaces (jaise `SettingsForm`, `SettingsActiveSession`).
    - `SettingsConstants.ts`: Saare hardcoded texts, labels, aur default values (Single Source of Truth).
    - `SettingsContext.tsx`: Module-level React Context jo form state, `isDirty` flag, aur `updateSettings` mutation ko handle karta hai. Ye prop-drilling ko completely eliminate karta hai.
  - **Layout**:
    - `SettingsDashboardContainer.tsx`: Master layout container jo API loading state check karke saare child components ko render karta hai.
    - `SettingsHeader.tsx`: Title aur description dikhane wala micro-component.
    - `SettingsSaveAction.tsx`: "Save All Settings" button, jo context se `isDirty` padhkar apne aapko disable/enable karta hai.
  - **Form Configs**:
    - `SettingsShopDetails.tsx`: Dukaan ki basic details.
    - `SettingsGSTConfig.tsx`: GST enable/disable toggle.
    - `SettingsWhatsAppConfig.tsx`: Business ka default WhatsApp number set karne ke liye input.
    - `SettingsPrinterConfig.tsx`: Thermal printer ka naam ya IP address dalne ka option.
  - **Device Security**:
    - `SettingsActiveDevices.tsx`: Security monitoring ke liye section jo dikhata hai ki aapka account aur kis kis device se login hai. "Logout" button support karta hai.

## 🛠 Core Features & Workflow

### 1. Centralized Form State
Saare config components `useSettings()` hook use karke sidhe `SettingsContext` se connect hote hain.
- Jab bhi koi field update hota hai, Context me `isDirty` flag `true` ho jata hai, jisse `SettingsSaveAction` button enable ho jata hai.
- Ek hi "Save" click par saare settings ek saath update ho jate hain.

### 2. Device Security & Session Management
- **Active Devices List**: Yeh list batati hai ki kis IP, location, aur device se account presently active hai.
- Agar dukandaar ko lagta hai ki koi anjaan device dikh raha hai, toh woh "Logout" button pe click karke use session se bahar kar sakta hai.
*(Note: Abhi UI me dummy active sessions dikh rahe hain, real API integration yahan asani se plug ho sakti hai kyunki state isolated hai).*

### 3. Business Context Integration
Jo bhi data Settings me change hoga, wo baaki modules par asar dalega:
- **Currency Symbol**: Dashboard, Billing, Reports, sab jagah yahi symbol dikhega.
- **WhatsApp Number**: Default send-from number.
- **GST Toggle**: Agar yahan GST disable kiya hai, toh Billing page pe GST lagne wala option hide/disable hona chahiye.

## 📌 Theme Independence
Is module me `var(--settings-primary)`, `var(--settings-card-bg)` jaise pure CSS variables use kiye gaye hain. JSX me koi tailwind specific color class nahi hai, taaki themer ko pura control mil sake.

## 🚀 AI & Developer Context: Future Enhancements
Agar is module ko aage badhana ho:
1. Naya setting card banane ke liye, naya component banayein (e.g. `SettingsUserRoles.tsx`), use `SettingsDashboardContainer` me import karein, aur state ke liye `SettingsTypes.ts` & `SettingsContext.tsx` update karein.
2. Hardcoded texts hamesha `SettingsConstants.ts` me likhein.
