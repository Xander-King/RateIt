import type { Metadata } from "next";
import Script from "next/script";
import { Chakra_Petch, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "My App",
  description: "A cross-platform web app starter with Supabase auth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${shareTechMono.variable}`}>
      <body className="min-h-screen antialiased">
        <Script id="main-color-init" strategy="beforeInteractive">
          {`
            try {
              var mainColor = localStorage.getItem('mainColor');
              if (mainColor) {
                document.documentElement.style.setProperty('--background', mainColor);
              }
            } catch (e) {}
          `}
        </Script>
        <Header/>
        {children}
      </body>
    </html>
  );
}
