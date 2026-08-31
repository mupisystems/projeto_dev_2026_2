import HeroMedia from "./HeroMedia";
import Navbar from "@/components/Navbar/Navbar";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[900px] items-center overflow-hidden border-b border-white/10">
      <HeroMedia />
      <div className="hero-overlay" />
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <Navbar variant="hero" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-end px-6 lg:px-12">
        <div className="max-w-2xl text-left lg:mr-[4%]">
          <p className="eyebrow mb-7 text-white/65">Brezelle collab bureau / 2026</p>
          <h1 className="max-w-3xl text-6xl font-black leading-[.9] tracking-[-.06em] text-white sm:text-8xl lg:text-[9.5rem]">Make it<br /><span className="text-white/30">matter.</span></h1>
          <p className="mt-9 max-w-md text-sm leading-6 text-white/70 sm:text-base">As melhores collabs não seguem tendência. Elas definem uma.</p>
          <a href="#proposal" className="button-primary mt-9 inline-flex items-center gap-8">Apresente sua ideia <span className="text-base">↓</span></a>
        </div>
      </div>
      <div className="absolute bottom-8 left-6 right-6 z-10 flex justify-between text-[10px] font-bold uppercase tracking-[.2em] text-white/45 lg:left-12 lg:right-12"><span>São Paulo / Brasil</span><span>Scroll to explore ↓</span></div>
    </section>
  );
}
