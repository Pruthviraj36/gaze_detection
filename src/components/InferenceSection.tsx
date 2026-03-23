import ScrollReveal from "./ScrollReveal";

const codeSnippet = `import torch, cv2
const codeSnippet = `import json, requests

url = "http://localhost:8000/predict"
landmarks = [
  [30, 40], [45, 45], [55, 45],
  [70, 40], [40, 70], [60, 70]
]

with open("face.jpg", "rb") as f:
    files = {"file": f}
    data = {"landmarks": json.dumps(landmarks)}
    res = requests.post(url, files=files, data=data).json()

print(res)  # -> {"pitch": ..., "yaw": ..., "roll": ...}`;

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
              The frontend sends a face image and six facial landmarks.
              The backend uses the .mat face model to estimate pose angles.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-5">
              {[
                { n: "01", title: "Upload Image", desc: "Provide a face image file" },
                { n: "02", title: "Mark 6 Points", desc: "Eyes and mouth corner landmarks" },
                { n: "03", title: "POST /predict", desc: "Send image + landmarks JSON" },
                { n: "04", title: "Read Pose", desc: "Use pitch, yaw, and roll response" },
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
