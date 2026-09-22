import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BackgroundAura from "@/components/layout/BackgroundAura";

export const metadata: Metadata = {
  title: "Lowkey Chopped Elite | LCE",
  description: "Next-generation hub for Games, AI, Entertainment, and Soundboard.",
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
    <html lang="en" className="dark">
      <body className="bg-background text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <BackgroundAura />
        <Navbar />
        <main className="flex-1 w-full pt-20 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
