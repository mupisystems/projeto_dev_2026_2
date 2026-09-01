import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brezelle — Make it matter",
    template: "%s | Brezelle",
  },
  description:
    "A Brezelle cria collabs com artistas, criadores e marcas que têm visão própria.",
  applicationName: "Brezelle",
  authors: [{ name: "Brezelle" }],
  creator: "Brezelle",
  publisher: "Brezelle",
  category: "fashion",
  keywords: [
    "Brezelle",
    "streetwear premium",
    "collabs",
    "colaborações de moda",
    "moda autoral",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Brezelle",
    title: "Brezelle — Make it matter",
    description:
      "Propostas de collab para uma marca de streetwear premium com visão própria.",
    images: [
      {
        url: "/videos/hero-final-frame.jpg",
        width: 2048,
        height: 1080,
        alt: "Editorial Brezelle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brezelle — Make it matter",
    description:
      "Propostas de collab para uma marca de streetwear premium com visão própria.",
    images: ["/videos/hero-final-frame.jpg"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
