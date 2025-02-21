import { Kanit } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "../style/globals.css";
import Head from 'next/head';
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
import SiteStatusOverlay from "@/components/BoardStatus";

const kanit = Kanit({
  subsets: ["latin"],
  variable: "--font-kanit",
  weight: ["400", "700"],
});

export const metadata = {
  "title": "Suized - Seized, but Never Silenced",
  "description": "Suized is your go-to platform for buying, selling, and trading digital goods, services, and exclusive content. Connect with a thriving community, find unique deals, and turn your skills into profit.",
  "keywords": "marketplace, forum, buy, sell, trade, digital goods, services, community, Suized",
  "author": "Anon",
  "openGraph": {
    "title": "Suized - Seized, but Never Silenced",
    "description": "Discover and trade digital goods and services on Koji Marketplace. Connect with buyers and sellers in a secure, thriving community.",
    "type": "website"
  },
  "telegram": {
    "site": "@",
    "title": "Suized - Seized, but Never Silenced",
    "description": "Join Suized to buy, sell, and trade digital goods and services securely."
  }
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="cryptomus" content="4884514a" />
      </Head>
      <SiteStatusOverlay />
      <body
        className={`${kanit.className} antialiased`}
      >
        <Script src="https://8x8.vc/vpaas-magic-cookie-e1caf5543ce644e7a0e4632ef7b0229a/external_api.js" strategy="lazyOnload" />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
