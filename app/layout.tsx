import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "KiboBot | Support Bots for Your Docs",
  description: "Turn docs and FAQs into fast, trusted support answers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth font-sans">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
