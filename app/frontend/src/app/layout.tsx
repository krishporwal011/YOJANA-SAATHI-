import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yojana Saathi AI - Citizen Scheme Assistant",
  description: "AI-driven discovery and navigation for Government of India citizen welfare schemes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
