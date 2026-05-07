export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import LikeButton from "@/components/posts/LikeButton";
import Comments from "@/components/posts/Comments";
import Link from "next/link";

type Params = { params: Promise<{ slug: string }> };

function readingTime(content = "") {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function PostPage({ params }: Params) {
  await connectDB();
  const { slug } = await params;
  const post = await Post.findOne({ slug }).populate("author", "name").lean() as any;
  if (!post || post.status !== "published") notFound();

  const session = await auth();
  const comments = await Comment.find({ post: post._id })
    .populate("author", "name _id")
    .sort({ createdAt: 1 })
    .lean();

  const postId = post._id.toString();
  const userId = session?.user?.id;
  const liked = userId ? post.likes.map(String).includes(userId) : false;
  const mins = readingTime(post.content);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero cover or gradient banner */}
      {post.coverImage ? (
        <div className="relative w-full h-72 sm:h-96 overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>
      ) : (
        <div className="w-full h-3 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 animate-gradient" />
      )}

      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-8 group animate-fade-in">
          <span className="group-hover:-translate-x-1 transition-transform duration-200 inline-block">←</span>
          Back to articles
        </Link>

        <article className="animate-fade-in-up">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag: string) => (
                <span key={tag} className="tag hover:scale-105 transition-transform cursor-default">{tag}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Author card */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
                {(post.author as any).name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{(post.author as any).name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    {mins} min read
                  </span>
                </div>
              </div>
            </div>
            {session?.user?.id === (post.author as any)._id?.toString() && (
              <Link href={`/dashboard/edit/${postId}`} className="btn-secondary text-xs px-3 py-1.5">
                ✏️ Edit post
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Like + share bar */}
          <div className="flex items-center justify-between mt-14 pt-6 border-t border-gray-100">
            <LikeButton postId={postId} initialLikes={post.likes.length} initialLiked={liked} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/posts/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-xs font-semibold border border-sky-100 hover:bg-sky-100 hover:scale-105 transition-all duration-200"
              >
                𝕏 Twitter
              </a>
            </div>
          </div>
        </article>

        {/* Author bio card */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white animate-fade-in-up delay-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {(post.author as any).name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold mb-0.5">Written by</p>
              <p className="text-lg font-bold">{(post.author as any).name}</p>
              <p className="text-sm text-blue-200 mt-0.5">Author on BlogPlatform</p>
            </div>
          </div>
        </div>

        <Comments postId={postId} initialComments={JSON.parse(JSON.stringify(comments))} />
      </div>
    </div>
  );
}
