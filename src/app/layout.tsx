import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RaUrus — Pencatat Keuangan Pintar AI",
  description: "Catat pengeluaran & pemasukan secepat kilat dengan kecerdasan buatan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RaUrus",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080d0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${poppins.variable} font-sans antialiased min-h-screen bg-[#050806]`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
