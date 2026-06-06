import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RICOL SAS — Simulador EOQ",
  description: "Simulador interactivo de Cantidad Económica de Pedido para PEAD Alta Soplado — RICOL SAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
