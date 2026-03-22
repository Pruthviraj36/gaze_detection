import ScrollReveal from "./ScrollReveal";

const pipeline = [
  { label: "Input", detail: "1-ch Grayscale\n64×64 eye patch", accent: true },
  { label: "Conv Layer", detail: "3×3 kernel\nModified input", accent: false },
  { label: "ResNet Blocks", detail: "layer1 → layer4\n512 features", accent: false },
  { label: "GAP", detail: "Global Avg Pool\n512-d vector", accent: false },
  { label: "Concat", detail: "+2 head pose\n→ 514 features", accent: true },
  { label: "FC Head", detail: "514→256→2\nBN + Dropout", accent: false },
  { label: "Output", detail: "Pitch & Yaw\nGaze angles", accent: true },
];

const ArchitectureSection = () => (
  <section className="py-20 md:py-28">
    <div className="container max-w-5xl mx-auto px-6">
      <ScrollReveal>
        <p className="font-mono text-xs tracking-wider uppercase text-primary mb-3">Architecture</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
          End-to-end pipeline
        </h2>
        <p className="text-muted-foreground max-w-xl mb-12 text-pretty">
          From raw grayscale eye patch to gaze direction — the model fuses visual 
          features with head pose angles for accurate estimation.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {pipeline.map((step, i) => (
            <div key={step.label} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-lg border p-4 text-center transition-shadow duration-300 hover:shadow-md ${
                  step.accent
                    ? "bg-primary/[0.06] border-primary/20"
                    : "bg-[hsl(var(--surface-elevated))]"
                }`}
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Step {i + 1}
                </p>
                <p className="font-semibold text-sm text-foreground mb-1">{step.label}</p>
                <p className="font-mono text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {step.detail}
                </p>
              </div>
              {i < pipeline.length - 1 && (
                <div className="hidden md:block text-muted-foreground/40 text-xl mt-2 rotate-0 md:rotate-0">→</div>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ArchitectureSection;
