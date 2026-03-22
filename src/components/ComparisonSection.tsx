import ScrollReveal from "./ScrollReveal";
import { Check, X, Minus } from "lucide-react";

const models = [
  {
    name: "MPIIGaze (Ours)",
    highlight: true,
    backbone: "ResNet-18",
    params: "12.5M",
    input: "Grayscale 64×64",
    headPose: true,
    output: "Pitch & Yaw",
    errorDeg: "4.5°",
    realtime: true,
    lightweight: true,
  },
  {
    name: "GazeNet",
    highlight: false,
    backbone: "AlexNet",
    params: "~60M",
    input: "RGB 224×224",
    headPose: false,
    output: "Pitch & Yaw",
    errorDeg: "6.3°",
    realtime: true,
    lightweight: false,
  },
  {
    name: "Full-Face Model",
    highlight: false,
    backbone: "VGG-16",
    params: "~138M",
    input: "RGB 448×448",
    headPose: true,
    output: "3D Gaze",
    errorDeg: "4.8°",
    realtime: false,
    lightweight: false,
  },
  {
    name: "iTracker",
    highlight: false,
    backbone: "Custom CNN",
    params: "~20M",
    input: "RGB 224×224",
    headPose: true,
    output: "Screen XY",
    errorDeg: "3.3°",
    realtime: false,
    lightweight: false,
  },
  {
    name: "RT-GENE",
    highlight: false,
    backbone: "ResNet-18",
    params: "~11M",
    input: "RGB 224×224",
    headPose: true,
    output: "Pitch & Yaw",
    errorDeg: "5.1°",
    realtime: true,
    lightweight: true,
  },
];

const BoolIcon = ({ val }: { val: boolean }) =>
  val ? (
    <Check className="w-3.5 h-3.5 text-primary mx-auto" />
  ) : (
    <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" />
  );

const ComparisonSection = () => (
  <section className="py-24 md:py-32" id="comparison">
    <div className="container max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-primary" />
          <span className="font-mono text-xs tracking-widest uppercase text-primary">
            Benchmark
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Model Comparison
        </h2>
        <p className="text-secondary-foreground max-w-lg mb-16 text-pretty">
          How MPIIGaze stacks up against other popular gaze estimation 
          architectures in accuracy, efficiency, and design.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider">
                    Model
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider">
                    Backbone
                  </th>
                  <th className="text-right font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider">
                    Params
                  </th>
                  <th className="text-left font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider hidden md:table-cell">
                    Input
                  </th>
                  <th className="text-center font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider">
                    Head Pose
                  </th>
                  <th className="text-right font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider">
                    Error
                  </th>
                  <th className="text-center font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Realtime
                  </th>
                  <th className="text-center font-medium text-muted-foreground px-5 py-3.5 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Lightweight
                  </th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr
                    key={m.name}
                    className={`border-b last:border-b-0 transition-colors ${
                      m.highlight
                        ? "bg-primary/[0.04]"
                        : "hover:bg-secondary/20"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {m.highlight && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary glow-dot shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
                            m.highlight ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {m.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {m.backbone}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-foreground text-right tabular-nums">
                      {m.params}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground hidden md:table-cell">
                      {m.input}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <BoolIcon val={m.headPose} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-foreground text-right tabular-nums">
                      {m.errorDeg}
                    </td>
                    <td className="px-5 py-4 text-center hidden sm:table-cell">
                      <BoolIcon val={m.realtime} />
                    </td>
                    <td className="px-5 py-4 text-center hidden sm:table-cell">
                      <BoolIcon val={m.lightweight} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ComparisonSection;
