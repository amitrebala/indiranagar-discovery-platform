import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/navigation/Header";
import { MobileNav } from "@/components/navigation/MobileNav";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <ServiceWorkerRegistration />
          <Header />
          <Breadcrumbs />
          <MobileNav />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
