"use client";

import "./billing.css";
import React from "react";
import { useBillingState } from "./billing_components/BillingStateHook";
import { BillingProductMainGrid } from "./billing_components/BillingProductMainGrid";
import { BillingCartMainPanel } from "./billing_components/BillingCartMainPanel";
import { BillingMobileResponsiveLayout } from "./billing_components/BillingMobileResponsiveLayout";
import { BillingLooseItemQuantityPicker } from "./billing_components/BillingLooseItemQuantityPicker";
import { BillingWhatsAppInvoiceDialog } from "./billing_components/BillingWhatsAppInvoiceDialog";
import { printThermalBill } from "./billing_components/BillingWhatsAppUtils";

export default function Billing() {
  const billing = useBillingState();

  const productGrid = (
    <BillingProductMainGrid
      products={billing.filteredProducts}
      quickProducts={billing.quickProducts}
      isLoading={billing.isLoading}
      search={billing.search}
      setSearch={billing.setSearch}
      filter={billing.filter}
      setFilter={billing.setFilter}
      cartBaseQty={(id) =>
        billing.cart
          .filter((item) => item.productId === id)
          .reduce((sum, item) => sum + item.stockDeltaBaseUnit, 0)
      }
      onProductTap={billing.handleProductTap}
      onRemoveTap={billing.handleProductRemove}
    />
  );

  const cartPanel = (
    <BillingCartMainPanel
      cart={billing.cart}
      customers={billing.customers}
      discount={billing.discount}
      setDiscount={billing.setDiscount}
      paymentMode={billing.paymentMode}
      setPaymentMode={billing.setPaymentMode}
      selectedCustomerId={billing.selectedCustomerId}
      setSelectedCustomerId={billing.setSelectedCustomerId}
      quickPhone={billing.quickPhone}
      setQuickPhone={billing.setQuickPhone}
      billSuccess={billing.billSuccess}
      enableGST={billing.enableGST}
      setEnableGST={billing.setEnableGST}
      gstRate={billing.gstRate}
      setGstRate={billing.setGstRate}
      subtotal={billing.subtotal}
      taxableValue={billing.taxableValue}
      gstAmount={billing.gstAmount}
      finalAmount={billing.finalAmount}
      cartCount={billing.cartCount}
      isCheckoutPending={billing.createBill.isPending}
      onUpdateQty={billing.updateQty}
      onRemove={billing.removeFromCart}
      onCheckout={billing.handleCheckout}
      onResetCart={billing.resetCart}
    />
  );

  return (
    <>
      {/* ── Desktop layout ─────────────────────────────────────────── */}
      <div className="hidden h-[calc(100dvh-2*1.5rem)] gap-5 md:flex">
        <div className="flex min-w-0 flex-1 flex-col">{productGrid}</div>
        <div className="w-96 shrink-0">{cartPanel}</div>
      </div>

      {/* ── Mobile layout ──────────────────────────────────────────── */}
      <BillingMobileResponsiveLayout
        mobileTab={billing.mobileTab}
        setMobileTab={billing.setMobileTab}
        cartCount={billing.cartCount}
        finalAmount={billing.finalAmount}
        productGrid={productGrid}
        cartPanel={cartPanel}
      />

      {/* ── Dialogs ────────────────────────────────────────────────── */}
      <BillingLooseItemQuantityPicker
        product={billing.khulaProduct}
        open={Boolean(billing.khulaProduct)}
        onOpenChange={(open) => !open && billing.setKhulaProduct(null)}
        onAdd={billing.addKhula}
      />

      <BillingWhatsAppInvoiceDialog
        billData={billing.whatsappBillData}
        shopName={billing.shopName}
        shopAddress={billing.settings?.shopAddress}
        shopPhone={billing.settings?.shopPhone}
        onClose={() => {
          if (billing.whatsappBillData) {
            printThermalBill(
              billing.whatsappBillData,
              billing.shopName,
              billing.settings?.shopAddress,
              billing.settings?.shopPhone,
              billing.settings?.gstNumber,
              billing.settings?.gstEnabled
            );
          }
          billing.setWhatsappBillData(null);
        }}
      />
    </>
  );
}
