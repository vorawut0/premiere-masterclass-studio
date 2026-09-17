import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Sliders, 
  Eye, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  CheckCircle2, 
  Flame, 
  Activity, 
  Sun, 
  Contrast, 
  Layers, 
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiereLogo } from '../PremiereLogo';

interface LumetriColorLabGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface TargetGrade {
  id: string;
  name: string;
  genre: string;
  desc: string;
  targetTemp: number;      // -50 to 50
  targetTint: number;      // -50 to 50
  targetExposure: number;  // -50 to 50
  targetContrast: number;  // -50 to 50
  targetSat: number;       // 0 to 200 (100 is default)
  lutColor: string;
}

const TARGET_GRADES: TargetGrade[] = [
  {
    id: 'cyberpunk',
    name: 'Neo Tokyo: Cyberpunk Neon',
    genre: 'Sci-Fi / Action',
    desc: 'อุณหภูมิติดฟ้าเย็นฉ่ำ ย้อม Tint ม่วงมาเจนต้า เร่งความคมชัด Contrast เพื่อขับแสงไฟนีออน',
    targetTemp: -30,
    targetTint: 35,
    targetExposure: 10,
    targetContrast: 40,
    targetSat: 140,
    lutColor: '#06B6D4'
  },
  {
    id: 'teal_orange',
    name: 'Blockbuster Teal & Orange',
    genre: 'Cinema Standard',
    desc: 'สไตล์หนังฮอลลีวูด โทนผิวคนอมส้มอบอุ่นตัดกับเงามืดสีน้ำเงินเข้มข้น',
    targetTemp: 25,
    targetTint: -15,
    targetExposure: 5,
    targetContrast: 30,
    targetSat: 125,
    lutColor: '#F59E0B'
  },
  {
    id: 'moody_nordic',
    name: 'Moody Nordic Crime',
    genre: 'Thriller / Mystery',
    desc: 'โทนหนาวเหน็บ ลดความสดสี (Desaturate) เพิ่ม Contrast ให้เงามืดลึกเพื่ออารมณ์สืบสวน',
    targetTemp: -40,
    targetTint: -20,
    targetExposure: -15,
    targetContrast: 25,
    targetSat: 65,
    lutColor: '#64748B'
  },
  {
    id: 'vintage_kodak',
    name: 'Vintage 35mm Film Stock',
    genre: 'Nostalgia / Indie',
    desc: 'โทนฟิล์มสีอบอุ่น นุ่มนวล เงามืดฟุ้งติดเขียวมะกอกเบาๆ ให้ฟีลลิ่งภาพถ่ายยุค 90s',
    targetTemp: 35,
    targetTint: 10,
    targetExposure: 15,
    targetContrast: -10,
    targetSat: 110,
    lutColor: '#D97706'
  }
];

