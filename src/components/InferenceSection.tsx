import ScrollReveal from "./ScrollReveal";

const codeSnippet = `import torch, cv2

# Load model
model = torch.load("gaze_model.pth")
model.eval()

# Pre-process eye patch
img = cv2.imread("eye.png", cv2.IMREAD_GRAYSCALE)
img = cv2.resize(img, (64, 64))
tensor = torch.tensor(img / 255.0, dtype=torch.float32)
tensor = tensor.unsqueeze(0).unsqueeze(0)

# Head pose input
head_pose = torch.tensor([[pitch, yaw]])

# Run inference
with torch.no_grad():
    gaze = model(tensor, head_pose)
    print(f"Gaze: {gaze}")  # → [pitch, yaw]`;

const InferenceSection = () => (
  <section className="py-24 md:py-32 relative" id="inference">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
    <div className="container relative max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-primary" />
              <span className="font-mono text-xs tracking-widest uppercase text-primary">Usage</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Inference
            </h2>
            <p className="text-secondary-foreground max-w-md mb-10 text-pretty">
              Four preprocessing steps, then a single forward pass yields 
              the gaze direction vector.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-5">
              {[
                { n: "01", title: "Grayscale", desc: "Convert to single channel" },
                { n: "02", title: "Resize 64×64", desc: "Standardize eye patch dimensions" },
                { n: "03", title: "Normalize", desc: "Scale pixel values to [0, 1]" },
                { n: "04", title: "Head Pose", desc: "Provide pitch & yaw as 2D vector" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-primary mt-1">{item.n}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={150} direction="left">
          <div className="rounded-xl overflow-hidden border bg-card shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-secondary/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground ml-2">inference.py</span>
            </div>
            <pre className="p-5 overflow-x-auto">
              <code className="font-mono text-[12px] leading-[1.7] text-secondary-foreground">
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
