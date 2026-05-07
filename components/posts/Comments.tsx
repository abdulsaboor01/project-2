"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Comment {
  _id: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

interface Props {
  postId: string;
  initialComments: Comment[];
}

export default function Comments({ postId, initialComments }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text }),
    });
    const comment = await res.json();
    setComments((prev) => [...prev, comment]);
    setText("");
    setSubmitting(false);
  }

  async function remove(id: string) {
    await fetch("/api/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setComments((prev) => prev.filter((c) => c._id !== id));
  }

  return (
    <section className="mt-14">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-xl font-bold text-gray-900">
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-100 to-transparent" />
      </div>

      {/* Comment list */}
      <div className="space-y-4 mb-8">
        {comments.length === 0 && (
          <div className="text-center py-10 rounded-2xl bg-gray-50 border border-dashed border-gray-200">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
          </div>
        )}
        {comments.map((c, i) => (
          <div key={c._id} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm mt-0.5">
              {c.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 bg-gray-50 hover:bg-blue-50/40 rounded-2xl px-4 py-3 border border-gray-100 hover:border-blue-100 transition-colors duration-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-bold text-gray-900">{c.author.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {session?.user?.id === (c as any).author._id && (
                    <button onClick={() => remove(c._id)} className="text-[11px] text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-0.5 rounded-full transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment form */}
      {session ? (
        <form onSubmit={submit} className="flex gap-3 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm mt-0.5">
            {session.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white border border-blue-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="btn-primary px-4 py-2 text-xs disabled:opacity-40"
            >
              {submitting ? "..." : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg shrink-0">👤</div>
          <p className="text-sm text-gray-600">
            <a href="/login" className="text-blue-600 font-bold hover:underline">Sign in</a> to join the conversation.
          </p>
        </div>
      )}
    </section>
  );
}
