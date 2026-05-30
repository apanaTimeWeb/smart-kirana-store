"use client";

import "./suppliers.css";
import { SuppliersProvider } from "./suppliers_context/SuppliersContext";
import { SuppliersMainLayout } from "./suppliers_components/Layout/SuppliersMainLayout";

export default function Suppliers() {
  return (
    <SuppliersProvider>
      <SuppliersMainLayout />
    </SuppliersProvider>
  );
}
