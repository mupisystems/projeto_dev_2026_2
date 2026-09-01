import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.text();
  const upstream = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const payload = await upstream
    .json()
    .catch(() => ({ error: "Não foi possível fazer login." }));
  if (!upstream.ok)
    return NextResponse.json(payload, { status: upstream.status });
  const response = NextResponse.json({ admin: payload.admin });
  response.cookies.set("brezelle_token", payload.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return response;
}
