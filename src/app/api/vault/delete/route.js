import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await VaultItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
