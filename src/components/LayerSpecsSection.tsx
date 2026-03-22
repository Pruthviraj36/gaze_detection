import ScrollReveal from "./ScrollReveal";

const layers = [
  {
    name: "Input Layer",
    specs: ["Modified 3×3 conv kernel", "1 input channel (grayscale)", "Optimized for fine, high-frequency features", "Designed for 64×64 eye patches"],
  },
  {
    name: "Backbone (ResNet-18)",
    specs: ["Sequential ResNet blocks (layer1–layer4)", "Progressive feature extraction", "Output: 512 features", "Global Adaptive Average Pooling"],
  },
  {
    name: "Feature Concatenation",
    specs: ["512 CNN features + 2 head pose values", "Combined input: 514 dimensions", "Head pose: Pitch & Yaw angles", "Improves accuracy via pose compensation"],
  },
  {
    name: "FC Classification Head",
    specs: ["FC1: 514 → 256 + BatchNorm + ReLU", "Dropout: p=0.5 regularization", "FC2: 256 → 2 (output)", "Output: (Pitch, Yaw) gaze angles"],
  },
];

const LayerSpecsSection = () => (
  <section className="py-20 md:py-28 bg-[hsl(var(--card))]">
    <div className="container max-w-5xl mx-auto px-6">
      <ScrollReveal>
        <p className="font-mono text-xs tracking-wider uppercase text-primary mb-3">Specifications</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-12 text-balance">
          Layer-by-layer breakdown
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {layers.map((layer, i) => (
          <ScrollReveal key={layer.name} delay={i * 80}>
            <div className="rounded-xl border bg-[hsl(var(--surface-elevated))] p-6 h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs font-semibold text-primary bg-primary/10 rounded-md px-2 py-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-foreground">{layer.name}</h3>
              </div>
              <ul className="space-y-2">
                {layer.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    <span className="font-mono text-[13px]">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default LayerSpecsSection;
