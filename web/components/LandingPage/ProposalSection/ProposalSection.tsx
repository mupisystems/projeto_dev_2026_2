import SubmissionForm from "./SubmissionForm";

export default function ProposalSection() {
  return (
    <section id="proposal" className="border-t border-white/10 bg-[#101010] px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="eyebrow">02 — Open call</p><h2 className="mt-7 max-w-sm text-4xl font-bold leading-none tracking-[-.05em] sm:text-6xl">Vamos fazer algo impossível de ignorar.</h2><div className="mt-12 border-l border-white/25 pl-5 text-sm leading-6 text-fog"><p>Selecione o formato que mais se aproxima da ideia. Cada proposta é lida pela nossa equipe — sem filtro automático, sem formulário jogado no vazio.</p></div></div>
        <SubmissionForm />
      </div>
    </section>
  );
}
