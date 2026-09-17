import React from 'react';
import { Trophy, Star, RotateCcw, ArrowLeft, Zap, Clock } from 'lucide-react';

interface GameOverModalProps {
  gameName: string;
  score: number;
  maxScore?: number;
  timeSeconds: number;
  personalBest: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameName,
  score,
  maxScore = 100,
  timeSeconds,
  personalBest,
  onPlayAgain,
  onClose
}) => {
  const isNewRecord = score > personalBest && personalBest > 0;
  const ratio = Math.min(1, score / (maxScore || 100));
  const stars = ratio >= 0.85 ? 3 : ratio >= 0.5 ? 2 : 1;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="py-6 px-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
      {/* Trophy Badge */}
      <div className="relative inline-block">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
          <Trophy className="w-10 h-10" />
        </div>
        {isNewRecord && (
          <span className="absolute -top-2 -right-3 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider animate-bounce shadow-md">
            New Record!
          </span>
        )}
      </div>

      {/* Stars */}
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3].map(st => (
          <Star
            key={st}
            className={`w-7 h-7 ${
              st <= stars
                ? 'text-amber-400 fill-amber-400 filter drop-shadow'
                : 'text-white/20'
            } transition-all`}
          />
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-1">
          {stars === 3 ? 'ยอดเยี่ยมระดับมือโปร!' : stars === 2 ? 'ทำผลงานได้ดีมาก!' : 'ผ่านการทดสอบ!'}
        </h3>
        <p className="text-xs text-[#94A3B8]">
          คุณทำมินิเกม <span className="text-[#C084FC] font-semibold">{gameName}</span> สำเร็จเรียบร้อย
        </p>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto p-3 rounded-2xl bg-white/5 border border-white/10 text-center font-mono">
        <div className="p-2 rounded-xl bg-white/5">
          <div className="text-[10px] text-[#94A3B8] mb-0.5">คะแนนที่ได้</div>
          <div className="text-lg font-bold text-[#34D399]">{score}</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <div className="text-[10px] text-[#94A3B8] mb-0.5 flex items-center justify-center gap-0.5">
            <Clock className="w-3 h-3" /> เวลา
          </div>
          <div className="text-lg font-bold text-white">{formatTime(timeSeconds)}</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <div className="text-[10px] text-[#94A3B8] mb-0.5 flex items-center justify-center gap-0.5">
            <Zap className="w-3 h-3 text-[#A855F7]" /> ได้รับ XP
          </div>
          <div className="text-lg font-bold text-[#C084FC]">+{score}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>เล่นใหม่อีกครั้ง</span>
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#EDEDF4] font-medium text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>เลือกเกมอื่น</span>
        </button>
      </div>
    </div>
  );
};
