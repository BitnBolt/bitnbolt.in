import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { NextAuthProvider } from '@/components/NextAuthProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitnBolt - Custom IoT Solutions & Smart Products",
  description: "Transform your business with BitnBolt's cutting-edge IoT solutions and custom-made products. Specializing in smart home systems, industrial automation, and innovative technology solutions.",
  keywords: "IoT solutions, custom made products, smart home, industrial automation, technology solutions, BitnBolt",
  authors: [{ name: "BitnBolt Team" }],
  creator: "BitnBolt",
  publisher: "BitnBolt",
  robots: "index, follow",
  openGraph: {
    title: "BitnBolt - Custom IoT Solutions & Smart Products",
    description: "Transform your business with BitnBolt's cutting-edge IoT solutions and custom-made products.",
    url: "https://bitnbolt.in",
    siteName: "BitnBolt",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BitnBolt - Custom IoT Solutions & Smart Products",
    description: "Transform your business with BitnBolt's cutting-edge IoT solutions and custom-made products.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z2EV5Y5WP1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z2EV5Y5WP1');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
        {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
