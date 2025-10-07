import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ error: "User already exists" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email : email, password: hashed });

    const token = signToken({ userId: newUser._id, email });
    const res = NextResponse.json({ success: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
