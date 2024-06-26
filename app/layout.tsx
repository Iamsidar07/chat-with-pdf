import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvder from "@/components/ReactQueryProvder";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatty - chat with pdf",
  description: "Chat with your pdf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvder>
      <ClerkProvider>
        <html lang="en">
          <body
            className={cn("min-h-screen grainy antialiased", inter.className)}
          >
            <Navbar />
            <Toaster />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </ReactQueryProvder>
  );
}
