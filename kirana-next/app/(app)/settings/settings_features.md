# Smart Kirana Store - Settings Module Documentation

Yeh document `Smart Kirana Store` application ke **Settings** module ki complete architectural aur functional details provide karta hai. Iska main purpose application ke configuration, preferences, aur security settings ko samajhna aur extend karna hai.

## 📁 Directory Structure & Architecture

Settings module `app/(app)/settings` directory me sthit hai.

- **`page.tsx`**: Main entry point jo sirf `SettingsManager` component ko render karta hai.
- **`settings.css`**: Settings module ke specific UI variables (jaise borders, shadows, and card styles) yahan define hote hain.
- **`settings_components/`**: Yahan specific cards aur manager components hain:
  - `SettingsManager.tsx`: Yeh master component hai jo state manage karta hai, API (`useGetSettings`, `useUpdateSettings`) se baat karta hai aur saare child cards ko render karta hai. Isme `isDirty` state tracking hai jo check karti hai ki koi change hua hai ya nahi.
  - `ShopDetailsCard.tsx`: Dukaan ki basic details (Name, Owner, Address, Phone, Currency) capture karta hai.
  - `GSTSettingsCard.tsx`: GST enable/disable karne ka toggle switch yahan hai. (Future me GST number input bhi isi me jayega).
  - `WhatsAppSettingsCard.tsx`: Business ka default WhatsApp number set karne ke liye input. Yahi number bills aur reminders me default kaam aata hai.
  - `PrinterSetupCard.tsx`: Thermal printer ka naam ya IP address dalne ka option. Isse receipt nikalne me madad milti hai.
  - `ActiveDevicesCard.tsx`: Security monitoring ke liye ek section jo dikhata hai ki aapka account aur kis kis device (Mobile, PC) se login hai. Isme "Logout" button ka support diya gaya hai.
  - `types.ts`: TypeScript interfaces aur default settings values `DEFAULTS` isi file me hain.

## 🛠 Core Features & Workflow

### 1. Centralized Form State
Saare chote-chote cards me jo bhi data dalta hai, wo ek hi central state (`SettingsForm`) me `SettingsManager` ke andar save hota hai.
- Jab bhi koi field update hota hai, `isDirty` flag `true` ho jata hai, jisse bottom ka **"Save All Settings"** button enable ho jata hai.
- Ek hi "Save" click par saare settings ek saath update ho jate hain, jisse multiple API calls se bacha jata hai.

### 2. Device Security & Session Management
- **Active Devices List**: Yeh list batati hai ki kis IP, location, aur device se account presently active hai.
- Agar dukandaar ko lagta hai ki koi anjaan device dikh raha hai, toh woh "Logout" button pe click karke use session se bahar kar sakta hai.
*(Note: Abhi UI me dummy active sessions dikh rahe hain, isme backend API integration future task hai).*

### 3. Business Context Integration
Jo bhi data Settings me change hoga, wo baaki modules par asar dalega:
- **Currency Symbol**: Dashboard, Billing, Reports, sab jagah yahi symbol dikhega.
- **WhatsApp Number**: Jab bhi Khata module me 'Reminder' bheja jayega, toh default send-from number ke taur par ye consider ho sakta hai.
- **GST Toggle**: Agar yahan GST disable kiya hai, toh Billing page pe GST lagne wala option hide/disable hona chahiye (Yeh integration logic app-wide lagaya ja sakta hai).
- **Printer Name/IP**: Receipt thermal print print ke time ye settings kaam aayegi.

## 🧠 State Management & API
- **TanStack Query Hooks**: Data fetching ke liye `useGetSettings` aur changes save karne ke liye `useUpdateSettings` mutation ka upyog kiya gaya hai.
- **Optimistic Invalidation**: Settings save hote hi query invalidate ho jati hai taaki globally app me naye settings turant reflect ho jayein.

## 🚀 AI & Developer Context: Future Enhancements
Agar is module ko aage badhana ho:

1. **User Role Management**: Dukandaar apne "Staff" ya "Cashier" ke liye sub-accounts bana sake aur permissions restrict kar sake (jaise cashier ko Reports na dikhein).
2. **Offline Data Sync Setting**: Ek setting jo user ko control de ki data kitni der me cloud par sync hona chahiye (Auto-sync vs Manual Sync).
3. **Receipt Customization**: Ek naya card jahan dukandaar receipt ke footer me apni policy likh sake, jaise "Bika hua maal wapas nahi hoga" ya "Thank you for shopping".
4. **Theme Preference**: Abhi "Light/Dark" toggle sidebar me hai, ise ek proper settings option ke taur par bhi banaya ja sakta hai (System / Light / Dark).

## 📌 Summary for Quick Handover
- `SettingsManager` me update method har card me as a prop paas kiya gaya hai. Toh agar naya field add karna hai toh `types.ts` me interface aur DEFAULTS update karein, naya card banayein, aur `SettingsManager` me render kar dein.
- Active Sessions ke liye `useGetActiveSessions` abhi ek mock hook (hardcoded data) hai, actual API banne ke baad use wahan plug-in karna padega.
