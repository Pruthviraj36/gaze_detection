import HeroSection from "@/components/HeroSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import LayerSpecsSection from "@/components/LayerSpecsSection";
import InferenceSection from "@/components/InferenceSection";

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    {/* Navbar */}
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="container max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono text-xs font-bold">G</span>
          </div>
          <span className="font-semibold text-foreground">MPIIGaze</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#specs" className="hover:text-foreground transition-colors">Specs</a>
          <a href="#inference" className="hover:text-foreground transition-colors">Inference</a>
        </div>
      </div>
    </nav>

    <main>
      <HeroSection />
      <div id="architecture"><ArchitectureSection /></div>
      <div id="specs"><LayerSpecsSection /></div>
      <div id="inference"><InferenceSection /></div>
    </main>

    <footer className="border-t py-8">
      <div className="container max-w-5xl mx-auto px-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          MPIIGaze · CNN-based Gaze Estimation · ResNet-18 Backbone · ~12.5M Parameters
        </p>
      </div>
    </footer>
  </div>
);

export default Index;
