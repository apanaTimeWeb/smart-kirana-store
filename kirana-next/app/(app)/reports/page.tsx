import "./reports.css";
import { ReportsProvider } from "./context/ReportsContext";
import { ReportsDashboardContainer } from "./components/Dashboard/ReportsDashboardContainer";

export default function Reports() {
  return (
    <ReportsProvider>
      <ReportsDashboardContainer />
    </ReportsProvider>
  );
}
