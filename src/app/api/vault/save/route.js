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

    const ownerId = decoded.userId || decoded.id || decoded.id;
    const { encryptedData, id } = await req.json();

    if (!encryptedData || !encryptedData.iv || !encryptedData.ciphertext) {
      return NextResponse.json({ error: "Invalid encryptedData" }, { status: 400 });
    }

    if (id) {
      await VaultItem.findByIdAndUpdate(id, { encryptedData, updatedAt: new Date() });
      return NextResponse.json({ success: true });
    }

    const newItem = await VaultItem.create({ owner: ownerId, encryptedData });
    return NextResponse.json({ success: true, id: newItem._id });
  } catch (err) {
    console.error("save vault error:", err);
    return NextResponse.json({ error: "Failed to save vault entry" }, { status: 500 });
  }
}
