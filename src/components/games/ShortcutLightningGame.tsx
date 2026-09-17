import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, Zap, CheckCircle2, XCircle, Flame, RotateCcw } from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface ShortcutLightningGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface ShortcutQuestion {
  id: number;
  expectedKey: string;
  expectedKeyDisplay: string;
  commandName: string;
  category: string;
  description: string;
  options: string[];
}

const SHORTCUT_QUESTIONS: ShortcutQuestion[] = [
  {
    id: 1,
    expectedKey: 'C',
    expectedKeyDisplay: 'C',
    commandName: 'Razor Tool (ตัดแบ่งคลิป)',
    category: 'Timeline Tool',
    description: 'เปลี่ยนเป็นเครื่องมือใบมีดโกนสำหรับตัดแบ่งคลิปวิดีโอหรือเสียง',
    options: ['C', 'V', 'B', 'R']
  },
  {
    id: 2,
    expectedKey: 'V',
    expectedKeyDisplay: 'V',
    commandName: 'Selection Tool (เครื่องมือเลือก)',
    category: 'Essential Tool',
    description: 'สลับกลับมาเป็นเมาส์ลูกศรปกติเพื่อเลือก ลาก ย้าย หรือย่อขยายคลิป',
    options: ['V', 'A', 'S', 'D']
  },
  {
    id: 3,
    expectedKey: 'M',
    expectedKeyDisplay: 'M',
    commandName: 'Add Marker (เพิ่มจุดมาร์กเกอร์)',
    category: 'Marker',
    description: 'ปักหมุดมาร์กเกอร์สีเขียวบนไทม์ไลน์เพื่อระบุจังหวะบีตหรือโน้ตฉากสำคัญ',
    options: ['M', 'N', 'K', 'L']
  },
  {
    id: 4,
    expectedKey: 'Q',
    expectedKeyDisplay: 'Q',
    commandName: 'Ripple Trim Previous (ตัดหัวคลิป)',
    category: 'Fast Trim',
    description: 'ตัดส่วนหัวของคลิปตั้งแต่ต้นคลิปจนถึงหัวอ่าน Playhead แล้วเลื่อนคลิปมาชิดทันที',
    options: ['Q', 'W', 'E', 'R']
  },
  {
    id: 5,
    expectedKey: 'W',
    expectedKeyDisplay: 'W',
    commandName: 'Ripple Trim Next (ตัดท้ายคลิป)',
    category: 'Fast Trim',
    description: 'ตัดส่วนท้ายของคลิปตั้งแต่หัวอ่าน Playhead จนถึงจุดจบคลิป แล้วเลื่อนคลิปถัดไปมาชิด',
    options: ['W', 'Q', 'T', 'Y']
  },
  {
    id: 6,
    expectedKey: 'L',
    expectedKeyDisplay: 'L',
    commandName: 'Shuttle Forward (กรอไปข้างหน้า 1x/2x/4x)',
    category: 'Playback',
    description: 'กดเล่นเดินหน้า และกดซ้ำเพื่อเพิ่มความเร็วในการรีวิวฟุตเทจแบบ Fast-Forward',
    options: ['L', 'J', 'K', 'I']
  },
  {
    id: 7,
    expectedKey: 'J',
    expectedKeyDisplay: 'J',
    commandName: 'Shuttle Reverse (กรอย้อนกลับหลัง)',
    category: 'Playback',
    description: 'เล่นคลิปถอยหลังย้อนกลับ และกดซ้ำเพื่อเพิ่มความเร็วในการกรอย้อนหลัง',
    options: ['J', 'L', 'O', 'P']
  },
  {
    id: 8,
    expectedKey: 'K',
    expectedKeyDisplay: 'K (หรือ Ctrl+K)',
    commandName: 'Cut / Add Edit (ตัดคลิปตรงหัวอ่าน)',
    category: 'Timeline Cut',
    description: 'ตัดคลิปทุกแทร็กที่เปิดใช้งานตรงตำแหน่งหัวอ่านปัจจุบันทันที',
    options: ['K', 'C', 'X', 'Z']
  }
];

