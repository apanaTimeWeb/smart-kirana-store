"use client";

import "./billing.css";
import React from "react";
import { BillingProvider, useBilling } from "./billing_context/BillingContext";
import { BillingProductMainGrid } from "./billing_components/Products/BillingProductMainGrid";
import { BillingCartMainPanel } from "./billing_components/Cart/BillingCartMainPanel";
import { BillingMobileResponsiveLayout } from "./billing_components/Layout/BillingMobileResponsiveLayout";
import { BillingLooseItemQuantityPicker } from "./billing_components/Dialogs/BillingLooseItemQuantityPicker";
import { BillingWhatsAppInvoiceDialog } from "./billing_components/Dialogs/BillingWhatsAppInvoiceDialog";

function BillingContent() {
  const billing = useBilling();

  return (
    <>
      {/* ── Desktop layout ─────────────────────────────────────────── */}
      <div className="hidden h-[calc(100dvh-2*1.5rem)] gap-5 md:flex">
        <div className="flex min-w-0 flex-1 flex-col">
          <BillingProductMainGrid />
        </div>
        <div className="w-96 shrink-0">
          <BillingCartMainPanel />
        </div>
      </div>

      {/* ── Mobile layout ──────────────────────────────────────────── */}
      <BillingMobileResponsiveLayout
        productGrid={<BillingProductMainGrid />}
        cartPanel={<BillingCartMainPanel />}
      />

      {/* ── Dialogs ────────────────────────────────────────────────── */}
      <BillingLooseItemQuantityPicker />
      <BillingWhatsAppInvoiceDialog />
    </>
  );
}

export default function Billing() {
  return (
    <BillingProvider>
      <BillingContent />
    </BillingProvider>
  );
}
