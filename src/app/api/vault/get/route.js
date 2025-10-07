import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import VaultItem from "@/models/VaultItem";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const ownerId = decoded.userId || decoded.id || decoded.id;
    const vaults = await VaultItem.find({ owner: ownerId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ vaults }, { status: 200 });
  } catch (err) {
    console.error("get vault error:", err);
    return NextResponse.json({ error: "Failed to fetch vault" }, { status: 500 });
  }
}
