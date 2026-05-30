import "./settings.css";
import { SettingsProvider } from "./context/SettingsContext";
import { SettingsDashboardContainer } from "./components/Dashboard/SettingsDashboardContainer";

export default function Settings() {
  return (
    <SettingsProvider>
      <SettingsDashboardContainer />
    </SettingsProvider>
  );
}