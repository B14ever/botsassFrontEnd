import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import { PLATFORM_NAME, PLATFORM_TAGLINE, PLATFORM_DESCRIPTION } from "@/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} — ${PLATFORM_TAGLINE}`,
  description: PLATFORM_DESCRIPTION,
  icons: {
    icon: "/redas_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
