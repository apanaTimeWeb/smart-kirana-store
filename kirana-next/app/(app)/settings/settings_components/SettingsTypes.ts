export type SettingsActiveSession = {
  id: string;
  deviceType: "Computer" | "Mobile" | "Tablet" | "Other";
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
