import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { PublicDataProvider } from "@/contexts/PublicDataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Careers - Shortlist AI",
  description: "Join our team at Shortlist AI. Explore exciting job opportunities and apply today.",
};

export default function CareersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PublicDataProvider>
          {children}
        </PublicDataProvider>
      </body>
    </html>
  );
} 