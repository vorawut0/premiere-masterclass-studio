import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  X, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  User, 
  Copy, 
  Check,
  Tag
} from 'lucide-react';
import { BLOG_DATA } from '../data/masterclassData';
import { BlogPost } from '../types';

export const BlogSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const categories = ['ทั้งหมด', 'Premiere Tips', 'Color', 'Audio', 'Plugins', 'AI', 'Workflow'];

  const filteredPosts = activeCategory === 'ทั้งหมด'
    ? BLOG_DATA
    : BLOG_DATA.filter(p => p.cat === activeCategory);

  const handleCopySummary = (post: BlogPost) => {
    const summaryText = `📌 ${post.title}\nหมวดหมู่: ${post.cat} | อ่าน: ${post.readTime}\n\n💡 Key Takeaway:\n${post.highlight}\n\n${post.practicalFormula ? '⚡ สูตรและค่ามาตรฐาน:\n' + post.practicalFormula.map(f => `• ${f.label}: ${f.value} (${f.note || ''})`).join('\n') : ''}`;
    navigator.clipboard.writeText(summaryText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2200);
  };

  return (
    <section id="blog" className="py-20 relative bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="studio-container">
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#B794F6] uppercase tracking-wider">
            <span className="w-4 h-px bg-[#B794F6]"></span>
            EDITOR'S KNOWLEDGE VAULT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">บทความและบันทึกจากห้องตัด</h2>
          <p className="text-sm text-[#9A9AB0] max-w-2xl">
            สรุปสูตรลับ เวิร์กโฟลว์ ค่าตัวเลขมาตรฐาน และเทคนิคระดับโปรสำหรับนักตัดต่อมืออาชีพ
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-lg shadow-purple-500/20 font-semibold'
                  : 'glass-panel text-[#9A9AB0] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Cards Grid with Beautiful Cover Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              onClick={() => setReadingPost(post)}
              id={`blog-card-${post.id}`}
              className="glass-panel rounded-2xl overflow-hidden cursor-pointer card-interactive flex flex-col justify-between border border-white/10 hover:border-purple-500/40 group shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div>
                {/* Beautiful Photo Cover with gradient overlay */}
                <div className="h-44 sm:h-48 relative overflow-hidden bg-slate-900">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#20153D] via-[#14122E] to-[#0A0A18]" />
                  )}
                  
                  {/* Subtle Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1b] via-[#0d0d1b]/40 to-black/25" />

                  {/* Badges on Cover Image */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[#B794F6] font-semibold text-[11px] border border-white/15 shadow-sm">
                      {post.cat}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      <Clock className="w-3 h-3 text-[#B794F6]" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Date on bottom right of cover */}
                  <div className="absolute bottom-2.5 right-3 text-[11px] font-mono text-white/80 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9A9AB0]" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base text-[#EDEDF4] group-hover:text-[#B794F6] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-[#9A9AB0] line-clamp-2 leading-relaxed">
                    {post.highlight}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#9A9AB0] border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#B794F6] group-hover:text-white transition-colors">
                  <span>อ่านบทความเจาะลึก</span>
                  <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-[#8B5CF6] flex items-center justify-center transition-all group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rich Blog Article Reader Modal */}
      {readingPost && (
        <div 
          id="blog-modal-backdrop"
          className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div className="w-full max-w-3xl glass-panel-strong border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Cover Image Header */}
            <div className="relative h-48 sm:h-64 bg-slate-900 shrink-0 overflow-hidden">
              {readingPost.coverImage && (
                <img
                  src={readingPost.coverImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d22] via-[#0f0d22]/70 to-black/40" />

              {/* Close Button */}
              <button
                onClick={() => setReadingPost(null)}
                id="close-blog-modal-btn"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
                title="ปิด"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Meta Header Inside Image */}
              <div className="absolute bottom-4 inset-x-5 sm:inset-x-6 z-10 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-bold shadow-md">
                    {readingPost.cat}
                  </span>
                  <span className="text-xs font-mono text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-[#B794F6]" />
                    {readingPost.readTime}
                  </span>
                  <span className="text-xs font-mono text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <Calendar className="w-3.5 h-3.5 text-[#9A9AB0]" />
                    {readingPost.date}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                  {readingPost.title}
                </h2>

                {readingPost.author && (
                  <div className="flex items-center gap-2 text-xs text-[#CBD5E1] pt-1">
                    <div className="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-[#B794F6]">
                      <User className="w-3 h-3" />
                    </div>
                    <span>{readingPost.author}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body with Rich Practical Knowledge */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-[#EDEDF4] leading-relaxed">
              
              {/* Highlight / Key Takeaway Callout */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-[#EDEDF4] flex items-start gap-3 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#B794F6] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#B794F6] mb-1 font-mono">
                    Key Principle • หัวใจสำคัญ
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-normal">
                    {readingPost.highlight}
                  </p>
                </div>
              </div>

              {/* Practical Formula Table (If available) */}
              {readingPost.practicalFormula && readingPost.practicalFormula.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#38BDF8] uppercase tracking-wider">
                    <Sliders className="w-4 h-4 text-[#38BDF8]" />
                    <span>สูตรคำนวณ & ค่าตัวเลขมาตรฐาน (Industry Cheat-Sheet)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {readingPost.practicalFormula.map((formula, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-500/30 transition-colors">
                        <div className="text-xs text-[#94A3B8] font-medium">{formula.label}</div>
                        <div className="text-sm font-mono font-bold text-[#38BDF8] mt-1">{formula.value}</div>
                        {formula.note && (
                          <div className="text-[11px] text-[#A78BFA] mt-1 italic">{formula.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Workflow (If available) */}
              {readingPost.keySteps && readingPost.keySteps.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#34D399] uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                    <span>ขั้นตอนการปฏิบัติแบบ Step-by-Step</span>
                  </div>
                  <div className="space-y-2.5">
                    {readingPost.keySteps.map((step) => (
                      <div key={step.stepNumber} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-[#34D399] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="font-bold text-sm text-[#F1F5F9]">{step.title}</h5>
                            {step.shortcut && (
                              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/40 text-[#FACC15] border border-amber-500/20">
                                ⌨️ {step.shortcut}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#94A3B8] leading-relaxed whitespace-pre-line">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tips Section */}
              {readingPost.proTips && readingPost.proTips.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>เคล็ดลับระดับสตูดิโอ (Pro Tips)</span>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {readingPost.proTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mistakes to Avoid Section */}
              {readingPost.mistakesToAvoid && readingPost.mistakesToAvoid.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>ข้อผิดพลาดที่พบบ่อยและควรหลีกเลี่ยง (Common Mistakes)</span>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {readingPost.mistakesToAvoid.map((mistake, idx) => (
                      <li key={idx} className="text-xs text-rose-200/90 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main Extended Text Content */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <h4 className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#B794F6]" />
                  <span>บทวิเคราะห์เชิงลึกจากผู้เชี่ยวชาญ</span>
                </h4>
                <div className="whitespace-pre-line text-xs sm:text-sm text-[#CBD5E1] leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 font-sans">
                  {readingPost.content}
                </div>
              </div>

              {/* Tags List */}
              {readingPost.tags && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-[#6B6B85] flex items-center gap-1 font-mono">
                    <Tag className="w-3 h-3" /> แท็ก:
                  </span>
                  {readingPost.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-[#B794F6] border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleCopySummary(readingPost)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                title="คัดลอกสรุปย่อและสูตรสำคัญ"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'คัดลอกสรุปแล้ว!' : 'คัดลอกสรุป & ค่ามาตรฐาน'}</span>
              </button>

              <button
                onClick={() => setReadingPost(null)}
                className="gradient-btn px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

