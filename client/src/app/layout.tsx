import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { AuthProvider } from "@/components/providers/authprovider";
import { ToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "crmX",
  description: "a mini crm tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
