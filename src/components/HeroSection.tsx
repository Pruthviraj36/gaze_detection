import ScrollReveal from "./ScrollReveal";
import { Eye, Cpu, Layers } from "lucide-react";

const stats = [
  { icon: Eye, label: "Output", value: "2D Gaze Vector" },
  { icon: Cpu, label: "Parameters", value: "~12.5M" },
  { icon: Layers, label: "Backbone", value: "ResNet-18" },
];

const HeroSection = () => (
  <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
    {/* Subtle grid */}
    <div className="absolute inset-0 opacity-[0.035]" style={{
      backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
      backgroundSize: "48px 48px"
    }} />

    <div className="container relative max-w-5xl mx-auto px-6">
      <ScrollReveal>
        <p className="font-mono text-sm tracking-wider uppercase text-muted-foreground mb-4">
          Deep Learning · Gaze Estimation
        </p>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-[0.95] mb-6">
          MPIIGaze Model
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed mb-12">
          A CNN-based regression model built on a modified ResNet-18 backbone, 
          optimized for precision eye-tracking from grayscale eye patches with 
          integrated head pose compensation.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={260}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative rounded-xl border bg-[hsl(var(--surface-elevated))] p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <s.icon className="w-5 h-5 text-primary mb-3" strokeWidth={1.8} />
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-lg font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default HeroSection;
