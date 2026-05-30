import { SETTINGS_DEVICE_TYPES } from "../settings_constants/SettingsSharedConstants";

// DeviceType is derived from the SETTINGS_DEVICE_TYPES array.
// Do NOT add values here manually — add them to SettingsSharedConstants.ts instead.
export type DeviceType = (typeof SETTINGS_DEVICE_TYPES)[number];

export type SettingsActiveSession = {
  id: string;
  deviceType: DeviceType;
  deviceName: string;
  ip: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
};

export type SettingsForm = {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  ownerName: string;
  gstNumber: string;
  gstEnabled: boolean;
  currency: string;
  lowStockThreshold: number;
  whatsappNumber: string;
  printerName: string;
};
