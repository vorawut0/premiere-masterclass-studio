import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Layers, 
  Flame,
  MousePointerClick
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiereLogo } from '../PremiereLogo';

interface KeyframeCurvesGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface CurveTarget {
  id: string;
  name: string;
  style: string;
  desc: string;
  targetP1x: number; // 0 to 1
  targetP1y: number; // 0 to 1
  targetP2x: number; // 0 to 1
  targetP2y: number; // 0 to 1
}

const CURVE_TARGETS: CurveTarget[] = [
  {
    id: 'snappy_pop',
    name: 'Apple Style Snappy Pop',
    style: 'Modern Tech Commercial',
    desc: 'เริ่มต้นพุ่งตัวรวดเร็วสะใจ แล้วค่อยๆ ผ่อนความเร็วลงอย่างนุ่มนวล (Fast Out, Slow In)',
    targetP1x: 0.15,
    targetP1y: 0.95,
    targetP2x: 0.25,
    targetP2y: 1.0,
  },
  {
    id: 'cinematic_ease',
    name: 'Cinematic S-Curve (Easy Ease)',
    style: 'Documentary / Trailer',
    desc: 'เข้าช้าๆ เร่งตรงกลาง แล้วค่อยๆ ชะลอหยุดสมูท ไร้รอยสะดุด (Smooth In & Out)',
    targetP1x: 0.42,
    targetP1y: 0.0,
    targetP2x: 0.58,
    targetP2y: 1.0,
  },
  {
    id: 'whip_pan',
    name: 'Whip Pan Transition Spike',
    style: 'Vlog / Music Video',
    desc: 'ความเร็วสูงสุดพุ่งสูงลิ่วกลางคลิปเพื่อสร้างการเหวี่ยงภาพเบลอทรงพลัง',
    targetP1x: 0.7,
    targetP1y: 0.1,
    targetP2x: 0.3,
    targetP2y: 0.9,
  }
];

