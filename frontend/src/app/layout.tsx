import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Playfair_Display, Montserrat } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartSync } from "@/components/cart/CartSync";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
  themeColor: '#0f051d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "LUNA BOUTIQUE | Venta de Ropa & Confección",
    template: "%s | LUNA BOUTIQUE"
  },
  description: "Diseños exclusivos inspirados en la elegancia lunar. Venta de ropa y confección de alta calidad.",
  keywords: ["boutique", "moda premium", "luna boutique", "confección", "ropa de diseño"],
  authors: [{ name: "LUNA Boutique Team" }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://lunaboutique.store",
    siteName: "LUNA BOUTIQUE",
    title: "LUNA BOUTIQUE | Venta de Ropa & Confección",
    description: "Eleva lo cotidiano con nuestra selección exclusiva de alta moda.",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "LUNA Boutique Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUNA BOUTIQUE | Venta de Ropa & Confección",
    description: "Eleva lo cotidiano con nuestra selección exclusiva de alta moda.",
    images: ["/icon.png"],
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
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-background text-foreground transition-colors selection:bg-[#db2777] selection:text-white overflow-x-hidden"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Fondo Extraído de la Imagen (Morado a Rosa, CERO NEGRO) */}
          <div className="magical-bg-animated" />
          <div className="studio-bg" />
          {/* Estrellas brillantes */}
          <div className="fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 pointer-events-none mix-blend-screen animate-twinkle" />

          <Navbar />
          <CartDrawer />
          <CartSync />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
