import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = session.user.id;
  const liked = post.likes.map(String).includes(userId);
  if (liked) {
    post.likes = post.likes.filter((l: any) => l.toString() !== userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return NextResponse.json({ likes: post.likes.length, liked: !liked });
}
