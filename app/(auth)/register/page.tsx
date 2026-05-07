"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password"), role: fd.get("role") }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); return setError(d.error); }
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden animate-slide-left">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-black">B</span>
          </div>
          <span className="text-white font-bold text-lg">BlogPlatform</span>
        </Link>
        <div className="relative">
          <p className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-4">Join today</p>
          <h2 className="text-white text-3xl font-bold mb-6 leading-snug">
            Start sharing your<br />ideas with the world
          </h2>
          <ul className="space-y-3">
            {["Write and publish articles", "Build your audience", "Engage with readers"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-blue-100 text-sm">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-bold shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-blue-200/60 text-xs">Free forever. No credit card required.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Free forever. Start in seconds.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Full name</label>
              <input name="name" placeholder="Jane Smith" required className="input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email address</label>
              <input name="email" type="email" placeholder="you@example.com" required className="input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
              <input name="password" type="password" placeholder="Min. 6 characters" required minLength={6} className="input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">I want to</label>
              <select name="role" className="input bg-white">
                <option value="reader">📖 Read articles</option>
                <option value="author">✍️ Write & publish</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
