import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "BlogPlatform", template: "%s · BlogPlatform" },
  description: "A modern platform for writers and readers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-gray-900 antialiased font-[var(--font-inter)]" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>

          <footer className="mt-24 bg-white border-t border-gray-100">
            <div className="max-w-5xl mx-auto px-5 py-14">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-10">
                <div className="max-w-xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-200">
                      <span className="text-white font-black text-sm">B</span>
                    </div>
                    <span className="font-bold text-gray-900 text-[15px]">
                      Blog<span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Platform</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A place for curious minds to share ideas, stories, and knowledge.
                  </p>
                </div>
                <div className="flex gap-12 text-sm">
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Explore</p>
                    <a href="/" className="block text-gray-500 hover:text-blue-600 transition-colors">Home</a>
                    <a href="/search" className="block text-gray-500 hover:text-blue-600 transition-colors">Search</a>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                    <a href="/login" className="block text-gray-500 hover:text-blue-600 transition-colors">Sign in</a>
                    <a href="/register" className="block text-gray-500 hover:text-blue-600 transition-colors">Sign up</a>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
                © {new Date().getFullYear()} BlogPlatform. All rights reserved.
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
