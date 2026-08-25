import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  Manrope,
} from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
  ],
  style: [
    "normal",
    "italic",
  ],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: [
    "400",
    "500",
    "600",
  ],
  style: [
    "normal",
    "italic",
  ],
});

export const metadata: Metadata = {
  title: "Gabriel & Luana | 28.08.2027",
  description:
    "Site oficial do casamento de Gabriel e Luana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`
        ${manrope.variable}
        ${cormorant.variable}
        ${bodoni.variable}
      `}
    >
      <body>{children}</body>
    </html>
  );
}