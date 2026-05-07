"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;
    return (
      <Link href={href} className={`relative text-sm font-medium transition-all duration-200 group ${active ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}>
        {label}
        <span className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 animate-fade-in-down ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-md shadow-blue-900/5 border-b border-gray-100" : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:shadow-blue-300 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <span className="font-extrabold text-gray-900 tracking-tight text-[15px]">
            Blog<span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Platform</span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden sm:flex items-center gap-7 flex-1 justify-center">
          <NavLink href="/search" label="Search" />
          {session && (session.user as any).role === "author" && (
            <NavLink href="/dashboard" label="Dashboard" />
          )}
        </div>

        {/* Right actions */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {session ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 hover:border-blue-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white text-[11px] font-bold shadow-sm animate-pulse-ring">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-700 max-w-[90px] truncate">
                  {session.user?.name}
                </span>
              </div>
              <button onClick={() => signOut()} className="text-sm font-medium text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-105 active:scale-95">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-xs">
                Get started →
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="sm:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-gray-50 transition-colors gap-[5px]"
          aria-label="Toggle menu"
        >
          <span className={`w-[18px] h-[1.5px] bg-gray-600 rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`w-[18px] h-[1.5px] bg-gray-600 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`w-[18px] h-[1.5px] bg-gray-600 rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-5 pt-2 bg-white border-t border-gray-100 space-y-1">
          <Link href="/search" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 transition-all duration-200">Search</Link>
          {session && (session.user as any).role === "author" && (
            <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1 transition-all duration-200">Dashboard</Link>
          )}
          <div className="pt-2 mt-1 border-t border-gray-100 space-y-1">
            {session ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
                </div>
                <button onClick={() => signOut()} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sign in</Link>
                <Link href="/register" className="block btn-primary text-center">Get started →</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