export const LumetriColorLabGame: React.FC<LumetriColorLabGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const currentTarget = TARGET_GRADES[currentGradeIndex];

  // User Color grading controls
  const [temp, setTemp] = useState(0);
  const [tint, setTint] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(100);

  // Game tracking
  const [score, setScore] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [scopeMode, setScopeMode] = useState<'waveform' | 'vectorscope'>('waveform');
  const [accuracy, setAccuracy] = useState(0);

  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate live matching accuracy
  useEffect(() => {
    const tempDiff = Math.abs(temp - currentTarget.targetTemp) / 100;
    const tintDiff = Math.abs(tint - currentTarget.targetTint) / 100;
    const expoDiff = Math.abs(exposure - currentTarget.targetExposure) / 100;
    const contDiff = Math.abs(contrast - currentTarget.targetContrast) / 100;
    const satDiff = Math.abs(saturation - currentTarget.targetSat) / 200;

    const totalDiff = (tempDiff * 1.5 + tintDiff * 1.5 + expoDiff + contDiff + satDiff) / 6;
    const rawAcc = Math.max(0, Math.min(100, Math.round((1 - totalDiff) * 100)));
    setAccuracy(rawAcc);
  }, [temp, tint, exposure, contrast, saturation, currentTarget]);

  // Live Scopes Canvas rendering (Waveform & Vectorscope)
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Background IRE graticules
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    if (scopeMode === 'waveform') {
      // IRE Grid Lines (100, 75, 50, 0)
      [0.1, 0.35, 0.6, 0.9].forEach((frac, idx) => {
        const y = h * frac;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = '9px monospace';
        ctx.fillText(`${100 - idx * 25} IRE`, 4, y - 3);
      });

      // Draw simulated RGB Parade / Lumetri Waveform
      const bands = 40;
      const bandWidth = w / bands;
      const baseMid = (h / 2) - (exposure * 0.8);

      for (let i = 0; i < bands; i++) {
        const x = i * bandWidth;
        const normX = i / bands;
        
        // Temperature pushes red or blue
        const rHeight = Math.sin(normX * Math.PI) * 40 * (contrast / 50 + 1) + (temp * 0.5);
        const gHeight = Math.sin(normX * Math.PI) * 35 * (contrast / 50 + 1) - (tint * 0.3);
        const bHeight = Math.sin(normX * Math.PI) * 40 * (contrast / 50 + 1) - (temp * 0.5);

        // Waveform particles/sparks
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)'; // Red
        ctx.fillRect(x, baseMid - rHeight, bandWidth - 1, rHeight * 1.6);

        ctx.fillStyle = 'rgba(34, 197, 94, 0.35)'; // Green
        ctx.fillRect(x, baseMid - gHeight, bandWidth - 1, gHeight * 1.6);

        ctx.fillStyle = 'rgba(59, 130, 246, 0.45)'; // Blue
        ctx.fillRect(x, baseMid - bHeight, bandWidth - 1, bHeight * 1.6);
      }
    } else {
      // Vectorscope Polar View
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 10;

      // Circle graticule
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Color targets (R, Mg, B, Cy, G, Yl)
      ctx.fillStyle = '#64748B';
      ctx.font = '9px monospace';
      ctx.fillText('R', cx + radius * 0.7, cy - radius * 0.5);
      ctx.fillText('B', cx - radius * 0.6, cy + radius * 0.6);
      ctx.fillText('G', cx - radius * 0.7, cy - radius * 0.5);

      // Chroma Trace Cloud
      const points = 35;
      const satRadius = (saturation / 100) * (radius * 0.6);
      const angleOffset = (temp * 0.03) + (tint * 0.02);

      for (let i = 0; i < points; i++) {
        const theta = (i / points) * Math.PI * 2 + angleOffset;
        const r = satRadius * (0.6 + Math.random() * 0.4);
        const px = cx + Math.cos(theta) * r;
        const py = cy + Math.sin(theta) * r;

        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fillRect(px, py, 2.5, 2.5);
      }
    }
  }, [temp, tint, exposure, contrast, saturation, scopeMode]);

  // Submit and lock grade
  const handleLockGrade = () => {
    const pts = Math.round(accuracy * 10);
    const updatedScore = score + pts;
    setScore(updatedScore);
    onScoreUpdate(updatedScore);
    setRoundCompleted(true);

    if (accuracy >= 85) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Next Film Look
  const handleNextGrade = () => {
    if (currentGradeIndex < TARGET_GRADES.length - 1) {
      setCurrentGradeIndex(i => i + 1);
      setTemp(0);
      setTint(0);
      setExposure(0);
      setContrast(0);
      setSaturation(100);
      setRoundCompleted(false);
    } else {
      setGameFinished(true);
      onComplete(score);
    }
  };

  // Reset current sliders
  const handleResetSliders = () => {
    setTemp(0);
    setTint(0);
    setExposure(0);
    setContrast(0);
    setSaturation(100);
  };

  // CSS Color preview filters based on sliders
  const userFilterStyle = {
    filter: `
      brightness(${1 + exposure / 100})
      contrast(${1 + contrast / 100})
      saturate(${saturation / 100})
      hue-rotate(${tint}deg)
      sepia(${temp > 0 ? temp / 120 : 0})
    `
  };

  const targetFilterStyle = {
    filter: `
      brightness(${1 + currentTarget.targetExposure / 100})
      contrast(${1 + currentTarget.targetContrast / 100})
      saturate(${currentTarget.targetSat / 100})
      hue-rotate(${currentTarget.targetTint}deg)
      sepia(${currentTarget.targetTemp > 0 ? currentTarget.targetTemp / 120 : 0})
    `
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#090C15]/95 border border-purple-500/25 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden flex flex-col text-[#EDEDF4] select-none">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-purple-950/30 via-[#101322] to-[#0A0D1A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>LUMETRI COLOR LAB</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                  STUDIO GRADE PRO
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              ห้องทดลองเกรดสีระดับสตูดิโอ • เทียบภาพและอ่าน Lumetri Scopes
            </p>
          </div>
        </div>

        {/* Live Score & Accuracy Match Meter */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">SCORE</div>
            <div className="text-lg sm:text-xl font-black text-amber-400 leading-none">
              {score.toLocaleString()}
            </div>
          </div>

          <div className={`px-3.5 py-1.5 rounded-xl bg-black/40 border transition-all ${
            accuracy >= 85 ? 'border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-white/10'
          }`}>
            <div className="text-[10px] text-cyan-300 uppercase flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>MATCH ACCURACY</span>
            </div>
            <div className={`text-lg sm:text-xl font-black leading-none ${
              accuracy >= 85 ? 'text-emerald-400' : accuracy >= 65 ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {accuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Target Brief Bar */}
      <div className="px-4 sm:px-6 py-3 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/30">
            ภารกิจ {currentGradeIndex + 1}/{TARGET_GRADES.length}
          </span>
          <h4 className="font-bold text-white sm:text-sm">{currentTarget.name}</h4>
          <span className="text-[#94A3B8] hidden sm:inline">• {currentTarget.genre}</span>
        </div>
        <p className="text-[11px] text-[#94A3B8] max-w-md italic">
          "{currentTarget.desc}"
        </p>
      </div>

      {/* Center Stage: Split Screen Comparison (Target vs Player Grading) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 sm:p-5 bg-[#0B0E1B]">
        {/* Visual Monitor 1: Target Look */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>TARGET LOOK (เป้าหมาย)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
              REFERENCE
            </span>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-amber-500/30 shadow-md group">
            <img 
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80" 
              alt="Color Target" 
              className="w-full h-full object-cover transition-all"
              style={targetFilterStyle}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-amber-300 border border-amber-500/30">
              LUT: {currentTarget.name}
            </div>
          </div>
        </div>

        {/* Visual Monitor 2: Player's Live Grading */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>YOUR GRADE (ภาพปัจจุบัน)</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
              accuracy >= 85 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'
            }`}>
              {accuracy}% MATCH
            </span>
          </div>
          <div className={`relative aspect-video rounded-2xl overflow-hidden border transition-all shadow-md ${
            accuracy >= 85 ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-cyan-500/30'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80" 
              alt="Player Grading Live" 
              className="w-full h-full object-cover transition-all"
              style={userFilterStyle}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
              PROGRAM MONITOR • USER
            </div>
          </div>
        </div>

        {/* Monitor 3: Real-time Lumetri Scopes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>LUMETRI SCOPES</span>
            </span>
            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-md text-[10px]">
              <button
                onClick={() => setScopeMode('waveform')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${scopeMode === 'waveform' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Waveform
              </button>
              <button
                onClick={() => setScopeMode('vectorscope')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${scopeMode === 'vectorscope' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Vector
              </button>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-purple-500/30 bg-black/80 flex items-center justify-center p-1">
            <canvas ref={scopeCanvasRef} width={280} height={160} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Bottom Panel: Tactile Lumetri Sliders Control Desk */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0B0E1B] to-[#070912] border-t border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Temperature Slider */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-300 font-bold">Temperature</span>
              <span className={temp > 0 ? 'text-amber-400' : temp < 0 ? 'text-cyan-400' : 'text-slate-400'}>
                {temp > 0 ? `+${temp}` : temp}
              </span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={temp} 
              disabled={roundCompleted}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>Cool</span>
              <span>Warm</span>
            </div>
          </div>

          {/* Tint Slider */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-pink-300 font-bold">Tint (Mg/Gr)</span>
              <span className={tint > 0 ? 'text-pink-400' : tint < 0 ? 'text-emerald-400' : 'text-slate-400'}>
                {tint > 0 ? `+${tint}` : tint}
              </span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={tint} 
              disabled={roundCompleted}
              onChange={(e) => setTint(Number(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>Green</span>
              <span>Magenta</span>
            </div>
          </div>

          {/* Exposure Slider */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-300 font-bold">Exposure</span>
              <span className={exposure > 0 ? 'text-amber-400' : exposure < 0 ? 'text-blue-400' : 'text-slate-400'}>
                {exposure > 0 ? `+${exposure}` : exposure}
              </span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={exposure} 
              disabled={roundCompleted}
              onChange={(e) => setExposure(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>Dark</span>
              <span>Bright</span>
            </div>
          </div>

          {/* Contrast Slider */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-purple-300 font-bold">Contrast</span>
              <span className="text-purple-400">{contrast > 0 ? `+${contrast}` : contrast}</span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={contrast} 
              disabled={roundCompleted}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>Soft</span>
              <span>Punchy</span>
            </div>
          </div>

          {/* Saturation Slider */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-300 font-bold">Saturation</span>
              <span className="text-emerald-400">{saturation}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={saturation} 
              disabled={roundCompleted}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-black/50 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>B&W</span>
              <span>Vivid</span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleResetSliders}
            disabled={roundCompleted}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตสไลเดอร์ (Reset)</span>
          </button>

          <div className="flex items-center gap-3">
            {!roundCompleted ? (
              <button
                onClick={handleLockGrade}
                id="lock-grade-btn"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันการเกรดสี (LOCK COLOR GRADE)</span>
              </button>
            ) : (
              <button
                onClick={handleNextGrade}
                id="next-grade-btn"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{currentGradeIndex < TARGET_GRADES.length - 1 ? 'ไปยังโทนภาพถัดไป →' : 'สรุปผลคะแนนทั้งหมด 🎉'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
