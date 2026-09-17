import React, { useState } from 'react';
import { Palette, Sliders, CheckCircle2, Sparkles, Eye, RotateCcw } from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface ColorMatcherGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface ColorRound {
  id: number;
  name: string;
  category: string;
  description: string;
  targetTemp: number; // -50 to 50
  targetTint: number; // -50 to 50
  targetSat: number;  // 0 to 150
  targetHex: string;
  bgGradient: string;
}

const COLOR_ROUNDS: ColorRound[] = [
  {
    id: 1,
    name: 'Teal & Orange Cinematic',
    category: 'Hollywood Blockbuster',
    description: 'ดึงเงาในภาพไปทางโทนเขียวอมฟ้า (Teal) และดันไฮไลต์สกินโทนให้อมส้มอบอุ่น (Orange)',
    targetTemp: 35,
    targetTint: -20,
    targetSat: 120,
    targetHex: '#F59E0B',
    bgGradient: 'from-[#0E3A40] via-[#1E293B] to-[#F59E0B]/30'
  },
  {
    id: 2,
    name: 'Vintage 70s Warm Film',
    category: 'Retro Nostalgia',
    description: 'โทนฟิล์มยุคเก่า แสงแดดสีอำพันสีทอง นุ่มนวล ละมุนตา ไม่ฉูดฉาด',
    targetTemp: 45,
    targetTint: 15,
    targetSat: 85,
    targetHex: '#D97706',
    bgGradient: 'from-[#78350F] via-[#92400E] to-[#FBBF24]/30'
  },
  {
    id: 3,
    name: 'Cyberpunk Neon Night',
    category: 'Sci-Fi Synthwave',
    description: 'เงาสีน้ำเงินเข้มและสีม่วงเข้ม ไฮไลต์สีชมพูมาเจนต้าสดสว่างระดับนีออน',
    targetTemp: -40,
    targetTint: 45,
    targetSat: 140,
    targetHex: '#EC4899',
    bgGradient: 'from-[#1E1B4B] via-[#4C1D95] to-[#EC4899]/30'
  },
  {
    id: 4,
    name: 'Moody Nordic Thriller',
    category: 'Cold Detective Noir',
    description: 'บรรยากาศเย็นยะเยือก แสงอมฟ้าหม่น ลดความสดของสีเพื่อเน้นความตึงเครียด',
    targetTemp: -45,
    targetTint: -10,
    targetSat: 65,
    targetHex: '#38BDF8',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#38BDF8]/25'
  },
  {
    id: 5,
    name: 'Clean Commercial Pop',
    category: 'Product & Lifestyle',
    description: 'แสงขาวธรรมชาติ คมชัด สดใส บาลานซ์แม่นยำ ไม่เพี้ยนโทน',
    targetTemp: 0,
    targetTint: 0,
    targetSat: 105,
    targetHex: '#3B82F6',
    bgGradient: 'from-[#1E293B] via-[#2563EB]/20 to-[#60A5FA]/30'
  }
];

