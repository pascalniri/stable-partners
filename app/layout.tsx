import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const outfit = Google_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Stable Partners Group | Boutique Property Management",
    template: "%s | Stable Partners Group",
  },
  description:
    "Your property should perform like a business. That's why we manage it like an investment rather than a building. From quality tenant selection to rent collection, proper maintenance, and strategies for boosting steady passive income without your involvement.",
  keywords: [
    "property management",
    "luxury real estate",
    "asset management",
    "tenant relations",
    "rent collection",
    "Rwanda property management",
  ],
  authors: [{ name: "Stable Partners Group" }],
  creator: "Stable Partners Group",
  publisher: "Stable Partners Group",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stablepartners.com",
    siteName: "Stable Partners Group",
    title: "Stable Partners Group | Boutique Property Management",
    description:
      "Expert property management for high-value assets. We handle the complexity, you reclaim your time.",
    images: [
      {
        url: "/stable-patners-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Stable Partners Group Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stable Partners Group | Boutique Property Management",
    description: "Expert property management for high-value assets.",
    images: ["/stable-patners-logo.jpg"],
  },
  icons: {
    icon: "/stable-patners-logo.jpg",
    shortcut: "/stable-patners-logo.jpg",
    apple: "/stable-patners-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={outfit.className}>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              color: "#fff",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: "0px",
              border: "1px solid #ffffff10",
            },
          }}
        />
      </body>
    </html>
  );
}
