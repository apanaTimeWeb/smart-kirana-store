"use client";

import "./khata.css";
import { KhataProvider } from "./khata_components/KhataContext";
import { KhataCustomerListContainer } from "./khata_components/KhataCustomerListContainer";

export default function Customers() {
  return (
    <KhataProvider>
      <KhataCustomerListContainer />
    </KhataProvider>
  );
}
