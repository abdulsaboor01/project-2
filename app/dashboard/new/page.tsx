import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/posts/PostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "author") redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Post</h1>
      <PostForm />
    </div>
  );
}
