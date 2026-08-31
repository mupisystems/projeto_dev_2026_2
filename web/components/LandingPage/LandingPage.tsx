import FooterSection from "./FooterSection/FooterSection";
import HeroSection from "./HeroSection/HeroSection";
import ManifestoSection from "./ManifestoSection/ManifestoSection";
import ProposalSection from "./ProposalSection/ProposalSection";

export default function LandingPage() {
  return <main className="min-h-screen bg-ink"><HeroSection /><ManifestoSection /><ProposalSection /><FooterSection /></main>;
}
