import React, { useState } from 'react';
import { 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Clock, 
  HardDrive, 
  Video, 
  Tv, 
  Layers, 
  Zap, 
  Award,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiereLogo } from '../PremiereLogo';

interface ExportTycoonGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface ClientOrder {
  id: string;
  client: string;
  projectTitle: string;
  demandDesc: string;
  correctFormat: 'MP4' | 'MOV' | 'PRORES' | 'WEBM';
  correctCodec: 'H.264' | 'HEVC' | 'ProRes 422HQ' | 'ProRes 4444';
  correctResolution: '4K' | '1080p' | '9:16 Vertical';
  correctBitrate: number; // in Mbps
  reward: number;
}

const CLIENT_ORDERS: ClientOrder[] = [
  {
    id: 'cinema',
    client: 'Major Hollywood Distribution',
    projectTitle: 'Master Trailer for Cinema Screen',
    demandDesc: 'ต้องการไฟล์คุณภาพระดับมาสเตอร์ ProRes 422HQ ความละเอียด 4K คมชัดสูงสุด ไร้รอยบีบอัดสำหรับฉายในโรงภาพยนตร์',
    correctFormat: 'MOV',
    correctCodec: 'ProRes 422HQ',
    correctResolution: '4K',
    correctBitrate: 220,
    reward: 500
  },
  {
    id: 'shorts',
    client: 'Trending Influencer Agency',
    projectTitle: 'Viral Dance TikTok & Reels',
    demandDesc: 'ส่งงานสำหรับลง TikTok และ Reels แนวนอนไม่ได้เด็ดขาด! ต้องเป็น 9:16 แนวตั้ง ฟอร์แมต MP4 H.264 บิตเรต 18 Mbps พอดี',
    correctFormat: 'MP4',
    correctCodec: 'H.264',
    correctResolution: '9:16 Vertical',
    correctBitrate: 18,
    reward: 450
  },
  {
    id: 'vfx',
    client: 'VFX Motion Studio',
    projectTitle: '3D Title Animation with Alpha Channel',
    demandDesc: 'งานแอนิเมชันเปิดเรื่อง ต้องมีช่องโปร่งใส Alpha Channel เพื่อนำไปซ้อนบนฟุตเทจ ต้องใช้ ProRes 4444 ในคอนเทนเนอร์ MOV',
    correctFormat: 'MOV',
    correctCodec: 'ProRes 4444',
    correctResolution: '1080p',
    correctBitrate: 150,
    reward: 550
  }
];

