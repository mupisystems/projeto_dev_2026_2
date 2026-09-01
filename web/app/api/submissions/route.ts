import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

async function proxy(request: Request, path: string) {
  const token = (await cookies()).get("brezelle_token")?.value;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const upstream = await fetch(`${API_URL}${path}`, {
    method: request.method,
    headers,
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: Request) {
  return proxy(request, `/submissions${new URL(request.url).search}`);
}
export async function POST(request: Request) {
  return proxy(request, "/submissions");
}
