type MetricProps = { label: string; value: number; tone: string };

function Metric({ label, value, tone }: MetricProps) { return <div className="bg-[#101010] p-6 sm:p-8"><p className="eyebrow">{label}</p><p className={`mt-5 text-5xl font-bold tracking-[-.07em] ${tone}`}>{value}</p></div>; }

export default function MetricsSection({ counts }: { counts: { pending: number; confirmed: number; cancelled: number } }) {
  return <section className="mt-14 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3"><Metric label="Pendentes" value={counts.pending} tone="text-amber-300" /><Metric label="Confirmadas" value={counts.confirmed} tone="text-emerald-300" /><Metric label="Canceladas" value={counts.cancelled} tone="text-red-300" /></section>;
}
