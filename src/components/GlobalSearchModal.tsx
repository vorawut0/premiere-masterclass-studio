import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Film, FolderDown, Briefcase, FileText, ArrowRight } from 'lucide-react';
import { LESSONS_DATA, VIDEOS_DATA, MEDIA_CATEGORIES, WORKSHOP_DATA, BLOG_DATA } from '../data/masterclassData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (id: number) => void;
  onSelectVideo: (id: number) => void;
  onSelectBlog: (id: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectVideo,
  onSelectBlog
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle search
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const results = {
    lessons: q ? LESSONS_DATA.filter(l => l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)) : [],
    videos: q ? VIDEOS_DATA.filter(v => v.title.toLowerCase().includes(q) || v.cat.toLowerCase().includes(q)) : [],
    media: q ? MEDIA_CATEGORIES.filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)) : [],
    workshops: q ? WORKSHOP_DATA.filter(w => w.title.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q)) : [],
    blogs: q ? BLOG_DATA.filter(b => b.title.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q)) : []
  };

  const totalResults = results.lessons.length + results.videos.length + results.media.length + results.workshops.length + results.blogs.length;

  return (
    <div 
      id="global-search-modal"
      className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <Search className="w-5 h-5 text-[#B794F6] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาบทเรียน, วิดีโอ, LUTs, เวิร์กช็อป, หรือบทความ..."
            autoFocus
            id="global-search-input"
            className="w-full bg-transparent text-sm sm:text-base text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="text-xs text-[#9A9AB0] hover:text-white"
            >
              ✕
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          {q ? (
            totalResults > 0 ? (
              <div className="space-y-4">
                {/* Lessons */}
                {results.lessons.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#B794F6] uppercase font-semibold">บทเรียน ({results.lessons.length})</span>
                    {results.lessons.map(l => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onSelectLesson(l.id);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                          <span className="font-semibold text-[#EDEDF4]">{l.title}</span>
                          <span className="text-[10px] text-[#6B6B85] font-mono">({l.dur})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9A9AB0]" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos */}
                {results.videos.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#3B82F6] uppercase font-semibold">วิดีโอ ({results.videos.length})</span>
                    {results.videos.map(v => (
                      <div
                        key={v.id}
                        onClick={() => {
                          onSelectVideo(v.id);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <Film className="w-4 h-4 text-[#3B82F6] shrink-0" />
                          <span className="font-semibold text-[#EDEDF4]">{v.title}</span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[10px] text-[#B794F6]">{v.cat}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9A9AB0]" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Media */}
                {results.media.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#34D399] uppercase font-semibold">สื่อการเรียน ({results.media.length})</span>
                    {results.media.map(m => (
                      <a
                        key={m.id}
                        href="#media"
                        onClick={onClose}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-all block"
                      >
                        <div className="flex items-center gap-2.5">
                          <FolderDown className="w-4 h-4 text-[#34D399] shrink-0" />
                          <span className="font-semibold text-[#EDEDF4]">{m.name}</span>
                          <span className="text-[10px] text-[#6B6B85] font-mono">({m.count} ไฟล์ • .{m.ext})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9A9AB0]" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Workshops */}
                {results.workshops.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold">เวิร์กช็อป ({results.workshops.length})</span>
                    {results.workshops.map(w => (
                      <a
                        key={w.id}
                        href="#workshop"
                        onClick={onClose}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-all block"
                      >
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="font-semibold text-[#EDEDF4]">{w.title}</span>
                          <span className="text-[10px] text-[#6B6B85] font-mono">({w.difficulty})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9A9AB0]" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Blogs */}
                {results.blogs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#F472B6] uppercase font-semibold">บทความ ({results.blogs.length})</span>
                    {results.blogs.map(b => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onSelectBlog(b.id);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-[#F472B6] shrink-0" />
                          <span className="font-semibold text-[#EDEDF4]">{b.title}</span>
                          <span className="text-[10px] text-[#6B6B85] font-mono">({b.readTime})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9A9AB0]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-[#9A9AB0]">
                ไม่พบผลลัพธ์ที่ตรงกับ "<span className="text-white">{query}</span>"
              </div>
            )
          ) : (
            <div className="py-6 text-center space-y-2 text-xs text-[#6B6B85]">
              <p>ลองพิมพ์ค้นหา เช่น <b>"Lumetri"</b>, <b>"Cutting"</b>, <b>"LUTs"</b>, <b>"Audio"</b>, หรือ <b>"Export"</b></p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Lumetri', 'Keyframe', 'Ultra Key', 'Audio', 'Shortcuts', 'Vlog', 'Export'].map(k => (
                  <button
                    key={k}
                    onClick={() => setQuery(k)}
                    className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-[#9A9AB0] hover:text-white transition-all cursor-pointer"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
