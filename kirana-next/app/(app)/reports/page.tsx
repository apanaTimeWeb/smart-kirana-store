import "./reports.css";
import { ReportsProvider } from "./reports_context/ReportsContext";
import { ReportsDashboardContainer } from "./reports_components/Dashboard/ReportsDashboardContainer";

export default function Reports() {
  return (
    <ReportsProvider>
      <ReportsDashboardContainer />
    </ReportsProvider>
  );
}
