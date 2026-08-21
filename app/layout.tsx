import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import { PLATFORM_NAME, PLATFORM_TAGLINE, PLATFORM_DESCRIPTION } from "@/constants";
import { getLocale, getMessages } from "next-intl/server";

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

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${PLATFORM_NAME} — ${PLATFORM_TAGLINE}`,
  description: PLATFORM_DESCRIPTION,
  icons: {
    icon: "/redas_icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} ${notoSansEthiopic.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
