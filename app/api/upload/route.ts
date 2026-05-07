import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "author") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
  const url = await uploadImage(base64);
  return NextResponse.json({ url });
}
