import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Scissors, 
  Flame, 
  Volume2, 
  VolumeX, 
  Trophy, 
  CheckCircle2, 
  Award,
  Disc,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiereLogo } from '../PremiereLogo';

interface BeatCutterGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface Note {
  id: number;
  lane: number; // 0: Q, 1: W, 2: C, 3: SPACE
  time: number; // target hit time in ms from game start
  hit: boolean;
  missed: boolean;
  type: 'cut' | 'ripple_q' | 'ripple_w' | 'drop';
}

interface HitFeedback {
  id: number;
  text: string;
  type: 'perfect' | 'great' | 'miss';
  lane: number;
  score: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: 'Beginner' | 'Pro Editor' | 'Master Cutter';
  durationSec: number;
  accentColor: string;
  notesPerMeasure: number;
  genre: string;
}

const TRACKS: Track[] = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk Neon Timeline',
    artist: 'Masterclass Synth Studio',
    bpm: 128,
    difficulty: 'Pro Editor',
    durationSec: 35,
    accentColor: 'from-cyan-500 via-indigo-500 to-purple-500',
    notesPerMeasure: 4,
    genre: 'Synthwave Electro'
  },
  {
    id: 'lofi',
    title: 'Sunset Coffee & L-Cut',
    artist: 'Chillhop Editor Beats',
    bpm: 92,
    difficulty: 'Beginner',
    durationSec: 30,
    accentColor: 'from-amber-400 via-rose-500 to-purple-600',
    notesPerMeasure: 3,
    genre: 'Lo-Fi Hip Hop'
  },
  {
    id: 'trailer',
    title: 'Blockbuster Action Trailer',
    artist: 'Epic Cinematic FX',
    bpm: 142,
    difficulty: 'Master Cutter',
    durationSec: 40,
    accentColor: 'from-purple-600 via-pink-600 to-amber-500',
    notesPerMeasure: 4,
    genre: 'Cinematic Orchestral'
  }
];

const LANES = [
  { id: 0, key: 'Q', name: 'Ripple In', color: '#06B6D4', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.6)]', label: 'Q' },
  { id: 1, key: 'W', name: 'Ripple Out', color: '#10B981', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]', label: 'W' },
  { id: 2, key: 'C', name: 'Razor Blade', color: '#A855F7', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]', label: 'C' },
  { id: 3, key: 'SPACE', name: 'Beat Drop', color: '#EC4899', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.6)]', label: 'SPACE' },
];

