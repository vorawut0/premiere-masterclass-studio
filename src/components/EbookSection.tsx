import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Download, 
  Share2, 
  Star, 
  Sliders, 
  Layers, 
  Volume2, 
  Palette, 
  Scissors, 
  FileText,
  Eye,
  Check
} from 'lucide-react';
import { EBOOK_CHAPTERS, EBOOK_METADATA } from '../data/ebookData';
import { EbookReaderModal } from './EbookReaderModal';

interface EbookSectionProps {
  onTriggerToast?: (msg: string) => void;
}

export const EbookSection: React.FC<EbookSectionProps> = ({ onTriggerToast }) => {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(EBOOK_CHAPTERS[0].id);

  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setIsReaderOpen(true);
  };

  const handleQuickDownloadSummary = () => {
    onTriggerToast?.('📥 กำลังเตรียมสรุปคัมภีร์ E-Book ฉบับย่อให้คุณ...');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <section id="ebook" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Premiere Pro Master Handbook — ฉบับสมบูรณ์</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          E-Book คัมภีร์ตัดต่อวิดีโอ <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
            ระดับมืออาชีพ 2026
          </span>
        </h2>

        <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          หนังสือคู่มือออนไลน์เล่มสมบูรณ์ ออกแบบเพื่อนักตัดต่อตั้งแต่ระดับเริ่มต้นจนถึงระดับภาพยนตร์
          ครอบคลุมการตั้งค่า Workspace, ศิลปะการตัด J-Cut/L-Cut, การเกรดสี Lumetri, การมิกซ์เสียง และคีย์ลัดเร่งสปีด
        </p>
      </div>

      {/* Hero Book Feature Card */}
      <div className="mb-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0E111B] to-[#17142A] border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left: 3D Open Book Spread Preview (หนังสือเปิดกางออก) */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              className="relative group cursor-pointer max-w-md w-full" 
              onClick={() => handleOpenChapter('chapter-1')}
              title="แตะเพื่อเปิดอ่านหนังสือแบบเปิด 2 หน้า"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-70 transition duration-500" />
              
              {/* The 3D Open Book Frame */}
              <div className="relative rounded-2xl sm:rounded-3xl border-2 border-purple-500/30 bg-[#161326] p-2 shadow-2xl overflow-hidden aspect-[16/11] flex">
                
                {/* Ribbon bookmark hanging down */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-12 bg-gradient-to-b from-purple-700 to-rose-600 z-30 shadow-lg rounded-b-sm">
                  <div className="absolute -bottom-1.5 left-0 right-0 h-2 bg-transparent border-t-[6px] border-t-rose-600 border-x-[10px] border-x-transparent" />
                </div>

                {/* Left Open Page */}
                <div className="flex-1 bg-[#FBF6ED] text-[#281D14] rounded-l-xl p-3 sm:p-4 flex flex-col justify-between relative shadow-inner border-r border-black/10 overflow-hidden">
                  <div className="space-y-1.5 relative z-10">
                    <span className="px-2 py-0.5 rounded-md bg-purple-600/90 text-white font-mono text-[9px] font-bold uppercase">
                      บทที่ 1
                    </span>
                    <h4 className="text-xs sm:text-sm font-black line-clamp-2 leading-tight text-[#281D14]">
                      Workspace & Performance
                    </h4>
                    <p className="text-[10px] text-[#634F3D] line-clamp-3 leading-relaxed">
                      การวางโครงสร้างระบบไฟล์ แคช และ Sequence ให้เครื่องประมวลผลเร็วที่สุดโดยไม่กระตุก...
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[9px] text-[#856D53] border-t border-[#EADBCA] pt-1.5 font-mono">
                    <span>หน้า 2</span>
                    <span className="text-purple-600 font-bold">● สันปกกลาง</span>
                  </div>
                </div>

                {/* Center Spine Gutter Shadow */}
                <div className="w-3 sm:w-4 bg-gradient-to-r from-black/40 via-black/20 to-black/40 relative z-20 shadow-lg flex items-center justify-center">
                  <div className="w-[1px] h-full bg-black/30" />
                </div>

                {/* Right Open Page */}
                <div className="flex-1 bg-[#FBF6ED] text-[#281D14] rounded-r-xl p-3 sm:p-4 flex flex-col justify-between relative shadow-inner border-l border-black/10 overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400">คีย์ลัดเร่งสปีด</span>
                      <span className="text-[9px] text-amber-600 font-bold">★ 4.98</span>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-black/10 aspect-[16/9] shadow-sm relative">
                      <img 
                        src={EBOOK_METADATA.coverImage} 
                        alt="Ebook Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="px-2 py-1 rounded-md bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-md">
                          <Eye className="w-3 h-3" />
                          เปิดอ่านหนังสือ
                        </span>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-md bg-[#F2E8D7] text-[9px] text-[#634F3D] font-mono flex items-center justify-between">
                      <span>Shortcut: ` (Tilde)</span>
                      <span className="text-purple-600 font-bold">เต็มจอ</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[9px] text-[#856D53] border-t border-[#EADBCA] pt-1.5 font-mono">
                    <span className="text-purple-600 font-bold">● สันปกกลาง</span>
                    <span>หน้า 3</span>
                  </div>
                </div>

              </div>

              <div className="text-center mt-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 group-hover:text-white transition-colors">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>คลิกเพื่อเปิดอ่านแบบหนังสือเปิด 2 หน้า (Interactive Flipbook)</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Right: Book Details, Stats & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>เปิดให้อ่านฟรี 100% สำหรับผู้เรียนในคอร์ส</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {EBOOK_METADATA.thaiTitle}
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                กลั่นกรองจากประสบการณ์การตัดต่อโปรดักชันจริง ถ่ายทอดเป็นลำดับขั้นตอนที่นำไปใช้ได้ทันที
                พร้อมสูตรสัดส่วน IRE สำหรับตรวจสีผิว และค่า Loudness Radar -14 LUFS สำหรับงาน YouTube
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">6</div>
                <div className="text-[11px] text-slate-400 mt-0.5">บทเรียนเจาะลึก</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">148</div>
                <div className="text-[11px] text-slate-400 mt-0.5">หน้าเนื้อหาเต็ม</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-pink-400 font-mono">25+</div>
                <div className="text-[11px] text-slate-400 mt-0.5">คีย์ลัดเร่งสปีด</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ฟรีไม่มีค่าใช้จ่าย</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleOpenChapter('chapter-1')}
                id="ebook-start-reading-btn"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>เปิดอ่าน E-Book ตอนนี้</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleQuickDownloadSummary}
                id="ebook-print-summary-btn"
                className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>พิมพ์/บันทึกสรุปย่อ</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-1">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                รองรับทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                ปรับขนาดตัวอักษรและสลับโหมดถนอมสายตาได้
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Chapters Grid: Explore all 6 chapters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">สารบัญทั้ง 6 บทเรียน</h3>
            <p className="text-xs text-[#94A3B8]">เลือกบทที่ต้องการอ่าน หรือเปิดตามลำดับ</p>
          </div>
          <button
            onClick={() => handleOpenChapter('chapter-1')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>เริ่มตั้งแต่บทที่ 1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EBOOK_CHAPTERS.map((chapter) => (
            <div 
              key={chapter.id}
              onClick={() => handleOpenChapter(chapter.id)}
              className="rounded-2xl bg-[#111422] border border-white/10 hover:border-purple-500/50 p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Chapter Thumbnail Image */}
                <div className="rounded-xl overflow-hidden aspect-[16/9] relative border border-white/10">
                  <img 
                    src={chapter.coverImage} 
                    alt={chapter.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-purple-300 font-mono text-[10px] font-bold">
                    บทที่ {chapter.chapterNumber}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 text-[10px] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{chapter.readTime}</span>
                  </div>
                </div>

                {/* Chapter Title & Subtitle */}
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {chapter.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1 leading-relaxed">
                    {chapter.subtitle}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {chapter.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-slate-300 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                <span>อ่านบทเรียนนี้</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      <EbookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        initialChapterId={selectedChapterId}
        onTriggerToast={onTriggerToast}
      />

    </section>
  );
};
