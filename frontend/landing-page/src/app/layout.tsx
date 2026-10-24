import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "ABC School",
    template: "%s | ABC School",
  },
  description:
    "Welcome to ABC School. Explore our academic programs, admissions, and school community.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen flex flex-col antialiased font-sans",
          inter.variable,
          geistMono.variable
        )}
      >
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
