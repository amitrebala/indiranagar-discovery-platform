import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/navigation/Header";
import { MobileNav } from "@/components/navigation/MobileNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Indiranagar with Amit | 186 Personally Visited Places",
  description: "Explore Indiranagar through Amit's eyes. 186 personally visited and verified places with insider tips, weather-aware recommendations, and authentic local experiences.",
  keywords: "Indiranagar with Amit, Bangalore, places, personal recommendations, verified places, local guide",
  openGraph: {
    title: "Indiranagar with Amit",
    description: "186 personally visited places in Bangalore's most vibrant neighborhood",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiranagar with Amit",
    description: "186 personally visited places in Bangalore's most vibrant neighborhood",
  },
  manifest: "/manifest.json",
  themeColor: "#f97316",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <MobileNav />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
