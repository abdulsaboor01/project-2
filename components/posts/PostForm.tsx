"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  status: "draft" | "published";
  coverImage: string;
}

interface Props {
  initialData?: Partial<PostFormData> & { _id?: string };
}

export default function PostForm({ initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    tags: initialData?.tags || "",
    status: initialData?.status || "draft",
    coverImage: initialData?.coverImage || "",
  });
  const [saving, setSaving] = useState(false);
  const isEdit = !!initialData?._id;

  const set = (key: keyof PostFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    const res = isEdit
      ? await fetch(`/api/posts/${initialData!._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Title */}
      <div>
        <input
          value={form.title}
          onChange={set("title")}
          placeholder="Your post title..."
          required
          className="w-full text-3xl font-extrabold text-slate-900 placeholder:text-slate-300 bg-transparent border-0 border-b-2 border-slate-100 focus:border-indigo-400 pb-3 focus:outline-none transition-colors"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={set("excerpt") as any}
          placeholder="A short summary shown in post cards and search results..."
          rows={2}
          className="input resize-none"
        />
      </div>

      {/* Content editor */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Content</label>
        <RichTextEditor content={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tags</label>
        <input
          value={form.tags}
          onChange={set("tags")}
          placeholder="technology, design, tutorial  (comma separated)"
          className="input"
        />
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <select
          value={form.status}
          onChange={set("status")}
          className="input w-auto pr-8"
        >
          <option value="draft">📄 Save as Draft</option>
          <option value="published">🌐 Publish</option>
        </select>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/dashboard")} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><span className="animate-spin">⟳</span> Saving...</> : isEdit ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
