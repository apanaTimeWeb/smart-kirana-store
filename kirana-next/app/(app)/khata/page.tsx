// page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Khata Module — Root Server Component
//
// This is intentionally a Server Component (no "use client" directive).
// In Next.js App Router, Server Components CAN render Client Components.
// The "use client" boundary lives inside KhataContext.tsx, KhataProvider, etc.
// Keeping this as a Server Component allows Next.js to optimize page rendering.
// ─────────────────────────────────────────────────────────────────────────────

import "./khata.css";
import { KhataProvider } from "./khata_components/KhataContext";
import { KhataCustomerListContainer } from "./khata_components/KhataCustomerListContainer";

export default function KhataPage() {
  return (
    <KhataProvider>
      <KhataCustomerListContainer />
    </KhataProvider>
  );
}
