import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Check,
  Flame,
  Trophy,
  Lightbulb,
  Zap,
  Target,
  ShieldCheck,
  Palette,
  Volume2,
  Scissors,
  Film,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_BANK } from '../data/masterclassData';
import { QuizQuestion } from '../types';
import { gameAudio } from '../utils/gameAudio';
import { PremiereLogo } from './PremiereLogo';

interface QuizSectionProps {
  quizBest: number | null;
  onFinishQuiz: (score: number) => void;
}

interface PreparedQuestion {
  q: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: string;
  category: { label: string; color: string; icon: any };
}

// Category classifier based on question content
const getQuestionCategory = (q: string): { label: string; color: string; icon: any } => {
  const text = q.toLowerCase();
  if (text.includes('lumetri') || text.includes('color') || text.includes('สี') || text.includes('lut')) {
    return { label: 'LUMETRI COLOR & SCOPES', color: 'from-amber-400 to-orange-500', icon: Palette };
  }
  if (text.includes('sound') || text.includes('audio') || text.includes('เสียง') || text.includes('ไมค์')) {
    return { label: 'ESSENTIAL SOUND & MIXING', color: 'from-cyan-400 to-blue-500', icon: Volume2 };
  }
  if (text.includes('keyframe') || text.includes('graphics') || text.includes('lower third') || text.includes('ตัวอักษร') || text.includes('ultra key') || text.includes('warp stabilizer') || text.includes('dissolve')) {
    return { label: 'MOTION & VISUAL FX', color: 'from-purple-400 to-pink-500', icon: Sparkles };
  }
  if (text.includes('razor') || text.includes('ripple') || text.includes('roll') || text.includes('marker') || text.includes('track') || text.includes('nest') || text.includes('ตัดคลิป')) {
    return { label: 'TIMELINE & SHORTCUTS', color: 'from-indigo-400 to-purple-500', icon: Scissors };
  }
  if (text.includes('export') || text.includes('encoder') || text.includes('bitrate') || text.includes('fps') || text.includes('frame rate') || text.includes('proxy') || text.includes('prproj')) {
    return { label: 'CODEC & EXPORT WORKFLOW', color: 'from-blue-400 to-cyan-400', icon: Film };
  }
  return { label: 'PREMIERE PRO ESSENTIALS', color: 'from-purple-500 to-indigo-500', icon: Layers };
};

