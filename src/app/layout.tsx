import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BackgroundAura from "@/components/layout/BackgroundAura";
import { CommandMenu } from "@/components/search/CommandMenu";

export const metadata: Metadata = {
  title: "Lowkey Chopped Elite | LCE",
  description: "Next-generation hub for Activities, AI, Entertainment, VM, and Soundboard.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable}`}>
      <body className={`${GeistSans.className} bg-background text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-purple-500/30 selection:text-purple-200 font-sans`}>
        <BackgroundAura />
        <Navbar />
        <CommandMenu />
        <main className="flex-1 w-full pt-20 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
