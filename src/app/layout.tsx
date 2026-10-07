import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Recipe Collection",
  description: "A warm place for all your favorite recipes",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50/30">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-200/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-amber-900">My Recipes</h1>
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center text-sm text-amber-700/60 border-t border-amber-200/50">
          Made with love for delicious cooking
        </footer>
      </body>
    </html>
  );
}
