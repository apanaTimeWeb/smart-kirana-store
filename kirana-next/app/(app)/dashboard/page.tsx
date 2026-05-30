"use client";

import "./dashboard.css";
import { DashboardProvider } from "./dashboard_context/DashboardContext";
import { DashboardPageContent } from "./dashboard_components/DashboardLayout/DashboardPageContent";

/**
 * Dashboard — Route Entry Point
 *
 * This file is intentionally minimal: it only wraps the module
 * in DashboardProvider (which fetches and holds all dashboard data)
 * and renders DashboardPageContent.
 *
 * To change dashboard layout or stat cards → edit DashboardPageContent.tsx
 * To change data fetching logic      → edit DashboardContext.tsx
 */
export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardPageContent />
    </DashboardProvider>
  );
}
