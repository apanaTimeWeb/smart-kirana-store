"use client";

import { useState } from "react";
import { SETTINGS_MOCK_ACTIVE_SESSIONS } from "../settings_constants/SettingsSharedConstants";
import type { SettingsActiveSession } from "../settings_types/SettingsTypes";

/**
 * SettingsActiveSessionsDataHook
 * Responsibility: Provides active session data to the UI.
 *
 * 🔁 BACKEND INTEGRATION POINT:
 * Tomorrow, replace the `useState(SETTINGS_MOCK_ACTIVE_SESSIONS)` below with
 * a real API call (e.g. `useQuery`, `useGetActiveSessions` from @/lib/api).
 * Only THIS file needs to change. No UI components need to be touched.
 */
export function useSettingsActiveSessions(): {
  data: SettingsActiveSession[];
  isLoading: boolean;
} {
  const [sessions] = useState<SettingsActiveSession[]>(SETTINGS_MOCK_ACTIVE_SESSIONS);

  return { data: sessions, isLoading: false };
}
