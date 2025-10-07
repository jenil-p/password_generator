// src/app/api/auth/verify/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    // payload should include userId and email (from signup/login)
    return NextResponse.json({ ok: true, userId: payload.userId || payload.id || payload.id, email: payload.email || null });
  } catch (err) {
    console.error("verify error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
