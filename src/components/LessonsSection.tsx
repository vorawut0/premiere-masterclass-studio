import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Check, 
  ArrowRight, 
  X, 
  Clock, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Youtube, 
  Bookmark, 
  FileText, 
  Save, 
  Bot, 
  Keyboard 
} from 'lucide-react';
import { Lesson } from '../types';
import { LESSONS_DATA } from '../data/masterclassData';

interface LessonsSectionProps {
  completedLessons: number[];
  bookmarks?: number[];
  bookmarkedLessons?: number[];
  notes?: Record<number, string>;
  lessonNotes?: Record<number, string>;
  onCompleteLesson: (id: number) => void;
  onToggleBookmark?: (id: number) => void;
  onSaveNote?: (id: number, note: string) => void;
  onOpenLessonCallback?: (lesson: Lesson) => void;
  onOpenAiAssistant?: () => void;
  onOpenShortcuts?: () => void;
  onTriggerToast?: (msg: string) => void;
  preselectedLessonId?: number | null;
}

export const LessonsSection: React.FC<LessonsSectionProps> = ({
  completedLessons,
  bookmarks,
  bookmarkedLessons = [],
  notes,
  lessonNotes = {},
  onCompleteLesson,
  onToggleBookmark,
  onSaveNote,
  onOpenLessonCallback,
  onOpenAiAssistant,
  onOpenShortcuts,
  onTriggerToast,
  preselectedLessonId
}) => {
  const activeBookmarks = bookmarks || bookmarkedLessons || [];
  const activeNotes = notes || lessonNotes || {};

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ทั้งหมด');
  const [activeTab, setActiveTab] = useState<'content' | 'notes'>('content');
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  
  // Auto-play Next Episode states
  const [isAutoPlayNext, setIsAutoPlayNext] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Auto open modal if requested from Search or Profile
  useEffect(() => {
    if (preselectedLessonId) {
      const lesson = LESSONS_DATA.find(l => l.id === preselectedLessonId);
      if (lesson) {
        setSelectedLesson(lesson);
        setActiveTab('content');
        setCurrentNoteText(activeNotes[lesson.id] || '');
        setNoteSaved(false);
      }
    }
  }, [preselectedLessonId]);

  // YouTube postMessage listener to detect video finished (playerState === 0)
  useEffect(() => {
    if (!selectedLesson) {
      setCountdown(null);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }
        if (data && data.event === 'infoDelivery' && data.info) {
          // playerState 0 is ENDED
          if (data.info.playerState === 0) {
            if (isAutoPlayNext) {
              setCountdown(3);
            }
          }
        }
        if (data && data.event === 'onStateChange' && (data.info === 0 || data.data === 0)) {
          if (isAutoPlayNext) {
            setCountdown(3);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedLesson, isAutoPlayNext]);

  // Auto-advance countdown timer
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      handleNext();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, selectedLesson]);

  const categories = ['ทั้งหมด', 'คั่นหน้าไว้ ★', 'Basic', 'Assets', 'Timeline', 'Cutting', 'Transition', 'Text', 'Effects', 'Color', 'Audio', 'Animation', 'Motion', 'Export', 'Project'];

  const filteredLessons = LESSONS_DATA.filter(l => {
    if (activeCategory === 'ทั้งหมด') return true;
    if (activeCategory === 'คั่นหน้าไว้ ★') return activeBookmarks.includes(l.id);
    return l.category === activeCategory;
  });

  const progressPercent = Math.round((completedLessons.length / LESSONS_DATA.length) * 100);

  const openLesson = (lesson: Lesson) => {
    setCountdown(null);
    setSelectedLesson(lesson);
    setActiveTab('content');
    setCurrentNoteText(activeNotes[lesson.id] || '');
    setNoteSaved(false);
    if (onOpenLessonCallback) {
      onOpenLessonCallback(lesson);
    }
  };

  const handleMarkDone = (id: number) => {
    onCompleteLesson(id);
  };

  const handleSaveCurrentNote = () => {
    if (!selectedLesson || !onSaveNote) return;
    onSaveNote(selectedLesson.id, currentNoteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleNext = () => {
    if (!selectedLesson) return;
    setCountdown(null);
    handleMarkDone(selectedLesson.id);
    const next = LESSONS_DATA.find(l => l.id === selectedLesson.id + 1);
    if (next) {
      setSelectedLesson(next);
      setActiveTab('content');
      setCurrentNoteText(activeNotes[next.id] || '');
    } else {
      setSelectedLesson(null);
    }
  };

  return (
    <section id="lessons" className="py-20 relative bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="studio-container">
        {/* Header with Progress */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 uppercase tracking-wider font-semibold mb-2">
              <span className="w-4 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></span>
              COMPREHENSIVE VIDEO CURRICULUM
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              บทเรียนวิดีโอทั้งหมด <span className="text-gradient">15 บท</span>
            </h2>
            <p className="text-sm text-[#94A3B8] mt-1">คัดสรรคลิปสอนตัดต่อระดับโลกพร้อมคำอธิบายภาษาไทยและแบบฝึกหัดลงมือทำจริง</p>
          </div>

          <div className="text-right sm:text-right">
            <div className="font-mono text-xs text-[#94A3B8] mb-1">
              ความคืบหน้า: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 font-bold">{completedLessons.length} / 15 บท</span> ({progressPercent}%)
            </div>
            <div className="w-48 sm:w-64 h-2 bg-[#121522] border border-indigo-500/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#38BDF8] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#38BDF8] text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'glass-panel text-[#94A3B8] hover:text-white hover:border-indigo-400/40 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lessons Grid (2 to 5 columns responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredLessons.map(lesson => {
            const isDone = completedLessons.includes(lesson.id);
            const thumbUrl = lesson.youtubeId 
              ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`
              : null;

            return (
              <div
                key={lesson.id}
                onClick={() => openLesson(lesson)}
                id={`lesson-card-${lesson.id}`}
                className="glass-panel p-3.5 rounded-2xl cursor-pointer card-interactive flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Thumbnail Container */}
                <div className="aspect-[16/9] rounded-xl relative overflow-hidden mb-3 bg-gradient-to-br from-[#1E1638] to-[#0F172A] border border-white/10 flex items-center justify-center">
                  {thumbUrl ? (
                    <img 
                      src={thumbUrl} 
                      alt={lesson.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&q=80";
                      }}
                    />
                  ) : (
                    <span className="font-display text-4xl font-extrabold text-white/20 group-hover:text-white/40 transition-colors">
                      {String(lesson.id).padStart(2, '0')}
                    </span>
                  )}

                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* YouTube Tag */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-red-400 backdrop-blur-xs flex items-center gap-1 border border-white/10">
                    <Youtube className="w-3 h-3 text-red-500" />
                    <span>EP.{String(lesson.id).padStart(2, '0')}</span>
                  </div>

                  {/* Bookmark Button */}
                  {onToggleBookmark && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(lesson.id);
                      }}
                      title={activeBookmarks.includes(lesson.id) ? "ยกเลิกการคั่นหน้า" : "คั่นหน้าบทเรียนนี้"}
                      className={`absolute top-2 right-9 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs ${
                        activeBookmarks.includes(lesson.id)
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 fill-current" />
                    </button>
                  )}

                  {/* Done Check Badge */}
                  {isDone && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#34D399] text-[#062c19] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Duration & Instructor Tag */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[#B794F6] truncate max-w-[120px]">
                      {lesson.instructor || 'Instructor'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#22D3EE]" />
                      {lesson.dur}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B85] uppercase">
                      <span>{lesson.category || 'General'}</span>
                      {activeNotes[lesson.id] && (
                        <span className="flex items-center gap-1 text-[#22D3EE] lowercase">
                          <FileText className="w-3 h-3" /> โน้ต
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-[#EDEDF4] group-hover:text-[#B794F6] transition-colors line-clamp-1">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-[#9A9AB0] line-clamp-2 mt-1">
                      {lesson.desc}
                    </p>
                  </div>

                  {/* Mini Progress */}
                  <div className="pt-2">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isDone ? 'bg-[#34D399]' : 'bg-transparent'}`} 
                        style={{ width: isDone ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Lesson Modal with Real YouTube Embed */}
      {selectedLesson && (
        <div 
          id="lesson-modal-backdrop"
          className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            id="lesson-modal-window"
            className="w-full max-w-4xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
          >
            {/* Modal Video Player Viewport */}
            <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center border-b border-white/10 shrink-0">
              <button
                onClick={() => {
                  setCountdown(null);
                  setSelectedLesson(null);
                }}
                id="close-lesson-modal-btn"
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/80 border border-white/30 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedLesson.youtubeId ? (
                <>
                  <iframe
                    key={selectedLesson.id}
                    src={`https://www.youtube-nocookie.com/embed/${selectedLesson.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                    title={selectedLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  {/* Countdown overlay when video ends */}
                  {countdown !== null && (
                    <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-3 shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                        <span className="text-2xl font-black font-mono">{countdown}</span>
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="3"
                            fill="none"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="#38BDF8"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="175.9"
                            strokeDashoffset={175.9 * (1 - countdown / 3)}
                            className="transition-all duration-1000 ease-linear"
                          />
                        </svg>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>เรียนจบแล้ว (+100 XP) · กำลังไปบทต่อไปอัตโนมัติ</span>
                      </div>

                      {LESSONS_DATA.find(l => l.id === selectedLesson.id + 1) ? (
                        <>
                          <h4 className="text-white text-base font-bold max-w-md line-clamp-1 mb-1">
                            บทที่ {selectedLesson.id + 1}: {LESSONS_DATA.find(l => l.id === selectedLesson.id + 1)?.title}
                          </h4>
                          <p className="text-[#94A3B8] text-xs mb-4 font-mono">
                            ความยาว {LESSONS_DATA.find(l => l.id === selectedLesson.id + 1)?.dur} • หมวด {LESSONS_DATA.find(l => l.id === selectedLesson.id + 1)?.category}
                          </p>
                        </>
                      ) : (
                        <p className="text-white text-base font-bold mb-4">ยินดีด้วย! คุณเรียนจบคอร์ส Premiere Pro Masterclass ครบทุกบทแล้ว</p>
                      )}

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={handleNext}
                          id="modal-next-lesson-now-btn"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>เล่นบทต่อไปทันที</span>
                        </button>
                        <button
                          onClick={() => setCountdown(null)}
                          id="modal-cancel-countdown-btn"
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#94A3B8] hover:text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                        >
                          <span>ยกเลิก</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center mx-auto text-white shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>
                  <p className="text-sm text-[#EDEDF4] font-medium">กำลังเตรียมคลิปวิดีโอ</p>
                </div>
              )}
            </div>

            {/* Modal Control Strip */}
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[#B794F6] font-mono font-semibold border border-purple-500/30">
                  EP.{String(selectedLesson.id).padStart(2, '0')}
                </span>
                <span className="text-[#EDEDF4] font-medium">{selectedLesson.category}</span>
                <span className="text-[#6B6B85]">•</span>
                <span className="text-[#9A9AB0] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-[#22D3EE]" /> {selectedLesson.dur}
                </span>
                {selectedLesson.instructor && (
                  <>
                    <span className="text-[#6B6B85]">•</span>
                    <span className="text-purple-300 font-mono">By {selectedLesson.instructor}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Auto-Play Toggle */}
                <button
                  onClick={() => setIsAutoPlayNext(prev => !prev)}
                  id="modal-autoplay-toggle-btn"
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAutoPlayNext
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                  title={isAutoPlayNext ? "เปิดเล่นบทต่อไปอัตโนมัติอยู่ (คลิกเพื่อปิด)" : "ปิดเล่นบทต่อไปอัตโนมัติ (คลิกเพื่อเปิด)"}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAutoPlayNext ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
                  <span>เล่นอัตโนมัติ: {isAutoPlayNext ? 'เปิด' : 'ปิด'}</span>
                </button>

                {onToggleBookmark && (
                  <button
                    onClick={() => onToggleBookmark(selectedLesson.id)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeBookmarks.includes(selectedLesson.id)
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-white/5 border-white/10 text-[#9A9AB0] hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${activeBookmarks.includes(selectedLesson.id) ? 'fill-current' : ''}`} />
                    <span>{activeBookmarks.includes(selectedLesson.id) ? 'คั่นหน้าแล้ว' : 'คั่นหน้า'}</span>
                  </button>
                )}

                {onOpenAiAssistant && (
                  <button
                    onClick={onOpenAiAssistant}
                    className="px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-[#B794F6] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>ถาม AI</span>
                  </button>
                )}

                {selectedLesson.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedLesson.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-medium flex items-center gap-1.5 transition-all text-xs"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>เปิดดูบน YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Modal Tabs Bar */}
            <div className="px-6 border-b border-white/10 bg-white/5 flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-[#8B5CF6] text-white font-bold'
                    : 'border-transparent text-[#9A9AB0] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B794F6]" />
                <span>เนื้อหาบทเรียนและแบบฝึกหัด</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-[#8B5CF6] text-white font-bold'
                    : 'border-transparent text-[#9A9AB0] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>สมุดบันทึกของฉัน (My Notes)</span>
                {activeNotes[selectedLesson.id] && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                )}
              </button>
            </div>

            {/* Modal Content Details */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {activeTab === 'content' ? (
                <>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-[#EDEDF4]">
                      {selectedLesson.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9A9AB0] mt-1 leading-relaxed">
                      {selectedLesson.desc}
                    </p>
                  </div>

                  {/* What you'll learn */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#B794F6] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      สิ่งที่คุณจะได้เรียนรู้ในบทนี้
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#EDEDF4]">
                      {selectedLesson.learn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exercise */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                    <h5 className="text-xs font-mono text-amber-400 font-semibold uppercase flex items-center gap-1.5">
                      🎯 แบบฝึกหัดท้ายบท (Hands-on Assignment)
                    </h5>
                    <p className="text-xs sm:text-sm text-[#EDEDF4] leading-relaxed">
                      {selectedLesson.exercise}
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#EDEDF4]">
                        บันทึกข้อคิด / คีย์ลัดประจำบทเรียนนี้
                      </h4>
                      <p className="text-xs text-[#9A9AB0]">
                        ข้อมูลนี้จะบันทึกเก็บไว้ในอุปกรณ์ของคุณ สามารถกลับมาอ่านทบทวนได้ทุกเมื่อ
                      </p>
                    </div>
                    {onOpenShortcuts && (
                      <button
                        onClick={onOpenShortcuts}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-[#EDEDF4] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Keyboard className="w-3.5 h-3.5 text-[#B794F6]" />
                        <span>ดูตารางคีย์ลัด</span>
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={7}
                    value={currentNoteText}
                    onChange={(e) => setCurrentNoteText(e.target.value)}
                    placeholder="พิมพ์จดบันทึกเทคนิคการตัดต่อ คีย์ลัด หรือจุดสำคัญที่ได้เรียนรู้จากคลิปนี้..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/15 text-xs sm:text-sm text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all font-mono leading-relaxed resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#9A9AB0]">
                      {currentNoteText.length} ตัวอักษร
                    </span>
                    <button
                      onClick={handleSaveCurrentNote}
                      className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {noteSaved ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{noteSaved ? 'บันทึกเรียบร้อยแล้ว' : 'บันทึกโน้ต'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleMarkDone(selectedLesson.id)}
                id="modal-mark-done-btn"
                className={`px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  completedLessons.includes(selectedLesson.id)
                    ? 'bg-[#34D399]/20 border-[#34D399] text-[#34D399]'
                    : 'border-white/20 text-[#EDEDF4] hover:bg-white/10'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{completedLessons.includes(selectedLesson.id) ? 'เรียนจบแล้ว (+20 XP)' : 'ทำเครื่องหมายว่าเรียนจบ'}</span>
              </button>

              <button
                onClick={handleNext}
                id="modal-next-lesson-btn"
                className="gradient-btn px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <span>บทถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

