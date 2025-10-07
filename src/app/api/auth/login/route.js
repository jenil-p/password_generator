import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "there is no such user..." }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "invalid email or password..." }, { status: 401 });

    const token = signToken({ userId: user._id, email });
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
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
