import { useState, useCallback, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { Upload, Play, RotateCcw, Crosshair } from "lucide-react";
import { toast } from "sonner";

const DemoSection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [result, setResult] = useState<{ pitch: number; yaw: number; head_pitch?: number; head_yaw?: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingMode, setMarkingMode] = useState(false);
  const [landmarks, setLandmarks] = useState<(number[] | null)[]>(new Array(6).fill(null));
  const [activeLandmarkIndex, setActiveLandmarkIndex] = useState<number>(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const LANDMARK_LABELS = [
    "Left Eye Outer",
    "Left Eye Inner",
    "Right Eye Inner",
    "Right Eye Outer",
    "Left Mouth Corner",
    "Right Mouth Corner"
  ];

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileObject(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
      setError(null);
      setLandmarks(new Array(6).fill(null));
      setActiveLandmarkIndex(0);
      setMarkingMode(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileObject(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
      setError(null);
      setLandmarks(new Array(6).fill(null));
      setActiveLandmarkIndex(0);
      setMarkingMode(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!markingMode || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Relative coordinates based on actual image size
    const relativeX = (x / rect.width) * imageRef.current.naturalWidth;
    const relativeY = (y / rect.height) * imageRef.current.naturalHeight;

    const newLandmarks = [...landmarks];
    newLandmarks[activeLandmarkIndex] = [relativeX, relativeY];
    setLandmarks(newLandmarks);

    if (activeLandmarkIndex < 5) {
      setActiveLandmarkIndex(activeLandmarkIndex + 1);
    } else {
      toast.success("All landmarks placed!");
    }
  };

  const runInference = useCallback(async () => {
    if (!image || !fileObject) {
      setError("Please upload an image first.");
      return;
    }

    setProcessing(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", fileObject);
      
      const allLandmarksPlaced = landmarks.every(l => l !== null);
      if (allLandmarksPlaced) {
        formData.append("landmarks", JSON.stringify(landmarks));
      } else {
        formData.append("pitch", "0.0");
        formData.append("yaw", "0.0");
      }

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Inference failed with status ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult({
        pitch: parseFloat(data.pitch.toFixed(2)),
        yaw: parseFloat(data.yaw.toFixed(2)),
        head_pitch: data.head_pitch !== undefined ? parseFloat(data.head_pitch.toFixed(2)) : undefined,
        head_yaw: data.head_yaw !== undefined ? parseFloat(data.head_yaw.toFixed(2)) : undefined,
      });
      if (data.head_pitch !== undefined) {
        setMarkingMode(false);
      }
    } catch (err: any) {
      console.error("Inference error:", err);
      setError(err.message || "An error occurred during inference");
    } finally {
      setProcessing(false);
    }
  }, [image, fileObject, landmarks]);

  const reset = () => {
    setImage(null);
    setFileObject(null);
    setResult(null);
    setProcessing(false);
    setError(null);
    setLandmarks(new Array(6).fill(null));
    setActiveLandmarkIndex(0);
    setMarkingMode(false);
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
            output. Use landmarks for accurate head pose estimation.
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
                  className="flex flex-col items-center justify-center h-80 rounded-lg border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:border-primary/30 transition-colors"
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
                  <div 
                    className={`h-80 rounded-lg overflow-hidden bg-secondary flex items-center justify-center relative ${markingMode ? 'cursor-crosshair ring-2 ring-primary ring-inset' : ''}`}
                    onClick={handleImageClick}
                  >
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Uploaded eye patch"
                      className="max-h-full max-w-full object-contain grayscale"
                    />
                    
                    {/* Landmark visualization */}
                    {landmarks.map((point, idx) => {
                      if (!point || !imageRef.current) return null;
                      const x = (point[0] / imageRef.current.naturalWidth) * imageRef.current.clientWidth;
                      const y = (point[1] / imageRef.current.naturalHeight) * imageRef.current.clientHeight;
                      
                      return (
                        <div 
                          key={idx}
                          className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-sm transition-colors"
                          style={{ 
                            left: `calc(50% - ${imageRef.current.clientWidth/2}px + ${x}px)`,
                            top: `calc(50% - ${imageRef.current.clientHeight/2}px + ${y}px)`,
                            backgroundColor: idx === activeLandmarkIndex && markingMode ? 'hsl(var(--primary))' : 'rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-mono text-white drop-shadow-md font-bold">
                            {idx + 1}
                          </span>
                        </div>
                      );
                    })}

                    {/* Scan line effect during processing */}
                    {processing && (
                      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div
                          className="absolute inset-x-0 h-0.5 bg-primary/60 blur-[1px]"
                          style={{ animation: "scan-line 1.5s linear infinite" }}
                        />
                      </div>
                    )}
                  </div>

                  {markingMode && (
                    <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-primary flex items-center gap-1.5">
                          <Crosshair className="w-3.5 h-3.5" />
                          Marking: {LANDMARK_LABELS[activeLandmarkIndex]}
                        </p>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {landmarks.filter(l => l !== null).length}/6 points
                        </span>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 invisible-scrollbar">
                        {LANDMARK_LABELS.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setActiveLandmarkIndex(idx); }}
                            className={`flex-none w-7 h-7 rounded-md border flex items-center justify-center text-[10px] font-mono transition-colors ${
                              activeLandmarkIndex === idx 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : landmarks[idx] 
                                  ? 'bg-secondary border-muted-foreground/30 text-foreground'
                                  : 'bg-transparent border-dashed text-muted-foreground'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={runInference}
                      disabled={processing || !!result}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4" />
                      {processing ? "Processing..." : "Run Inference"}
                    </button>
                    {!result && (
                      <button
                        onClick={() => setMarkingMode(!markingMode)}
                        className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors active:scale-[0.97] ${
                          markingMode 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
                        }`}
                      >
                        <Crosshair className="w-4 h-4" />
                        <span className="text-sm font-medium">Pose Markers</span>
                      </button>
                    )}
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
                {!result && !processing && !error && (
                  <p className="text-sm text-muted-foreground/50">
                    Awaiting input…
                  </p>
                )}

                {error && (
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <p className="text-sm font-medium text-destructive">Inference Failed</p>
                    <p className="text-xs text-muted-foreground max-w-[200px] font-mono break-words">{error}</p>
                    <button
                      onClick={runInference}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {processing && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="font-mono text-xs text-muted-foreground">
                      Running inference…
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
                    <p className="text-xs text-muted-foreground mb-0.5">Gaze Pitch</p>
                    <p className="font-mono text-lg font-bold text-foreground tabular-nums">
                      {result.pitch > 0 ? "+" : ""}
                      {result.pitch}°
                    </p>
                  </div>
                  <div className="rounded-lg border bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Gaze Yaw</p>
                    <p className="font-mono text-lg font-bold text-foreground tabular-nums">
                      {result.yaw > 0 ? "+" : ""}
                      {result.yaw}°
                    </p>
                  </div>
                  {result.head_pitch !== undefined && (
                    <div className="col-span-2 grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                       <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono mb-0.5">Head Pitch</p>
                        <p className="font-mono text-sm font-semibold text-primary">
                          {result.head_pitch > 0 ? "+" : ""}
                          {result.head_pitch}°
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono mb-0.5">Head Yaw</p>
                        <p className="font-mono text-sm font-semibold text-primary">
                          {result.head_yaw > 0 ? "+" : ""}
                          {result.head_yaw}°
                        </p>
                      </div>
                    </div>
                  )}
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
