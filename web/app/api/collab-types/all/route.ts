import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function GET() {
  const token = (await cookies()).get("brezelle_token")?.value;
  const upstream = await fetch(`${API_URL}/collab-types/all`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(request: Request) {
  const token = (await cookies()).get("brezelle_token")?.value;
  const id = new URL(request.url).searchParams.get("id");
  const upstream = await fetch(`${API_URL}/collab-types/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: await request.text(),
    cache: "no-store",
  });
  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
