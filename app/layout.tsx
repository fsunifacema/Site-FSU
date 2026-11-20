import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { THEME_BOOT_SCRIPT } from "@/lib/theme";

import "./styles/style.css";
import "./styles/glass-sidebar.css";
import "./styles/light-mode.css";
import "./styles/next.css";
import "./styles/cards-premium.css";
import "./styles/contact-glass.css";
import "./styles/mobile.css";

const inter = localFont({
  src: "./fonts/inter-latin-700.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "FSU — Fábrica de Software",
  description: "Desenvolvemos sistemas personalizados com escopo claro, arquitetura sólida e evolução estruturada.",
  icons: {
    icon: [{ url: "/assets/images/favicon-fsu-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/assets/images/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-color-mode="dark" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
