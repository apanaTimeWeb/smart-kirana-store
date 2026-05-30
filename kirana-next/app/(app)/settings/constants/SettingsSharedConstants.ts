import type { SettingsForm } from "../types/SettingsTypes";

// ─── Device Types ────────────────────────────────────────────────────────────
// Const array → TypeScript union type is derived FROM this (see SettingsTypes.ts)
// Tomorrow: swap MOCK_ACTIVE_SESSIONS with a real API call in one place.
export const SETTINGS_DEVICE_TYPES = [
  "Computer",
  "Mobile",
  "Tablet",
  "Other",
] as const;

// ─── Mock Active Sessions ────────────────────────────────────────────────────
// Single Source of Truth for session data.
// Replace this with a real API call in SettingsActiveSessionsDataHook.ts
export const SETTINGS_MOCK_ACTIVE_SESSIONS = [
  {
    id: "1",
    deviceType: "Computer" as const,
    deviceName: "Windows PC - Chrome",
    ip: "182.68.45.123",
    location: "Patna, Bihar",
    lastActive: "Just now",
    isCurrent: true,
  },
  {
    id: "2",
    deviceType: "Mobile" as const,
    deviceName: "Redmi Note 12",
    ip: "182.68.112.78",
    location: "Patna, Bihar",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];

export const SettingsSharedConstants = {
  DEFAULTS: {
    shopName: "Smart Kirana Store",
    shopAddress: "",
    shopPhone: "",
    ownerName: "",
    gstNumber: "",
    gstEnabled: false,
    currency: "₹",
    lowStockThreshold: 5,
    whatsappNumber: "",
    printerName: "",
  } as SettingsForm,

  TEXTS: {
    TITLE: "Settings",
    SUBTITLE: "Manage your shop and security preferences",
    DUKAAN_DETAILS: "Dukaan Details",
    DUKAAN_DESC: "Aapki dukaan ki basic information",
    SHOP_NAME: "Dukaan Ka Naam",
    SHOP_NAME_PLACEHOLDER: "Ramesh General Store",
    OWNER_NAME: "Malik Ka Naam",
    OWNER_NAME_PLACEHOLDER: "Ramesh Kumar",
    ADDRESS: "Pata (Address)",
    ADDRESS_PLACEHOLDER: "Gandhi Nagar, Patna",
    PHONE: "Phone Number",
    PHONE_PLACEHOLDER: "9876543210",
    CURRENCY: "Currency Symbol",
    GST_SETTINGS: "GST Settings",
    GST_ENABLE: "GST Billing Enable Karein",
    GST_NUMBER: "GST Number (GSTIN)",
    GST_NUMBER_PLACEHOLDER: "22AAAAA0000A1Z5",
    WHATSAPP_SETTINGS: "WhatsApp Settings",
    WHATSAPP_NUMBER: "WhatsApp Number",
    WHATSAPP_PLACEHOLDER: "9876543210",
    PRINTER_SETUP: "Printer Setup",
    PRINTER_NAME: "Printer Name / IP Address",
    PRINTER_PLACEHOLDER: "Epson TM-T82 or 192.168.1.100",
    ACTIVE_DEVICES: "Active Devices & Sessions",
    ACTIVE_DEVICES_DESC: "Account kis devices pe logged in hai - Security ke liye monitor karein",
    LOADING_DEVICES: "Loading devices...",
    NO_SESSIONS: "No active sessions found.",
    CURRENT_DEVICE: "Current Device",
    UNKNOWN_LOCATION: "Unknown",
    LAST_ACTIVE: "Last active",
    LOGOUT: "Logout",
    SECURITY_TIP: "💡 Security Tip: Agar koi anjaan device dikhe to turant logout kar dein.",
    LOGOUT_CONFIRM: "Kya aap {0} se logout karna chahte hain?",
    LOGOUT_SUCCESS: "{0} se logout ho gaya",
    SAVE_ALL: "Save All Settings",
    SAVING: "Saving...",
    SAVE_SUCCESS: "✅ Settings successfully saved!",
    SAVE_ERROR: "❌ Failed to save settings",
    LOADING_SETTINGS: "Loading settings...",
  },
};
