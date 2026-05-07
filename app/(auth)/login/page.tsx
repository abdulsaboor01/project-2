"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: fd.get("email"), password: fd.get("password"), redirect: false });
    setLoading(false);
    if (res?.error) return setError("Invalid email or password. Please try again.");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 flex-col justify-between p-12 relative overflow-hidden animate-slide-left">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-black">B</span>
          </div>
          <span className="text-white font-bold text-lg">BlogPlatform</span>
        </Link>
        <div className="relative">
          <p className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-4">Welcome back</p>
          <blockquote className="text-white text-2xl font-bold leading-relaxed mb-5">
            "The best way to predict the future is to write it."
          </blockquote>
          <p className="text-blue-200 text-sm">Join thousands of writers sharing their ideas every day.</p>
        </div>
        <div className="relative flex gap-3">
          {["✍️ Write", "📖 Read", "💬 Discuss"].map((item) => (
            <span key={item} className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">{item}</span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 animate-slide-right">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-bold text-gray-900">Blog<span className="text-blue-600">Platform</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email address</label>
              <input name="email" type="email" placeholder="you@example.com" required className="input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
              <input name="password" type="password" placeholder="••••••••" required className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
