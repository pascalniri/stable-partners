"use client";

import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

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
