import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Playfair_Display, Montserrat } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "LUNA BOUTIQUE | Alta Moda & Estilo Atemporal",
    template: "%s | LUNA BOUTIQUE"
  },
  description: "Curaduría exclusiva de moda unisex diseñada para elevar lo cotidiano a lo extraordinario. Minimalismo refinado y elegancia lunar.",
  keywords: ["boutique", "moda premium", "lujo accesible", "luna boutique", "moda unisex"],
  authors: [{ name: "LUNA Team" }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://lunaboutique.store",
    siteName: "LUNA BOUTIQUE",
    title: "LUNA BOUTIQUE | Alta Moda & Estilo Atemporal",
    description: "Eleva lo cotidiano con nuestra selección exclusiva de alta moda.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481658327-477282130772?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "LUNA Boutique Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUNA BOUTIQUE | Alta Moda & Estilo Atemporal",
    description: "Eleva lo cotidiano con nuestra selección exclusiva de alta moda.",
    images: ["https://images.unsplash.com/photo-1490481658327-477282130772?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] transition-colors selection:bg-[#94a3b8] selection:text-white">
        <Navbar />
        <CartDrawer />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
