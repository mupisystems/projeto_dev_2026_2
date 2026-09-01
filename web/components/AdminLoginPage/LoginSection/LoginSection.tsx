import type { FormEvent } from "react";

type Props = { email: string; password: string; error: string; loading: boolean; onEmailChange: (value: string) => void; onPasswordChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; };

export default function LoginSection({ email, password, error, loading, onEmailChange, onPasswordChange, onSubmit }: Props) {
  return <section className="mt-20"><p className="eyebrow">Área interna / Login</p><h1 className="mt-5 text-5xl font-bold tracking-[-.06em]">Bem-vindo<br />de volta.</h1><form onSubmit={onSubmit} className="mt-12 grid gap-6"><label><span className="eyebrow mb-2 block text-white/60">Email</span><input className="field" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} required /></label><label><span className="eyebrow mb-2 block text-white/60">Senha</span><input className="field" type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} required /></label>{error && <p role="alert" className="border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}<button className="button-primary mt-2 w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar no painel ↗"}</button></form></section>;
}
