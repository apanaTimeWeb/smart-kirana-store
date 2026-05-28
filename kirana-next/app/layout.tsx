import type { Metadata, Viewport } from "next";
// @ts-ignore: Allow side-effect CSS import when no type declarations are present
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Smart Kirana Store",
  description: "Smart POS for Kirana shops - billing, khata, stock, and reports in one place.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
