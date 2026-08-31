import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function POST() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    cache: "no-store",
  }).catch(() => undefined);
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set("brezelle_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
