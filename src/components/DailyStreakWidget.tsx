import React from 'react';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { UserState } from '../types';
import { getLast7DaysStreak, getStreakMilestones } from '../utils/streak';

interface DailyStreakWidgetProps {
  userState: UserState;
  onClaimDailyStreak?: () => void;
}

export const DailyStreakWidget: React.FC<DailyStreakWidgetProps> = ({
  userState,
  onClaimDailyStreak
}) => {
  const currentStreak = userState.dailyStreak ?? 1;
  const maxStreak = userState.maxStreak ?? currentStreak;
  const activityDates = userState.activityDates ?? [];
  const streakClaimed = userState.streakClaimedToday ?? false;

  const weekDays = getLast7DaysStreak(activityDates);
  const milestone = getStreakMilestones(currentStreak);
  const activeDaysThisWeek = weekDays.filter(d => d.isEngaged).length;

  return (
    <div 
      id="daily-streak-card"
      className="bg-gradient-to-br from-[#121626]/95 via-[#0E1220]/95 to-[#161726]/95 p-5 sm:p-6 rounded-2xl border border-amber-500/25 relative overflow-hidden mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 group"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />

      <div className="relative z-10 space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/10 border border-amber-500/35 text-amber-300 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.25)]">
                <Flame className="w-6 h-6 fill-amber-400/35 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                  <span>Daily Streak Tracker</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs">
                  สถิติความต่อเนื่อง
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                ติดตามการเข้าฝึกฝนอย่างสม่ำเสมอเพื่อพัฒนาสู่ระดับมืออาชีพ
              </p>
            </div>
          </div>

          {/* Quick Stats Pill & Bonus Claim Button */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#0D101C]/80 border border-amber-500/20 flex items-center gap-2 text-xs font-mono shadow-xs backdrop-blur-md">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[#94A3B8]">สถิติสูงสุด:</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-300 font-bold">{maxStreak} วัน</span>
            </div>

            {onClaimDailyStreak && (
              <button
                onClick={onClaimDailyStreak}
                disabled={streakClaimed}
                id="claim-streak-bonus-btn"
                className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  streakClaimed 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 cursor-default shadow-xs'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold border-amber-300/40 shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 hover:-translate-y-0.5'
                }`}
                title={streakClaimed ? "รับโบนัสประจำวันแล้ว" : "คลิกเพื่อรับโบนัส Streak +10 XP"}
              >
                {streakClaimed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>รับโบนัสวันนี้แล้ว (+10 XP)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>รับโบนัส Streak (+10 XP)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Counter and 7-Day Indicator Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Big Counter Display */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-[#111524]/90 to-[#0A0D18]/90 border border-amber-500/20 flex flex-col justify-between space-y-4 shadow-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
            
            <div className="flex items-baseline gap-3.5">
              <div className="flex items-center gap-2 text-amber-400">
                <Flame className="w-8 h-8 fill-amber-400/30 text-amber-400 animate-pulse" />
                <span className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 tracking-tight">
                  {currentStreak}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-lg sm:text-xl font-bold text-white block">วันติดต่อกัน</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  กำลังสะสมสตรีค (Active)
                </span>
              </div>
            </div>

            {/* Milestone Progress bar */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>เป้าหมายถัดไป: {milestone.nextMilestone} วัน</span>
                </span>
                <span className="text-amber-300 font-bold">
                  {milestone.daysRemaining === 0 ? 'สำเร็จแล้ว!' : `อีก ${milestone.daysRemaining} วัน`}
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/10 overflow-hidden relative p-0.5 shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all duration-500 ease-out"
                  style={{ width: `${milestone.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {currentStreak >= 7 
                  ? 'คุณมีวินัยในการเรียนรู้ที่ยอดเยี่ยม ก้าวสู่การเป็นมืออาชีพอย่างมั่นคง'
                  : currentStreak >= 3
                  ? 'ทำได้ดีมาก! เข้าเรียนต่อเนื่องครบ 3 วัน ได้รับ Badge พิเศษแล้ว'
                  : 'การเปิดดูบทเรียนหรือฝึกฝนวันละ 15 นาที จะช่วยรักษา Streak และเพิ่มทักษะได้เร็วขึ้น'}
              </p>
            </div>
          </div>

          {/* Right Column: 7-Day Visual Week Indicator */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-gradient-to-b from-[#111524]/90 to-[#0A0D18]/90 border border-amber-500/20 space-y-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                  กิจกรรม 7 วันล่าสุด (Weekly Log)
                </span>
              </div>
              <span className="text-xs font-mono text-[#94A3B8]">
                เข้าเรียนแล้ว <strong className="text-amber-400 font-bold">{activeDaysThisWeek}</strong> / 7 วัน
              </span>
            </div>

            {/* 7 Days Circles / Cards */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekDays.map((day, idx) => {
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-xl border transition-all text-center relative ${
                      day.isToday
                        ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/25 to-orange-500/15 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                        : day.isEngaged
                        ? 'border-amber-500/30 bg-[#161B2E] text-white shadow-xs'
                        : 'border-white/5 bg-[#0B0E18] text-[#64748B]'
                    }`}
                  >
                    {/* Day name */}
                    <span className={`text-[11px] font-mono font-medium ${
                      day.isToday ? 'text-amber-300 font-bold' : day.isEngaged ? 'text-white' : 'text-[#64748B]'
                    }`}>
                      {day.dayName}
                    </span>

                    {/* Status icon bubble */}
                    <div className="my-1.5">
                      {day.isEngaged ? (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          day.isToday 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
                            : 'bg-amber-500/25 text-amber-300 border border-amber-500/30'
                        }`}>
                          <Flame className="w-3.5 h-3.5 fill-current" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#131724] border border-white/5 flex items-center justify-center text-[#64748B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#333C50]" />
                        </div>
                      )}
                    </div>

                    {/* Day date number */}
                    <span className={`text-[10px] font-mono ${
                      day.isToday ? 'text-amber-300 font-bold' : 'text-[#94A3B8]'
                    }`}>
                      {day.fullDateLabel}
                    </span>

                    {/* Today tag */}
                    {day.isToday && (
                      <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[8px] font-black tracking-tight shadow-md">
                        วันนี้
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom footnote */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-[#949CAE] pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>การเข้าดูวิดีโอ, ทำแบบทดสอบ หรือฝึกซ้อม นับเป็นกิจกรรมของวัน</span>
              </div>
              <span className="text-amber-400 font-medium">
                เข้าเรียนต่อเนื่องพรุ่งนี้เพื่อ streak +1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
