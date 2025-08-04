import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Footer } from "@/components/layout/Footer";
import HasAmitBeenHereButton from "@/components/community/HasAmitBeenHereButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indiranagar Discovery | Personal Place Recommendations",
  description: "Discover hidden gems in Indiranagar with personal recommendations from a local expert. Weather-aware exploration with 100+ curated places.",
  keywords: "Indiranagar, Bangalore, places, recommendations, local expert, weather-aware",
  openGraph: {
    title: "Indiranagar Discovery Platform",
    description: "Personal place recommendations from local expert",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiranagar Discovery Platform",
    description: "Personal place recommendations from local expert",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <MobileNav />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <HasAmitBeenHereButton />
      </body>
    </html>
  );
}
