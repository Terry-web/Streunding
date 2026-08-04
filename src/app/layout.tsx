import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Streunding Imkerij", template: "%s | Streunding" },
  description: "Mijn reis naar het imkeren — kasten timmeren, brouwen met honing en leren over bijen.",
  openGraph: {
    siteName: "Streunding Imkerij",
    locale: "nl_NL",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Streunding Imkerij" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <ScrollAnimations />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
