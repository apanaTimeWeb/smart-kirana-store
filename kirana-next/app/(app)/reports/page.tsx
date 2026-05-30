"use client";

import "./reports.css";
import { ReportsProvider } from "./reports_components/ReportsContext";
import { ReportsDashboardContainer } from "./reports_components/ReportsDashboardContainer";

export default function Reports() {
  return (
    <ReportsProvider>
      <ReportsDashboardContainer />
    </ReportsProvider>
  );
}

