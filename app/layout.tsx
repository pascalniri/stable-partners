import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: {
    default: "Stable Partners Group | Boutique Property Management",
    template: "%s | Stable Partners Group"
  },
  description: "Boutique property management for high-value asset owners. Reclaiming your time through radical transparency and clinical precision.",
  keywords: ["property management", "luxury real estate", "asset management", "tenant relations", "rent collection", "Rwanda property management"],
  authors: [{ name: "Stable Partners Group" }],
  creator: "Stable Partners Group",
  publisher: "Stable Partners Group",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stablepartners.com",
    siteName: "Stable Partners Group",
    title: "Stable Partners Group | Boutique Property Management",
    description: "Expert property management for high-value assets. We handle the complexity, you reclaim your time.",
    images: [
      {
        url: "/stable-partners-group - logo.png",
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
    images: ["/stable-partners-group - logo.png"],
  },
  icons: {
    icon: "/stable-partners-group - favicon.png",
    shortcut: "/stable-partners-group - favicon.png",
    apple: "/stable-partners-group - favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className={bricolage.className}>
        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="beforeInteractive" 
        />
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#fff',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '0px',
            border: '1px solid #ffffff10'
          }
        }} />
      </body>
    </html>
  );
}
