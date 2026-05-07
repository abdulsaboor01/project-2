import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
  const comments = await Comment.find({ post: postId })
    .populate("author", "name")
    .sort({ createdAt: 1 })
    .lean();
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { postId, content } = await req.json();
  const comment = await Comment.create({ post: postId, author: session.user.id, content });
  await comment.populate("author", "name");
  return NextResponse.json(comment, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await req.json();
  const comment = await Comment.findById(id);
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (comment.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await comment.deleteOne();
  return NextResponse.json({ success: true });
}
