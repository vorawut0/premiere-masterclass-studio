import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { QUIZ_BANK } from '../../data/masterclassData';
import { gameAudio } from '../../utils/gameAudio';

interface SpeedRushGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

export const SpeedRushGame: React.FC<SpeedRushGameProps> = ({ onComplete, onScoreUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState(QUIZ_BANK);
  const [answeredFeedback, setAnsweredFeedback] = useState<{
    selectedIdx: number;
    isCorrect: boolean;
  } | null>(null);

  // Initialize shuffled questions
  useEffect(() => {
    setQuestions([...QUIZ_BANK].sort(() => Math.random() - 0.5));
  }, []);

  // 1-second countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          gameAudio.playVictory();
          onComplete(score);
          return 0;
        }
        if (prev <= 5) {
          gameAudio.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, onComplete]);

  const currentQ = questions[qIndex % questions.length];

  const handleAnswer = (chosenIdx: number) => {
    if (answeredFeedback || timeLeft <= 0) return;

    const isCorrect = chosenIdx === currentQ.a;

    if (isCorrect) {
      gameAudio.playCorrect();
      const bonusPts = 15 + streak * 5;
      const newScore = score + bonusPts;
      const newStreak = streak + 1;

      setScore(newScore);
      setStreak(newStreak);
      onScoreUpdate(newScore);

      // Award +2 seconds bonus time
      setTimeLeft(t => Math.min(30, t + 2));

      setAnsweredFeedback({ selectedIdx: chosenIdx, isCorrect: true });
    } else {
      gameAudio.playWrong();
      setStreak(0);
      // Deduct 1 second penalty
      setTimeLeft(t => Math.max(0, t - 1));
      setAnsweredFeedback({ selectedIdx: chosenIdx, isCorrect: false });
    }

    setTimeout(() => {
      setAnsweredFeedback(null);
      setQIndex(q => q + 1);
    }, 400);
  };

  if (!currentQ) return null;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Timer & Score Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-spin' : 'text-amber-400'}`} />
          <span className="text-[#94A3B8]">เวลา:</span>
          <span
            className={`font-black text-sm ${
              timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'
            }`}
          >
            {timeLeft}s
          </span>
          {answeredFeedback?.isCorrect && (
            <span className="text-emerald-400 font-bold text-[10px] animate-bounce">+2s!</span>
          )}
        </div>

        {streak > 1 && (
          <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{streak}x Combo!</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-[#34D399] font-bold">
          <Zap className="w-3.5 h-3.5 fill-[#34D399]" />
          <span>{score} pts</span>
        </div>
      </div>

      {/* Visual Time Progress Bar */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            timeLeft > 10
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : timeLeft > 5
              ? 'bg-gradient-to-r from-amber-500 to-orange-400'
              : 'bg-gradient-to-r from-rose-500 to-red-600'
          }`}
          style={{ width: `${Math.min(100, (timeLeft / 20) * 100)}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 via-purple-900/20 to-black/40 border border-white/10 space-y-2 text-center">
        <div className="text-[10px] font-mono text-[#A78BFA] uppercase tracking-wider">
          ข้อที่ {qIndex + 1} — ความเร็วและการตัดสินใจ
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          {currentQ.q}
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentQ.o.map((opt, idx) => {
          const isSelected = answeredFeedback?.selectedIdx === idx;
          const showCorrect = answeredFeedback && idx === currentQ.a;

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={!!answeredFeedback}
              className={`p-3 rounded-xl border text-left text-xs transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer shadow-md ${
                showCorrect
                  ? 'bg-emerald-600 border-emerald-300 text-white scale-[1.02]'
                  : isSelected && !answeredFeedback.isCorrect
                  ? 'bg-rose-600 border-rose-300 text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90 hover:scale-[1.01]'
              }`}
            >
              <span className="font-medium leading-relaxed">{opt}</span>
              {showCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />}
            </button>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-[#94A3B8]">
        ตอบถูกรับ +15 pts และเวลาเพิ่ม +2 วินาที! ตอบผิดหัก 1 วินาที
      </p>
    </div>
  );
};
