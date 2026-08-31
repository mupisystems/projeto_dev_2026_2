"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import LoginSection from "./LoginSection/LoginSection";
import Navbar from "@/components/Navbar/Navbar";

export default function AdminLoginPage() {
  const router = useRouter(); const [email, setEmail] = useState("admin@brezelle.com"); const [password, setPassword] = useState("admin123"); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); const payload = await response.json().catch(() => ({})); if (!response.ok) setError(payload.error || "Não foi possível entrar."); else router.push("/admin"); setLoading(false); }
  return <main className="flex min-h-screen items-center justify-center bg-ink px-6"><div className="w-full max-w-md"><Navbar variant="minimal" /><LoginSection email={email} password={password} error={error} loading={loading} onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={login} /></div></main>;
}
