import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import slugify from "slugify";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const authorId = searchParams.get("author");

  const query: any = {};
  if (status) query.status = status;
  else query.status = "published";
  if (search) query.$text = { $search: search };
  if (authorId) query.author = authorId;

  const posts = await Post.find(query)
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "author") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const body = await req.json();
  const slug = slugify(body.title, { lower: true, strict: true }) + "-" + Date.now();
  const post = await Post.create({ ...body, slug, author: session.user.id });
  return NextResponse.json(post, { status: 201 });
}
