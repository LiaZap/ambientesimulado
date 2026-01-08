import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRF Ambiente Simulado",
  description: "Plataforma de preparação de alto desempenho para a PRF.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import { prisma } from "@/lib/db";
import { FacebookPixel } from "@/components/analytics/facebook-pixel";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let config = null;
  try {
    config = await prisma.systemConfig.findFirst();
  } catch (error) {
    console.error("Failed to fetch system config (likely during build):", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FacebookPixel pixelId={config?.facebookPixelId} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
