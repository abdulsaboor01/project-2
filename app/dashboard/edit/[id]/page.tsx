export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import PostForm from "@/components/posts/PostForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const session = await auth();
  if (!session || (session.user as any).role !== "author") redirect("/login");

  await connectDB();
  const { id } = await params;
  const post = await Post.findById(id).lean() as any;
  if (!post || post.author.toString() !== session.user.id) notFound();

  const initialData = {
    _id: post._id.toString(),
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    tags: (post.tags || []).join(", "),
    status: post.status,
    coverImage: post.coverImage || "",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={initialData} />
    </div>
  );
}
