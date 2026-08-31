export default function OverviewSection({ notice }: { notice: string }) {
  return <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow">Painel / Visão geral</p><h1 className="mt-4 text-5xl font-bold tracking-[-.07em] sm:text-7xl">Propostas<span className="text-fog">.</span></h1></div>{notice && <p className="border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">{notice}</p>}</div>;
}