export const QuizSection: React.FC<QuizSectionProps> = ({ quizBest, onFinishQuiz }) => {
  const [quizState, setQuizState] = useState<'intro' | 'active' | 'result'>('intro');
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [reviewList, setReviewList] = useState<{ q: string; chosen: string; isCorrect: boolean; correctText: string; explanation?: string; category: string }[]>([]);

  const timerRef = useRef<any>(null);

  // Shuffle helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const startQuiz = () => {
    gameAudio.playSlide();
    const prepared: PreparedQuestion[] = shuffleArray(QUIZ_BANK).slice(0, 20).map(item => {
      const opts = item.o.map((text, idx) => ({
        text,
        isCorrect: idx === item.a
      }));
      return {
        q: item.q,
        options: shuffleArray(opts),
        explanation: item.explanation,
        category: getQuestionCategory(item.q)
      };
    });

    setQuestions(prepared);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setSecondsLeft(600);
    setReviewList([]);
    setQuizState('active');

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectOption = useCallback((index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = currentQ.options[index].isCorrect;
    const correctOption = currentQ.options.find(o => o.isCorrect)?.text || '';

    if (isCorrect) {
      gameAudio.playCorrect();
      setScore(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      gameAudio.playWrong();
      setStreak(0);
    }

    setReviewList(prev => [
      ...prev,
      {
        q: currentQ.q,
        chosen: currentQ.options[index].text,
        isCorrect,
        correctText: correctOption,
        explanation: currentQ.explanation,
        category: currentQ.category.label
      }
    ]);
  }, [hasAnswered, questions, currentIndex]);

  const handleNextQuestion = useCallback(() => {
    gameAudio.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      finishQuiz();
    }
  }, [currentIndex, questions.length]);

  const finishQuiz = useCallback(() => {
    clearInterval(timerRef.current);
    setQuizState('result');
    onFinishQuiz(score);

    if (score >= 16) {
      gameAudio.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      gameAudio.playVictory();
    }
  }, [score, onFinishQuiz]);

  // Keyboard shortcut listener (1-4, A-D, Enter/Space)
  useEffect(() => {
    if (quizState !== 'active') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input or modal, ignore
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (!hasAnswered) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleSelectOption(0);
        else if (e.key === '2' || e.key.toLowerCase() === 'b') handleSelectOption(1);
        else if (e.key === '3' || e.key.toLowerCase() === 'c') handleSelectOption(2);
        else if (e.key === '4' || e.key.toLowerCase() === 'd') handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizState, hasAnswered, handleSelectOption, handleNextQuestion]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section id="quiz" className="py-20 relative overflow-hidden">
      <div className="studio-container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="space-y-3 mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#141828] border border-[#2B344F] font-mono text-xs text-[#9999FF] uppercase tracking-wider font-semibold">
              <PremiereLogo className="w-4 h-4 rounded-xs shrink-0" />
              <span>KNOWLEDGE BENCHMARK &amp; CERTIFICATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              <span>แบบทดสอบ</span>
              <span className="text-[#9999FF]">วัดระดับความรู้</span>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-[#1B2134] text-slate-300 border border-white/10">
                20 ข้อ • 10 นาที
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              ประเมินความแม่นยำตั้งแต่คีย์ลัด เครื่องมือตัดต่อ ไปจนถึงขั้นตอน Color Grading และ Export เพื่อรับรองมาตรฐาน Premiere Pro Masterclass
            </p>
          </div>

          {/* Main Quiz Card Container */}
          <div className="relative rounded-2xl bg-[#0D101B] border border-[#22283C] shadow-[0_16px_50px_rgba(0,0,0,0.6)] overflow-hidden p-5 sm:p-8 lg:p-9">
            {/* Top Accent Line in Adobe Premiere Purple */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[#4848D0]" />

            {/* ========================================================= */}
            {/* 1. INTRO VIEW */}
            {/* ========================================================= */}
            {quizState === 'intro' && (
              <div className="space-y-7 relative z-10">
                {/* Official Premiere Pro Banner */}
                <div className="p-6 sm:p-7 rounded-xl bg-[#121626] border border-[#242C44] flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                  <div className="relative shrink-0">
                    <PremiereLogo className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl shadow-xl" withGlow />
                    <span className="absolute -bottom-2 -right-1.5 px-2 py-0.5 rounded bg-[#4040C0] text-white font-mono text-[10px] font-bold tracking-wider uppercase border border-[#7878FF]/30 shadow-xs">
                      BENCHMARK
                    </span>
                  </div>
                  
                  <div className="text-center sm:text-left space-y-2 flex-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#1A2033] border border-white/10 text-[11px] font-mono text-[#9999FF] uppercase tracking-wider font-bold">
                      <span>ADOBE PREMIERE PRO</span>
                      <span className="w-1 h-1 rounded-full bg-[#9999FF]"></span>
                      <span>PROFESSIONAL BENCHMARK</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Premiere Pro Professional Examination
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                      คลังข้อสอบมาตรฐานสุ่ม 20 ข้อจากทั้ง 6 เสาหลักการตัดต่อ (Cutting, Audio, Lumetri Color, Motion Graphics, VFX และ Media Encoder)
                    </p>
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-[#121626] border border-[#22293E] flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#9999FF]/10 text-[#9999FF] flex items-center justify-center shrink-0 border border-[#9999FF]/20">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider">จำนวนข้อสอบ</span>
                      <span className="font-extrabold text-base sm:text-lg text-white">20 ข้อ (สุ่มโจทย์)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121626] border border-[#22293E] flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider">เวลาจำลอง</span>
                      <span className="font-extrabold text-base sm:text-lg text-white">10:00 นาที (30s/ข้อ)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121626] border border-[#22293E] flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-mono text-[11px] text-slate-400 uppercase tracking-wider">เกณฑ์ผ่าน &amp; สถิติเดิม</span>
                      <span className="font-extrabold text-base sm:text-lg text-emerald-400">
                        {quizBest !== null ? `${quizBest}/20 ข้อ (${Math.round((quizBest / 20) * 100)}%)` : 'ผ่านเกณฑ์ 80% (16/20)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions & CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1F2538] pt-5">
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9999FF] shrink-0" />
                    <span>รองรับการกดคีย์ลัด <kbd className="px-1.5 py-0.5 rounded bg-[#1B2134] border border-white/10 font-mono text-white text-[11px]">1-4</kbd> หรือ <kbd className="px-1.5 py-0.5 rounded bg-[#1B2134] border border-white/10 font-mono text-white text-[11px]">A-D</kbd> บนคีย์บอร์ด</span>
                  </div>

                  <button
                    onClick={startQuiz}
                    id="start-quiz-btn"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#4040C0] hover:bg-[#4E4EC8] active:bg-[#3434A0] text-white font-bold text-sm tracking-wide border border-[#6868E8]/40 shadow-[0_4px_16px_rgba(64,64,192,0.35)] hover:shadow-[0_6px_22px_rgba(64,64,192,0.45)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>เริ่มทำแบบทดสอบ (Start Exam)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. ACTIVE QUESTION VIEW */}
            {/* ========================================================= */}
            {quizState === 'active' && questions.length > 0 && (
              <div className="space-y-6 relative z-10">
                {/* Header Information Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1F2538]">
                  {/* Left: Question Counter & Category Badge */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="px-3 py-1 rounded-md bg-[#4040C0]/20 text-[#9999FF] font-mono text-xs font-black tracking-wider border border-[#4040C0]/40 flex items-center gap-1.5">
                      <PremiereLogo className="w-3.5 h-3.5 rounded-xs inline-block" />
                      <span>ข้อ {currentIndex + 1} / {questions.length}</span>
                    </div>

                    {/* Dynamic Category Pill */}
                    {(() => {
                      const CategoryIcon = questions[currentIndex].category.icon;
                      return (
                        <div className="px-2.5 py-1 rounded-md bg-[#161B2B] border border-[#2A334B] text-slate-300 font-mono text-xs font-semibold flex items-center gap-1.5">
                          <CategoryIcon className="w-3.5 h-3.5 text-[#9999FF]" />
                          <span>{questions[currentIndex].category.label}</span>
                        </div>
                      );
                    })()}

                    {/* Streak Badge */}
                    {streak >= 2 && (
                      <div className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-xs font-black flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Streak x{streak}!</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Digital Timer & Live Score */}
                  <div className="flex items-center gap-2.5">
                    {/* Live Score */}
                    <div className="px-3 py-1 rounded-md bg-[#161B2B] border border-[#2A334B] text-slate-300 font-mono text-xs font-semibold flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>คะแนน: <strong className="text-white">{score}</strong></span>
                    </div>

                    {/* Timer Pill */}
                    <div className={`font-mono text-xs sm:text-sm font-black flex items-center gap-1.5 px-3 py-1 rounded-md border transition-colors ${
                      secondsLeft <= 60 
                        ? 'bg-red-500/15 text-red-300 border-red-500/40 animate-pulse' 
                        : 'bg-[#161B2B] text-sky-300 border-[#2A334B]'
                    }`}>
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>{formatTimer(secondsLeft)}</span>
                    </div>
                  </div>
                </div>

                {/* Sleek Adobe Progress Bar */}
                <div className="space-y-1.5">
                  <div className="h-2 bg-[#171C2D] rounded-full overflow-hidden p-0.5 relative border border-white/5">
                    <div 
                      className="h-full bg-[#4848D0] rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                    <span>ความคืบหน้า {Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                    <span>เหลืออีก {questions.length - (currentIndex + 1)} ข้อ</span>
                  </div>
                </div>

                {/* Question Box */}
                <div className="p-5 sm:p-6 rounded-xl bg-[#121626] border border-[#242C44] relative overflow-hidden">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4040C0]/20 text-[#9999FF] flex items-center justify-center shrink-0 border border-[#4040C0]/30 mt-0.5">
                      <HelpCircle className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white leading-snug tracking-tight">
                      {questions[currentIndex].q}
                    </h3>
                  </div>
                </div>

                {/* Option Cards (A, B, C, D) */}
                <div className="space-y-3">
                  {questions[currentIndex].options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    
                    // State determination
                    let cardClasses = "bg-[#121626] border-[#22293E] hover:border-[#4848D0] hover:bg-[#181D31] text-slate-200 hover:text-white";
                    let badgeClasses = "bg-[#1A2033] text-[#9999FF] border-[#2E3752]";
                    let isSelected = selectedOption === idx;

                    if (hasAnswered) {
                      if (opt.isCorrect) {
                        cardClasses = "bg-emerald-950/40 border-emerald-500 text-emerald-100 font-semibold";
                        badgeClasses = "bg-emerald-500 text-black font-black border-emerald-400";
                      } else if (isSelected) {
                        cardClasses = "bg-rose-950/40 border-rose-500 text-rose-100 font-semibold";
                        badgeClasses = "bg-rose-500 text-white font-black border-rose-400";
                      } else {
                        cardClasses = "opacity-40 bg-[#121626]/50 border-white/5 text-slate-400";
                        badgeClasses = "bg-white/5 text-slate-500 border-white/5";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={hasAnswered}
                        id={`quiz-option-${idx}`}
                        className={`w-full p-4 sm:p-4.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer group select-none relative overflow-hidden ${cardClasses}`}
                      >
                        <div className="flex items-center gap-3.5 flex-1">
                          {/* Letter Badge */}
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-mono text-sm font-black shrink-0 border transition-colors ${badgeClasses}`}>
                            {hasAnswered && opt.isCorrect ? (
                              <Check className="w-5 h-5 stroke-[3]" />
                            ) : hasAnswered && isSelected && !opt.isCorrect ? (
                              <span className="text-base font-black leading-none">✕</span>
                            ) : (
                              letter
                            )}
                          </div>

                          {/* Option Text */}
                          <span className="text-sm sm:text-base leading-relaxed">
                            {opt.text}
                          </span>
                        </div>

                        {/* Status Feedback Badge */}
                        {hasAnswered && (
                          <div className="shrink-0 flex items-center gap-2">
                            {opt.isCorrect && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="hidden sm:inline">คำตอบที่ถูกต้อง</span>
                              </span>
                            )}
                            {isSelected && !opt.isCorrect && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/40">
                                <XCircle className="w-4 h-4 text-rose-400" />
                                <span className="hidden sm:inline">คำตอบของคุณ</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Keyboard Hint on Hover (Desktop) */}
                        {!hasAnswered && (
                          <span className="hidden sm:block text-[11px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            กด {letter}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {hasAnswered && questions[currentIndex].explanation && (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#141829] border border-[#2B3550] text-xs sm:text-sm text-slate-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30 mt-0.5">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-xs font-bold text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
                          <span>PRO EDITOR INSIGHT • คำอธิบายเชิงลึก</span>
                        </div>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                          {questions[currentIndex].explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer */}
                {hasAnswered && (
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1F2538]">
                    <div className="text-xs font-mono">
                      {questions[currentIndex].options[selectedOption ?? 0]?.isCorrect ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ยอดเยี่ยม! ตอบถูกต้อง (+10 XP)</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          <span>ตอบยังไม่ถูก — ศึกษาคำอธิบายด้านบนเพื่อจดจำเทคนิค</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleNextQuestion}
                        id="quiz-next-question-btn"
                        className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#4040C0] hover:bg-[#4E4EC8] active:bg-[#3434A0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#6868E8]/40 shadow-md transition-all cursor-pointer"
                      >
                        <span>{currentIndex + 1 === questions.length ? 'ดูผลการทดสอบ (Finish)' : 'ข้อถัดไป (Next Question)'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. RESULT SUMMARY & CERTIFICATE VIEW */}
            {/* ========================================================= */}
            {quizState === 'result' && (
              <div className="space-y-8 relative z-10">
                {/* Score & Certificate Header */}
                <div className="text-center space-y-4 py-4">
                  <div className="relative inline-block">
                    <PremiereLogo className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-xl mx-auto" withGlow />
                  </div>

                  <div className="space-y-1">
                    <div className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
                      คะแนนสอบ Premiere Pro Benchmark
                    </div>
                    <div className="font-extrabold text-5xl sm:text-6xl text-white tracking-tight">
                      <span>{score}</span>
                      <span className="text-2xl sm:text-3xl text-slate-500 font-normal ml-2">/ 20</span>
                    </div>
                    
                    {/* Rank Badge */}
                    <div className="pt-2">
                      {score >= 18 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm">
                          <span>🏆 MASTER EDITOR (เกียรตินิยมอันดับ 1 - 90%+)</span>
                        </div>
                      ) : score >= 16 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold text-xs sm:text-sm">
                          <span>🌟 CERTIFIED PRO EDITOR (ผ่านเกณฑ์มาตรฐาน 80%+)</span>
                        </div>
                      ) : score >= 12 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold text-xs sm:text-sm">
                          <span>👍 INTERMEDIATE EDITOR (ผ่านเกณฑ์พื้นฐาน 60%+)</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4040C0]/20 text-[#9999FF] border border-[#4040C0]/30 font-bold text-xs sm:text-sm">
                          <span>💪 APPRENTICE (ทบทวนบทเรียนและทำแบบทดสอบใหม่ได้เสมอ)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 Score Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3.5 rounded-xl bg-[#121626] border border-[#22293E]">
                    <span className="block font-mono text-[11px] text-slate-400">ความถูกต้อง</span>
                    <span className="font-mono font-black text-xl text-white">{Math.round((score / 20) * 100)}%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#121626] border border-[#22293E]">
                    <span className="block font-mono text-[11px] text-slate-400">ข้อที่ถูก</span>
                    <span className="font-mono font-black text-xl text-emerald-400">{score} ข้อ</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#121626] border border-[#22293E]">
                    <span className="block font-mono text-[11px] text-slate-400">ข้อที่ผิด</span>
                    <span className="font-mono font-black text-xl text-rose-400">{20 - score} ข้อ</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#121626] border border-[#22293E]">
                    <span className="block font-mono text-[11px] text-slate-400">Streak สูงสุด</span>
                    <span className="font-mono font-black text-xl text-amber-400">{maxStreak}x 🔥</span>
                  </div>
                </div>

                {/* Review Accordion List */}
                <div className="space-y-2.5">
                  <h4 className="font-mono text-xs text-[#9999FF] uppercase font-bold flex items-center justify-between">
                    <span>สรุปผลการตอบคำถามทั้ง 20 ข้อ:</span>
                    <span className="text-[11px] text-slate-400 font-normal">คลิกเพื่อทบทวนโจทย์และเฉลย</span>
                  </h4>
                  
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {reviewList.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                          item.isCorrect 
                            ? 'bg-emerald-950/20 border-emerald-500/30' 
                            : 'bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="font-mono font-bold text-slate-400 shrink-0">#{idx + 1}</span>
                            <span className="text-white font-medium">{item.q}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                            item.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {item.isCorrect ? '✓ ถูกต้อง' : '✕ ผิด'}
                          </span>
                        </div>

                        {!item.isCorrect && (
                          <div className="pl-6 pt-1 space-y-1 text-[11px]">
                            <div className="text-slate-400">
                              คำตอบที่คุณเลือก: <span className="text-rose-300 line-through">{item.chosen}</span>
                            </div>
                            <div className="text-slate-300 font-medium">
                              คำตอบที่ถูกต้อง: <span className="text-emerald-300 font-bold">{item.correctText}</span>
                            </div>
                          </div>
                        )}

                        {item.explanation && (
                          <div className="pl-6 pt-1 text-[11px] text-slate-300 leading-relaxed italic">
                            💡 {item.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retake Button */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4 border-t border-[#1F2538]">
                  <button
                    onClick={startQuiz}
                    id="retake-quiz-btn"
                    className="px-8 py-3.5 rounded-xl bg-[#1E2336] hover:bg-[#272E46] text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/10 hover:border-[#9999FF]/40 shadow-md transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ทำแบบทดสอบใหม่อีกครั้ง (Retake Exam)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

