import React, { useState } from 'react';
import { Search, Heart, Play, Clock, Eye, X, Sparkles, Filter, Youtube, ExternalLink } from 'lucide-react';
import { VideoItem } from '../types';
import { VIDEOS_DATA } from '../data/masterclassData';

interface VideosSectionProps {
  favVideos: number[];
  recentVideos: number[];
  onToggleFav: (id: number) => void;
  onWatchVideo: (id: number) => void;
}

export const VideosSection: React.FC<VideosSectionProps> = ({
  favVideos,
  recentVideos,
  onToggleFav,
  onWatchVideo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  const categories = ['ทั้งหมด', 'พื้นฐาน', 'ตัดต่อ', 'Shorts & AI', 'สี', 'เสียง', 'Motion', 'VFX', 'Workflow', 'Export'];

  const filteredVideos = VIDEOS_DATA.filter(video => {
    if (activeCategory !== 'ทั้งหมด' && video.cat !== activeCategory) return false;
    if (showOnlyFavs && !favVideos.includes(video.id)) return false;
    if (searchTerm && !video.title.toLowerCase().includes(searchTerm.toLowerCase()) && !video.cat.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleOpenVideo = (video: VideoItem) => {
    setPlayingVideo(video);
    onWatchVideo(video.id);
  };

  return (
    <section id="videos" className="py-20 relative">
      <div className="studio-container">
        {/* Section Header */}
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#B794F6] uppercase tracking-wider">
            <span className="w-4 h-px bg-[#B794F6]"></span>
            VIDEO TUTORIAL VAULT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">คลังวิดีโอเทคนิคพิเศษ {VIDEOS_DATA.length} ตอน</h2>
          <p className="text-sm text-[#9A9AB0]">คลิปเจาะลึกเทคนิคพิเศษ, AI Tools, Workflow มืออาชีพ และเคล็ดลับการตัดต่อแบบครบวงจร</p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#9A9AB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาวิดีโอ หัวข้อ หรือหมวดหมู่..."
              id="video-search-input"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9A9AB0] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Categories & Favorites Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat && !showOnlyFavs
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-md'
                    : 'glass-panel text-[#9A9AB0] hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setShowOnlyFavs(!showOnlyFavs)}
              id="video-fav-filter-btn"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                showOnlyFavs
                  ? 'bg-[#EC4899] text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  : 'glass-panel text-[#9A9AB0] hover:text-white hover:border-pink-500/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavs ? 'fill-current' : ''}`} />
              <span>รายการโปรด ({favVideos.length})</span>
            </button>
          </div>
        </div>

        {/* Recently Viewed Strip */}
        {recentVideos.length > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs font-mono text-[#B794F6] shrink-0">ดูล่าสุด:</span>
            <div className="flex items-center gap-2">
              {recentVideos.map(id => {
                const v = VIDEOS_DATA.find(x => x.id === id);
                if (!v) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleOpenVideo(v)}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs text-[#EDEDF4] whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Play className="w-2.5 h-2.5 fill-current text-[#B794F6]" />
                    <span>{v.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredVideos.map(video => {
            const isFav = favVideos.includes(video.id);
            const thumbUrl = video.youtubeId 
              ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
              : null;

            return (
              <div
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                id={`video-card-${video.id}`}
                className="glass-panel rounded-2xl overflow-hidden cursor-pointer card-interactive flex flex-col justify-between group relative"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] bg-gradient-to-br from-[#1E1638] to-[#0F172A] relative flex items-center justify-center border-b border-white/10 overflow-hidden">
                  {thumbUrl ? (
                    <img 
                      src={thumbUrl} 
                      alt={video.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&q=80";
                      }}
                    />
                  ) : null}

                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Play icon */}
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>

                  {/* YouTube Tag */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-red-400 backdrop-blur-xs flex items-center gap-1 border border-white/10">
                    <Youtube className="w-3 h-3 text-red-500" />
                    <span>CLIP</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFav(video.id);
                    }}
                    title={isFav ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer ${
                      isFav ? 'text-[#EC4899] bg-pink-500/20 border border-pink-500/30' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-[#22D3EE]" />
                    <span>{video.dur}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-[#B794F6] text-[10px] font-semibold border border-purple-500/20">
                        {video.cat}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B6B85] flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views || '10k+'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#EDEDF4] group-hover:text-[#B794F6] transition-colors line-clamp-1">
                      {video.title}
                    </h4>

                    {video.description && (
                      <p className="text-xs text-[#9A9AB0] line-clamp-2 mt-1">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl">
            <p className="text-sm text-[#9A9AB0]">ไม่พบวิดีโอที่ค้นหา ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        )}
      </div>

      {/* Video Player Modal with Real YouTube Embed */}
      {playingVideo && (
        <div 
          id="video-player-modal-backdrop"
          className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <div className="w-full max-w-4xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[92vh]">
            <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center border-b border-white/10 shrink-0">
              <button
                onClick={() => setPlayingVideo(null)}
                id="close-video-modal-btn"
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/80 border border-white/30 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {playingVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={playingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="text-center space-y-2 p-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center mx-auto text-white shadow-xl">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{playingVideo.title}</h3>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 bg-white/5 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[#B794F6] text-xs font-semibold">
                    {playingVideo.cat}
                  </span>
                  <span className="text-xs font-mono text-[#9A9AB0]">{playingVideo.dur}</span>
                  {playingVideo.instructor && (
                    <span className="text-xs text-purple-300 font-mono">By {playingVideo.instructor}</span>
                  )}
                </div>
                <h4 className="font-bold text-base text-[#EDEDF4]">{playingVideo.title}</h4>
                <p className="text-xs text-[#9A9AB0] mt-0.5">{playingVideo.description || 'วิดีโอสอนเทคนิคพิเศษ Premiere Pro'}</p>
              </div>

              <div className="flex items-center gap-2.5">
                {playingVideo.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${playingVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-semibold flex items-center gap-1.5 transition-all text-xs"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>เปิดดูบน YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  onClick={() => onToggleFav(playingVideo.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    favVideos.includes(playingVideo.id)
                      ? 'bg-[#EC4899] text-white shadow-md'
                      : 'glass-panel text-[#EDEDF4] hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favVideos.includes(playingVideo.id) ? 'fill-current' : ''}`} />
                  <span>{favVideos.includes(playingVideo.id) ? 'บันทึกแล้ว' : 'บันทึก'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

