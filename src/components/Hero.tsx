import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  Video, 
  CheckCircle2, 
  Film, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  X, 
  Tv, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PremiereLogo } from './PremiereLogo';
import { LESSONS_DATA } from '../data/masterclassData';

interface HeroProps {
  onStartLearning: () => void;
  onPreviewLesson: () => void;
}

// Helper to format exact SMPTE 24fps Timecode (HH:MM:SS:FF)
const formatSMPTE = (seconds: number, fps = 24): string => {
  const safeSec = Math.max(0, isNaN(seconds) ? 0 : seconds);
  const totalSeconds = Math.floor(safeSec);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  const frame = String(Math.floor((safeSec % 1) * fps)).padStart(2, '0');
  return `${h}:${m}:${s}:${frame}`;
};

const parseDurationSec = (durStr: string): number => {
  if (!durStr) return 480;
  const match = durStr.match(/\d+/g);
  if (!match) return 480;
  const num = parseInt(match[0], 10);
  if (durStr.includes('ชั่วโมง')) return num * 3600;
  return num * 60;
};

// Featured starter clips for the Program Monitor (3 starter lessons)
const FEATURED_HERO_CLIPS = LESSONS_DATA.slice(0, 3).map((lesson, idx) => ({
  id: lesson.id,
  title: `บทที่ ${lesson.id} · ${lesson.title}`,
  channel: lesson.instructor || 'JaLearn',
  dur: lesson.dur,
  durationSec: parseDurationSec(lesson.dur),
  youtubeId: lesson.youtubeId,
  resolution: idx % 2 === 0 ? "4K UHD 24fps" : "1080p FHD 60fps"
}));

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onPreviewLesson }) => {
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const currentClip = FEATURED_HERO_CLIPS[currentClipIndex] || FEATURED_HERO_CLIPS[0];

  // Inline Video Player & 100% Real-time Synchronized States
  const [isPlaying, setIsPlaying] = useState(true); // Player monitor active mode
  const [isVideoPlaying, setIsVideoPlaying] = useState(true); // Real video playing state
  const [isMuted, setIsMuted] = useState(true); // Default muted so browsers automatically permit autoplay without click
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentClip.durationSec || 494);
  const [vuLevel, setVuLevel] = useState(72);
  const [liveFps, setLiveFps] = useState(59.94);

  // Auto-play Next Episode states
  const [isAutoPlayNext, setIsAutoPlayNext] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Send control command to embedded YouTube player
  const postCommand = (func: string, args: any[] = []) => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args
          }),
          '*'
        );
      }
    } catch {
      // Ignore cross-origin issues
    }
  };

  // Switch to next clip automatically or manually
  const handlePlayNextClip = () => {
    setCountdown(null);
    setCurrentClipIndex(prev => (prev + 1) % FEATURED_HERO_CLIPS.length);
    setIsPlaying(true);
    setIsVideoPlaying(true);
    setCurrentTime(0);
  };

  // Switch to previous clip manually
  const handlePlayPrevClip = () => {
    setCountdown(null);
    setCurrentClipIndex(prev => (prev - 1 + FEATURED_HERO_CLIPS.length) % FEATURED_HERO_CLIPS.length);
    setIsPlaying(true);
    setIsVideoPlaying(true);
    setCurrentTime(0);
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
  };

  // Countdown timer effect for auto-playing next episode
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      handlePlayNextClip();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, currentClipIndex]);

  // Real-time bidirectional listener from YouTube IFrame postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }
        if (data && data.event === 'infoDelivery' && data.info) {
          const info = data.info;
          if (typeof info.currentTime === 'number' && !isNaN(info.currentTime)) {
            setCurrentTime(info.currentTime);
          }
          if (typeof info.duration === 'number' && info.duration > 0) {
            setDuration(info.duration);
          }
          if (typeof info.playerState === 'number') {
            // 1: playing, 2: paused, 3: buffering, 0: ended
            if (info.playerState === 1) {
              setIsVideoPlaying(true);
            } else if (info.playerState === 2) {
              setIsVideoPlaying(false);
            } else if (info.playerState === 0) {
              // Video finished playing! Trigger autoplay next
              setIsVideoPlaying(false);
              if (isAutoPlayNext) {
                setCountdown(3);
              }
            }
          }
        }

        // Also handle onStateChange format if sent by player
        if (data && data.event === 'onStateChange' && (data.info === 0 || data.data === 0)) {
          setIsVideoPlaying(false);
          if (isAutoPlayNext) {
            setCountdown(3);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isAutoPlayNext]);

  // Request sync from player periodically
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening', id: 1 }),
          '*'
        );
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // High-precision Real-time Playback Clock & Audio VU meter simulation
  useEffect(() => {
    let animId: number;
    let lastRafTime = performance.now();

    const tick = (now: number) => {
      if (isPlaying && isVideoPlaying) {
        const dt = (now - lastRafTime) / 1000;
        setCurrentTime(prev => {
          const next = prev + dt;
          return next <= duration ? next : duration;
        });

        // Real-time Audio VU meter synchronized to playback state
        setVuLevel(prev => {
          if (isMuted) return 0;
          const wave = Math.sin(now * 0.009) * 22 + 68;
          const jitter = (Math.random() - 0.5) * 15;
          const target = Math.max(10, Math.min(96, wave + jitter));
          return prev * 0.75 + target * 0.25;
        });
      } else {
        // Drop VU meter to silence when paused
        setVuLevel(prev => (prev > 0.5 ? prev * 0.75 : 0));
      }
      lastRafTime = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isVideoPlaying, duration, isMuted]);

  // Real-time Live Frame Rate (FPS) Measurement via RAF Delta
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsAnimId: number;

    const measureFps = (now: number) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 450) {
        const fps = (frameCount * 1000) / delta;
        setLiveFps(fps);
        frameCount = 0;
        lastTime = now;
      }
      fpsAnimId = requestAnimationFrame(measureFps);
    };
    fpsAnimId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(fpsAnimId);
  }, []);

  // Update duration and reset time on clip change
  useEffect(() => {
    setCurrentTime(0);
    setDuration(currentClip.durationSec || 494);
    setIsVideoPlaying(true);
  }, [currentClipIndex, currentClip.durationSec]);

  // Transport Control Actions
  const handleSeek = (targetSec: number) => {
    const clamped = Math.max(0, Math.min(duration, targetSec));
    setCurrentTime(clamped);
    postCommand('seekTo', [clamped, true]);
  };

  const handleStepFrame = (frames: number) => {
    const dt = frames * (1 / 24);
    handleSeek(currentTime + dt);
  };

  const togglePlayPause = () => {
    if (isVideoPlaying) {
      postCommand('pauseVideo');
      setIsVideoPlaying(false);
    } else {
      postCommand('playVideo');
      setIsVideoPlaying(true);
    }
  };

  // Floating particles background animation
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => {
      const rand = Math.random();
      const color = rand > 0.6 ? '139, 92, 246' : rand > 0.25 ? '56, 189, 248' : '245, 158, 11';
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        vy: Math.random() * 0.35 + 0.1,
        color,
        alpha: Math.random() * 0.45 + 0.25
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.vy;
        if (p.y < -10) p.y = height + 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Studio Audio Waveform canvas in preview visual
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 500);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 300);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const bars = Array.from({ length: 44 }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.03 + Math.random() * 0.04
    }));

    const renderWave = () => {
      ctx.clearRect(0, 0, width, height);
      const barW = width / bars.length;
      bars.forEach((b, i) => {
        b.phase += b.speed;
        const h = (Math.sin(b.phase) + 1) * 0.5 * (height * 0.4) + 6;
        const grad = ctx.createLinearGradient(0, height / 2 - h / 2, 0, height / 2 + h / 2);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.85)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.75)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(i * barW + 1, height / 2 - h / 2, Math.max(1, barW - 3), h);
      });
      animationFrameId = requestAnimationFrame(renderWave);
    };
    renderWave();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[88vh] flex items-center pt-24 pb-16 overflow-hidden">
      {/* Floating Particles Background Animation */}
      <canvas 
        ref={particleCanvasRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-60" 
      />

      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle Studio Ruler Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="studio-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 2xl:gap-16 items-center">
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#12162A]/90 border border-indigo-500/30 text-xs font-semibold text-[#C7D2FE] shadow-[0_0_20px_rgba(153,153,255,0.2)]">
              <PremiereLogo className="w-5 h-5 rounded-md shadow-xs" withGlow />
              <span className="tracking-wide">Adobe Premiere Pro Masterclass Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.18]">
              เรียนตัดต่อวิดีโอ <br />
              <span className="text-gradient">Adobe Premiere Pro</span> <br />
              สู่มาตรฐานมืออาชีพ
            </h1>

            <p className="text-[#94A3B8] text-base sm:text-lg max-w-xl leading-relaxed">
              ฝึกฝนทักษะจริงตั้งแต่การจัดระบบ Assets, การคัดเลือกช็อตและตัดต่อ Rough Cut,
              การเกรดสี Lumetri, มิกซ์เสียง Essential Sound จนถึงสร้าง Motion Graphics
              พร้อม 15 บทเรียนวิดีโอ, 10 เวิร์กช็อปโปรเจกต์จริง และ 8 มินิเกมฝึกทักษะ
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onStartLearning}
                id="hero-start-btn"
                className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25"
              >
                <span>เริ่มเรียนบทแรกฟรี</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(true)}
                id="hero-preview-btn"
                className="px-5 py-3 rounded-xl text-sm font-semibold border border-indigo-500/25 bg-[#131724]/90 hover:bg-[#1C2134] hover:border-indigo-400/40 text-[#EDEDF4] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Video className="w-4 h-4 text-[#818CF8]" />
                <span>ชมวิดีโอตัวอย่างตรงนี้</span>
              </button>
            </div>

            {/* Real-time Timeline Scrub Indicator */}
            <div className="space-y-1.5 pt-2 max-w-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-[#38BDF8] font-bold tracking-wider">{formatSMPTE(currentTime, 24)}</span>
                </div>
                <span className="text-[#64748B] font-mono">{formatSMPTE(duration, 24)}</span>
              </div>
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleSeek(pct * duration);
                }}
                className="w-full h-2 bg-[#131724] border border-indigo-500/25 rounded-full overflow-hidden relative shadow-inner cursor-pointer hover:h-2.5 transition-all group/bar"
                title="คลิกเพื่อเลื่อนตำแหน่งเวลาแบบ Real-time (Click to Seek)"
              >
                <div 
                  className="h-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#38BDF8] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-[width] duration-75"
                  style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Structured Syllabus Highlights */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-indigo-500/15 max-w-lg">
              <div>
                <span className="block font-display font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">15</span>
                <span className="text-[12px] text-[#94A3B8]">บทเรียนวิดีโอ</span>
              </div>
              <div>
                <span className="block font-display font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">10</span>
                <span className="text-[12px] text-[#94A3B8]">เวิร์กช็อปจริง</span>
              </div>
              <div>
                <span className="block font-display font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">8</span>
                <span className="text-[12px] text-[#94A3B8]">มินิเกมฝึกทักษะ</span>
              </div>
              <div>
                <span className="block font-display font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">100%</span>
                <span className="text-[12px] text-[#94A3B8]">มีใบประกาศ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Premiere Pro Program Monitor Panel */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="bg-[#121522] border border-indigo-500/25 rounded-2xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.15)] group">
              {/* NLE Program Window Header */}
              <div className="px-4 py-2.5 bg-[#171B2C] border-b border-indigo-500/20 flex items-center justify-between text-xs text-[#94A3B8] font-mono select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <PremiereLogo className="w-4 h-4 rounded-xs shrink-0 ml-1" />
                  {isPlaying ? (
                    <div className="flex items-center gap-2 min-w-0 ml-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 flex items-center gap-1 ${
                        isVideoPlaying 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isVideoPlaying ? 'bg-red-500' : 'bg-amber-400'}`} />
                        {isVideoPlaying ? 'REAL-TIME LIVE' : 'PAUSED'}
                      </span>
                      <span className="text-[#F1F5F9] font-semibold truncate text-[11px] sm:text-xs">
                        {currentClip.title}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#F1F5F9] font-semibold ml-2 truncate">Program: Master_Sequence.prproj</span>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] shrink-0">
                  {isPlaying && (
                    <button
                      onClick={() => setIsAutoPlayNext(prev => !prev)}
                      id="hero-autoplay-toggle-btn"
                      title={isAutoPlayNext ? "เปิดเล่นบทต่อไปอัตโนมัติอยู่ (คลิกเพื่อปิด)" : "ปิดเล่นบทต่อไปอัตโนมัติอยู่ (คลิกเพื่อเปิด)"}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAutoPlayNext
                          ? 'bg-purple-500/25 text-purple-200 border border-purple-500/40 hover:bg-purple-500/35 shadow-xs'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Sparkles className={`w-3 h-3 ${isAutoPlayNext ? 'text-purple-300 animate-pulse' : 'text-slate-500'}`} />
                      <span>เล่นอัตโนมัติ: {isAutoPlayNext ? 'เปิด' : 'ปิด'}</span>
                    </button>
                  )}

                  {isPlaying && (
                    <button
                      onClick={() => {
                        const nextMuted = !isMuted;
                        setIsMuted(nextMuted);
                        postCommand(nextMuted ? 'mute' : 'unMute');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isMuted
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                      title={isMuted ? "คลิกเพื่อเปิดเสียง (Unmute)" : "คลิกเพื่อปิดเสียง (Mute)"}
                    >
                      {isMuted ? <VolumeX className="w-3 h-3 text-amber-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                      <span>{isMuted ? 'เปิดเสียง' : 'มีเสียง'}</span>
                    </button>
                  )}

                  {isPlaying ? (
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        postCommand('pauseVideo');
                      }}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-red-500/20 text-[#94A3B8] hover:text-red-300 border border-white/10 hover:border-red-500/30 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="หยุดเล่นและกลับสู่หน้า Sequence ปกติ"
                    >
                      <X className="w-3 h-3" />
                      <span className="hidden sm:inline">ปิดวิดีโอ</span>
                    </button>
                  ) : (
                    <span className="hidden sm:inline text-[#64748B]">Fit (100%)</span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[#A5B4FC] border border-indigo-500/30 text-[10px] font-semibold">
                    {currentClip.resolution}
                  </span>
                </div>
              </div>

              {/* Viewport Screen */}
              <div className="aspect-[16/10] sm:aspect-[16/9] bg-[#0A0C11] flex items-center justify-center relative overflow-hidden">
                {isPlaying ? (
                  /* Live Embedded Video Playing Right Here */
                  <div className="relative w-full h-full bg-black">
                    <iframe
                      ref={iframeRef}
                      id="hero-youtube-player"
                      key={`${currentClip.youtubeId}-${isMuted}`}
                      src={`https://www.youtube-nocookie.com/embed/${currentClip.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
                      title={currentClip.title}
                      className="w-full h-full border-0 absolute inset-0 z-20"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />

                    {/* Auto-Play Next Episode Overlay with Countdown */}
                    {countdown !== null && (
                      <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-3 shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                          <span className="text-2xl font-black font-mono">{countdown}</span>
                          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="rgba(255,255,255,0.15)"
                              strokeWidth="3"
                              fill="none"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#38BDF8"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray="175.9"
                              strokeDashoffset={175.9 * (1 - countdown / 3)}
                              className="transition-all duration-1000 ease-linear"
                            />
                          </svg>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>จบคลิปแล้ว · กำลังเล่นบทต่อไปอัตโนมัติ</span>
                        </div>

                        <h4 className="text-white text-sm sm:text-base font-bold max-w-md line-clamp-1 mb-1">
                          {FEATURED_HERO_CLIPS[(currentClipIndex + 1) % FEATURED_HERO_CLIPS.length]?.title}
                        </h4>
                        <p className="text-[#94A3B8] text-xs mb-4 font-mono">
                          ความยาว {FEATURED_HERO_CLIPS[(currentClipIndex + 1) % FEATURED_HERO_CLIPS.length]?.dur} • By {FEATURED_HERO_CLIPS[(currentClipIndex + 1) % FEATURED_HERO_CLIPS.length]?.channel}
                        </p>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={handlePlayNextClip}
                            id="autoplay-next-now-btn"
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>เล่นบทต่อไปทันที</span>
                          </button>
                          <button
                            onClick={handleCancelCountdown}
                            id="autoplay-cancel-btn"
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#94A3B8] hover:text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                          >
                            <span>ยกเลิก</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Rule of Thirds Guides (Subtle) */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-10">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* Radial Glow Backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.32),transparent_65%)] pointer-events-none" />

                {/* Waveform Canvas Overlay */}
                <canvas 
                  ref={waveCanvasRef} 
                  className="absolute inset-0 w-full h-full opacity-35 pointer-events-none z-10" 
                />

                {/* Right Side Audio Meter (dB indicator) */}
                <div className="absolute right-3 top-4 bottom-16 w-2 flex flex-col justify-between items-center z-20 pointer-events-none opacity-85">
                  <span className="text-[8px] font-mono text-red-400">0</span>
                  <div className="w-1.5 flex-1 my-1 bg-[#1E2330] rounded-xs overflow-hidden flex flex-col justify-end">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-500 via-amber-400 to-red-500 transition-all duration-75"
                      style={{ height: `${vuLevel}%` }} 
                    />
                  </div>
                  <span className="text-[8px] font-mono text-[#646D82]">-24</span>
                </div>

                {/* Center Playback Trigger */}
                <div className="relative z-20 text-center space-y-3 px-4">
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                      setIsVideoPlaying(true);
                      postCommand('playVideo');
                    }}
                    id="hero-play-center-btn"
                    className="w-18 h-18 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(139,92,246,0.7)] hover:scale-110 hover:shadow-[0_0_55px_rgba(139,92,246,0.9)] active:scale-95 transition-all duration-300 cursor-pointer text-white border border-white/30 group-hover:scale-105"
                    title="คลิกเพื่อเล่นวิดีโอตรงนี้ได้ทันที"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>

                  <div className="space-y-1.5">
                    <span className="inline-block text-xs font-semibold text-white bg-[#1A1E2B]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-indigo-500/30 shadow-sm max-w-sm sm:max-w-md truncate">
                      {currentClip.title}
                    </span>
                    <p className="text-[12px] text-cyan-300 font-medium flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      คลิกที่ปุ่ม Play เพื่อเล่นวิดีโอตรงนี้ได้เลย
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Timecode & Transport Bar (100% Real-Time Synchronized) */}
            <div className="absolute left-2.5 right-6 bottom-2.5 z-30 flex flex-col gap-1.5 px-3 py-2 rounded-xl bg-[#0F121C]/95 border border-indigo-500/35 text-xs font-mono shadow-2xl backdrop-blur-md">
              {/* Real-time Interactive Timeline Scrubber */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleSeek(pct * duration);
                }}
                className="group/scrub relative w-full h-1.5 sm:h-2 bg-[#1A1F30] rounded-full cursor-pointer overflow-hidden border border-indigo-500/20 hover:h-2.5 transition-all"
                title="คลิกเพื่อกระโดดไปยังตำแหน่งเวลาที่ต้องการ (Real-time Scrubbing)"
              >
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-[width] duration-75"
                  style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
                />
              </div>

              {/* Transport Controls & Live Real-time Metadata */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                {/* Left: REC, LIVE / PAUSED, SMPTE tag */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
                  <span className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-red-500 animate-rec shadow-[0_0_8px_rgba(239,68,68,0.9)]' : 'bg-red-900 opacity-60'}`} />
                  <span className={`font-bold tracking-wider text-[11px] ${isVideoPlaying ? 'text-red-400' : 'text-slate-500'}`}>REC</span>
                  {isVideoPlaying ? (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                      PAUSED
                    </span>
                  )}
                  <span className="text-cyan-400/80 hidden sm:inline text-[10px] tracking-wide font-semibold">SMPTE</span>
                </div>

                {/* Center: Prev Clip, Play/Pause, Step Back, Real SMPTE Timecode, Step Forward, Next Clip */}
                <div className="flex items-center gap-1 sm:gap-1.5 text-[#94A3B8]">
                  <button
                    onClick={handlePlayPrevClip}
                    className="p-1 rounded hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    title="เล่นบทก่อนหน้า (Previous Lesson)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="p-1 rounded-md hover:bg-white/10 text-white transition-colors cursor-pointer"
                    title={isVideoPlaying ? "หยุดชั่วคราว (Pause)" : "เล่นต่อ (Play)"}
                  >
                    {isVideoPlaying ? <Pause className="w-3.5 h-3.5 text-amber-300 fill-current" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
                  </button>

                  <button
                    onClick={() => handleStepFrame(-1)}
                    className="p-1 rounded hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer hidden xs:inline-flex"
                    title="ย้อนกลับ 1 เฟรม (-1 frame)"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>

                  {/* Real-time SMPTE Timecode */}
                  <div className="flex items-center gap-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200 font-bold text-xs sm:text-sm tracking-widest drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                      {formatSMPTE(currentTime, 24)}
                    </span>
                    <span className="text-[#64748B] text-[10px] hidden md:inline font-mono">
                      / {formatSMPTE(duration, 24)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStepFrame(1)}
                    className="p-1 rounded hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer hidden xs:inline-flex"
                    title="เดินหน้า 1 เฟรม (+1 frame)"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handlePlayNextClip}
                    className="p-1 rounded hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    title="เล่นบทถัดไป (Next Lesson)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Clip Index & Live Measured FPS */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#64748B] text-[11px] shrink-0">
                  <span className="hidden lg:inline text-indigo-300/80 font-mono text-[10px]">
                    คลิป {currentClipIndex + 1}/{FEATURED_HERO_CLIPS.length}
                  </span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]" title="อัตราเฟรมเรตการเรนเดอร์สด (Live Real-Time FPS)">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold">{liveFps.toFixed(2)} FPS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quick Clip Selector Bar */}
          <div className="px-4 py-2.5 bg-[#141826] border-t border-indigo-500/15 flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <div className="flex items-center gap-1.5 shrink-0 text-[#94A3B8] font-mono text-[11px]">
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">เลือกตอน:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {FEATURED_HERO_CLIPS.map((clip, idx) => (
                <button
                  key={clip.id}
                  onClick={() => {
                    setCurrentClipIndex(idx);
                    setIsPlaying(true);
                    setIsVideoPlaying(true);
                    setCurrentTime(0);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentClipIndex === idx && isPlaying
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                      : currentClipIndex === idx
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>บทที่ {clip.id}</span>
                  <span className="opacity-60 text-[10px]">({clip.dur})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isPlaying && (
                <button
                  onClick={() => setIsPlaying(false)}
                  className="text-[11px] text-red-400 hover:text-red-300 transition-colors font-mono cursor-pointer"
                >
                  ✕ ปิดวิดีโอ
                </button>
              )}
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
