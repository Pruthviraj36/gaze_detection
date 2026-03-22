import ScrollReveal from "./ScrollReveal";

const codeSnippet = `# Pre-processing pipeline
image = cv2.imread("eye_patch.png", cv2.IMREAD_GRAYSCALE)
image = cv2.resize(image, (64, 64))
tensor = torch.tensor(image / 255.0, dtype=torch.float32)
tensor = tensor.unsqueeze(0).unsqueeze(0)  # [1, 1, 64, 64]

# Head pose vector
head_pose = torch.tensor([[pitch, yaw]], dtype=torch.float32)

# Inference
with torch.no_grad():
    gaze = model(tensor, head_pose)  # → [pitch, yaw]`;

const InferenceSection = () => (
  <section className="py-20 md:py-28">
    <div className="container max-w-5xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <ScrollReveal>
            <p className="font-mono text-xs tracking-wider uppercase text-primary mb-3">Inference</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
              Running the model
            </h2>
            <p className="text-muted-foreground mb-8 text-pretty">
              The model requires a grayscale eye patch and a 2D head pose vector. 
              Output represents gaze direction as pitch and yaw angles.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-4">
              {[
                { step: "Grayscale", desc: "Convert input to single-channel grayscale" },
                { step: "Resize", desc: "Scale to 64×64 pixel eye patch" },
                { step: "Normalize", desc: "Map pixel values to 0.0–1.0 range" },
                { step: "Head Pose", desc: "Provide [pitch, yaw] as secondary input" },
              ].map((item, i) => (
                <div key={item.step} className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-primary w-6">{i + 1}.</span>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.step}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={150} direction="left">
          <div className="rounded-xl overflow-hidden border shadow-lg shadow-foreground/5">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[hsl(var(--code-bg))] border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              <span className="ml-2 font-mono text-[11px] text-[hsl(var(--code-fg))]/50">inference.py</span>
            </div>
            <pre className="p-5 bg-[hsl(var(--code-bg))] overflow-x-auto">
              <code className="font-mono text-[13px] leading-relaxed text-[hsl(var(--code-fg))]">
                {codeSnippet}
              </code>
            </pre>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default InferenceSection;
