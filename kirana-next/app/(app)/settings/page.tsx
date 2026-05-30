import "./settings.css";
import { SettingsProvider } from "./settings_context/SettingsContext";
import { SettingsDashboardContainer } from "./settings_components/Dashboard/SettingsDashboardContainer";

export default function Settings() {
  return (
    <SettingsProvider>
      <SettingsDashboardContainer />
    </SettingsProvider>
  );
}