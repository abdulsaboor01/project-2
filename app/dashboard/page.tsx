export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "author") redirect("/login");

  await connectDB();
  const posts = await Post.find({ author: session.user.id }).sort({ createdAt: -1 }).lean();
  const published = posts.filter((p: any) => p.status === "published").length;
  const drafts = posts.filter((p: any) => p.status === "draft").length;
  const totalLikes = posts.reduce((sum: number, p: any) => sum + (p.likes?.length ?? 0), 0);

  const stats = [
    { label: "Total Posts", value: posts.length, icon: "📝", from: "from-blue-500", to: "to-blue-600", light: "bg-blue-50", text: "text-blue-600" },
    { label: "Published", value: published, icon: "🌐", from: "from-sky-500", to: "to-cyan-500", light: "bg-sky-50", text: "text-sky-600" },
    { label: "Drafts", value: drafts, icon: "📄", from: "from-amber-400", to: "to-orange-500", light: "bg-amber-50", text: "text-amber-600" },
    { label: "Total Likes", value: totalLikes, icon: "♥", from: "from-red-400", to: "to-pink-500", light: "bg-red-50", text: "text-red-500" },
  ];

  return (
    <div>
      {/* Gradient header banner */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full animate-float-slow" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full animate-float" />
        <div className="max-w-5xl mx-auto px-5 py-10 relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="animate-fade-in-up">
              <p className="text-sky-200 text-xs font-bold uppercase tracking-widest mb-1">Dashboard</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {session.user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-blue-200 text-sm mt-1">Here&apos;s an overview of your content.</p>
            </div>
            <Link href="/dashboard/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-sky-50 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-px animate-fade-in-up delay-100">
              + New Post
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30L720 10L1440 30V30H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-2">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="card p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 animate-fade-in-up overflow-hidden relative group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.from} ${s.to} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center text-white text-xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {s.icon}
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Posts table */}
        <div className="card overflow-hidden animate-fade-in-up delay-300">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 via-sky-50 to-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="font-bold text-gray-900">Your Posts</h2>
            </div>
            <span className="text-xs text-gray-400 bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">{posts.length} total</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-3xl animate-bounce-in">✍️</div>
              <p className="font-bold text-gray-700 mb-1">No posts yet</p>
              <p className="text-sm text-gray-400 mb-5">Create your first post to get started.</p>
              <Link href="/dashboard/new" className="btn-primary">Write your first post</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {posts.map((post: any, i: number) => (
                <div
                  key={post._id.toString()}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-sky-50/30 transition-all duration-200 group animate-fade-in-up"
                  style={{ animationDelay: `${300 + i * 50}ms` }}
                >
                  {/* Status indicator */}
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${post.status === "published" ? "bg-emerald-500 shadow-sm shadow-emerald-300" : "bg-amber-400 shadow-sm shadow-amber-200"}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm group-hover:text-blue-700 transition-colors">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                      }`}>{post.status}</span>
                      <span className="text-[11px] text-gray-400">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                        <span className="text-red-400">♥</span> {post.likes?.length ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link href={`/dashboard/edit/${post._id}`} className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">Edit</Link>
                    <Link href={`/posts/${post.slug}`} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">View ↗</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
