import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brezelle — Make it matter",
  description: "Portal de collabs da Brezelle.",
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
