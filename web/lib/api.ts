export const API_URL = process.env.API_URL || "http://localhost:8080";

export type CollabType = { id: number; title: string; active: boolean; created_at?: string; updated_at?: string };
export type SubmissionLog = { id: number; from_status?: string; to_status: string; changed_at: string };
export type Submission = {
  id: number; brand_name: string; email: string; instagram: string; collab_type_id: number;
  collab_type: string; proposed_date: string; pitch: string; status: "pending" | "confirmed" | "cancelled";
  created_at: string; updated_at: string; logs?: SubmissionLog[];
};
export type SubmissionResponse = {
  data: Submission[]; pagination: { page: number; limit: number; total: number; pages: number };
  counts: { pending: number; confirmed: number; cancelled: number };
};
