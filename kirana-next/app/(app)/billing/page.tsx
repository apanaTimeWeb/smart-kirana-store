"use client";

import "./billing.css";
import React from "react";
import { BillingProvider, useBilling } from "./billing_components/BillingContext";
import { BillingProductMainGrid } from "./billing_components/BillingProductMainGrid";
import { BillingCartMainPanel } from "./billing_components/BillingCartMainPanel";
import { BillingMobileResponsiveLayout } from "./billing_components/BillingMobileResponsiveLayout";
import { BillingLooseItemQuantityPicker } from "./billing_components/BillingLooseItemQuantityPicker";
import { BillingWhatsAppInvoiceDialog } from "./billing_components/BillingWhatsAppInvoiceDialog";

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
