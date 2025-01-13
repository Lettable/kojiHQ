import localFont from "next/font/local";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "../style/globals.css";
import Head from 'next/head';
import Script from "next/script";
// import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  "title": "Koji Marketplace - Buy, Sell & Trade Digital Goods",
  "description": "Koji Marketplace is your go-to platform for buying, selling, and trading digital goods, services, and exclusive content. Connect with a thriving community, find unique deals, and turn your skills into profit.",
  "keywords": "marketplace, buy, sell, trade, digital goods, services, community, Koji",
  "cryptomus": "4884514a",
  "author": "Mirzya",
  "openGraph": {
    "title": "Koji Marketplace - Buy, Sell & Trade Digital Goods",
    "description": "Discover and trade digital goods and services on Koji Marketplace. Connect with buyers and sellers in a secure, thriving community.",
    "type": "website"
  },
  "telegram": {
    "site": "@KojiHQ",
    "title": "Koji Marketplace - Buy, Sell & Trade",
    "description": "Join Koji Marketplace to buy, sell, and trade digital goods and services securely."
  }
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="cryptomus" content="4884514a" />
        
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="https://8x8.vc/vpaas-magic-cookie-e1caf5543ce644e7a0e4632ef7b0229a/external_api.js" strategy="lazyOnload" />
        {children}
        <SpeedInsights />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
