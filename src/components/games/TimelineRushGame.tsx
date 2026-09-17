import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Scissors, 
  AlertTriangle, 
  Layers, 
  Play, 
  RotateCcw,
  ShieldAlert,
  Keyboard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiereLogo } from '../PremiereLogo';

interface TimelineRushGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface TimelineGlitch {
  id: number;
  type: 'red_bar' | 'dead_air' | 'corrupt_frame' | 'desync';
  x: number;          // Position along timeline (pixels)
  track: number;      // 0 = V1, 1 = V2, 2 = A1
  width: number;
  color: string;
  actionKey: 'ENTER' | 'Q' | 'C' | 'L';
  resolved: boolean;
}

export const TimelineRushGame: React.FC<TimelineRushGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bufferHp, setBufferHp] = useState(100);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glitchesRef = useRef<TimelineGlitch[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const playheadXRef = useRef<number>(200);

  // Sound generator
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSfx = (type: 'slash' | 'hit' | 'render') => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'slash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'render') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch {
      // Audio fallback
    }
  };

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setBufferHp(100);
    setResolvedCount(0);
    glitchesRef.current = [];
  };

  // Spawn timeline glitches
  const spawnGlitch = (canvasWidth: number) => {
    const types: ('red_bar' | 'dead_air' | 'corrupt_frame' | 'desync')[] = ['red_bar', 'dead_air', 'corrupt_frame', 'desync'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    let key: 'ENTER' | 'Q' | 'C' | 'L' = 'ENTER';
    let color = '#EF4444';
    let track = 0;

    if (selectedType === 'red_bar') {
      key = 'ENTER';
      color = '#EF4444';
      track = 0;
    } else if (selectedType === 'dead_air') {
      key = 'Q';
      color = '#F59E0B';
      track = 1;
    } else if (selectedType === 'corrupt_frame') {
      key = 'C';
      color = '#A855F7';
      track = 0;
    } else {
      key = 'L';
      color = '#06B6D4';
      track = 2;
    }

    glitchesRef.current.push({
      id: Date.now() + Math.random(),
      type: selectedType,
      x: canvasWidth + 20,
      track,
      width: selectedType === 'red_bar' ? 70 : 45,
      color,
      actionKey: key,
      resolved: false
    });
  };

  // Resolve glitch when player presses key or button
  const handleAction = (key: 'ENTER' | 'Q' | 'C' | 'L') => {
    if (!isPlaying) return;
    const playhead = playheadXRef.current;
    const hitTolerance = 65; // pixels around playhead

    // Find closest glitch to playhead matching the key
    const target = glitchesRef.current.find(g => 
      !g.resolved && 
      g.actionKey === key && 
      Math.abs(g.x - playhead) < hitTolerance
    );

    if (target) {
      target.resolved = true;
      playSfx(key === 'ENTER' ? 'render' : 'slash');
      const pts = (100 + combo * 10);
      setScore(s => {
        const next = s + pts;
        onScoreUpdate(next);
        return next;
      });
      setCombo(c => c + 1);
      setResolvedCount(r => r + 1);
      setActiveNotification(`SOLVED: [${key}] +${pts} pts!`);
      setTimeout(() => setActiveNotification(null), 800);
    } else {
      playSfx('hit');
      setCombo(0);
      setBufferHp(hp => Math.max(0, hp - 8));
      setActiveNotification(`MISS! NO GLITCH NEAR CTI`);
      setTimeout(() => setActiveNotification(null), 600);
    }
  };

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAction('ENTER');
      } else if (e.key.toUpperCase() === 'Q') {
        handleAction('Q');
      } else if (e.key.toUpperCase() === 'C') {
        handleAction('C');
      } else if (e.key.toUpperCase() === 'L') {
        handleAction('L');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastSpawn = Date.now();
    const speed = 3.2; // timeline speed

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      playheadXRef.current = 140; // Fixed Playhead CTI position

      // Draw 3 Video/Audio Tracks (V2, V1, A1)
      const trackH = 46;
      const tracks = ['V2 (B-Roll)', 'V1 (Main Cut)', 'A1 (Dialogue)'];

      tracks.forEach((tr, i) => {
        const ty = 30 + i * (trackH + 6);
        ctx.fillStyle = i < 2 ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, ty, w, trackH);

        // Track header tag
        ctx.fillStyle = '#64748B';
        ctx.font = '10px monospace';
        ctx.fillText(tr, 8, ty + 16);

        // Track divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeRect(0, ty, w, trackH);
      });

      // Spawn new glitch periodically
      if (Date.now() - lastSpawn > 1100) {
        spawnGlitch(w);
        lastSpawn = Date.now();
      }

      // Update & Draw Glitches
      glitchesRef.current.forEach((g) => {
        g.x -= speed;
        const ty = 30 + g.track * (trackH + 6);

        if (!g.resolved) {
          // Glow effect
          ctx.shadowColor = g.color;
          ctx.shadowBlur = 12;
          ctx.fillStyle = g.color;
          ctx.fillRect(g.x, ty + 4, g.width, trackH - 8);
          ctx.shadowBlur = 0;

          // Key symbol on the clip
          ctx.fillStyle = '#000';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`[${g.actionKey}]`, g.x + 8, ty + 26);
        } else {
          // Solved (Turned Green Rendered Clip)
          ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
          ctx.fillRect(g.x, ty + 4, g.width, trackH - 8);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('CLEAN', g.x + 8, ty + 26);
        }

        // Check if unresolved glitch passed playhead
        if (!g.resolved && g.x + g.width < playheadXRef.current - 20) {
          g.resolved = true;
          setBufferHp(hp => {
            const next = Math.max(0, hp - 15);
            if (next <= 0) {
              setIsPlaying(false);
              onComplete(score);
            }
            return next;
          });
          setCombo(0);
        }
      });

      // Remove offscreen glitches
      glitchesRef.current = glitchesRef.current.filter(g => g.x + g.width > -50);

      // Draw Playhead CTI (Blue Marker & Red Line)
      const phX = playheadXRef.current;
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(phX - 8, 10);
      ctx.lineTo(phX + 8, 10);
      ctx.lineTo(phX, 26);
      ctx.closePath();
      ctx.fill();

      // Laser CTI Line
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(phX, 26);
      ctx.lineTo(phX, h - 10);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, score, combo]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#090C16]/95 border border-pink-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col text-[#EDEDF4] select-none">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-pink-950/40 via-[#140E24] to-[#0A0D18] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>TIMELINE RUSH: GLITCH SLAYER</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 uppercase">
                  ARCADE PRO EDITION
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              กดคีย์ลัดเคลียร์บั๊กไทม์ไลน์ก่อนคลิปชนหัวอ่าน CTI • กู้ชีพ 60 FPS Buffer
            </p>
          </div>
        </div>

        {/* Status Score & Buffer HP */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">SCORE</div>
            <div className="text-lg sm:text-xl font-black text-pink-400 leading-none">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right min-w-[90px]">
            <div className="text-[10px] text-cyan-300 uppercase">BUFFER HP</div>
            <div className={`text-lg sm:text-xl font-black leading-none ${
              bufferHp > 50 ? 'text-emerald-400' : bufferHp > 20 ? 'text-amber-400' : 'text-rose-500 animate-pulse'
            }`}>
              {bufferHp}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Rush Canvas */}
      <div className="p-4 sm:p-6 bg-[#070912] flex flex-col items-center relative">
        {/* Floating Notification */}
        {activeNotification && (
          <div className="absolute top-8 px-4 py-1.5 rounded-full bg-black/80 border border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.6)] text-xs font-mono font-black text-pink-300 z-20 animate-bounce">
            {activeNotification}
          </div>
        )}

        <canvas 
          ref={canvasRef} 
          width={720} 
          height={210} 
          className="w-full h-auto max-h-[240px] rounded-2xl border border-white/10 bg-[#0A0D18]"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 z-30">
            <ShieldAlert className="w-12 h-12 text-pink-400 animate-bounce" />
            <div>
              <h4 className="text-xl font-black text-white">พร้อมกู้วิกฤตไทม์ไลน์แล้วหรือยัง?</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                คลิปเออเร่อจะไหลเข้าหาหัวอ่าน CTI กดปุ่มหรือคลิกคีย์ลัดให้ตรงกับจังหวะที่คลิปมาถึงเส้นสีฟ้า!
              </p>
            </div>
            <button
              onClick={startGame}
              id="start-timeline-rush-btn"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white font-black text-sm tracking-wide shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>เริ่มสตาร์ทเกม (START RUSH)</span>
            </button>
          </div>
        )}
      </div>

      {/* Responsive Touch / Keyboard Controls Deck */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0F1326] to-[#090C16] border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-pink-400" />
            <span>กดปุ่มบนคีย์บอร์ดจริง หรือ แตะปุ่มสัมผัสด้านล่าง:</span>
          </span>
          <span className="text-amber-300 font-bold">COMBO: {combo}x</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleAction('ENTER')}
            id="rush-enter-btn"
            className="p-3 rounded-2xl bg-gradient-to-br from-rose-950/70 to-red-900/40 border border-rose-500/40 hover:border-rose-400 active:scale-95 transition-all text-left group cursor-pointer shadow-md"
          >
            <div className="text-[10px] font-mono text-rose-300 uppercase">RED BAR LAG</div>
            <div className="text-base font-black text-white group-hover:text-rose-300">[ENTER]</div>
            <div className="text-[9px] text-slate-400">Pre-Render Sequence</div>
          </button>

          <button
            onClick={() => handleAction('Q')}
            id="rush-q-btn"
            className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/70 to-orange-900/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 transition-all text-left group cursor-pointer shadow-md"
          >
            <div className="text-[10px] font-mono text-amber-300 uppercase">DEAD AIR GAP</div>
            <div className="text-base font-black text-white group-hover:text-amber-300">[Q]</div>
            <div className="text-[9px] text-slate-400">Ripple Trim In</div>
          </button>

          <button
            onClick={() => handleAction('C')}
            id="rush-c-btn"
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-950/70 to-violet-900/40 border border-purple-500/40 hover:border-purple-400 active:scale-95 transition-all text-left group cursor-pointer shadow-md"
          >
            <div className="text-[10px] font-mono text-purple-300 uppercase">GLITCH FRAME</div>
            <div className="text-base font-black text-white group-hover:text-purple-300">[C]</div>
            <div className="text-[9px] text-slate-400">Razor Tool Cut</div>
          </button>

          <button
            onClick={() => handleAction('L')}
            id="rush-l-btn"
            className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/70 to-blue-900/40 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 transition-all text-left group cursor-pointer shadow-md"
          >
            <div className="text-[10px] font-mono text-cyan-300 uppercase">DESYNC AUDIO</div>
            <div className="text-base font-black text-white group-hover:text-cyan-300">[L]</div>
            <div className="text-[9px] text-slate-400">Re-Link Track</div>
          </button>
        </div>
      </div>
    </div>
  );
};
