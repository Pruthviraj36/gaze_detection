import ScrollReveal from "./ScrollReveal";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Input",
    desc: "Face image",
    detail: "RGB frame",
    color: "primary",
  },
  {
    id: "02",
    title: "Landmarks",
    desc: "Select 6 points",
    detail: "Eyes + mouth corners",
    color: "muted",
  },
  {
    id: "03",
    title: "3D Face Model",
    desc: "Load .mat coordinates",
    detail: "(6, 3) object points",
    color: "muted",
  },
  {
    id: "04",
    title: "Camera Matrix",
    desc: "Estimate intrinsics",
    detail: "focal length + center",
    color: "muted",
  },
  {
    id: "05",
    title: "PnP Solve",
    desc: "2D-3D correspondence",
    detail: "cv2.solvePnP",
    color: "primary",
  },
  {
    id: "06",
    title: "Rotation Matrix",
    desc: "Rodrigues transform",
    detail: "rvec → R",
    color: "muted",
  },
  {
    id: "07",
    title: "Output",
    desc: "Pose angles",
    detail: "(pitch, yaw, roll)",
    color: "primary",
  },
];

const ArchitectureSection = () => (
  <section className="py-24 md:py-32 relative" id="architecture">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
    <div className="container relative max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-primary" />
          <span className="font-mono text-xs tracking-widest uppercase text-primary">
            Pipeline
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Architecture
        </h2>
        <p className="text-secondary-foreground max-w-lg mb-16 text-pretty">
          Seven-stage pipeline from image and landmarks to 3D head pose angles,
          powered by the 6-point .mat face model.
        </p>
      </ScrollReveal>

      {/* Pipeline flow */}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <ScrollReveal key={step.id} delay={i * 60}>
            <div className="flex items-center gap-4 group">
              {/* Step number */}
              <span
                className={`font-mono text-xs font-bold w-8 text-center ${
                  step.color === "primary"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.id}
              </span>

              {/* Card */}
              <div
                className={`flex-1 flex items-center justify-between rounded-lg border px-5 py-4 transition-all duration-300 ${
                  step.color === "primary"
                    ? "border-primary/20 bg-primary/[0.04] glow-border"
                    : "bg-card hover:border-muted-foreground/20"
                }`}
              >
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground hidden sm:block">
                  {step.detail}
                </span>
              </div>

              {/* Arrow */}
              {i < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0 hidden md:block" />
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ArchitectureSection;
