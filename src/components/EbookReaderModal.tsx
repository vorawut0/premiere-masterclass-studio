import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Palette, 
  Scissors, 
  Clock, 
  Check, 
  ArrowRight,
  Sun,
  Moon,
  Type,
  List,
  Award,
  Download,
  Printer,
  Sliders,
  Eye,
  RotateCw
} from 'lucide-react';
import { EBOOK_CHAPTERS, EBOOK_METADATA } from '../data/ebookData';
import { EbookChapter } from '../types';

interface EbookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterId?: string;
  onTriggerToast?: (msg: string) => void;
}

// Synthesize a realistic, soft paper flip sound using Web Audio API
function playPaperTurnSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 0.14;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Natural paper friction noise with gentle decay
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * Math.exp(-progress * 2.5);
      output[i] = (Math.random() * 2 - 1) * envelope * 0.22;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + duration);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
  } catch {
    // AudioContext blocked or not supported
  }
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({
  isOpen,
  onClose,
  initialChapterId,
  onTriggerToast
}) => {
  // Spreads: 
  // 0: Cover & Table of Contents
  // 1: Chapter 1 (Left & Right pages)
  // 2: Chapter 2
  // 3: Chapter 3
  // 4: Chapter 4
  // 5: Chapter 5
  // 6: Chapter 6
  // 7: Back Cover & Certificate of Reading
  const totalSpreads = 8;
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'book' | 'scroll'>('book');
  const [readerTheme, setReaderTheme] = useState<'sepia' | 'light' | 'dark'>('sepia');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [mobileActiveSide, setMobileActiveSide] = useState<'left' | 'right'>('left');

  const [readChapters, setReadChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('premiere_ebook_read_chapters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedSpreads, setBookmarkedSpreads] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('premiere_ebook_bookmarked_spreads');
      return saved ? JSON.parse(saved) : [0];
    } catch {
      return [0];
    }
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Jump to chapter if requested
  useEffect(() => {
    if (initialChapterId && isOpen) {
      const idx = EBOOK_CHAPTERS.findIndex(c => c.id === initialChapterId);
      if (idx !== -1) {
        setCurrentSpread(idx + 1); // Chapter 1 corresponds to spread 1
      }
    }
  }, [initialChapterId, isOpen]);

  // Mark chapter read when viewing its spread
  useEffect(() => {
    if (currentSpread >= 1 && currentSpread <= 6) {
      const ch = EBOOK_CHAPTERS[currentSpread - 1];
      if (ch && !readChapters.includes(ch.id)) {
        const next = [...readChapters, ch.id];
        setReadChapters(next);
        localStorage.setItem('premiere_ebook_read_chapters', JSON.stringify(next));
        onTriggerToast?.(`📖 เริ่มอ่าน ${ch.title} (+25 XP)`);
      }
    }
  }, [currentSpread]);

  // Keyboard navigation for open book
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextSpread();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSpread();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSpread, viewMode]);

  const goToNextSpread = () => {
    if (currentSpread < totalSpreads - 1) {
      playPaperTurnSound(isSoundEnabled);
      setSlideDirection(1);
      setCurrentSpread(prev => prev + 1);
      setMobileActiveSide('left');
    } else {
      onTriggerToast?.('🏆 คุณอ่านคัมภีร์ E-Book ครบทุกหน้าแล้ว!');
    }
  };

  const goToPrevSpread = () => {
    if (currentSpread > 0) {
      playPaperTurnSound(isSoundEnabled);
      setSlideDirection(-1);
      setCurrentSpread(prev => prev - 1);
      setMobileActiveSide('left');
    }
  };

  const jumpToSpread = (spreadIdx: number) => {
    playPaperTurnSound(isSoundEnabled);
    setSlideDirection(spreadIdx > currentSpread ? 1 : -1);
    setCurrentSpread(spreadIdx);
    setIsSidebarOpen(false);
    setMobileActiveSide('left');
  };

  const toggleBookmark = () => {
    let next: number[];
    if (bookmarkedSpreads.includes(currentSpread)) {
      next = bookmarkedSpreads.filter(s => s !== currentSpread);
      onTriggerToast?.('ยกเลิกการคั่นหน้านี้แล้ว');
    } else {
      next = [...bookmarkedSpreads, currentSpread];
      onTriggerToast?.('🔖 คั่นหน้านี้ด้วยริบบิ้นเรียบร้อยแล้ว');
    }
    setBookmarkedSpreads(next);
    localStorage.setItem('premiere_ebook_bookmarked_spreads', JSON.stringify(next));
  };

  const isCurrentSpreadBookmarked = bookmarkedSpreads.includes(currentSpread);

  if (!isOpen) return null;

  // Theme styling configurations
  const themeStyles = {
    sepia: {
      modalBg: 'bg-[#181512]/95 backdrop-blur-xl',
      bookCover: 'bg-gradient-to-r from-[#2B1B10] via-[#382315] to-[#2B1B10] border-[#5A381E]',
      bookEdges: 'border-[#D8C6A5] shadow-[0_10px_35px_rgba(0,0,0,0.5)]',
      pageBg: 'bg-[#FBF6ED]',
      pageBorder: 'border-[#EADBCA]',
      spineShadow: 'from-black/25 via-black/10 to-transparent',
      spineGutter: 'bg-gradient-to-r from-[#D7C4A5] via-[#BAA481] to-[#D7C4A5]',
      textPrimary: 'text-[#281D14]',
      textSecondary: 'text-[#634F3D]',
      cardBg: 'bg-[#F2E8D7] border-[#DFCBB2]',
      accentBg: 'bg-[#8F4F24]',
      accentText: 'text-[#8F4F24]',
      pageNumber: 'text-[#856D53]',
      headerRule: 'border-[#E7D6C1]',
      bannerBg: 'bg-[#EFE3CF]'
    },
    light: {
      modalBg: 'bg-slate-900/90 backdrop-blur-xl',
      bookCover: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30',
      bookEdges: 'border-slate-300 shadow-[0_10px_35px_rgba(0,0,0,0.4)]',
      pageBg: 'bg-[#FFFFFF]',
      pageBorder: 'border-slate-200',
      spineShadow: 'from-black/20 via-black/5 to-transparent',
      spineGutter: 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300',
      textPrimary: 'text-[#0F172A]',
      textSecondary: 'text-[#475569]',
      cardBg: 'bg-slate-50 border-slate-200',
      accentBg: 'bg-indigo-600',
      accentText: 'text-indigo-600',
      pageNumber: 'text-slate-400',
      headerRule: 'border-slate-200',
      bannerBg: 'bg-indigo-50/70'
    },
    dark: {
      modalBg: 'bg-black/95 backdrop-blur-2xl',
      bookCover: 'bg-gradient-to-r from-[#0C0F1A] via-[#141829] to-[#0C0F1A] border-purple-500/30',
      bookEdges: 'border-purple-950/60 shadow-[0_10px_45px_rgba(0,0,0,0.8)]',
      pageBg: 'bg-[#101423]',
      pageBorder: 'border-white/10',
      spineShadow: 'from-black/60 via-black/20 to-transparent',
      spineGutter: 'bg-gradient-to-r from-[#171B2D] via-[#090C16] to-[#171B2D]',
      textPrimary: 'text-[#EDEDF5]',
      textSecondary: 'text-[#94A3B8]',
      cardBg: 'bg-[#161B2E] border-white/10',
      accentBg: 'bg-purple-600',
      accentText: 'text-purple-400',
      pageNumber: 'text-[#64748B]',
      headerRule: 'border-white/10',
      bannerBg: 'bg-purple-950/30'
    }
  }[readerTheme];

  // Font size classes
  const fontClass = fontSize === 'large' 
    ? 'text-[15px] leading-relaxed' 
    : fontSize === 'xlarge' 
    ? 'text-[17px] leading-loose' 
    : 'text-[13.5px] leading-relaxed';

  // RENDER CONTENT FOR SPREADS
  const renderSpreadContent = (spreadIdx: number) => {
    // SPREAD 0: COVER & TABLE OF CONTENTS
    if (spreadIdx === 0) {
      return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: BOOK COVER PAGE */}
          <div className={`p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden select-none border-b md:border-b-0 md:border-r ${themeStyles.pageBorder}`}>
            {/* Hardcover Texture Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
            
            {/* Book Corner Emboss */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow-md">
                OFFICIAL HARDCOVER EDITION
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <span>★ 4.98</span>
                <span className="text-[10px] text-slate-400 font-normal">(14,850+ นักเรียน)</span>
              </div>
            </div>

            {/* Central Book Cover Artwork & Titles */}
            <div className="my-auto py-6 z-10 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mx-auto flex items-center justify-center shadow-xl shadow-purple-600/30 border border-white/20">
                <BookOpen className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono tracking-widest uppercase text-purple-400 font-semibold">
                  ADOBE PREMIERE PRO MASTER HANDBOOK
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                  คัมภีร์ตัดต่อวิดีโอ <br />
                  <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
                    ระดับมืออาชีพ 2026
                  </span>
                </h1>
                <p className={`text-xs sm:text-sm max-w-sm mx-auto ${themeStyles.textSecondary}`}>
                  {EBOOK_METADATA.subtitle}
                </p>
              </div>

              {/* Cover Artwork Thumbnail */}
              <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-[16/9] relative group">
                <img 
                  src={EBOOK_METADATA.coverImage} 
                  alt="Book Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-3">
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    6 บทเรียนเข้มข้น • 148 หน้าเนื้อหาเต็ม • 25+ คีย์ลัด
                  </span>
                </div>
              </div>
            </div>

            {/* Book Cover Footer */}
            <div className={`pt-4 border-t ${themeStyles.headerRule} flex items-center justify-between text-[11px] ${themeStyles.textSecondary} z-10`}>
              <span>โดย ครูพุดซา & คณะผู้จัดทำ</span>
              <span className="font-mono font-semibold">{EBOOK_METADATA.edition}</span>
            </div>
          </div>

          {/* RIGHT: TABLE OF CONTENTS (สารบัญ) */}
          <div className="p-6 sm:p-10 flex flex-col justify-between overflow-y-auto relative">
            <div className="space-y-5">
              {/* Heading */}
              <div className={`pb-3 border-b ${themeStyles.headerRule} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-500" />
                  <h2 className="text-base sm:text-lg font-black tracking-wide">
                    สารบัญคัมภีร์ (Table of Contents)
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-purple-500 font-bold">
                  {readChapters.length}/6 อ่านแล้ว
                </span>
              </div>

              {/* Kru Phutsa Foreword */}
              <div className={`p-4 rounded-2xl border ${themeStyles.cardBg} space-y-1.5`}>
                <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>คำนำจากผู้สอน (Foreword by Kru Phutsa)</span>
                </div>
                <p className={`text-xs italic leading-relaxed ${themeStyles.textSecondary}`}>
                  "การตัดต่อที่ดีที่สุด คือการตัดต่อที่ผู้ชมไม่รู้สึกว่ามีรอยต่อ คัมภีร์เล่มนี้รวบรวมแก่นวิชาและเทคนิคทางลัดที่ใช้จริงในโปรดักชัน เพื่อให้คุณตัดงานได้เร็วกว่าเดิม 3 เท่า และได้คุณภาพระดับภาพยนตร์"
                </p>
              </div>

              {/* Chapter Listing with Page Links */}
              <div className="space-y-2">
                {EBOOK_CHAPTERS.map((ch, idx) => {
                  const isRead = readChapters.includes(ch.id);
                  const spreadTarget = idx + 1;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToSpread(spreadTarget)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        themeStyles.cardBg
                      } hover:border-purple-500/50 hover:shadow-md`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-500 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {ch.chapterNumber}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold truncate group-hover:text-purple-500 transition-colors">
                            {ch.title}
                          </h4>
                          <p className={`text-[11px] truncate ${themeStyles.textSecondary}`}>
                            {ch.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isRead && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" />
                            <span>อ่านแล้ว</span>
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-purple-400">
                          หน้า {spreadTarget * 2} →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Start Action on Right Page */}
            <div className={`pt-4 mt-6 border-t ${themeStyles.headerRule} flex items-center justify-between`}>
              <span className={`text-[11px] font-mono ${themeStyles.pageNumber}`}>
                หน้า 1 • คำนำและสารบัญ
              </span>
              <button
                onClick={goToNextSpread}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>เปิดอ่านบทที่ 1</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // SPREAD 7: BACK COVER & CERTIFICATE OF READING
    if (spreadIdx === 7) {
      return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: COMPLETION SUMMARY & CHECKLIST */}
          <div className={`p-6 sm:p-10 flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r ${themeStyles.pageBorder}`}>
            <div className="space-y-6">
              <div className={`pb-3 border-b ${themeStyles.headerRule}`}>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-500">
                  EPILOGUE & SUMMARY
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1">
                  บทสรุปแห่งการเป็นมาสเตอร์ตัดต่อ
                </h2>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${themeStyles.textSecondary}`}>
                ขอแสดงความยินดีที่คุณได้ศึกษาคัมภีร์ Premiere Pro ครบถ้วนทั้ง 6 บทเรียนหลัก การตัดต่อไม่ได้จบลงที่การจำเครื่องมือ แต่คือการนำเคล็ดวิชาเหล่านี้ไปลงมือปฏิบัติจริงกับฟุตเทจทุกวัน
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500">
                  หัวใจสำคัญ 6 ประการที่คุณสำเร็จแล้ว:
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    "1. จัดพื้นที่ Workspace, Proxies และล้าง Media Cache อย่างมืออาชีพ",
                    "2. ใช้ J-Cut / L-Cut ซ่อนรอยต่อ และตัดต่อบนจังหวะ Cut on Action",
                    "3. เกรดสีด้วย Lumetri Scopes และคุมโทนสีผิวให้แม่นยำบน IRE 60-70",
                    "4. มิกซ์เสียงผ่าน Essential Sound Panel และคุม Loudness Radar -14 LUFS",
                    "5. ขึงกราฟความเร็ว Velocity Curves และมาสก์วัตถุเพื่อสร้างมิติ",
                    "6. ใช้คีย์ลัดสองมือ (Q-W-E-D-F-C-V) และตรวจ Pre-flight checklist ก่อนส่งมอบ"
                  ].map((item, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${themeStyles.cardBg} flex items-start gap-2.5 text-xs`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t ${themeStyles.headerRule} flex items-center justify-between text-[11px] ${themeStyles.pageNumber}`}>
              <span>หน้า 14 • บทส่งท้าย</span>
              <button
                onClick={goToPrevSpread}
                className="text-purple-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>ย้อนกลับไปบทที่ 6</span>
              </button>
            </div>
          </div>

          {/* RIGHT: GRADUATION CERTIFICATE & BADGE */}
          <div className="p-6 sm:p-10 flex flex-col justify-between overflow-y-auto relative text-center">
            <div className="my-auto space-y-5 py-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-xl">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold tracking-wider uppercase border border-amber-500/30">
                  OFFICIAL READING CERTIFICATE
                </span>
                <h3 className="text-xl sm:text-2xl font-black pt-2">
                  คัมภีร์ตัดต่อวิดีโอฉบับสมบูรณ์
                </h3>
                <p className={`text-xs max-w-sm mx-auto ${themeStyles.textSecondary}`}>
                  มอบให้เพื่อเป็นเกียรติแก่ผู้ศึกษาที่ได้อ่านเนื้อหาครบทั้ง 6 บทเรียน พัฒนาศักยภาพสู่การเป็น Professional Video Editor
                </p>
              </div>

              {/* Certificate Card Box */}
              <div className={`p-5 rounded-2xl border-2 border-dashed border-purple-500/30 ${themeStyles.cardBg} text-left space-y-3 max-w-sm mx-auto shadow-lg`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">สถานะการเรียนรู้:</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ผ่านการอ่านครบ 100%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">คะแนนความรู้พิเศษ:</span>
                  <span className="font-mono font-bold text-purple-400">+150 XP (E-Book Master)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ผู้รับรอง:</span>
                  <span className="font-medium">ครูพุดซา & ทีมงานตัดต่อ</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onTriggerToast?.('🏆 คุณได้รับตรานักอ่าน E-Book Master (+150 XP) เรียบร้อยแล้ว!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <Award className="w-4 h-4" />
                  <span>รับตราสัญลักษณ์อ่านจบ</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์สรุปคัมภีร์</span>
                </button>
              </div>
            </div>

            <div className={`pt-4 border-t ${themeStyles.headerRule} flex items-center justify-between text-[11px] ${themeStyles.pageNumber}`}>
              <span>หน้า 15 • ปกหลังและใบรับรอง</span>
              <button
                onClick={() => jumpToSpread(0)}
                className="text-purple-500 font-bold hover:underline cursor-pointer"
              >
                กลับไปหน้าปกหนังสือ ⮌
              </button>
            </div>
          </div>
        </div>
      );
    }

    // CHAPTER SPREADS 1 TO 6
    const ch = EBOOK_CHAPTERS[spreadIdx - 1];
    if (!ch) return null;

    const leftPageNum = spreadIdx * 2;
    const rightPageNum = spreadIdx * 2 + 1;
    const isCompleted = readChapters.includes(ch.id);

    return (
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        {/* LEFT PAGE: CHAPTER INTRO, OVERVIEW & SECTION 1 */}
        <div className={`p-6 sm:p-9 flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r ${themeStyles.pageBorder} relative`}>
          <div className="space-y-5">
            {/* Header Running Title */}
            <div className={`pb-3 border-b ${themeStyles.headerRule} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold">
                  บทที่ {ch.chapterNumber}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                  PREMIERE PRO MASTER HANDBOOK
                </span>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {ch.readTime}
              </span>
            </div>

            {/* Chapter Headline */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                {ch.title}
              </h2>
              <p className={`text-xs sm:text-sm font-medium ${themeStyles.textSecondary}`}>
                {ch.subtitle}
              </p>
            </div>

            {/* Summary Callout Banner */}
            <div className={`p-3.5 sm:p-4 rounded-2xl border ${themeStyles.cardBg} space-y-1`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>แก่นความคิดของบทเรียนนี้</span>
              </div>
              <p className={`text-xs leading-relaxed italic ${themeStyles.textSecondary}`}>
                "{ch.summary}"
              </p>
            </div>

            {/* Section 1 Details */}
            {ch.sections[0] && (
              <div className="space-y-3 pt-1">
                <h3 className="text-sm sm:text-base font-bold text-purple-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  {ch.sections[0].title}
                </h3>
                <p className={`${fontClass} ${themeStyles.textPrimary}`}>
                  {ch.sections[0].body}
                </p>

                {/* Section 1 Image */}
                {ch.sections[0].image && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-md aspect-[16/9] my-3">
                    <img 
                      src={ch.sections[0].image} 
                      alt={ch.sections[0].imageCaption || ch.sections[0].title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                {ch.sections[0].imageCaption && (
                  <p className="text-center text-[11px] text-slate-400 italic">
                    ภาพประกอบ: {ch.sections[0].imageCaption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Left Page Footer */}
          <div className={`pt-4 mt-6 border-t ${themeStyles.headerRule} flex items-center justify-between text-[11px] ${themeStyles.pageNumber}`}>
            <span>หน้า {leftPageNum} • {ch.title}</span>
            <span className="text-[10px] uppercase tracking-wider font-mono">Adobe Premiere Masterclass</span>
          </div>

          {/* Left Page Dog-Ear Flip Corner (Bottom Left) */}
          <button
            onClick={goToPrevSpread}
            className="absolute bottom-0 left-0 w-8 h-8 group overflow-hidden cursor-pointer"
            title="คลิกมุมเพื่อพลิกกลับไปหน้าก่อนหน้า"
          >
            <div className="w-12 h-12 bg-black/10 group-hover:bg-purple-500/30 transform -rotate-45 -translate-x-6 translate-y-6 transition-all border-t border-r border-black/20" />
          </button>
        </div>

        {/* RIGHT PAGE: SECTIONS 2/3, PRO TIPS, SHORTCUTS & KEY TAKEAWAYS */}
        <div className="p-6 sm:p-9 flex flex-col justify-between overflow-y-auto relative">
          <div className="space-y-5">
            {/* Header Running Title */}
            <div className={`pb-3 border-b ${themeStyles.headerRule} flex items-center justify-between`}>
              <span className="text-[11px] font-mono text-slate-400 font-semibold truncate">
                {ch.title}
              </span>
              {isCompleted ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>อ่านจบแล้ว</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-purple-400">
                  เนื้อหาหน้าเจาะลึก
                </span>
              )}
            </div>

            {/* Additional Sections */}
            {ch.sections.slice(1).map((sec, sIdx) => (
              <div key={sIdx} className="space-y-2.5">
                <h3 className="text-sm sm:text-base font-bold text-purple-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  {sec.title}
                </h3>
                <p className={`${fontClass} ${themeStyles.textPrimary}`}>
                  {sec.body}
                </p>

                {/* Diagrams if present */}
                {sec.diagramData && sec.diagramData.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2.5">
                    {sec.diagramData.map((d, dIdx) => (
                      <div key={dIdx} className={`p-2.5 rounded-xl border ${themeStyles.cardBg} text-center space-y-0.5`}>
                        <div className="text-[10px] font-semibold text-slate-400">{d.label}</div>
                        <div className="text-sm sm:text-base font-black text-purple-500 font-mono">{d.value}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{d.desc}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tip Box */}
                {sec.proTip && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 my-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <strong className="text-amber-500 font-bold block">💡 Pro Editor Tip:</strong>
                      <span className={`${themeStyles.textPrimary} leading-relaxed`}>{sec.proTip}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Power Shortcuts Box */}
            {ch.shortcuts && ch.shortcuts.length > 0 && (
              <div className={`p-4 rounded-2xl border ${themeStyles.cardBg} space-y-2.5`}>
                <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>คีย์ลัดเร่งสปีดประจำบทเรียนนี้ (Shortcuts)</span>
                </div>
                <div className="divide-y divide-white/10 text-xs">
                  {ch.shortcuts.map((sc, scIdx) => (
                    <div key={scIdx} className="py-1.5 flex items-center justify-between gap-3">
                      <kbd className="px-2 py-0.5 rounded-md bg-black/20 border border-white/20 font-mono font-bold text-purple-500 text-[11px]">
                        {sc.key}
                      </kbd>
                      <span className={`text-[11px] text-right ${themeStyles.textSecondary}`}>
                        {sc.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways Checklist */}
            <div className={`p-4 rounded-2xl border ${themeStyles.cardBg} space-y-2`}>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>สรุปข้อคิดสำคัญ (Key Takeaways)</span>
              </div>
              <ul className="space-y-1.5 text-xs">
                {ch.keyTakeaways.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={`leading-relaxed ${themeStyles.textSecondary}`}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Page Footer */}
          <div className={`pt-4 mt-6 border-t ${themeStyles.headerRule} flex items-center justify-between text-[11px] ${themeStyles.pageNumber}`}>
            <span className="text-[10px] uppercase tracking-wider font-mono">บทที่ {ch.chapterNumber} จาก 6</span>
            <span>หน้า {rightPageNum}</span>
          </div>

          {/* Right Page Dog-Ear Flip Corner (Bottom Right) */}
          <button
            onClick={goToNextSpread}
            className="absolute bottom-0 right-0 w-8 h-8 group overflow-hidden cursor-pointer"
            title="คลิกมุมเพื่อพลิกไปหน้าถัดไป"
          >
            <div className="w-12 h-12 bg-black/10 group-hover:bg-purple-500/30 transform rotate-45 translate-x-6 translate-y-6 transition-all border-t border-l border-black/20" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Outer Modal Container */}
      <div className={`w-full h-full max-w-7xl rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden relative ${themeStyles.modalBg}`}>
        
        {/* Top Floating Control Bar */}
        <header className="px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-30">
          
          {/* Left: Table of Contents & Chapter Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              id="ebook-open-book-toc-btn"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="เปิดสารบัญบทเรียน"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">สารบัญ</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-600/30 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/30 shrink-0">
                สเปรด {currentSpread + 1}/{totalSpreads}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate hidden md:inline">
                {currentSpread === 0 ? 'หน้าปก & สารบัญ' : currentSpread === 7 ? 'บทส่งท้าย & ประกาศนียบัตร' : EBOOK_CHAPTERS[currentSpread - 1]?.title}
              </span>
            </div>
          </div>

          {/* Center: Open Book / Continuous Scroll Mode Toggle */}
          <div className="hidden lg:flex items-center bg-white/5 rounded-xl border border-white/10 p-0.5">
            <button
              onClick={() => setViewMode('book')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'book' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>หนังสือเปิด 2 หน้า (Open Book)</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'scroll' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>โหมดเลื่อนอ่าน</span>
            </button>
          </div>

          {/* Right: Sound, Font, Themes, Bookmark & Close Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Page Flip Sound Toggle */}
            <button
              onClick={() => {
                const next = !isSoundEnabled;
                setIsSoundEnabled(next);
                if (next) playPaperTurnSound(true);
                onTriggerToast?.(next ? '🔊 เปิดเสียงพลิกหน้ากระดาษแล้ว' : '🔇 ปิดเสียงกระดาษแล้ว');
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSoundEnabled 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
              title={isSoundEnabled ? 'ปิดเสียงพลิกกระดาษ' : 'เปิดเสียงพลิกกระดาษ'}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-white/5 rounded-xl border border-white/10 p-0.5">
              <button
                onClick={() => setFontSize(prev => prev === 'xlarge' ? 'large' : 'normal')}
                disabled={fontSize === 'normal'}
                className="px-2 py-1 text-xs font-bold hover:bg-white/10 rounded-lg disabled:opacity-30 cursor-pointer"
                title="ลดขนาดตัวอักษร"
              >
                A-
              </button>
              <span className="text-[10px] px-1 font-mono text-slate-400">
                {fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.2x' : '1.4x'}
              </span>
              <button
                onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : 'xlarge')}
                disabled={fontSize === 'xlarge'}
                className="px-2 py-1 text-xs font-bold hover:bg-white/10 rounded-lg disabled:opacity-30 cursor-pointer"
                title="เพิ่มขนาดตัวอักษร"
              >
                A+
              </button>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-0.5">
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  readerTheme === 'sepia' ? 'bg-amber-700 text-white' : 'text-amber-400 hover:text-amber-200'
                }`}
                title="กระดาษถนอมสายตา (Sepia Paper)"
              >
                ถนอมสายตา
              </button>
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  readerTheme === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="กระดาษขาวพรีเมียม (Ivory White)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  readerTheme === 'dark' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="หนังสือหนังสีเข้ม (Midnight Leather)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ribbon Bookmark Button */}
            <button
              onClick={toggleBookmark}
              id="ebook-open-book-ribbon-btn"
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isCurrentSpreadBookmarked
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
              title={isCurrentSpreadBookmarked ? 'ปลดที่คั่นหน้า' : 'คั่นหน้านี้ด้วยริบบิ้น'}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              id="ebook-open-book-close-btn"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer ml-1"
              title="ปิด E-Book"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Middle Stage: The 3D Open Book / Flipbook Canvas */}
        <div className="flex-1 flex overflow-hidden relative p-2 sm:p-4 md:p-6 items-center justify-center">
          
          {/* Table of Contents Slide-in Drawer */}
          <aside className={`absolute top-0 bottom-0 left-0 z-40 w-80 max-w-[85vw] border-r border-white/10 bg-[#0E111C]/95 backdrop-blur-2xl flex flex-col transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-white">สารบัญทั้งเล่ม</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <button
                onClick={() => jumpToSpread(0)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                  currentSpread === 0 ? 'bg-purple-600 text-white border-purple-400 font-bold' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>หน้าปก & สารบัญ (Cover & TOC)</span>
                <span className="font-mono text-[10px]">หน้า 1</span>
              </button>

              {EBOOK_CHAPTERS.map((ch, idx) => {
                const spreadTarget = idx + 1;
                const isSelected = currentSpread === spreadTarget;
                const isChRead = readChapters.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => jumpToSpread(spreadTarget)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer space-y-1 ${
                      isSelected ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-purple-400 text-[10px]">บทที่ {ch.chapterNumber}</span>
                      {isChRead && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="font-semibold text-white truncate">{ch.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                      <span>{ch.readTime}</span>
                      <span className="font-mono">หน้า {spreadTarget * 2}-{spreadTarget * 2 + 1}</span>
                    </div>
                  </button>
                );
              })}

              <button
                onClick={() => jumpToSpread(7)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                  currentSpread === 7 ? 'bg-amber-600 text-white border-amber-400 font-bold' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>บทส่งท้าย & ประกาศนียบัตร</span>
                <span className="font-mono text-[10px]">หน้า 14-15</span>
              </button>
            </div>
          </aside>

          {/* VIEW MODE: BOOK SPREAD (หนังสือเปิด) */}
          {viewMode === 'book' && (
            <div className="w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center relative perspective-[1800px]">
              
              {/* Outer Hardcover Frame & Realistic Page Paper Edges */}
              <div className={`w-full h-full rounded-2xl md:rounded-3xl border-4 ${themeStyles.bookCover} ${themeStyles.bookEdges} relative flex overflow-hidden shadow-2xl transition-all duration-300`}>
                
                {/* Book Thickness Multi-page Stack Effect (Left Page Stack) */}
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/5 to-transparent pointer-events-none z-20 border-r border-black/10" />

                {/* Book Thickness Multi-page Stack Effect (Right Page Stack) */}
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-black/40 via-white/5 to-transparent pointer-events-none z-20 border-l border-black/10" />

                {/* REALISTIC CENTER SPINE (สันหนังสือตรงกลาง) with Stitches and Curvature Shadow */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 z-30 pointer-events-none">
                  {/* Center crease / Gutter binding */}
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-black/35 to-transparent flex items-center justify-center">
                    <div className="w-[1.5px] h-full bg-black/40 shadow-inner" />
                  </div>
                  {/* Stitches markings */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col justify-between py-6 opacity-40">
                    <div className="w-1 h-3 border-y border-black/80" />
                    <div className="w-1 h-3 border-y border-black/80" />
                    <div className="w-1 h-3 border-y border-black/80" />
                  </div>
                </div>

                {/* SATIN RIBBON BOOKMARK HANGING FROM TOP SPINE */}
                <div 
                  onClick={toggleBookmark}
                  className={`absolute top-0 left-1/2 -translate-x-1/2 z-40 w-6 transition-all duration-300 cursor-pointer group ${
                    isCurrentSpreadBookmarked ? 'h-24 sm:h-32' : 'h-10 sm:h-14 opacity-70 hover:opacity-100'
                  }`}
                  title={isCurrentSpreadBookmarked ? 'คลิกเพื่อปลดริบบิ้นคั่นหน้า' : 'คลิกเพื่อคั่นหน้านี้ด้วยริบบิ้น'}
                >
                  <div className="w-full h-full bg-gradient-to-b from-purple-700 via-rose-600 to-rose-700 rounded-b-sm shadow-xl relative flex flex-col justify-end items-center pb-1">
                    {/* Swallowtail cut at ribbon end */}
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-transparent border-t-[10px] border-t-rose-700 border-x-[12px] border-x-transparent" />
                    {isCurrentSpreadBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 text-amber-300 fill-current drop-shadow-md mb-1" />
                    )}
                  </div>
                </div>

                {/* Inner Spread Content Container with Motion Turning Effect */}
                <div className={`w-full h-full ${themeStyles.pageBg} relative overflow-hidden transition-colors duration-300`}>
                  <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
                    <motion.div
                      key={currentSpread}
                      custom={slideDirection}
                      initial={{ 
                        opacity: 0.2, 
                        rotateY: slideDirection > 0 ? 12 : -12,
                        scale: 0.98,
                        transformOrigin: slideDirection > 0 ? 'right center' : 'left center'
                      }}
                      animate={{ 
                        opacity: 1, 
                        rotateY: 0,
                        scale: 1,
                        transition: { duration: 0.35, ease: 'easeOut' }
                      }}
                      exit={{ 
                        opacity: 0, 
                        rotateY: slideDirection > 0 ? -12 : 12,
                        scale: 0.98,
                        transition: { duration: 0.2, ease: 'easeIn' }
                      }}
                      className="w-full h-full"
                    >
                      {renderSpreadContent(currentSpread)}
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* Prev Page Button (Floating Left) */}
              <button
                onClick={goToPrevSpread}
                disabled={currentSpread === 0}
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#161B2E]/90 hover:bg-purple-600 text-white disabled:opacity-20 disabled:pointer-events-none border border-white/20 shadow-xl flex items-center justify-center transition-all transform hover:scale-110 z-40 cursor-pointer"
                title="พลิกกลับหน้าก่อนหน้า (หรือกดลูกศรซ้าย)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Page Button (Floating Right) */}
              <button
                onClick={goToNextSpread}
                disabled={currentSpread === totalSpreads - 1}
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#161B2E]/90 hover:bg-purple-600 text-white disabled:opacity-20 disabled:pointer-events-none border border-white/20 shadow-xl flex items-center justify-center transition-all transform hover:scale-110 z-40 cursor-pointer"
                title="พลิกไปหน้าถัดไป (หรือกดลูกศรขวา)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          )}

          {/* VIEW MODE: CONTINUOUS SCROLL (สำหรับผู้ที่ต้องการอ่านยาว) */}
          {viewMode === 'scroll' && (
            <div 
              ref={scrollContainerRef}
              className="w-full h-full max-w-4xl overflow-y-auto px-4 sm:px-8 py-6 rounded-2xl bg-black/40 border border-white/10 space-y-8"
            >
              {Array.from({ length: totalSpreads }).map((_, sIdx) => (
                <div key={sIdx} className={`rounded-2xl border ${themeStyles.pageBg} p-4 sm:p-8 shadow-xl`}>
                  {renderSpreadContent(sIdx)}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Navigation & Reading Progress Ribbon */}
        <footer className="px-4 sm:px-6 py-3 border-t border-white/10 bg-black/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-30">
          
          {/* Progress Tracker Pill */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs text-slate-300 font-medium">
              คืบหน้า: <strong className="text-purple-400 font-mono">{Math.round(((currentSpread + 1) / totalSpreads) * 100)}%</strong>
            </span>
            <div className="w-32 sm:w-44 h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentSpread + 1) / totalSpreads) * 100}%` }}
              />
            </div>
          </div>

          {/* Spread Thumbnails / Dots Fast Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            {Array.from({ length: totalSpreads }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => jumpToSpread(idx)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  currentSpread === idx 
                    ? 'bg-purple-500 ring-4 ring-purple-500/20 scale-125' 
                    : bookmarkedSpreads.includes(idx)
                    ? 'bg-amber-400'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                title={`กระโดดไปหน้าที่ ${idx === 0 ? '1 (ปก)' : idx === 7 ? '14-15' : `${idx * 2}-${idx * 2 + 1}`}`}
              />
            ))}
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={goToPrevSpread}
              disabled={currentSpread === 0}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>หน้าก่อน</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              {currentSpread + 1} / {totalSpreads}
            </span>

            <button
              onClick={goToNextSpread}
              disabled={currentSpread === totalSpreads - 1}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>หน้าถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </footer>

      </div>
    </div>
  );
};