export const ExportTycoonGame: React.FC<ExportTycoonGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [orderIndex, setOrderIndex] = useState(0);
  const currentOrder = CLIENT_ORDERS[orderIndex];

  // User Settings
  const [format, setFormat] = useState<'MP4' | 'MOV' | 'PRORES' | 'WEBM'>('MP4');
  const [codec, setCodec] = useState<'H.264' | 'HEVC' | 'ProRes 422HQ' | 'ProRes 4444'>('H.264');
  const [resolution, setResolution] = useState<'4K' | '1080p' | '9:16 Vertical'>('1080p');
  const [bitrate, setBitrate] = useState<number>(15);

  const [score, setScore] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  // File size calculation estimation
  const estSizeMb = Math.round((bitrate * 60) / 8);

  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setFeedback(null);

    const interval = setInterval(() => {
      setRenderProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          evaluateDelivery();
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  const evaluateDelivery = () => {
    const isFormatOk = format === currentOrder.correctFormat;
    const isCodecOk = codec === currentOrder.correctCodec;
    const isResOk = resolution === currentOrder.correctResolution;
    const isBitrateClose = Math.abs(bitrate - currentOrder.correctBitrate) <= 15;

    if (isFormatOk && isCodecOk && isResOk && isBitrateClose) {
      const earned = currentOrder.reward;
      const updated = score + earned;
      setScore(updated);
      onScoreUpdate(updated);
      setFeedback({
        success: true,
        msg: `ลูกค้าอนุมัติผ่าน 100%! สเปกถูกต้องตรงใจ ได้รับ ${earned} pts`
      });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else {
      let reasons: string[] = [];
      if (!isFormatOk) reasons.push(`คอนเทนเนอร์ควรเป็น ${currentOrder.correctFormat}`);
      if (!isCodecOk) reasons.push(`Codec ควรเป็น ${currentOrder.correctCodec}`);
      if (!isResOk) reasons.push(`ความละเอียดควรเป็น ${currentOrder.correctResolution}`);
      if (!isBitrateClose) reasons.push(`บิตเรตควรอยู่ราวๆ ${currentOrder.correctBitrate} Mbps`);

      setFeedback({
        success: false,
        msg: `ลูกค้าตีกลับงาน! ตรวจพบข้อผิดพลาด: ${reasons.join(', ')}`
      });
    }
  };

  const handleNextOrder = () => {
    if (orderIndex < CLIENT_ORDERS.length - 1) {
      setOrderIndex(i => i + 1);
      setFeedback(null);
      setRenderProgress(0);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#090C16]/95 border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col text-[#EDEDF4] select-none">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#101426] to-[#0A0D18] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span>EXPORT ARCHITECT: BITRATE TYCOON</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                  MEDIA ENCODER PRO
                </span>
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              ห้องส่งออกไฟล์ Media Encoder • กำหนด Codec, Bitrate, และฟอร์แมตตามสเปกลูกค้า
            </p>
          </div>
        </div>

        {/* Score & Job tracker */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">SCORE</div>
            <div className="text-lg sm:text-xl font-black text-cyan-400 leading-none">
              {score.toLocaleString()}
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-right">
            <div className="text-[10px] text-[#94A3B8] uppercase">JOB</div>
            <div className="text-lg sm:text-xl font-black text-purple-400 leading-none">
              {orderIndex + 1}/{CLIENT_ORDERS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Client Brief Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent border-b border-white/10 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              CLIENT BRIEF
            </span>
            <span className="text-white font-bold">{currentOrder.client}</span>
          </div>
          <span className="text-amber-400 font-bold">REWARD: +{currentOrder.reward} PTS</span>
        </div>
        <h4 className="text-sm sm:text-base font-bold text-white">{currentOrder.projectTitle}</h4>
        <p className="text-xs text-[#CBD5E1] leading-relaxed italic">
          "{currentOrder.demandDesc}"
        </p>
      </div>

      {/* Export Settings Panel */}
      <div className="p-4 sm:p-6 bg-[#080A14] grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Column: Format & Codec */}
        <div className="space-y-4">
          {/* Container Format */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>CONTAINER FORMAT</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['MP4', 'MOV', 'PRORES'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  disabled={isRendering || feedback?.success}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    format === f 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  .{f}
                </button>
              ))}
            </div>
          </div>

          {/* Video Codec */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-purple-400" />
              <span>VIDEO CODEC</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['H.264', 'HEVC', 'ProRes 422HQ', 'ProRes 4444'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCodec(c)}
                  disabled={isRendering || feedback?.success}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    codec === c 
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Resolution & Bitrate */}
        <div className="space-y-4">
          {/* Resolution */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-pink-400" />
              <span>ASPECT & RESOLUTION</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['4K', '1080p', '9:16 Vertical'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  disabled={isRendering || feedback?.success}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    resolution === r 
                      ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Bitrate Slider */}
          <div className="space-y-2 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>TARGET BITRATE</span>
              </span>
              <span className="text-cyan-400 font-bold">{bitrate} Mbps</span>
            </div>
            <input 
              type="range"
              min="5"
              max="250"
              step="5"
              value={bitrate}
              disabled={isRendering || feedback?.success}
              onChange={(e) => setBitrate(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-black/60 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> EST. SIZE: ~{estSizeMb} MB/min
              </span>
              <span>250 Mbps Max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Bar & Action Footer */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0E1222] to-[#080A14] border-t border-white/10 space-y-3">
        {/* Progress bar */}
        {isRendering && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> ENCODING TIMELINE FRAMES...
              </span>
              <span>{renderProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-150"
                style={{ width: `${renderProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-2xl text-xs font-mono flex items-center justify-between gap-3 ${
            feedback.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            <span>{feedback.msg}</span>
            {feedback.success && (
              <button
                onClick={handleNextOrder}
                id="next-export-job-btn"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:brightness-110 cursor-pointer whitespace-nowrap"
              >
                {orderIndex < CLIENT_ORDERS.length - 1 ? 'รับงานถัดไป →' : 'ดูสรุปผล 🎉'}
              </button>
            )}
          </div>
        )}

        {!feedback?.success && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleStartRender}
              disabled={isRendering}
              id="export-media-encoder-btn"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 disabled:opacity-50 text-white font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{isRendering ? 'กำลังเข้ารหัส...' : 'ส่งออกและส่งงานลูกค้า (QUEUE EXPORT)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
