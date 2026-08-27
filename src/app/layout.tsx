import type { Metadata } from "next";

import {
  Bodoni_Moda,
  Cormorant_Garamond,
  Manrope,
  Pinyon_Script,
} from "next/font/google";

import InviteTokenBridge from "@/components/InviteTokenBridge";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable:
    "--font-manrope",
  display: "swap",
});

const cormorant =
  Cormorant_Garamond({
    subsets: ["latin"],
    variable:
      "--font-cormorant",
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
  variable:
    "--font-bodoni",
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

const pinyon =
  Pinyon_Script({
    subsets: ["latin"],
    variable:
      "--font-pinyon",
    display: "swap",
    weight: "400",
  });

export const metadata: Metadata = {
  title:
    "Gabriel & Luana | 28.08.2027",
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
        ${pinyon.variable}
      `}
    >
      <body>
        <InviteTokenBridge />

        {children}
      </body>
    </html>
  );
}