export const ColorMatcherGame: React.FC<ColorMatcherGameProps> = ({ onComplete, onScoreUpdate }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [score, setScore] = useState(0);

  // User slider inputs
  const [userTemp, setUserTemp] = useState(0);
  const [userTint, setUserTint] = useState(0);
  const [userSat, setUserSat] = useState(100);

  const [matchResult, setMatchResult] = useState<{
    accuracy: number;
    points: number;
    comment: string;
  } | null>(null);

  const currentRound = COLOR_ROUNDS[currentRoundIdx];

  const handleApplyGrade = () => {
    // Calculate difference
    const tempDiff = Math.abs(userTemp - currentRound.targetTemp);
    const tintDiff = Math.abs(userTint - currentRound.targetTint);
    const satDiff = Math.abs(userSat - currentRound.targetSat);

    const maxTempDiff = 100;
    const maxTintDiff = 100;
    const maxSatDiff = 150;

    const tempAcc = Math.max(0, 100 - (tempDiff / maxTempDiff) * 100);
    const tintAcc = Math.max(0, 100 - (tintDiff / maxTintDiff) * 100);
    const satAcc = Math.max(0, 100 - (satDiff / maxSatDiff) * 100);

    const overallAccuracy = Math.round((tempAcc * 0.45 + tintAcc * 0.35 + satAcc * 0.2));
    const roundPoints = Math.round((overallAccuracy / 100) * 20);

    let comment = 'สีใกล้เคียงเป้าหมายยอดเยี่ยม!';
    if (overallAccuracy >= 90) {
      comment = 'แม่นยำระดับ Master Colorist!';
      gameAudio.playCorrect();
    } else if (overallAccuracy >= 75) {
      comment = 'เกรดสีได้ดีมาก!';
      gameAudio.playCorrect();
    } else {
      comment = 'ยังคลาดเคลื่อนจากเฉดเป้าหมายเล็กน้อย';
      gameAudio.playClick();
    }

    setMatchResult({
      accuracy: overallAccuracy,
      points: roundPoints,
      comment
    });

    const newScore = score + roundPoints;
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  const handleNextRound = () => {
    setMatchResult(null);
    setUserTemp(0);
    setUserTint(0);
    setUserSat(100);

    if (currentRoundIdx + 1 < COLOR_ROUNDS.length) {
      setCurrentRoundIdx(r => r + 1);
    } else {
      gameAudio.playVictory();
      onComplete(score);
    }
  };

  // Compute live CSS filter based on user sliders
  const userFilterStyle = {
    filter: `hue-rotate(${userTint}deg) saturate(${userSat}%) contrast(${100 + Math.abs(userTemp) * 0.3}%)`,
    backgroundColor: userTemp > 0 
      ? `rgba(245, 158, 11, ${userTemp / 250})` 
      : `rgba(56, 189, 248, ${Math.abs(userTemp) / 250})`
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">รอบที่:</span>
          <span className="text-white font-bold">
            {currentRoundIdx + 1} / {COLOR_ROUNDS.length}
          </span>
        </div>
        <div className="text-[#A78BFA] font-semibold">{currentRound.name}</div>
      </div>

      {/* Visual Canvas Split Compare */}
      <div className="grid grid-cols-2 gap-3">
        {/* Target Look Box */}
        <div className="rounded-2xl border border-white/15 overflow-hidden flex flex-col bg-black/40">
          <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>ภาพเป้าหมาย (Target)</span>
            </span>
          </div>
          <div
            className={`h-28 sm:h-32 p-3 flex flex-col justify-end bg-gradient-to-tr ${currentRound.bgGradient} relative`}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 space-y-0.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-white">
                {currentRound.category}
              </span>
              <p className="text-[11px] font-bold text-white leading-tight">
                {currentRound.name}
              </p>
            </div>
          </div>
        </div>

        {/* User Interactive Grade Box */}
        <div className="rounded-2xl border border-white/15 overflow-hidden flex flex-col bg-black/40">
          <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#38BDF8]" />
              <span>ภาพที่คุณกำลังปรับ (Live)</span>
            </span>
          </div>
          <div
            className="h-28 sm:h-32 p-3 flex flex-col justify-end relative transition-all duration-150"
            style={userFilterStyle}
          >
            <div className="relative z-10 space-y-0.5 bg-black/40 p-2 rounded-xl backdrop-blur-xs">
              <span className="text-[9px] font-mono text-white/80">
                Temp: {userTemp > 0 ? `+${userTemp}` : userTemp} | Tint: {userTint} | Sat: {userSat}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lumetri Sliders Panel */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#A78BFA]">
          <Palette className="w-3.5 h-3.5" />
          <span>Lumetri Basic Correction Sliders:</span>
        </div>

        {/* 1. Temperature Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-cyan-400">← Cool (เย็น)</span>
            <span className="text-white font-bold">Temperature: {userTemp}</span>
            <span className="text-amber-400">Warm (อุ่น) →</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={userTemp}
            onChange={e => {
              setUserTemp(Number(e.target.value));
              setMatchResult(null);
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* 2. Tint Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-emerald-400">← Green (เขียว)</span>
            <span className="text-white font-bold">Tint: {userTint}</span>
            <span className="text-fuchsia-400">Magenta (ชมพู) →</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={userTint}
            onChange={e => {
              setUserTint(Number(e.target.value));
              setMatchResult(null);
            }}
            className="w-full accent-fuchsia-500 cursor-pointer"
          />
        </div>

        {/* 3. Saturation Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/40">B&W (0%)</span>
            <span className="text-white font-bold">Saturation: {userSat}%</span>
            <span className="text-rose-400">Vivid (150%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            value={userSat}
            onChange={e => {
              setUserSat(Number(e.target.value));
              setMatchResult(null);
            }}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Match Results or Action Button */}
      {matchResult ? (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 text-center space-y-2 animate-in fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">
              ความแม่นยำ: <span className="text-[#34D399] font-mono">{matchResult.accuracy}%</span> (+{matchResult.points} pts)
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">{matchResult.comment}</p>
          <button
            onClick={handleNextRound}
            className="px-6 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            {currentRoundIdx + 1 < COLOR_ROUNDS.length ? 'ไปรอบถัดไป →' : 'ดูผลคะแนนรวม'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleApplyGrade}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>ปรับเสร็จแล้ว — เทียบความแม่นยำสี</span>
          </button>
        </div>
      )}
    </div>
  );
};
