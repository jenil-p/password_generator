import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", "", { maxAge: 0, path: "/" });
  return res;
}
