import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Recipe Box",
  description: "A curated collection of favorite recipes",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 bg-[var(--background)]/95 header-blur border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link 
                href="/" 
                className="group flex items-center gap-2.5 tap-target"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center transition-transform group-hover:scale-105">
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                </div>
                <span className="text-base sm:text-lg font-semibold tracking-tight text-[var(--foreground)]">
                  Recipe Box
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-[var(--border)] bg-[var(--secondary)]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                Made with care for home cooks everywhere
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
