export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import PostCard from "@/components/posts/PostCard";
import Link from "next/link";

export default async function HomePage() {
  await connectDB();
  const posts = await Post.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .lean();

  const featured = posts[0] as any;
  const rest = posts.slice(1) as any[];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 overflow-hidden">
        {/* Animated floating orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full animate-float-slow" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-sky-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-blue-300/10 rounded-full blur-xl animate-float-slow" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-5xl mx-auto px-5 py-24 text-center">
          {/* Badge */}
          <div className="animate-fade-in-down">
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
              Now publishing
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fade-in-up delay-100">
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
              Ideas worth
              <br />
              <span className="shimmer-text">sharing</span>
            </h1>
          </div>

          {/* Subtext */}
          <div className="animate-fade-in-up delay-200">
            <p className="text-lg text-blue-100 max-w-lg mx-auto leading-relaxed mb-10">
              Discover insightful articles, tutorials, and stories from writers around the world.
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-300 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 border border-white/25 text-white text-sm font-semibold hover:bg-white/25 backdrop-blur-sm transition-all duration-200 hover:-translate-y-px active:scale-[0.98]">
              Browse articles
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-sky-50 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-px active:scale-[0.98]">
              Start writing →
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up delay-400 flex items-center justify-center gap-10 mt-14 pt-10 border-t border-white/15">
            {[
              { value: posts.length.toString(), label: "Articles published" },
              { value: "100%", label: "Free forever" },
              { value: "∞", label: "Ideas to explore" },
            ].map((s, i) => (
              <div key={s.label} className="text-center animate-scale-in" style={{ animationDelay: `${500 + i * 100}ms` }}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5">
        {/* ── Featured ── */}
        {featured && (
          <section className="pt-14 mb-14 animate-fade-in-up delay-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">⭐ Featured</span>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-100 to-transparent" />
            </div>
            <Link href={`/posts/${featured.slug}`} className="group block card overflow-hidden hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1">
              <div className="sm:flex">
                {featured.coverImage ? (
                  <div className="sm:w-2/5 h-60 sm:h-auto overflow-hidden">
                    <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="sm:w-2/5 h-60 sm:h-auto bg-gradient-to-br from-blue-500 via-blue-600 to-sky-400 animate-gradient flex items-center justify-center">
                    <span className="text-white/20 text-8xl font-black animate-float">B</span>
                  </div>
                )}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    {featured.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {featured.tags.slice(0, 3).map((t: string) => (
                          <span key={t} className="tag hover:scale-105 transition-transform cursor-default">{t}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{featured.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {featured.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{featured.author.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(featured.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className="ml-auto text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-all">
                      Read article
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 inline-block">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Grid ── */}
        {rest.length > 0 && (
          <section className="pb-20">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Latest articles</span>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-100 to-transparent" />
              <span className="text-[11px] text-gray-400 bg-white border border-gray-100 px-2.5 py-1 rounded-full">{posts.length} total</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post: any, i: number) => (
                <div key={post._id.toString()} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <PostCard post={JSON.parse(JSON.stringify(post))} />
                </div>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-28 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5 text-3xl animate-bounce-in">✍️</div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">No posts yet</h2>
            <p className="text-sm text-gray-400 mb-6">Be the first to publish something great.</p>
            <Link href="/register" className="btn-primary">Start writing</Link>
          </div>
        )}
      </div>
    </div>
  );
}