export const ShortcutLightningGame: React.FC<ShortcutLightningGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; key: string } | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const currentQ = SHORTCUT_QUESTIONS[currentRound];

  const handleAnswerKey = useCallback(
    (keyChar: string) => {
      if (feedback || !currentQ) return;

      setPressedKey(keyChar);
      const isCorrect = keyChar.toUpperCase() === currentQ.expectedKey.toUpperCase();

      if (isCorrect) {
        gameAudio.playCorrect();
        const streakBonus = streak * 5;
        const roundScore = 15 + streakBonus;
        const newScore = score + roundScore;
        const newStreak = streak + 1;

        setScore(newScore);
        setStreak(newStreak);
        onScoreUpdate(newScore);
        setFeedback({ isCorrect: true, key: keyChar });

        setTimeout(() => {
          setFeedback(null);
          setPressedKey(null);
          if (currentRound + 1 < SHORTCUT_QUESTIONS.length) {
            setCurrentRound(r => r + 1);
          } else {
            gameAudio.playVictory();
            onComplete(newScore);
          }
        }, 500);
      } else {
        gameAudio.playWrong();
        setStreak(0);
        setFeedback({ isCorrect: false, key: keyChar });

        setTimeout(() => {
          setFeedback(null);
          setPressedKey(null);
          if (currentRound + 1 < SHORTCUT_QUESTIONS.length) {
            setCurrentRound(r => r + 1);
          } else {
            onComplete(score);
          }
        }, 800);
      }
    },
    [currentRound, currentQ, feedback, score, streak, onScoreUpdate, onComplete]
  );

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore functional keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        handleAnswerKey(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswerKey]);

  if (!currentQ) return null;

  return (
    <div className="space-y-4 max-w-lg mx-auto text-center">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">คำถามที่:</span>
          <span className="text-white font-bold">
            {currentRound + 1} / {SHORTCUT_QUESTIONS.length}
          </span>
        </div>

        {streak > 1 && (
          <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak}x Combo Streak!</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[#38BDF8]">
          <Keyboard className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">กดปุ่มบนคีย์บอร์ดจริงได้เลย</span>
        </div>
      </div>

      {/* Target Question Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 via-purple-900/20 to-black/40 border border-purple-500/20 space-y-2">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[#C084FC] text-[10px] font-mono uppercase tracking-wider font-semibold">
          {currentQ.category}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {currentQ.commandName}
        </h3>
        <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
          {currentQ.description}
        </p>
      </div>

      {/* 3D Physical Keycap Display */}
      <div className="py-2">
        <div
          className={`inline-flex flex-col items-center justify-center w-24 h-24 rounded-3xl border-2 transition-all duration-150 shadow-2xl relative select-none ${
            feedback
              ? feedback.isCorrect
                ? 'bg-emerald-600 border-emerald-300 text-white scale-105 ring-4 ring-emerald-500/30'
                : 'bg-rose-600 border-rose-300 text-white animate-shake'
              : pressedKey
              ? 'translate-y-1 shadow-inner bg-purple-700 border-purple-400 text-white'
              : 'bg-gradient-to-b from-white/15 to-white/5 border-white/25 text-white hover:border-purple-400 shadow-purple-500/10'
          }`}
        >
          <span className="text-3xl font-black font-mono tracking-wider">
            {feedback ? feedback.key : '?'}
          </span>
          <span className="text-[9px] font-mono text-white/70 uppercase">
            {feedback ? (feedback.isCorrect ? 'ถูกต้อง!' : 'ยังไม่ถูก') : 'กดแป้นพิมพ์'}
          </span>
        </div>
      </div>

      {/* Choice Options Buttons (for click or touch) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-sm mx-auto">
        {currentQ.options.map(optKey => {
          const isSelected = pressedKey === optKey;

          return (
            <button
              key={optKey}
              onClick={() => handleAnswerKey(optKey)}
              disabled={!!feedback}
              className={`h-14 rounded-2xl border font-mono text-lg font-bold transition-all duration-150 flex flex-col items-center justify-center cursor-pointer active:translate-y-1 shadow-md ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:scale-105'
              }`}
            >
              <span>{optKey}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[#94A3B8]">
        คุณสามารถกดคีย์บอร์ดจริง <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white">A-Z</kbd> หรือคลิกปุ่มบนหน้าจอได้ทันที
      </p>
    </div>
  );
};
