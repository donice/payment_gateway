import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/shared/layout/MainLayout";
import useIsBrower from "../../hooks/useIsBrowser";

export const metadata: Metadata = {
  title: "Abiapay Payment Gateway",
  description: "Abiapay Payment Gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useIsBrower();
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
