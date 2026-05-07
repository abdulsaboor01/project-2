import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  await connectDB();
  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: role || "reader" });
  return NextResponse.json({ id: user._id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
