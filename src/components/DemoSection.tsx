import { useState, useCallback, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { Upload, Play, RotateCcw } from "lucide-react";

const DemoSection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{ pitch: number; yaw: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const simulateInference = useCallback(() => {
    setProcessing(true);
    setResult(null);
    // Simulate model inference with random but realistic values
    setTimeout(() => {
      setResult({
        pitch: parseFloat((Math.random() * 30 - 15).toFixed(2)),
        yaw: parseFloat((Math.random() * 40 - 20).toFixed(2)),
      });
      setProcessing(false);
    }, 1800);
  }, []);

  const reset = () => {
    setImage(null);
    setResult(null);
    setProcessing(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section className="py-24 md:py-32 relative" id="demo">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      <div className="container relative max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-[1px] bg-primary" />
            <span className="font-mono text-xs tracking-widest uppercase text-primary">
              Interactive
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Try It Out
          </h2>
          <p className="text-secondary-foreground max-w-lg mb-16 text-pretty">
            Upload a grayscale eye patch image and see simulated gaze estimation 
            output. Real inference requires the PyTorch backend.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload area */}
            <div className="rounded-xl border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Input
              </p>

              {!image ? (
                <label
                  className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:border-primary/30 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drop eye patch image here
                  </p>
                  <p className="text-xs text-[hsl(var(--text-dim))]">
                    or click to browse
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <div className="h-64 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                    <img
                      src={image}
                      alt="Uploaded eye patch"
                      className="max-h-full max-w-full object-contain grayscale"
                    />
                    {/* Scan line effect during processing */}
                    {processing && (
                      <div className="absolute inset-0 overflow-hidden rounded-lg">
                        <div
                          className="absolute inset-x-0 h-0.5 bg-primary/60 blur-[1px]"
                          style={{ animation: "scan-line 1.5s linear infinite" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={simulateInference}
                      disabled={processing || !!result}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4" />
                      {processing ? "Processing..." : "Run Inference"}
                    </button>
                    <button
                      onClick={reset}
                      className="px-3 py-2.5 rounded-lg border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors active:scale-[0.97]"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Output area */}
            <div className="rounded-xl border bg-card p-6">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Output
              </p>

              <div className="h-64 rounded-lg bg-secondary flex items-center justify-center relative overflow-hidden">
                {!result && !processing && (
                  <p className="text-sm text-muted-foreground/50">
                    Awaiting input…
                  </p>
                )}

                {processing && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="font-mono text-xs text-muted-foreground">
                      Simulating forward pass…
                    </p>
                  </div>
                )}

                {result && (
                  <div className="w-full h-full relative">
                    {/* Gaze visualization */}
                    <svg viewBox="0 0 300 240" className="w-full h-full">
                      {/* Grid */}
                      <line x1="150" y1="20" x2="150" y2="220" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="30" y1="120" x2="270" y2="120" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />

                      {/* Origin */}
                      <circle cx="150" cy="120" r="3" fill="hsl(var(--muted-foreground))" opacity="0.3" />

                      {/* Gaze vector */}
                      <line
                        x1="150"
                        y1="120"
                        x2={150 + result.yaw * 4}
                        y2={120 - result.pitch * 4}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx={150 + result.yaw * 4}
                        cy={120 - result.pitch * 4}
                        r="5"
                        fill="hsl(var(--primary))"
                        className="animate-pulse-glow"
                      />

                      {/* Labels */}
                      <text x="155" y="232" fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="JetBrains Mono" opacity="0.5">yaw →</text>
                      <text x="18" y="115" fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="JetBrains Mono" opacity="0.5" transform="rotate(-90, 18, 115)">pitch →</text>
                    </svg>
                  </div>
                )}
              </div>

              {result && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-lg border bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Pitch</p>
                    <p className="font-mono text-lg font-bold text-foreground tabular-nums">
                      {result.pitch > 0 ? "+" : ""}
                      {result.pitch}°
                    </p>
                  </div>
                  <div className="rounded-lg border bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Yaw</p>
                    <p className="font-mono text-lg font-bold text-foreground tabular-nums">
                      {result.yaw > 0 ? "+" : ""}
                      {result.yaw}°
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DemoSection;
