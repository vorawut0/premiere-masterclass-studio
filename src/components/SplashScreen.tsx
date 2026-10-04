import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PremiereLogo } from './PremiereLogo';
import { Sparkles, Film, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

const LOADING_STEPS = [
  'กำลังเตรียมห้องตัดต่อระดับโปร...',
  'โหลดคลังบทเรียน 4K & ทรัพยากร...',
  'ซิงค์เครื่องมือ & เวิร์กโฟลว์ไทม์ไลน์...',
  'พร้อมเข้าสู่ Premiere Masterclass 100%'
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 1800
}) => {
  const [progress, setProgress] = useState(12);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setStepIndex(0);
      } else if (pct < 70) {
        setStepIndex(1);
      } else if (pct < 95) {
        setStepIndex(2);
      } else {
        setStepIndex(3);
      }

      if (elapsed >= minDuration) {
        clearInterval(interval);
        setIsDone(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isDone ? (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07090E] text-white select-none overflow-hidden"
          style={{ width: '100vw', height: '100vh', touchAction: 'none' }}
        >
          {/* Ambient Studio Lighting Aura */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#6366F1]/20 via-[#8B5CF6]/15 to-[#38BDF8]/10 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#9999FF]/20 rounded-full blur-[80px]" />
            {/* Cinematic subtle grid backdrop */}
            <div 
              className="absolute inset-0 opacity-[0.03]" 
              style={{
                backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          {/* Center Brand Identity Container */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm sm:max-w-md">
            {/* 3D Luminous Logo Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Outer Rotating Pulse Ring */}
              <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-r from-[#6366F1]/30 via-[#9999FF]/20 to-[#38BDF8]/30 blur-md animate-pulse" />
              
              {/* Subtle Orbital Border Glow */}
              <div className="absolute -inset-2 rounded-[38px] border border-[#9999FF]/30 shadow-[0_0_30px_rgba(153,153,255,0.35)]" />

              {/* Central Premiere Pro Icon Badge */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-[#000042] border border-[#9999FF]/40 shadow-[0_20px_50px_rgba(0,0,66,0.9),inset_0_2px_8px_rgba(153,153,255,0.4)] flex items-center justify-center p-3 transform transition-transform hover:scale-105">
                <PremiereLogo 
                  className="w-full h-full drop-shadow-[0_0_18px_rgba(153,153,255,0.8)]" 
                  withGlow 
                />
              </div>

              {/* Verified Pro Badge Pill */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-2.5 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 border border-white/20 text-white text-[10px] font-bold font-mono tracking-wider shadow-lg flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>STUDIO</span>
              </motion.div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-1.5 mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                Premiere <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#9999FF] to-[#38BDF8]">Masterclass</span>
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#94A3B8] tracking-wide flex items-center justify-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>หลักสูตรตัดต่อวิดีโอระดับมืออาชีพ</span>
              </p>
            </motion.div>

            {/* Futuristic Progress Bar */}
            <div className="w-64 sm:w-72 space-y-2">
              <div className="relative h-1.5 sm:h-2 w-full bg-[#141824] rounded-full overflow-hidden border border-indigo-500/20 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6366F1] via-[#9999FF] to-[#38BDF8] rounded-full shadow-[0_0_12px_rgba(153,153,255,0.7)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>

              {/* Progress Metadata & Status Text */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#94A3B8] truncate max-w-[200px] text-left">
                  {LOADING_STEPS[stepIndex]}
                </span>
                <span className="text-[#38BDF8] font-bold">
                  {progress}%
                </span>
              </div>
            </div>

            {/* SMPTE Timecode Ticker */}
            <div className="mt-8 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#64748B]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>TIME: 00:00:01:24</span>
              <span className="text-[#475569]">|</span>
              <span>4K UHD 60FPS</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
