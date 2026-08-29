import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Lora } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  variable: "--font-heading",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  variable: "--font-body",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://streunding.nl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Streunding Imkerij", template: "%s | Streunding" },
  description: "Mijn reis naar het imkeren — kasten timmeren, brouwen met honing en leren over bijen.",
  openGraph: {
    siteName: "Streunding Imkerij",
    locale: "nl_NL",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Streunding Imkerij" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav userEmail={user?.email ?? null} />
        <ScrollAnimations />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