export const KeyframeCurvesGame: React.FC<KeyframeCurvesGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const target = CURVE_TARGETS[levelIndex];

  // User Bezier handles: P0 = (0,0), P1 = (p1x, p1y), P2 = (p2x, p2y), P3 = (1,1)
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.75);
  const [p2y, setP2y] = useState(0.9);

  const [score, setScore] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levelPassed, setLevelPassed] = useState(false);

  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate cubic bezier point at t
  const getCubicBezierY = (t: number, p1x: number, p1y: number, p2x: number, p2y: number): number => {
    // 3*(1-t)^2 * t * P1 + 3*(1-t) * t^2 * P2 + t^3
    const u = 1 - t;
    return 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t;
  };

  // Accuracy calculation
  const diffP1x = Math.abs(p1x - target.targetP1x);
  const diffP1y = Math.abs(p1y - target.targetP1y);
  const diffP2x = Math.abs(p2x - target.targetP2x);
  const diffP2y = Math.abs(p2y - target.targetP2y);
  const totalDiff = (diffP1x + diffP1y + diffP2x + diffP2y) / 4;
  const accuracy = Math.max(0, Math.min(100, Math.round((1 - totalDiff * 1.5) * 100)));

  // Render Graph Editor Canvas
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;
    const pad = 30;
    const graphW = w - pad * 2;
    const graphH = h - pad * 2;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gx = pad + (graphW / 4) * i;
      const gy = pad + (graphH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(gx, pad);
      ctx.lineTo(gx, pad + graphH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pad, gy);
      ctx.lineTo(pad + graphW, gy);
      ctx.stroke();
    }

    // Target ghost curve (Amber/Orange reference)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pad, pad + graphH);
    ctx.bezierCurveTo(
      pad + target.targetP1x * graphW,
      pad + (1 - target.targetP1y) * graphH,
      pad + target.targetP2x * graphW,
      pad + (1 - target.targetP2y) * graphH,
      pad + graphW,
      pad
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Player curve (Neon Cyan with glowing shadow)
    ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(pad, pad + graphH);
    ctx.bezierCurveTo(
      pad + p1x * graphW,
      pad + (1 - p1y) * graphH,
      pad + p2x * graphW,
      pad + (1 - p2y) * graphH,
      pad + graphW,
      pad
    );
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tangent Handles Levers
    const p0x = pad, p0y = pad + graphH;
    const h1x = pad + p1x * graphW, h1y = pad + (1 - p1y) * graphH;
    const h2x = pad + p2x * graphW, h2y = pad + (1 - p2y) * graphH;
    const p3x = pad + graphW, p3y = pad;

    // Handle 1 line
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.lineTo(h1x, h1y);
    ctx.stroke();

    // Handle 2 line
    ctx.beginPath();
    ctx.moveTo(p3x, p3y);
    ctx.lineTo(h2x, h2y);
    ctx.stroke();

    // Handle Knobs
    ctx.fillStyle = '#C084FC';
    ctx.beginPath();
    ctx.arc(h1x, h1y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(h2x, h2y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Start & End Keyframe Diamonds
    ctx.fillStyle = '#38BDF8';
    [[p0x, p0y], [p3x, p3y]].forEach(([kx, ky]) => {
      ctx.save();
      ctx.translate(kx, ky);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
    });
  }, [p1x, p1y, p2x, p2y, target]);

  // Motion Graphics Live Animation Playback
  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    const duration = 1200; // ms

    if (isPlaying) {
      const step = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = getCubicBezierY(progress, p1x, p1y, p2x, p2y);
        setPreviewProgress(Math.max(0, Math.min(1, eased)));

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setIsPlaying(false);
        }
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, p1x, p1y, p2x, p2y]);

  const handleTestPlay = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleCommitCurve = () => {
    const pts = Math.round(accuracy * 10);
    const newScore = score + pts;
    setScore(newScore);
    onScoreUpdate(newScore);
    setLevelPassed(true);

    if (accuracy >= 80) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNextLevel = () => {
    if (levelIndex < CURVE_TARGETS.length - 1) {
      setLevelIndex(i => i + 1);
      setP1x(0.25);
      setP1y(0.1);
      setP2x(0.75);
      setP2y(0.9);
      setLevelPassed(false);
      setPreviewProgress(0);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#0A0C16]/95 border border-purple-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col text-[#EDEDF4] select-none">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-[#120F24] to-[#0A0D18] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>KEYFRAME FLOW: BEZIER SCULPTOR</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase">
                  MOTION GRAPHICS PRO
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              ดัดกราฟความเร็วคีย์เฟรม (Speed Graph) ใน Premiere Pro ให้โมชันลื่นไหลระดับเทพ
            </p>
          </div>
        </div>

        {/* Status Score */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">SCORE</div>
            <div className="text-lg sm:text-xl font-black text-amber-400 leading-none">
              {score.toLocaleString()}
            </div>
          </div>

          <div className={`px-3.5 py-1.5 rounded-xl bg-black/40 border transition-all ${
            accuracy >= 80 ? 'border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/10'
          }`}>
            <div className="text-[10px] text-cyan-300 uppercase">CURVE MATCH</div>
            <div className={`text-lg sm:text-xl font-black leading-none ${
              accuracy >= 80 ? 'text-emerald-400' : 'text-slate-300'
            }`}>
              {accuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Target Brief */}
      <div className="px-4 sm:px-6 py-2.5 bg-purple-500/5 border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
            LEVEL {levelIndex + 1}/{CURVE_TARGETS.length}
          </span>
          <span className="text-white font-bold">{target.name}</span>
          <span className="text-slate-400 hidden sm:inline">({target.style})</span>
        </div>
        <div className="text-amber-300/90 italic">
          เส้นประสีส้ม = เส้นความเร็วเป้าหมาย • ปรับคันโยกสีฟ้าให้แนบสนิท
        </div>
      </div>

      {/* Main Graph & Live Preview Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 bg-[#080912]">
        {/* Speed Graph Editor Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>PREMIERE GRAPH EDITOR</span>
            </span>
            <span className="text-[10px] text-purple-300">BEZIER VELOCITY</span>
          </div>

          <div className="relative aspect-square max-h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/70 flex items-center justify-center p-2">
            <canvas 
              ref={graphCanvasRef} 
              width={320} 
              height={300} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Live Motion Graphics Preview Track */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>MOTION GRAPHIC PREVIEW</span>
              </span>
              <button
                onClick={handleTestPlay}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>PLAY ANIMATION</span>
              </button>
            </div>

            {/* Animation Runway Track */}
            <div className="h-32 rounded-2xl border border-white/10 bg-black/50 relative overflow-hidden flex items-center px-4">
              <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500" />
              <div className="absolute inset-y-0 right-0 w-1 bg-purple-500" />
              <div className="w-full h-1 bg-white/10 rounded-full" />

              {/* Animated Floating Graphic Pill */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-75"
                style={{
                  left: `calc(16px + ${previewProgress * 75}%)`
                }}
              >
                <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-white/20 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                  <span className="text-xs font-black text-white whitespace-nowrap">SPEED GRAPH PRO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Curve Presets for Editors */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400">QUICK TANGENT PRESETS:</div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                onClick={() => { setP1x(0.15); setP1y(0.95); setP2x(0.25); setP2y(1.0); }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 cursor-pointer text-center"
              >
                Snap Pop
              </button>
              <button
                onClick={() => { setP1x(0.42); setP1y(0.0); setP2x(0.58); setP2y(1.0); }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-purple-300 cursor-pointer text-center"
              >
                Easy Ease
              </button>
              <button
                onClick={() => { setP1x(0.7); setP1y(0.1); setP2x(0.3); setP2y(0.9); }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-300 cursor-pointer text-center"
              >
                Whip Spike
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tangent Handle Sliders Controls */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0E1020] to-[#080912] border-t border-white/10 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Handle 1 X */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-purple-300">
              <span>Handle 1 X</span>
              <span>{p1x.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.02" value={p1x} 
              disabled={levelPassed}
              onChange={(e) => setP1x(Number(e.target.value))} 
              className="w-full accent-purple-400 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
          </div>

          {/* Handle 1 Y */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-purple-300">
              <span>Handle 1 Y</span>
              <span>{p1y.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.02" value={p1y} 
              disabled={levelPassed}
              onChange={(e) => setP1y(Number(e.target.value))} 
              className="w-full accent-purple-400 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
          </div>

          {/* Handle 2 X */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-pink-300">
              <span>Handle 2 X</span>
              <span>{p2x.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.02" value={p2x} 
              disabled={levelPassed}
              onChange={(e) => setP2x(Number(e.target.value))} 
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
          </div>

          {/* Handle 2 Y */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-pink-300">
              <span>Handle 2 Y</span>
              <span>{p2y.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.02" value={p2y} 
              disabled={levelPassed}
              onChange={(e) => setP2y(Number(e.target.value))} 
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          {!levelPassed ? (
            <button
              onClick={handleCommitCurve}
              id="confirm-bezier-curve-btn"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ล็อคเส้นความเร็ว (LOCK KEYFRAME CURVE)</span>
            </button>
          ) : (
            <button
              onClick={handleNextLevel}
              id="next-curve-level-btn"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{levelIndex < CURVE_TARGETS.length - 1 ? 'ดัดกราฟภารกิจถัดไป →' : 'สรุปผลคะแนนทั้งหมด 🎉'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
