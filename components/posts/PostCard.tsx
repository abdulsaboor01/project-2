import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author: { name: string };
  likes: string[];
  tags?: string[];
  createdAt: string;
  status: string;
}

function readingTime(content = "") {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const colors = ["from-blue-500 to-sky-400", "from-sky-500 to-cyan-400", "from-blue-600 to-indigo-500", "from-cyan-500 to-blue-500"];

export default function PostCard({ post }: { post: Post }) {
  const mins = readingTime(post.content);
  const colorIdx = post.title.charCodeAt(0) % colors.length;

  return (
    <article className="group card overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-blue-200/60 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      {/* Cover / accent */}
      {post.coverImage ? (
        <div className="relative overflow-hidden h-48 shrink-0">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Reading time badge on image */}
          <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {mins} min read
          </span>
        </div>
      ) : (
        <div className={`relative h-2 shrink-0 bg-gradient-to-r ${colors[colorIdx]} animate-gradient`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer-bar" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 2).map((t) => (
              <span key={t} className="tag hover:bg-blue-100 hover:scale-105 transition-all duration-200 cursor-default">{t}</span>
            ))}
          </div>
        )}

        {/* Title + excerpt */}
        <Link href={`/posts/${post.slug}`} className="flex-1 group/link">
          <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug text-[15px] mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          )}
        </Link>

        {/* Divider */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md group-hover:scale-110 group-hover:shadow-blue-300 transition-all duration-300`}>
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{post.author.name}</p>
              <p className="text-[11px] text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {mins} min read
              </p>
            </div>
            {/* Likes */}
            <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0 group-hover:text-red-400 transition-colors duration-300">
              <span className="group-hover:scale-125 group-hover:animate-bounce transition-transform duration-300 inline-block">♥</span>
              <span>{post.likes.length}</span>
            </div>
            {post.status === "draft" && (
              <span className="text-[11px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold ring-1 ring-amber-100">Draft</span>
            )}
          </div>

          {/* Animated read more */}
          <Link href={`/posts/${post.slug}`} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="w-4 h-px bg-blue-600 group-hover:w-6 transition-all duration-300" />
            Read article
            <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
