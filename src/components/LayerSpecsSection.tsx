import ScrollReveal from "./ScrollReveal";

const layers = [
  {
    name: "Input Layer",
    tag: "CONV",
    specs: [
      { k: "Kernel", v: "3×3 (modified)" },
      { k: "Channels", v: "1 (grayscale)" },
      { k: "Target", v: "High-freq features" },
      { k: "Input Size", v: "64×64 px" },
    ],
  },
  {
    name: "ResNet-18 Backbone",
    tag: "FEAT",
    specs: [
      { k: "Blocks", v: "layer1 → layer4" },
      { k: "Output", v: "512 features" },
      { k: "Pooling", v: "Global Adaptive Avg" },
      { k: "Architecture", v: "Modified ResNet" },
    ],
  },
  {
    name: "Feature Fusion",
    tag: "FUSE",
    specs: [
      { k: "CNN Features", v: "512-d" },
      { k: "Head Pose", v: "+2 (pitch, yaw)" },
      { k: "Combined", v: "514-d vector" },
      { k: "Purpose", v: "Pose compensation" },
    ],
  },
  {
    name: "Classification Head",
    tag: "HEAD",
    specs: [
      { k: "FC1", v: "514 → 256" },
      { k: "Activation", v: "BN + ReLU" },
      { k: "Dropout", v: "p = 0.5" },
      { k: "FC2 (Output)", v: "256 → 2" },
    ],
  },
];

const LayerSpecsSection = () => (
  <section className="py-24 md:py-32" id="specs">
    <div className="container max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-primary" />
          <span className="font-mono text-xs tracking-widest uppercase text-primary">Layers</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Specifications
        </h2>
        <p className="text-secondary-foreground max-w-lg mb-16 text-pretty">
          Detailed breakdown of each layer group with exact dimensions and configurations.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layers.map((layer, i) => (
          <ScrollReveal key={layer.name} delay={i * 80}>
            <div className="rounded-xl border bg-card p-6 h-full card-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">{layer.name}</h3>
                <span className="font-mono text-[10px] font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                  {layer.tag}
                </span>
              </div>
              <div className="space-y-3">
                {layer.specs.map((spec) => (
                  <div key={spec.k} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{spec.k}</span>
                    <span className="font-mono text-xs font-medium text-foreground">{spec.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default LayerSpecsSection;
