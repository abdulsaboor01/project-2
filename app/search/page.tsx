"use client";
import { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/posts/PostCard";

const suggestions = ["Technology", "Design", "Tutorial", "Programming", "Career"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setPosts([]); return; }
    setLoading(true);
    const res = await fetch(`/api/posts?search=${encodeURIComponent(q)}`);
    setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 400);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full animate-float-slow" />
        <div className="absolute -bottom-8 left-1/4 w-48 h-48 bg-sky-400/10 rounded-full blur-2xl animate-float" />

        <div className="relative max-w-2xl mx-auto px-5 py-16 text-center animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">Find an article</h1>
          <p className="text-blue-200 text-sm mb-8">Search by title, content, or tags</p>

          {/* Search bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-focus-within:bg-blue-300/30 transition-all duration-300" />
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-blue-900/30 overflow-hidden">
              <svg className="absolute left-4 w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-12 py-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                autoFocus
              />
              {loading ? (
                <span className="absolute right-4 text-blue-500 animate-spin text-xl">⟳</span>
              ) : query ? (
                <button onClick={() => setQuery("")} className="absolute right-4 text-gray-400 hover:text-gray-600 text-lg transition-colors">✕</button>
              ) : null}
            </div>
          </div>

          {/* Suggestion chips */}
          {!query && (
            <div className="flex flex-wrap justify-center gap-2 mt-5 animate-fade-in delay-200">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30L720 10L1440 30V30H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Result count */}
        {!loading && query && posts.length > 0 && (
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-blue-600 text-base">{posts.length}</span> result{posts.length !== 1 ? "s" : ""} for
              <span className="ml-1 font-semibold text-gray-700">&ldquo;{query}&rdquo;</span>
            </p>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-100 to-transparent" />
            <button onClick={() => setQuery("")} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Clear</button>
          </div>
        )}

        {/* No results */}
        {!loading && query && posts.length === 0 && (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-3xl animate-bounce-in">🔍</div>
            <p className="font-bold text-gray-700 mb-1">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-gray-400 mb-5">Try different keywords or browse suggestions.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQuery(s)} className="tag hover:scale-105 transition-transform cursor-pointer">{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-3xl animate-float">✨</div>
            <p className="font-semibold text-gray-600 mb-1">Discover great articles</p>
            <p className="text-sm text-gray-400">Type above or pick a suggestion to get started</p>
          </div>
        )}

        {/* Results grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any, i: number) => (
            <div key={post._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
