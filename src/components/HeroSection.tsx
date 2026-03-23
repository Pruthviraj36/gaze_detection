import ScrollReveal from "./ScrollReveal";

const EyeVisualization = () => (
  <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-glow" />
    {/* Mid ring */}
    <div className="absolute inset-4 rounded-full border border-primary/10" />
    {/* Eye shape */}
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
      {/* Crosshairs */}
      <line
        x1="100"
        y1="30"
        x2="100"
        y2="170"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <line
        x1="30"
        y1="100"
        x2="170"
        y2="100"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      {/* Eye outline */}
      <ellipse
        cx="100"
        cy="100"
        rx="55"
        ry="35"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Iris */}
      <circle
        cx="100"
        cy="100"
        r="22"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Pupil */}
      <circle
        cx="100"
        cy="100"
        r="10"
        fill="hsl(var(--primary))"
        opacity="0.5"
      />
      {/* Gaze vector */}
      <line
        x1="100"
        y1="100"
        x2="135"
        y2="78"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="135" cy="78" r="3" fill="hsl(var(--primary))" />
      {/* Angle indicators */}
      <text
        x="140"
        y="75"
        fill="hsl(var(--primary))"
        fontSize="8"
        fontFamily="JetBrains Mono"
        opacity="0.7"
      >
        θ
      </text>
      <text
        x="105"
        y="95"
        fill="hsl(var(--muted-foreground))"
        fontSize="7"
        fontFamily="JetBrains Mono"
        opacity="0.5"
      >
        pitch
      </text>
      <text
        x="108"
        y="106"
        fill="hsl(var(--muted-foreground))"
        fontSize="7"
        fontFamily="JetBrains Mono"
        opacity="0.5"
      >
        yaw
      </text>
    </svg>
    {/* Corner markers */}
    <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary/30" />
    <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary/30" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-primary/30" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary/30" />
  </div>
);

const stats = [
  { value: "6", label: "Landmarks", sub: "Required points" },
  { value: "3", label: "Output Dim", sub: "Pitch · Yaw · Roll" },
  { value: "MAT", label: "Model Source", sub: "3D face points" },
  { value: "PnP", label: "Pose Solver", sub: "OpenCV solvePnP" },
];

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    {/* Background grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
    {/* Radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />

    <div className="container relative max-w-6xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary glow-dot" />
              <span className="font-mono text-[11px] tracking-wider uppercase text-primary">
                Landmark Pose Estimation
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[0.92] mb-6">
              Face
              <br />
              <span className="text-primary">Pose</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-secondary-foreground text-lg leading-relaxed max-w-md mb-10 text-pretty">
              A 6-point face-pose pipeline built on a .mat 3D face model. Upload
              an image, mark landmarks, and estimate pitch, yaw, and roll.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border bg-card p-3 card-hover"
                >
                  <p className="font-mono text-xl font-bold text-foreground">
                    {s.value}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {s.label}
                  </p>
                  <p className="font-mono text-[10px] text-[hsl(var(--text-dim))]">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={200} direction="left">
          <EyeVisualization />
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default HeroSection;
