import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sliders, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  ShieldCheck, 
  Music, 
  Mic, 
  Radio, 
  Zap,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiereLogo } from '../PremiereLogo';

interface AudioMixerGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface ChannelState {
  id: string;
  name: string;
  type: 'dialogue' | 'music' | 'sfx' | 'ambience';
  faderDb: number;        // -30 to +6 dB
  targetDbMin: number;
  targetDbMax: number;
  isMuted: boolean;
  isSolo: boolean;
  color: string;
}

export const AudioMixerGame: React.FC<AudioMixerGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [round, setRound] = useState(1);
  const maxRounds = 4;
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [limiterActive, setLimiterActive] = useState(true);
  const [highpassActive, setHighpassActive] = useState(false);
  const [duckingActive, setDuckingActive] = useState(false);
  const [roundSuccess, setRoundSuccess] = useState<boolean | null>(null);

  // Channels setup
  const [channels, setChannels] = useState<ChannelState[]>([
    {
      id: 'ch1',
      name: 'Host Dialogue',
      type: 'dialogue',
      faderDb: 4, // Intentionally clipping initially!
      targetDbMin: -12,
      targetDbMax: -6,
      isMuted: false,
      isSolo: false,
      color: '#38BDF8'
    },
    {
      id: 'ch2',
      name: 'Background Music',
      type: 'music',
      faderDb: -2, // Too loud, burying dialogue
      targetDbMin: -24,
      targetDbMax: -18,
      isMuted: false,
      isSolo: false,
      color: '#C084FC'
    },
    {
      id: 'ch3',
      name: 'Impact SFX',
      type: 'sfx',
      faderDb: 6, // Clipping hard
      targetDbMin: -10,
      targetDbMax: -4,
      isMuted: false,
      isSolo: false,
      color: '#F472B6'
    },
    {
      id: 'ch4',
      name: 'Room Ambience',
      type: 'ambience',
      faderDb: 0,
      targetDbMin: -30,
      targetDbMax: -22,
      isMuted: false,
      isSolo: false,
      color: '#34D399'
    }
  ]);

  // Web Audio Synthesizer for live playback
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
  };

  const playFeedbackSound = (type: 'beep' | 'success' | 'warn') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'warn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio fallback
    }
  };

  // Update channel fader
  const handleFaderChange = (id: string, val: number) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, faderDb: val } : ch));
  };

  // Check master loudness compliance
  const evaluateMix = () => {
    let passed = true;
    let feedback = '';

    channels.forEach(ch => {
      if (ch.faderDb < ch.targetDbMin || ch.faderDb > ch.targetDbMax) {
        passed = false;
        feedback = `${ch.name} ไม่อยู่ในช่วงที่กำหนด (${ch.targetDbMin}dB ถึง ${ch.targetDbMax}dB)`;
      }
    });

    if (!limiterActive) {
      passed = false;
      feedback = 'ลืมเปิด Master Limiter ป้องกันเสียงแตก (Peak Limiting)!';
    }

    if (passed) {
      playFeedbackSound('success');
      setRoundSuccess(true);
      const points = 350 * combo;
      const newScore = score + points;
      setScore(newScore);
      onScoreUpdate(newScore);
      setCombo(c => c + 1);

      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        if (round < maxRounds) {
          setRound(r => r + 1);
          setRoundSuccess(null);
          // Randomize next target scenarios
          setChannels(prev => prev.map(ch => ({
            ...ch,
            faderDb: Math.floor(Math.random() * 20) - 10
          })));
        } else {
          onComplete(newScore);
        }
      }, 1400);
    } else {
      playFeedbackSound('warn');
      setRoundSuccess(false);
      setCombo(1);
      setTimeout(() => setRoundSuccess(null), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#0B0D17]/95 border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col text-[#EDEDF4] select-none">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#0F1424] to-[#0A0D18] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>AUDIO DECIBEL MASTER</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                  BROADCAST MASTER PRO
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              คอนโซลปรับมิกซ์เสียงรอบทิศทาง • คุมระดับเดซิเบลมาตรฐานออกอากาศ (-14 LUFS / -6dB Peak)
            </p>
          </div>
        </div>

        {/* Status Score */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">SCORE</div>
            <div className="text-lg sm:text-xl font-black text-cyan-400 leading-none">
              {score.toLocaleString()}
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">ROUND</div>
            <div className="text-lg sm:text-xl font-black text-purple-400 leading-none">
              {round}/{maxRounds}
            </div>
          </div>
        </div>
      </div>

      {/* Target Criteria Banner */}
      <div className="px-4 sm:px-6 py-2.5 bg-cyan-500/5 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>BROADCAST SPECS: Dialogue (-12 ถึง -6dB) • Music (-24 ถึง -18dB) • SFX (-10 ถึง -4dB)</span>
        </div>
        <div className="flex items-center gap-2">
          {limiterActive ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> LIMITER ON (-1dB)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> LIMITER OFF (CLIPPING RISK)
            </span>
          )}
        </div>
      </div>

      {/* Center Mixer Console: 4 Audio Strips */}
      <div className="p-4 sm:p-6 bg-[#080A12] grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map((ch) => {
          const isClipping = ch.faderDb > 0;
          const isSweetSpot = ch.faderDb >= ch.targetDbMin && ch.faderDb <= ch.targetDbMax;

          return (
            <div 
              key={ch.id} 
              className={`relative rounded-2xl p-4 bg-gradient-to-b from-[#111526] to-[#0A0D18] border transition-all flex flex-col justify-between items-center ${
                isSweetSpot ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : isClipping ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'border-white/10'
              }`}
            >
              {/* Channel Label Header */}
              <div className="w-full text-center space-y-1 pb-3 border-b border-white/10">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                  {ch.type === 'dialogue' && <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                  {ch.type === 'music' && <Music className="w-3.5 h-3.5 text-purple-400" />}
                  {ch.type === 'sfx' && <Zap className="w-3.5 h-3.5 text-pink-400" />}
                  {ch.type === 'ambience' && <Radio className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{ch.name}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Target: <span className="text-cyan-300 font-bold">{ch.targetDbMin} to {ch.targetDbMax} dB</span>
                </div>
              </div>

              {/* Fader & LED Meter Column */}
              <div className="py-4 flex items-center justify-center gap-4 w-full h-56">
                {/* Visual LED Meter */}
                <div className="w-3.5 h-44 bg-black/60 rounded-full border border-white/10 p-0.5 flex flex-col-reverse justify-between overflow-hidden">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const ledDb = -30 + i * 2.8;
                    const isActive = ch.faderDb >= ledDb;
                    const isRed = ledDb > 0;
                    const isYellow = ledDb >= -6 && ledDb <= 0;
                    
                    return (
                      <div 
                        key={i} 
                        className={`w-full h-2 rounded-sm transition-all duration-75 ${
                          isActive 
                            ? isRed ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]' : isYellow ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' 
                            : 'bg-white/5'
                        }`} 
                      />
                    );
                  })}
                </div>

                {/* Vertical Slider Fader */}
                <div className="h-44 flex items-center justify-center relative">
                  <input 
                    type="range"
                    min="-30"
                    max="6"
                    step="1"
                    value={ch.faderDb}
                    onChange={(e) => handleFaderChange(ch.id, Number(e.target.value))}
                    className="w-40 h-2 -rotate-90 origin-center accent-cyan-400 cursor-pointer bg-black/70 rounded-lg"
                  />
                </div>
              </div>

              {/* Digital Readout & Status Pill */}
              <div className="w-full pt-2 border-t border-white/10 flex flex-col items-center gap-1 font-mono">
                <div className={`text-sm font-black ${
                  isClipping ? 'text-rose-400 animate-pulse' : isSweetSpot ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {ch.faderDb > 0 ? `+${ch.faderDb}` : ch.faderDb} dB
                </div>

                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSweetSpot ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : isClipping ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-white/5 text-slate-400'
                }`}>
                  {isSweetSpot ? 'PERFECT LEVEL' : isClipping ? 'CLIPPING (เสียงแตก)' : 'ADJUST FADER'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Rack Strip: Plugins & Verification */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0E1222] to-[#080B14] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Hardware FX Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setLimiterActive(!limiterActive)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              limiterActive 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Master Limiter (-1.0 dB)</span>
          </button>

          <button
            onClick={() => setHighpassActive(!highpassActive)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              highpassActive 
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>HPF 80Hz (ตัดเสียงฮัมแอร์)</span>
          </button>
        </div>

        {/* Evaluate Action Button */}
        <div className="flex items-center gap-3">
          {roundSuccess === false && (
            <span className="text-xs font-mono text-rose-400 flex items-center gap-1.5 animate-bounce">
              <AlertTriangle className="w-4 h-4" /> ระดับเสียงยังไม่ผ่านเกณฑ์ ปรับสไลเดอร์ใหม่อีกครั้ง
            </span>
          )}

          <button
            onClick={evaluateMix}
            id="audit-audio-mix-btn"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ตรวจสอบมิกซ์เสียง (CHECK BROADCAST MIX)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
