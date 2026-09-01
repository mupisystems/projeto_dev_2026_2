import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPageView from "@/components/AdminPage/AdminPage";
import { API_URL, CollabType, SubmissionResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const token = (await cookies()).get("brezelle_token")?.value;
  if (!token) redirect("/admin/login");
  const headers = { Authorization: `Bearer ${token}` };
  const [submissionResponse, typeResponse] = await Promise.all([
    fetch(`${API_URL}/submissions?page=1&limit=10`, {
      headers,
      cache: "no-store",
    }),
    fetch(`${API_URL}/collab-types/all`, { headers, cache: "no-store" }),
  ]);
  if (submissionResponse.status === 401 || typeResponse.status === 401)
    redirect("/admin/login");
  const data = (await submissionResponse.json()) as SubmissionResponse;
  const types = (await typeResponse.json()) as CollabType[];
  return <AdminPageView initialData={data} initialTypes={types} />;
}
