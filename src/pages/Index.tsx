import HeroSection from "@/components/HeroSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import LayerSpecsSection from "@/components/LayerSpecsSection";
import InferenceSection from "@/components/InferenceSection";
import ComparisonSection from "@/components/ComparisonSection";
import DemoSection from "@/components/DemoSection";
import TrainingSection from "@/components/TrainingSection";

const navLinks = [
  { href: "#architecture", label: "Architecture" },
  { href: "#specs", label: "Specs" },
  { href: "#comparison", label: "Compare" },
  { href: "#demo", label: "Demo" },
  { href: "#inference", label: "Inference" },
];

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    {/* Navbar */}
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b">
      <div className="container max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono text-xs font-bold">G</span>
          </div>
          <span className="font-semibold text-foreground text-sm tracking-tight">MPIIGaze</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>

    <main>
      <HeroSection />
      <ArchitectureSection />
      <LayerSpecsSection />
      <ComparisonSection />
      <DemoSection />
      <InferenceSection />
    </main>

    <footer className="border-t py-10">
      <div className="container max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[11px] text-muted-foreground">
          MPIIGaze · CNN Gaze Estimation · ~12.5M Parameters
        </p>
        <p className="font-mono text-[11px] text-[hsl(var(--text-dim))]">
          Built for research & demonstration
        </p>
      </div>
    </footer>
  </div>
);

export default Index;
