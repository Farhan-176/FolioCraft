import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FolioCraft | Dynamic Portfolio Management Ecosystem",
  description: "Manage, customize, and showcase developer portfolios dynamically with real-time editing, custom themes, and RESTful API integration. Developed for EncoderX Remote Internship Batch 02.",
  keywords: ["portfolio management", "full stack", "developer portfolio", "EncoderX", "dynamic routing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
