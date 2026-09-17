import React, { useState, useEffect } from 'react';

const SECTION_LABELS: Record<string, string> = {
  home: 'HOME',
  instructor: 'INSTRUCTOR',
  lessons: 'LESSONS',
  videos: 'VIDEOS',
  media: 'MEDIA',
  quiz: 'QUIZ',
  games: 'GAMES',
  workshop: 'WORKSHOP',
  blog: 'BLOG',
  dashboard: 'DASHBOARD',
  profile: 'PROFILE',
  contact: 'CONTACT'
};

export const ScrollScrubber: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentSection, setCurrentSection] = useState('HOME');
  const [timecode, setTimecode] = useState('00:00');

  useEffect(() => {
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100)) : 0;
      setScrollPercent(pct);

      const totalSec = Math.floor(pct * 3.9);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const ss = String(totalSec % 60).padStart(2, '0');
      setTimecode(`${mm}:${ss}`);

      const sections = Object.keys(SECTION_LABELS);
      for (let i = sections.length - 1; i >= 0; i--) {
        const secId = sections[i];
        const el = document.getElementById(secId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setCurrentSection(SECTION_LABELS[secId]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div id="scroll-scrubber" className="fixed top-0 left-0 right-0 h-[3px] z-[1100] bg-white/5 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] relative transition-all duration-75"
          style={{ width: `${scrollPercent}%` }}
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
        </div>
      </div>

      <div 
        id="scrub-readout" 
        className="fixed bottom-6 right-6 z-[800] font-mono text-xs text-[#9A9AB0] bg-black/60 dark:bg-black/70 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg pointer-events-none flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
        <span>{timecode}</span>
        <span className="text-white/40">|</span>
        <span className="text-[#B794F6] font-semibold">{currentSection}</span>
      </div>
    </>
  );
};
