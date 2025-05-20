import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { Poppins } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: "Pharmacon - Online Pharmacy",
  description: "Your trusted online pharmacy for prescription and over-the-counter medications",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased h-full`}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased h-full`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
