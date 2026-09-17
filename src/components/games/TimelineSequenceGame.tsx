import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  X, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Sparkles,
  Layers,
  Film
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface TimelineSequenceGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface StepItem {
  id: number;
  label: string;
  category: string;
  color: string;
}

const CORRECT_WORKFLOW: StepItem[] = [
  { id: 1, label: '1. Import & คัดแยกไฟล์ลง Bin (A-Roll / B-Roll / Audio)', category: 'Media Prep', color: 'from-blue-600 to-indigo-600' },
  { id: 2, label: '2. วาง Assembly Cut จัดเรียงโครงเรื่องตามสคริปต์บน Timeline', category: 'Rough Cut', color: 'from-indigo-600 to-purple-600' },
  { id: 3, label: '3. ตัดทอนส่วนเกินให้กระชับด้วย Razor (C) & Ripple Trim (Q/W)', category: 'Fine Cut', color: 'from-purple-600 to-pink-600' },
  { id: 4, label: '4. มิกซ์เสียง Dialogue, ใส่ Sound Effects & ดนตรี ทำ Auto-Ducking', category: 'Audio Mix', color: 'from-emerald-600 to-teal-600' },
  { id: 5, label: '5. ใส่ Transition, Lower Third และ Motion Graphics เปิดหัวคลิป', category: 'Motion VFX', color: 'from-cyan-600 to-blue-600' },
  { id: 6, label: '6. ปรับค่าแสง White Balance และ Color Grading ย้อมโทนด้วย Lumetri', category: 'Color Finish', color: 'from-amber-600 to-orange-600' },
  { id: 7, label: '7. Render & Export Final Master (.mp4 H.264 / ProRes 422)', category: 'Delivery', color: 'from-rose-600 to-red-600' }
];

export const TimelineSequenceGame: React.FC<TimelineSequenceGameProps> = ({ onComplete, onScoreUpdate }) => {
  const [availablePool, setAvailablePool] = useState<StepItem[]>([]);
  const [timelineSequence, setTimelineSequence] = useState<StepItem[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [stepResults, setStepResults] = useState<boolean[]>([]);

  const resetGame = () => {
    // Shuffle steps into available pool
    const shuffled = [...CORRECT_WORKFLOW].sort(() => Math.random() - 0.5);
    setAvailablePool(shuffled);
    setTimelineSequence([]);
    setHasChecked(false);
    setStepResults([]);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleAddToTimeline = (item: StepItem) => {
    gameAudio.playClick();
    setTimelineSequence(prev => [...prev, item]);
    setAvailablePool(prev => prev.filter(x => x.id !== item.id));
    setHasChecked(false);
  };

  const handleRemoveFromTimeline = (item: StepItem) => {
    gameAudio.playClick();
    setTimelineSequence(prev => prev.filter(x => x.id !== item.id));
    setAvailablePool(prev => [...prev, item]);
    setHasChecked(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    gameAudio.playSlide();
    setTimelineSequence(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setHasChecked(false);
  };

  const handleMoveDown = (index: number) => {
    if (index === timelineSequence.length - 1) return;
    gameAudio.playSlide();
    setTimelineSequence(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setHasChecked(false);
  };

  const handleCheckOrder = () => {
    if (timelineSequence.length < CORRECT_WORKFLOW.length) return;

    const results = timelineSequence.map((item, idx) => item.id === CORRECT_WORKFLOW[idx].id);
    setStepResults(results);
    setHasChecked(true);

    const correctCount = results.filter(Boolean).length;
    const finalScore = Math.round((correctCount / CORRECT_WORKFLOW.length) * 100);

    onScoreUpdate(finalScore);

    if (correctCount === CORRECT_WORKFLOW.length) {
      gameAudio.playVictory();
      setTimeout(() => {
        onComplete(100);
      }, 700);
    } else {
      if (correctCount >= 4) {
        gameAudio.playCorrect();
      } else {
        gameAudio.playWrong();
      }
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Top Controls */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">วางบน Timeline แล้ว:</span>
          <span className="text-[#34D399] font-bold">
            {timelineSequence.length} / {CORRECT_WORKFLOW.length} ขั้นตอน
          </span>
        </div>
        <button
          onClick={resetGame}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px] flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>รีเซ็ต</span>
        </button>
      </div>

      {/* Available Pool */}
      {availablePool.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-[#A78BFA] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>ขั้นตอนที่ยังไม่ได้วาง (คลิกเพื่อนำลง Timeline):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availablePool.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddToTimeline(item)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#8B5CF6] hover:text-white border border-white/15 text-xs font-medium text-white transition-all cursor-pointer flex items-center gap-1.5 shadow"
              >
                <span>+</span>
                <span className="line-clamp-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Timeline Drop Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>ไทม์ไลน์กระบวนการผลิต (คลิกเลื่อนขึ้น-ลงเพื่อจัดลำดับ):</span>
          </span>
          {timelineSequence.length === CORRECT_WORKFLOW.length && (
            <span className="text-emerald-400 font-bold">ครบ 7 ขั้นตอนแล้ว พร้อมตรวจ!</span>
          )}
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/15 min-h-[220px] space-y-2">
          {timelineSequence.length > 0 ? (
            timelineSequence.map((item, idx) => {
              const isVerified = hasChecked;
              const isCorrect = stepResults[idx];

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                    isVerified
                      ? isCorrect
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-rose-500/20 border-rose-400 text-white'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-white/10 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs truncate">{item.label}</div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">{item.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isVerified && (
                      <span className="mr-1">
                        {isCorrect ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </span>
                    )}
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 cursor-pointer"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === timelineSequence.length - 1}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 cursor-pointer"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromTimeline(item)}
                      className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 cursor-pointer ml-1"
                      title="ยกเลิกขั้นตอน"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[#94A3B8] text-xs space-y-1">
              <p>ไทม์ไลน์ยังว่างเปล่า</p>
              <p className="text-[11px] opacity-70">
                คลิกเลือกขั้นตอนจากกล่องด้านบนเพื่อนำมาเรียงลำดับกระบวนการตัดต่อตั้งแต่ 1 ถึง 7
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verify Button */}
      <div className="text-center pt-1">
        <button
          onClick={handleCheckOrder}
          disabled={timelineSequence.length < CORRECT_WORKFLOW.length}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 mx-auto ${
            timelineSequence.length === CORRECT_WORKFLOW.length
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white cursor-pointer hover:scale-105 active:scale-95 shadow-purple-500/25'
              : 'bg-white/10 text-[#94A3B8] cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ตรวจสอบความถูกต้องของไทม์ไลน์</span>
        </button>
      </div>
    </div>
  );
};