export const BeatCutterGame: React.FC<BeatCutterGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  // Game states
  const [selectedTrack, setSelectedTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [perfectHits, setPerfectHits] = useState(0);
  const [greatHits, setGreatHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeLane, setActiveLane] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<HitFeedback[]>([]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [visualPulse, setVisualPulse] = useState(false);

  // Refs for high performance game loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const notesRef = useRef<Note[]>([]);
  const requestAnimRef = useRef<number>(0);
  const lastBeatIndexRef = useRef<number>(-1);
  const feedbackIdCounter = useRef(0);

  // Initialize Web Audio Synthesizer
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Play synthesized audio tone on beat
  const playSynthesizedTone = (freq: number, type: OscillatorType = 'sine', duration = 0.08, gainVal = 0.15) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // Play blade slice sound
  const playSliceSound = (isPerfect: boolean) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // High frequency metal swish
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isPerfect ? 'triangle' : 'sawtooth';
      const baseFreq = isPerfect ? 880 : 520;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);

      // Chime resonance for perfect hits
      if (isPerfect) {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(1320, ctx.currentTime);
        chimeGain.gain.setValueAtTime(0.12, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start();
        chime.stop(ctx.currentTime + 0.18);
      }
    } catch {}
  };

  // Play beat metronome tick
  const playBeatTick = (isDownbeat: boolean) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isDownbeat ? 160 : 280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(isDownbeat ? 0.22 : 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  };

  // Generate track notes based on BPM
  const generateNotesForTrack = (track: Track): Note[] => {
    const notes: Note[] = [];
    const beatIntervalMs = (60 / track.bpm) * 1000;
    const totalDurationMs = track.durationSec * 1000;
    let currentMs = 1800; // Start with 1.8s lead-in
    let noteId = 1;

    while (currentMs < totalDurationMs - 1500) {
      // Create musical patterns with variation
      const measureBeat = Math.floor((currentMs / beatIntervalMs) % 4);
      
      // Choose lane intelligently to simulate editing rhythm
      let lane = 2; // Razor blade by default
      if (measureBeat === 0) {
        lane = 3; // Beat drop on downbeat
      } else if (measureBeat === 1) {
        lane = 0; // Ripple in
      } else if (measureBeat === 2) {
        lane = 2; // Razor cut
      } else {
        lane = 1; // Ripple out
      }

      // Add variation based on track difficulty
      if (track.difficulty === 'Master Cutter' && Math.random() > 0.4) {
        // Double hit / fast syncopation
        notes.push({
          id: noteId++,
          lane: (lane + 1) % 4,
          time: currentMs + beatIntervalMs * 0.5,
          hit: false,
          missed: false,
          type: 'cut'
        });
      }

      notes.push({
        id: noteId++,
        lane,
        time: currentMs,
        hit: false,
        missed: false,
        type: lane === 3 ? 'drop' : lane === 0 ? 'ripple_q' : lane === 1 ? 'ripple_w' : 'cut'
      });

      currentMs += beatIntervalMs;
    }

    return notes;
  };

  // Start / Restart game
  const startGame = () => {
    initAudio();
    const generated = generateNotesForTrack(selectedTrack);
    notesRef.current = generated;
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHealth(100);
    setPerfectHits(0);
    setGreatHits(0);
    setMisses(0);
    setGameEnded(false);
    setIsPaused(false);
    setIsPlaying(true);
    setFeedbacks([]);
    lastBeatIndexRef.current = -1;
    startTimeRef.current = performance.now();
  };

  // Hit evaluation logic
  const handleCutAction = useCallback((laneIndex: number) => {
    if (!isPlaying || isPaused || gameEnded) return;

    setActiveLane(laneIndex);
    setTimeout(() => setActiveLane(null), 120);

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const hitZoneWindow = 220; // ms tolerance
    const perfectWindow = 85;  // ms perfect tolerance

    // Find candidate notes in this lane that haven't been hit/missed yet
    const candidateNotes = notesRef.current.filter(
      n => !n.hit && !n.missed && n.lane === laneIndex && Math.abs(n.time - elapsed) < hitZoneWindow
    );

    if (candidateNotes.length > 0) {
      // Pick the closest note to playhead
      candidateNotes.sort((a, b) => Math.abs(a.time - elapsed) - Math.abs(b.time - elapsed));
      const targetNote = candidateNotes[0];
      const diff = Math.abs(targetNote.time - elapsed);

      targetNote.hit = true;
      const isPerfect = diff <= perfectWindow;
      const pts = isPerfect ? 100 : 50;

      playSliceSound(isPerfect);

      // Trigger visual pulse
      setVisualPulse(true);
      setTimeout(() => setVisualPulse(false), 80);

      // Update feedback
      const newFb: HitFeedback = {
        id: feedbackIdCounter.current++,
        text: isPerfect ? 'PERFECT CUT!' : 'GREAT SYNC!',
        type: isPerfect ? 'perfect' : 'great',
        lane: laneIndex,
        score: pts
      };
      setFeedbacks(prev => [...prev.slice(-4), newFb]);

      // Update stats
      setCombo(prev => {
        const next = prev + 1;
        setMaxCombo(m => Math.max(m, next));
        return next;
      });

      if (isPerfect) setPerfectHits(p => p + 1);
      else setGreatHits(g => g + 1);

      setScore(prev => {
        const multiplier = combo > 20 ? 4 : combo > 10 ? 3 : combo > 5 ? 2 : 1;
        const totalAdd = pts * multiplier;
        const updated = prev + totalAdd;
        onScoreUpdate(updated);
        return updated;
      });

      setHealth(h => Math.min(100, h + 3));
    } else {
      // Swing and miss
      playSynthesizedTone(180, 'sawtooth', 0.05, 0.06);
    }
  }, [isPlaying, isPaused, gameEnded, combo, onScoreUpdate]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();

      if (key === 'Q') {
        e.preventDefault();
        handleCutAction(0);
      } else if (key === 'W') {
        e.preventDefault();
        handleCutAction(1);
      } else if (key === 'C') {
        e.preventDefault();
        handleCutAction(2);
      } else if (e.code === 'Space' || key === ' ') {
        e.preventDefault();
        handleCutAction(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCutAction]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameEnded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with deep studio neutral
      ctx.clearRect(0, 0, width, height);

      // Lane metrics
      const laneWidth = width / 4;
      const hitZoneY = height - 70; // Position of cutting playhead line
      const speed = 0.55 * speedMultiplier; // pixels per ms

      // Draw background lanes with subtle glows
      for (let i = 0; i < 4; i++) {
        const x = i * laneWidth;
        const isCurrentActive = activeLane === i;

        // Lane divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Active lane laser flash
        if (isCurrentActive) {
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(1, `${LANES[i].color}33`);
          ctx.fillStyle = grad;
          ctx.fillRect(x, 0, laneWidth, height);
        }
      }

      // Draw Cutting Playhead Hit Line
      ctx.save();
      ctx.shadowColor = visualPulse ? '#EC4899' : '#A855F7';
      ctx.shadowBlur = visualPulse ? 25 : 12;
      ctx.strokeStyle = visualPulse ? '#FFFFFF' : '#A855F7';
      ctx.lineWidth = visualPulse ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(0, hitZoneY);
      ctx.lineTo(width, hitZoneY);
      ctx.stroke();
      ctx.restore();

      // Draw hit zone markers (target pads)
      for (let i = 0; i < 4; i++) {
        const cx = i * laneWidth + laneWidth / 2;
        const padRadius = 24;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, hitZoneY, padRadius, 0, Math.PI * 2);
        ctx.strokeStyle = activeLane === i ? '#FFFFFF' : `${LANES[i].color}88`;
        ctx.lineWidth = activeLane === i ? 3 : 1.5;
        ctx.fillStyle = activeLane === i ? `${LANES[i].color}55` : 'rgba(15, 18, 30, 0.7)';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Process notes
      const beatIntervalMs = (60 / selectedTrack.bpm) * 1000;
      const currentBeatIndex = Math.floor(elapsed / beatIntervalMs);
      if (currentBeatIndex > lastBeatIndexRef.current) {
        lastBeatIndexRef.current = currentBeatIndex;
        playBeatTick(currentBeatIndex % 4 === 0);
      }

      let activeNotesRemaining = false;

      notesRef.current.forEach(note => {
        const noteDist = (note.time - elapsed) * speed;
        const noteY = hitZoneY - noteDist;

        // Check if note was missed (went past hit line by 120ms)
        if (!note.hit && !note.missed && elapsed > note.time + 150) {
          note.missed = true;
          setCombo(0);
          setMisses(m => m + 1);
          setHealth(h => Math.max(0, h - 8));
          setFeedbacks(prev => [
            ...prev.slice(-3),
            {
              id: feedbackIdCounter.current++,
              text: 'MISS',
              type: 'miss',
              lane: note.lane,
              score: 0
            }
          ]);
        }

        // Only draw visible notes
        if (noteY > -50 && noteY < height + 20 && !note.hit) {
          activeNotesRemaining = true;
          const lane = LANES[note.lane];
          const x = note.lane * laneWidth + 10;
          const blockW = laneWidth - 20;
          const blockH = 22;

          ctx.save();
          // Glow effect
          ctx.shadowColor = lane.color;
          ctx.shadowBlur = 14;

          // Note body: rounded gradient clip
          const grad = ctx.createLinearGradient(x, noteY, x + blockW, noteY + blockH);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.3, lane.color);
          grad.addColorStop(1, '#0A0C16');

          ctx.fillStyle = grad;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;

          // Rounded rectangle
          const r = 6;
          ctx.beginPath();
          ctx.roundRect(x, noteY - blockH / 2, blockW, blockH, r);
          ctx.fill();
          ctx.stroke();

          // Internal cut indicator line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + blockW / 2, noteY - blockH / 2 + 3);
          ctx.lineTo(x + blockW / 2, noteY + blockH / 2 - 3);
          ctx.stroke();

          ctx.restore();
        }
      });

      // End of song check
      const totalDuration = selectedTrack.durationSec * 1000;
      if (elapsed > totalDuration + 1000 || health <= 0) {
        setGameEnded(true);
        setIsPlaying(false);
        onComplete(score);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
        return;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused, gameEnded, selectedTrack, speedMultiplier, activeLane, health, score, onComplete]);

  // Live mini waveform visualizer canvas
  useEffect(() => {
    const wfCanvas = waveformCanvasRef.current;
    if (!wfCanvas) return;
    const ctx = wfCanvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, wfCanvas.width, wfCanvas.height);
      const bars = 36;
      const barWidth = wfCanvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const heightFactor = isPlaying 
          ? Math.sin(phase + i * 0.4) * 0.5 + 0.5 
          : 0.15;
        const barHeight = Math.max(3, heightFactor * (wfCanvas.height - 6));
        const x = i * barWidth;
        const y = (wfCanvas.height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#A855F7');
        grad.addColorStop(0.5, '#06B6D4');
        grad.addColorStop(1, '#EC4899');

        ctx.fillStyle = isPlaying ? grad : 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      phase += isPlaying ? 0.12 : 0.02;
      animId = requestAnimationFrame(drawWaveform);
    };

    animId = requestAnimationFrame(drawWaveform);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Calculation of grade
  const totalNotesCount = notesRef.current.length || 1;
  const accuracyPercent = Math.round(((perfectHits + greatHits) / Math.max(1, perfectHits + greatHits + misses)) * 100);
  const grade = accuracyPercent >= 95 ? 'S+' : accuracyPercent >= 85 ? 'S' : accuracyPercent >= 75 ? 'A' : accuracyPercent >= 60 ? 'B' : 'C';

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#090C15]/95 border border-purple-500/25 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden flex flex-col text-[#EDEDF4] select-none">
      
      {/* Top Glass Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-purple-950/30 via-[#101322] to-[#0A0D1A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>BEAT CUTTER</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                  STUDIO PRO EDITION
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              ตัดต่อตามจังหวะเพลง (Rhythm Cut) ด้วยคีย์ลัด Premiere Pro
            </p>
          </div>
        </div>

        {/* Live Score & Combo Dashboard */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">SCORE</div>
            <div className="text-lg sm:text-xl font-black text-amber-400 leading-none">
              {score.toLocaleString()}
            </div>
          </div>

          <div className={`px-3.5 py-1.5 rounded-xl bg-black/40 border transition-all ${
            combo > 10 ? 'border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'border-white/10'
          }`}>
            <div className="text-[10px] text-pink-300 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-pink-500 fill-pink-500" />
              <span>COMBO</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white leading-none">
              {combo}x
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Track Selection & Bento Stats Bar */}
      <div className="px-4 sm:px-6 py-3 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Track Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Disc className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-[#94A3B8] text-[11px] uppercase font-mono mr-1">TRACK:</span>
          {TRACKS.map(t => (
            <button
              key={t.id}
              disabled={isPlaying}
              onClick={() => setSelectedTrack(t)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedTrack.id === t.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400/40'
                  : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 border border-white/5'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t.title} ({t.bpm} BPM)
            </button>
          ))}
        </div>

        {/* Mini Waveform & Health Bar */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden sm:flex items-center gap-2">
            <canvas ref={waveformCanvasRef} width={100} height={20} className="rounded-md" />
          </div>

          {/* Health Gauge */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[#94A3B8]">HP:</span>
            <div className="w-20 h-2.5 rounded-full bg-black/50 overflow-hidden border border-white/10 p-0.5">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${health}%`,
                  backgroundColor: health > 50 ? '#10B981' : health > 25 ? '#F59E0B' : '#EF4444' 
                }}
              />
            </div>
            <span className="text-white font-bold">{health}%</span>
          </div>
        </div>
      </div>

      {/* Center Stage: The Rhythm Runway */}
      <div className="relative w-full h-80 sm:h-96 bg-[#0B0E1B] overflow-hidden flex flex-col justify-between">
        
        {/* Background Grid & Ambient Studio Atmosphere */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 60 FPS Note Canvas */}
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={380} 
          className="w-full h-full object-fill relative z-10"
        />

        {/* Floating Hit Text Overlays */}
        <div className="absolute inset-x-0 bottom-24 pointer-events-none z-20 flex justify-center">
          {feedbacks.map(fb => (
            <div
              key={fb.id}
              className={`absolute font-display font-black text-lg sm:text-2xl animate-out fade-out zoom-out-95 duration-500 tracking-wider drop-shadow-md ${
                fb.type === 'perfect' 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                  : fb.type === 'great'
                  ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                  : 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
              }`}
              style={{
                left: `${(fb.lane * 25) + 12.5}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {fb.text}
            </div>
          ))}
        </div>

        {/* Game Start Overlay (When not playing) */}
        {!isPlaying && !gameEnded && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <Scissors className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                พร้อมตัดต่อตามบีทเพลงหรือยัง?
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md">
                กดคีย์ <kbd className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-cyan-300 border border-white/20">Q</kbd>{' '}
                <kbd className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-emerald-300 border border-white/20">W</kbd>{' '}
                <kbd className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-purple-300 border border-white/20">C</kbd> และ{' '}
                <kbd className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-pink-300 border border-white/20">SPACE</kbd>{' '}
                เมื่อแถบคลิปวิ่งมาชนเส้น Playhead ด้านล่าง!
              </p>
            </div>

            <button
              onClick={startGame}
              id="beat-cutter-start-btn"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>เริ่มเล่นทันที (START BEAT)</span>
            </button>
          </div>
        )}

        {/* Game Over / Victory Modal */}
        {gameEnded && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5 animate-in zoom-in-95">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
                <Trophy className="w-10 h-10" />
              </div>
              <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-mono text-xs font-black border border-purple-400 shadow-md">
                GRADE {grade}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {health > 0 ? '🎉 ยอดเยี่ยม! ผ่านการทดสอบจังหวะ' : '⚠️ เส้นไทม์ไลน์หลุดจังหวะ!'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {selectedTrack.title} ({selectedTrack.bpm} BPM)
              </p>
            </div>

            {/* Stats Breakdown Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-[10px] text-[#94A3B8]">TOTAL SCORE</div>
                <div className="text-base font-bold text-amber-400">{score.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-[10px] text-[#94A3B8]">ACCURACY</div>
                <div className="text-base font-bold text-emerald-400">{accuracyPercent}%</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-[10px] text-[#94A3B8]">MAX COMBO</div>
                <div className="text-base font-bold text-pink-400">{maxCombo}x</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-[10px] text-[#94A3B8]">PERFECT CUTS</div>
                <div className="text-base font-bold text-cyan-400">{perfectHits}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startGame}
                id="beat-cutter-replay-btn"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>เล่นใหม่อีกครั้ง</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tactile Rhythm Control Bar (Desktop Keys + Mobile Touch Pads) */}
      <div className="p-3 sm:p-4 bg-gradient-to-b from-[#0B0E1B] to-[#070912] border-t border-white/10">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {LANES.map((lane, idx) => {
            const isPressed = activeLane === idx;

            return (
              <button
                key={lane.id}
                onMouseDown={() => handleCutAction(idx)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleCutAction(idx);
                }}
                id={`beat-lane-btn-${lane.key.toLowerCase()}`}
                className={`py-3.5 sm:py-4 px-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                  isPressed 
                    ? `bg-white/20 border-white text-white ${lane.glow} scale-95` 
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-[#EDEDF4] hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: lane.color }} 
                  />
                  <span className="text-[11px] sm:text-xs font-mono font-bold uppercase hidden sm:inline">
                    {lane.name}
                  </span>
                </div>
                <kbd 
                  className="px-3 py-1 rounded-lg font-mono font-black text-sm sm:text-base border shadow-sm"
                  style={{
                    backgroundColor: isPressed ? lane.color : 'rgba(0,0,0,0.5)',
                    color: isPressed ? '#000' : '#FFF',
                    borderColor: `${lane.color}88`
                  }}
                >
                  {lane.label}
                </kbd>
              </button>
            );
          })}
        </div>

        {/* Bottom Helper Info */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8] px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>คีย์บอร์ดลัด: กดปุ่ม [Q] [W] [C] [SPACE] หรือแตะที่ปุ่มหน้าจอ</span>
          </div>
          <div className="flex items-center gap-2">
            <span>ความเร็ว:</span>
            {[1, 1.25, 1.5].map(spd => (
              <button
                key={spd}
                disabled={isPlaying}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  speedMultiplier === spd 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/5 text-[#94A3B8] hover:text-white'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
