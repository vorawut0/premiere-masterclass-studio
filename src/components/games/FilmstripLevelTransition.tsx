import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Play, Scissors, Sparkles } from 'lucide-react';
import { RunnerStage, STAGE_BIOMES } from './timelineRunnerData';
import { gameAudio } from '../../utils/gameAudio';

interface FilmstripLevelTransitionProps {
  isActive: boolean;
  targetStage: RunnerStage | null;
  stageIndex?: number;
  totalStages?: number;
  onComplete: () => void;
}

export const FilmstripLevelTransition: React.FC<FilmstripLevelTransitionProps> = ({
  isActive,
  targetStage,
  stageIndex = 0,
  totalStages = 5,
  onComplete
}) => {
  const [countdown, setCountdown] = useState(3);
  const [scrubTc, setScrubTc] = useState('00:00:00:00');

  useEffect(() => {
    if (!isActive) return;

    gameAudio.playFilmStrip();

    // Fast timecode counter simulation
    const interval = setInterval(() => {
      const frames = Math.floor(Math.random() * 24);
      const secs = Math.floor(Math.random() * 60);
      setScrubTc(`00:00:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`);
    }, 45);

    // Countdown tick
    const c1 = setTimeout(() => setCountdown(2), 250);
    const c2 = setTimeout(() => setCountdown(1), 500);

    // Transition completion callback after film rolls through
    const timer = setTimeout(() => {
      onComplete();
    }, 1250);

    return () => {
      clearInterval(interval);
      clearTimeout(c1);
      clearTimeout(c2);
      clearTimeout(timer);
    };
  }, [isActive, onComplete]);

  if (!targetStage) return null;

  const biome = STAGE_BIOMES[targetStage.biomeId] || STAGE_BIOMES.cyber_dark;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          id="filmstrip-level-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[2500] bg-black/95 flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
        >
          {/* Subtle Film Grain Noise Texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '4px 4px'
            }}
          />

          {/* Top Film Sprockets Bar (Authentic 35mm film perforations) */}
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: -100 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-[140%] h-14 bg-[#0a0a0d] border-b-2 border-white/15 flex items-center justify-around px-2 relative shrink-0 shadow-xl"
          >
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {/* Sprocket Hole */}
                <div className="w-5 h-7 rounded-[4px] bg-[#000000] border border-amber-500/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)]" />
                <span className="text-[8px] font-mono text-amber-400/60 font-semibold tracking-tighter">
                  {`F•${(i * 4 + 100).toString()}`}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Film Edge Monospace Meta Strip (Top Edge Code) */}
          <div className="w-full bg-[#111116] py-1 px-4 border-b border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-amber-400/80 uppercase tracking-widest overflow-hidden">
            <div className="flex items-center gap-3">
              <span className="font-bold flex items-center gap-1">
                <Film className="w-3 h-3 text-amber-400" />
                KODAK VISION3 500T
              </span>
              <span className="text-white/40">•</span>
              <span>24.000 FPS</span>
              <span className="text-white/40">•</span>
              <span className="text-cyan-400">PRORES 422 HQ</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="text-emerald-400">STATUS: CUEING NEXT SEQUENCE</span>
              <span className="text-white/40">•</span>
              <span className="font-bold">{scrubTc}</span>
            </div>
          </div>

          {/* Center Main Filmstrip Frame Reel (Whipping across horizontally) */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center p-4 overflow-hidden">
            {/* Sliding Film Cell Frame */}
            <motion.div
              initial={{ x: '100%', scale: 0.92 }}
              animate={{ x: 0, scale: 1 }}
              exit={{ x: '-100%', scale: 0.92 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative w-full max-w-3xl aspect-[16/8] sm:aspect-[16/7] rounded-xl overflow-hidden border-4 border-[#1E1E26] bg-[#0A0C14] shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between p-6"
              style={{
                boxShadow: `0 0 50px ${biome.glowColor}33, inset 0 0 80px rgba(0,0,0,0.95)`
              }}
            >
              {/* Corner Frame Alignment Crosshairs (Editing Suite Canvas guides) */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70" />

              {/* Center SMPTE Leader Target Crosshair with Rotating Hand */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-52 h-52 rounded-full border-2 border-white/40 relative flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border border-white/30" />
                  <div className="w-24 h-24 rounded-full border border-white/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-white/40" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-0.5 bg-white/40" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-0.5 h-1/2 bg-cyan-400 origin-bottom self-start" />
                  </motion.div>
                </div>
              </div>

              {/* Cell Header: Track & Sequence Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/40 flex items-center gap-1.5">
                    <Scissors className="w-3 h-3 text-cyan-400" />
                    TIMELINE CUT #{stageIndex + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[11px]">
                    SEQUENCE {stageIndex + 1} OF {totalStages}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-bold tracking-wider">{scrubTc}</span>
                </div>
              </div>

              {/* Cell Body: Stage Details in Cinematic Staging */}
              <div className="relative z-10 text-center space-y-2 my-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring' }}
                  className="space-y-1"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-emerald-300 uppercase font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    {biome.name}
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {targetStage.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto line-clamp-1">
                    {targetStage.titleTh}
                  </p>
                </motion.div>

                {/* Film Leader Countdown Circle / Badge */}
                <div className="pt-2 flex items-center justify-center gap-4">
                  <div className="px-4 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center gap-3 font-mono text-xs text-white shadow-inner">
                    <span className="text-slate-400">DISTANCE:</span>
                    <span className="font-bold text-cyan-300">{targetStage.distance}m</span>
                    <span className="text-white/20">|</span>
                    <span className="text-slate-400">TEMPO:</span>
                    <span className="font-bold text-amber-400">{targetStage.bpm} BPM</span>
                  </div>

                  {/* Leader Number */}
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.4, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                  >
                    {countdown}
                  </motion.div>
                </div>
              </div>

              {/* Cell Footer: Premiere Pro Style Audio & Video Track Indicators */}
              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">V1: MAIN VIDEO</span>
                  <span>•</span>
                  <span className="text-purple-400 font-bold">A1: 48kHz STEREO</span>
                </div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" />
                  ROLLING IN...
                </div>
              </div>

              {/* Realistic Timeline Playhead (Scrubbing across the cell from left to right) */}
              <motion.div
                initial={{ left: '-5%' }}
                animate={{ left: '105%' }}
                transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-30 shadow-[0_0_12px_#38BDF8] pointer-events-none"
              >
                {/* Playhead Head (The triangular marker on top) */}
                <div className="absolute -top-1 -left-2 w-4 h-3.5 bg-cyan-400 clip-playhead shadow-md flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-black" />
                </div>
                {/* Laser Light trailing glow */}
                <div className="absolute top-0 bottom-0 -left-6 w-6 bg-gradient-to-r from-transparent to-cyan-400/20" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Film Edge Code Strip */}
          <div className="w-full bg-[#111116] py-1 px-4 border-t border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-amber-400/80 uppercase tracking-widest overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">IN [ 00:00:00:00 ]</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">OUT [ 00:01:30:00 ]</span>
            </div>
            <div className="text-cyan-300 font-bold animate-pulse">
              PRESS SPACEBAR TO SKIP / LOADING ASSETS 100%
            </div>
          </div>

          {/* Bottom Film Sprockets Bar (Sliding in sync with top) */}
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: -100 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-[140%] h-14 bg-[#0a0a0d] border-t-2 border-white/15 flex items-center justify-around px-2 relative shrink-0 shadow-2xl"
          >
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-mono text-amber-400/60 font-semibold tracking-tighter">
                  {`KEY•${(i * 8 + 200).toString()}`}
                </span>
                {/* Sprocket Hole */}
                <div className="w-5 h-7 rounded-[4px] bg-[#000000] border border-amber-500/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)]" />
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
