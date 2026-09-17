import React from 'react';
import { 
  Clapperboard, 
  Star, 
  Gamepad2, 
  Clock, 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Medal,
  Zap,
  Flame,
  Briefcase,
  ArrowRight,
  ChevronRight,
  FolderDown,
  FileCheck,
  Trophy,
  Target,
  CheckCircle,
  Play,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { ACHIEVEMENTS_DATA, LESSONS_DATA } from '../data/masterclassData';
import { UserState, WorkshopSubmission } from '../types';
import { DailyStreakWidget } from './DailyStreakWidget';
import { PremiereLogo } from './PremiereLogo';

interface DashboardSectionProps {
  userState: UserState;
  onOpenCertificate?: () => void;
  onClaimDailyStreak?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  onOpenNextLesson?: () => void;
  onOpenWorkshopFeedback?: (submission: WorkshopSubmission) => void;
  onOpenVerification?: () => void;
}

const BADGE_ICONS: Record<string, any> = {
  BookOpen,
  Layers,
  GraduationCap,
  Medal,
  Gamepad2,
  Zap,
  Flame,
  Sparkles
};

export const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  userState, 
  onOpenCertificate,
  onClaimDailyStreak,
  onNavigateToSection,
  onOpenNextLesson,
  onOpenWorkshopFeedback,
  onOpenVerification
}) => {
  const completedCount = userState.completedLessons.length;
  const totalLessons = LESSONS_DATA.length;
  const percent = Math.round((completedCount / totalLessons) * 100);
  
  // Workshop submissions calculations
  const submissions: WorkshopSubmission[] = Object.values(userState.workshopSubmissions || {});
  const workshopCount = submissions.length;
  const avgWorkshopScore = workshopCount > 0 
    ? Math.round(submissions.reduce((acc: number, cur: WorkshopSubmission) => acc + (cur.score || 0), 0) / workshopCount)
    : null;
  const latestSubmission = submissions.length > 0 ? submissions[submissions.length - 1] : null;

  // Next recommended lesson to study
  const nextLesson = LESSONS_DATA.find(l => !userState.completedLessons.includes(l.id)) || LESSONS_DATA[0];

  // Quiz Score & Streak
  const latestQuizScore = userState.quizHistory.length > 0
    ? userState.quizHistory[userState.quizHistory.length - 1]
    : null;
  const bestQuizScore = userState.quizBest;
  const currentStreak = userState.dailyStreak ?? 1;

  // Skill Level & Gamified XP Rank
  const points = userState.points || 0;
  const ranks = [
    { level: 1, title: 'Novice Cutter (มือใหม่ตัดต่อ)', min: 0, max: 150, color: 'text-zinc-300', bg: 'bg-zinc-500/20', border: 'border-zinc-500/30' },
    { level: 2, title: 'Assistant Editor (ผู้ช่วยลำดับภาพ)', min: 150, max: 350, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    { level: 3, title: 'Commercial Editor (นักตัดต่องานโฆษณา)', min: 350, max: 650, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
    { level: 4, title: 'Pro Colorist & Sound (ผู้เชี่ยวชาญเกรดสี/เสียง)', min: 650, max: 1000, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
    { level: 5, title: 'Master Post Producer (ระดับมืออาชีพสูงสุด)', min: 1000, max: 2000, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  ];
  const currentRank = ranks.find(r => points >= r.min && points < r.max) || ranks[ranks.length - 1];
  const nextRank = ranks.find(r => r.level === currentRank.level + 1) || null;
  const rankProgress = nextRank 
    ? Math.min(100, Math.max(0, Math.round(((points - currentRank.min) / (nextRank.min - currentRank.min)) * 100)))
    : 100;

  // Certificate Criteria Check
  const hasLessonsOrQuiz = percent >= 100 || (bestQuizScore !== null && bestQuizScore >= 14);
  const hasWorkshop = workshopCount >= 1;
  const hasDailyStreak = currentStreak >= 1;
  const isEligibleForCert = hasLessonsOrQuiz;
  const isGoldMasterReady = hasLessonsOrQuiz && hasWorkshop;

  // SVG Circular progress math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const handleNav = (sectionId: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="dashboard" className="py-20 relative overflow-hidden">
      {/* Subtle Studio Atmospheric Glow in Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.14),transparent)] pointer-events-none -z-10" />

      <div className="studio-container">
        {/* Header Area */}
        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 uppercase tracking-wider font-semibold">
            <PremiereLogo className="w-4 h-4 rounded-xs shrink-0" withGlow />
            <span>STUDIO DASHBOARD & LEARNING PROGRESS</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  <span>แดชบอร์ด</span>
                  <span className="text-gradient">ความคืบหน้า</span>
                </h2>
                <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full ${currentRank.bg} ${currentRank.color} border ${currentRank.border} shadow-xs backdrop-blur-md`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>LEVEL {currentRank.level}</span>
                </div>
              </div>
              <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
                ติดตามผลการเรียนรู้ สถิติข้อสอบ เวิร์กช็อปส่งตรวจ และความพร้อมรับใบประกาศนียบัตร
              </p>
            </div>

            {onOpenCertificate && (
              <button
                onClick={onOpenCertificate}
                id="dashboard-open-certificate-btn"
                className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2.5 text-xs sm:text-sm cursor-pointer shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isEligibleForCert
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-bold hover:brightness-110 shadow-amber-500/25 ring-2 ring-amber-400/40 animate-pulse'
                    : 'bg-[#181D30] hover:bg-[#202740] text-[#EDEDF4] hover:text-white border border-indigo-500/30 hover:border-indigo-400/50 shadow-indigo-500/10'
                }`}
              >
                <Award className={`w-4 h-4 ${isEligibleForCert ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{isEligibleForCert ? '🎓 ดูใบประกาศนียบัตรของคุณ' : 'ดูตัวอย่างใบประกาศนียบัตร'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Level & XP Gamification Banner - VIP Studio Passport */}
        <div className="mb-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#121528]/95 via-[#0F1322]/95 to-[#16172D]/95 border border-purple-500/25 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl group">
          {/* Ambient Corner Lighting */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Subtle Shimmer Line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            {/* Rank Emblem & Titles */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-[2px] shadow-[0_0_24px_rgba(99,102,241,0.35)]">
                  <div className="w-full h-full rounded-[14px] bg-[#0A0D18] flex flex-col items-center justify-center">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-purple-300 font-extrabold leading-none">LVL</span>
                    <span className="text-xl font-display font-black text-white leading-none mt-0.5">{currentRank.level}</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-3 h-3 fill-current" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-purple-300 uppercase tracking-wide font-semibold">
                    ลำดับขั้นทักษะ (Skill Rank)
                  </span>
                  <span className="w-1 h-1 rounded-full bg-purple-400/60"></span>
                  <span className="text-[11px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {points} XP รวม
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <span className={currentRank.color}>{currentRank.title}</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5 hidden sm:block">
                  สะสม XP ได้จากการเรียนจบบท (+10), ทำควิซผ่าน (+25) และส่งเวิร์กช็อป (+50)
                </p>
              </div>
            </div>

            {/* XP Progress Bar with Target Milestone */}
            <div className="w-full md:w-84 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{nextRank ? `ขั้นถัดไป: ${nextRank.title.split(' ')[0]}` : 'ทักษะระดับสูงสุด (Master)'}</span>
                </span>
                <span className="text-purple-300 font-bold">
                  {nextRank ? `${points} / ${nextRank.min} XP (${rankProgress}%)` : `${points} XP (MAX)`}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                  style={{ width: `${rankProgress}%` }}
                />
              </div>
              {nextRank && (
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>ปัจจุบัน LV.{currentRank.level}</span>
                  <span className="text-indigo-300/90 font-medium">อีก {Math.max(0, nextRank.min - points)} XP เพื่อเลื่อนขั้น</span>
                  <span>เป้าหมาย LV.{nextRank.level}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6 Summary Metric Cards - Curated Studio Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-7">
          {/* 1. Course Progress */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#13172E]/90 to-[#0C0F1C]/90 border border-indigo-500/25 hover:border-indigo-400/50 shadow-md hover:shadow-indigo-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                <Clapperboard className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                COURSE
              </span>
            </div>
            <span className="block font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {percent}%
            </span>
            <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">ความคืบหน้าคอร์ส</span>
            <div className="mt-3 pt-2.5 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-1">
                <span>เรียนแล้ว</span>
                <span className="text-indigo-300 font-bold">{completedCount}/{totalLessons} บท</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>

          {/* 2. Daily Streak */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#241A14]/85 to-[#0C0F1C]/90 border border-amber-500/30 hover:border-amber-400/60 shadow-md hover:shadow-amber-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/35 flex items-center justify-center shadow-[0_0_14px_rgba(245,158,11,0.25)]">
                <Flame className="w-4 h-4 fill-amber-400/30 text-amber-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                STREAK
              </span>
            </div>
            <span className="block font-display font-bold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 tracking-tight">
              {currentStreak} <span className="text-lg font-normal text-amber-200/90 font-mono">วัน</span>
            </span>
            <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">Daily Streak</span>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
              </span>
              <span className="text-amber-300/80">สูงสุด {userState.maxStreak || currentStreak} วัน</span>
            </div>
          </div>

          {/* 3. Workshops & Portfolio */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1F142D]/85 to-[#0C0F1C]/90 border border-purple-500/25 hover:border-purple-400/50 shadow-md hover:shadow-purple-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                WORKSHOP
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                {workshopCount}
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">/ 10</span>
            </div>
            <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">เวิร์กช็อปส่งแล้ว</span>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>เกรดเฉลี่ย</span>
              <span className="text-purple-300 font-bold">{avgWorkshopScore !== null ? `${avgWorkshopScore} คะแนน` : 'รอส่งตรวจ'}</span>
            </div>
          </div>

          {/* 4. Quiz Best */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#211D13]/85 to-[#0C0F1C]/90 border border-yellow-500/25 hover:border-yellow-400/50 shadow-md hover:shadow-yellow-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(234,179,8,0.2)]">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
                EXAM
              </span>
            </div>
            <span className="block font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {bestQuizScore !== null ? `${bestQuizScore}/20` : (latestQuizScore !== null ? `${latestQuizScore}/20` : '-')}
            </span>
            <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">คะแนนสอบสูงสุด</span>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>เกณฑ์เซอร์</span>
              <span className={bestQuizScore !== null && bestQuizScore >= 14 ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                {bestQuizScore !== null && bestQuizScore >= 14 ? '✓ ผ่านเกณฑ์' : '≥ 14 คะแนน'}
              </span>
            </div>
          </div>

          {/* 5. Games Played */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F212C]/85 to-[#0C0F1C]/90 border border-cyan-500/25 hover:border-cyan-400/50 shadow-md hover:shadow-cyan-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                MINIGAMES
              </span>
            </div>
            <span className="block font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {userState.gamesPlayed} <span className="text-base font-normal text-[#94A3B8] font-mono">รอบ</span>
            </span>
            <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">มินิเกมฝึกสกิล</span>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>ฝึกปุ่มลัด</span>
              <span className="text-cyan-300 font-bold">8 โหมดเกม</span>
            </div>
          </div>

          {/* 6. Study Minutes */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F2520]/85 to-[#0C0F1C]/90 border border-emerald-500/25 hover:border-emerald-400/50 shadow-md hover:shadow-emerald-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                TIME
              </span>
            </div>
            <span className="block font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {userState.studyMinutes >= 60 
                ? `${Math.floor(userState.studyMinutes / 60)}h ${userState.studyMinutes % 60}m` 
                : `${userState.studyMinutes}m`}
            </span>
            <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">เวลาเรียนสะสม</span>
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>บันทึกชั่วโมง</span>
              <span className="text-emerald-400 font-bold">{userState.studyMinutes} นาที</span>
            </div>
          </div>
        </div>

        {/* Quick Learning Action Launchers - Studio Action Pods */}
        <div className="mb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Continue Next Lesson */}
          <div 
            onClick={() => {
              if (onOpenNextLesson) {
                onOpenNextLesson();
              } else {
                handleNav('lessons');
              }
            }}
            className="p-4 rounded-2xl bg-[#111422]/90 hover:bg-[#15192C] border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            <div className="space-y-1 overflow-hidden min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono font-semibold">
                <Play className="w-3.5 h-3.5 fill-indigo-400" />
                <span>เรียนต่อบทล่าสุด</span>
              </div>
              <p className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition-colors">
                {percent >= 100 ? 'ทบทวนเนื้อหาบทเรียน' : `บทที่ ${nextLesson.id}: ${nextLesson.title}`}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500 text-indigo-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-200">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Action 2: Take Quiz */}
          <div 
            onClick={() => handleNav('quiz')}
            className="p-4 rounded-2xl bg-[#111422]/90 hover:bg-[#15192C] border border-amber-500/30 hover:border-amber-400/60 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 shadow-md hover:shadow-amber-500/10 hover:-translate-y-0.5"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>ทดสอบวัดระดับ</span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                {bestQuizScore !== null ? `สอบอีกครั้ง (สถิติ ${bestQuizScore}/20)` : 'ทำข้อสอบ 20 ข้อเพื่อรับใบเซอร์'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 group-hover:bg-amber-500 text-amber-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-200">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Action 3: Workshop Hub */}
          <div 
            onClick={() => handleNav('workshop')}
            className="p-4 rounded-2xl bg-[#111422]/90 hover:bg-[#15192C] border border-purple-500/30 hover:border-purple-400/60 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 shadow-md hover:shadow-purple-500/10 hover:-translate-y-0.5"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>ส่งงานเวิร์กช็อป</span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-purple-200 transition-colors truncate">
                {workshopCount > 0 ? `ส่งแล้ว ${workshopCount}/10 ชิ้น (ดูเกรด)` : 'เลือก 1 ใน 10 โปรเจกต์ส่งตรวจ'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 group-hover:bg-purple-500 text-purple-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-200">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Action 4: Practice Assets */}
          <div 
            onClick={() => handleNav('workshop')}
            className="p-4 rounded-2xl bg-[#111422]/90 hover:bg-[#15192C] border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 shadow-md hover:shadow-cyan-500/10 hover:-translate-y-0.5"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-semibold">
                <FolderDown className="w-3.5 h-3.5" />
                <span>คลังไฟล์ฝึกซ้อม & ฟุตเทจ</span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                ดาวน์โหลด LUTs, SFX และ XML ฟรี
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-200">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Dedicated Daily Streak Tracker & Visual Indicator */}
        <DailyStreakWidget 
          userState={userState} 
          onClaimDailyStreak={onClaimDailyStreak} 
        />

        {/* Deep Dive Progress & Analytical Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column (5 Cols): Donut Chart & Certificate Readiness Checklist */}
          <div className="lg:col-span-5 space-y-6">
            {/* Donut Chart Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 flex flex-col items-center justify-center text-center shadow-lg">
              <h3 className="font-bold text-base text-white mb-6">อัตราความสำเร็จในหลักสูตร</h3>

              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="dashboardCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="text-[#151928] stroke-current"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="url(#dashboardCircleGrad)"
                    className="transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-3xl text-white">{percent}%</span>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    {completedCount} / {totalLessons} บท
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] mt-6 max-w-xs leading-relaxed">
                {percent === 100 
                  ? '🎉 ยินดีด้วย! คุณเรียนจบหลักสูตรครบทุกบทแล้ว' 
                  : `เหลืออีก ${totalLessons - completedCount} บทเรียน เพื่อสำเร็จหลักสูตรและรับใบประกาศนียบัตร`}
              </p>
            </div>

            {/* Certificate Readiness Checklist */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>เกณฑ์การรับใบประกาศนียบัตร</span>
                </h3>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  isGoldMasterReady 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : isEligibleForCert 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-white/5 text-[#94A3B8] border-white/10'
                }`}>
                  {isGoldMasterReady ? 'GOLD MASTER' : (isEligibleForCert ? 'READY' : 'IN PROGRESS')}
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Condition 1: Lessons or Quiz */}
                <div className="p-3 rounded-xl bg-[#121522] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {hasLessonsOrQuiz ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                    )}
                    <span className={hasLessonsOrQuiz ? 'text-white' : 'text-[#94A3B8]'}>
                      เรียนครบ 15 บท หรือสอบ Quiz $\ge$ 14/20
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {percent >= 100 ? '100%' : (bestQuizScore !== null ? `${bestQuizScore}/20` : `${percent}%`)}
                  </span>
                </div>

                {/* Condition 2: Workshop Submissions */}
                <div className="p-3 rounded-xl bg-[#121522] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {hasWorkshop ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                    )}
                    <span className={hasWorkshop ? 'text-white' : 'text-[#94A3B8]'}>
                      ส่งงานเวิร์กช็อปอย่างน้อย 1 ชิ้น
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {workshopCount}/1 ชิ้น
                  </span>
                </div>

                {/* Condition 3: Daily Activity */}
                <div className="p-3 rounded-xl bg-[#121522] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {hasDailyStreak ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                    )}
                    <span className={hasDailyStreak ? 'text-white' : 'text-[#94A3B8]'}>
                      เช็คอิน Daily Streak ต่อเนื่อง
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {currentStreak} วัน
                  </span>
                </div>
              </div>

              {onOpenCertificate && (
                <div className="space-y-2 mt-2">
                  <button
                    onClick={onOpenCertificate}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                      isEligibleForCert
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>{isEligibleForCert ? 'เปิดรับใบประกาศนียบัตร (Certificate)' : 'ดูตัวอย่างใบประกาศนียบัตร'}</span>
                  </button>

                  {onOpenVerification && (
                    <button
                      onClick={onOpenVerification}
                      className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#94A3B8] hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                    >
                      <CheckCircle className="w-3 h-3 text-amber-400" />
                      <span>ตรวจสอบรหัสใบประกาศฯ ออนไลน์</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Workshop Submissions, Recent Lessons & Achievements */}
          <div className="lg:col-span-7 space-y-6">
            {/* Workshop Submission Portfolio Box */}
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/25 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>ผลงานเวิร์กช็อปที่ส่งตรวจ (Workshop Portfolio)</span>
                </h3>
                <button
                  onClick={() => handleNav('workshop')}
                  className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>ส่งงานเพิ่ม</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {submissions.length > 0 ? (
                <div className="space-y-3">
                  {submissions.slice(0, 3).map((sub, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#121522] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            Project #{sub.projectId}: {sub.projectTitle}
                          </span>
                          <span className="px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                            เกรด {sub.grade}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] line-clamp-1">
                          {sub.feedback || 'ผ่านเกณฑ์การประเมินมาตรฐาน'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-display font-bold text-sm text-emerald-400">
                            {sub.score} / 100
                          </div>
                          <div className="text-[10px] font-mono text-[#64748B]">
                            {sub.submittedAt.split(' ')[0]}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (onOpenWorkshopFeedback) {
                              onOpenWorkshopFeedback(sub);
                            } else {
                              handleNav('profile');
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-purple-300 hover:text-white transition-colors cursor-pointer"
                        >
                          ดูฟีดแบ็ก
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#121522] border border-dashed border-white/10 text-center space-y-2">
                  <p className="text-xs text-[#94A3B8]">คุณยังไม่ได้ส่งผลงานเวิร์กช็อป</p>
                  <p className="text-[11px] text-[#64748B]">
                    ส่งงาน 1 ชิ้นเพื่อปลดล็อกเกียรตินิยม Gold Master บนใบประกาศนียบัตรของคุณ
                  </p>
                  <button
                    onClick={() => handleNav('workshop')}
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-1.5"
                  >
                    <span>เลือกโจทย์ Workshop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Recent Lessons List */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-4 shadow-lg">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-indigo-400" />
                <span>ประวัติการเข้าเรียนล่าสุด</span>
              </h3>

              <div className="space-y-2">
                {userState.recentLessons.length > 0 ? (
                  userState.recentLessons.map((title, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-[#121522] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-[#EDEDF4]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>{title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#64748B]">ล่าสุด</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#64748B] py-2">ยังไม่มีประวัติการเรียน เริ่มเรียนบทแรกได้ที่เมนูด้านบน</p>
                )}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>ความสำเร็จ & Badges</span>
                </h3>
                <span className="text-xs font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 font-bold">
                  ปลดล็อก {userState.badges.length} / {ACHIEVEMENTS_DATA.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACHIEVEMENTS_DATA.map(badge => {
                  const Icon = BADGE_ICONS[badge.icon] || Award;
                  const isUnlocked = userState.badges.includes(badge.id);

                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-2 ${
                        isUnlocked
                          ? 'bg-[#151928] border-indigo-500/40 text-white shadow-xs'
                          : 'bg-[#0D101A] border-white/5 opacity-50 text-[#64748B]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30' 
                          : 'bg-[#151926] text-[#64748B]'
                      }`}>
                        {isUnlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-[#EDEDF4]">{badge.name}</h4>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
