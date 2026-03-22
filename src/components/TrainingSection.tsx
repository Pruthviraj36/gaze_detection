import ScrollReveal from "./ScrollReveal";
import { useMemo } from "react";

// Simulated training loss data
const epochs = Array.from({ length: 50 }, (_, i) => i + 1);
const trainLoss = epochs.map((e) => 2.8 * Math.exp(-0.06 * e) + 0.12 + Math.random() * 0.04);
const valLoss = epochs.map((e) => 2.9 * Math.exp(-0.055 * e) + 0.18 + Math.random() * 0.06);

const hyperparams = [
  { k: "Optimizer", v: "Adam" },
  { k: "Learning Rate", v: "1e-4" },
  { k: "LR Schedule", v: "StepLR (γ=0.1, step=15)" },
  { k: "Batch Size", v: "64" },
  { k: "Epochs", v: "50" },
  { k: "Weight Decay", v: "1e-4" },
  { k: "Dropout", v: "0.5" },
  { k: "Loss Function", v: "L1 (MAE)" },
];

const datasetInfo = [
  { k: "Dataset", v: "MPIIGaze" },
  { k: "Subjects", v: "15 participants" },
  { k: "Total Samples", v: "213,659 images" },
  { k: "Evaluation", v: "Leave-one-out cross-val" },
  { k: "Eye Patches", v: "Normalized 64×64" },
  { k: "Annotations", v: "3D gaze direction" },
];

const LossChart = () => {
  const chartW = 480;
  const chartH = 200;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const w = chartW - padL - padR;
  const h = chartH - padT - padB;

  const maxY = 3.2;
  const toX = (i: number) => padL + (i / (epochs.length - 1)) * w;
  const toY = (v: number) => padT + (1 - v / maxY) * h;

  const makePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
      {/* Grid lines */}
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={toY(t)} x2={chartW - padR} y2={toY(t)} stroke="hsl(var(--border))" strokeWidth="0.5" />
          <text x={padL - 6} y={toY(t) + 3} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="JetBrains Mono" opacity="0.6">
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Epoch labels */}
      {[1, 10, 20, 30, 40, 50].map((e) => (
        <text key={e} x={toX(e - 1)} y={chartH - 4} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="JetBrains Mono" opacity="0.6">
          {e}
        </text>
      ))}

      {/* Validation loss */}
      <path d={makePath(valLoss)} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.35" strokeLinejoin="round" />

      {/* Train loss */}
      <path d={makePath(trainLoss)} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.8" strokeLinejoin="round" />

      {/* Legend */}
      <circle cx={chartW - padR - 80} cy={padT + 6} r="3" fill="hsl(var(--primary))" />
      <text x={chartW - padR - 74} y={padT + 9} fill="hsl(var(--foreground))" fontSize="7" fontFamily="JetBrains Mono">Train</text>
      <circle cx={chartW - padR - 40} cy={padT + 6} r="3" fill="hsl(var(--muted-foreground))" opacity="0.5" />
      <text x={chartW - padR - 34} y={padT + 9} fill="hsl(var(--foreground))" fontSize="7" fontFamily="JetBrains Mono">Val</text>

      {/* Axis labels */}
      <text x={chartW / 2} y={chartH} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="JetBrains Mono" opacity="0.5">Epoch</text>
    </svg>
  );
};

const TrainingSection = () => (
  <section className="py-24 md:py-32" id="training">
    <div className="container max-w-6xl mx-auto px-6">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-primary" />
          <span className="font-mono text-xs tracking-widest uppercase text-primary">Training</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Training Details
        </h2>
        <p className="text-secondary-foreground max-w-lg mb-16 text-pretty">
          Loss convergence, dataset statistics, and the hyperparameters used 
          to train the gaze estimation model.
        </p>
      </ScrollReveal>

      {/* Loss Chart */}
      <ScrollReveal delay={80}>
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground text-sm">Loss Curve</h3>
            <span className="font-mono text-[10px] text-muted-foreground">L1 Loss (MAE) over 50 epochs</span>
          </div>
          <LossChart />
        </div>
      </ScrollReveal>

      {/* Dataset + Hyperparams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScrollReveal delay={140}>
          <div className="rounded-xl border bg-card p-6 h-full card-hover">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground text-sm">Dataset</h3>
              <span className="font-mono text-[10px] font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                DATA
              </span>
            </div>
            <div className="space-y-3">
              {datasetInfo.map((d) => (
                <div key={d.k} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{d.k}</span>
                  <span className="font-mono text-xs font-medium text-foreground">{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="rounded-xl border bg-card p-6 h-full card-hover">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground text-sm">Hyperparameters</h3>
              <span className="font-mono text-[10px] font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                CONFIG
              </span>
            </div>
            <div className="space-y-3">
              {hyperparams.map((h) => (
                <div key={h.k} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{h.k}</span>
                  <span className="font-mono text-xs font-medium text-foreground">{h.v}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default TrainingSection;
