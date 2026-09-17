import React, { useState } from 'react';
import { 
  Move, 
  Check, 
  Sparkles, 
  Sliders, 
  Film, 
  Volume2, 
  RotateCcw,
  Scissors
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface DndTermsGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface TermItem {
  id: string;
  term: string;
  badge: string;
  def: string;
  hint: string;
  icon: any;
}

const ALL_TERMS: TermItem[] = [
  {
    id: 'ripple',
    term: 'Ripple Edit (B)',
    badge: 'Timeline Tool',
    def: 'เลื่อนคลิปข้างเคียงมาชิดอัตโนมัติเมื่อตัด ไม่ให้เกิดช่องว่างว่างเปล่า (Gap)',
    hint: 'ใช้บ่อยสุดตอนตัดต่อเพื่อความรวดเร็ว',
    icon: Scissors
  },
  {
    id: 'lumetri',
    term: 'Lumetri Color',
    badge: 'Color Panel',
    def: 'พาเนลปรับแก้ White Balance, Curves, วงล้อสี Color Wheels และย้อมโทนภาพยนตร์',
    hint: 'เครื่องมือมาตรฐานงานเกรดสี',
    icon: Sliders
  },
  {
    id: 'ultra',
    term: 'Ultra Key',
    badge: 'Keying Effect',
    def: 'เอฟเฟกต์เจาะฉากหลังสีเขียว (Green Screen) ดูดสีฉากหลังออกอย่างเนียนตา',
    hint: 'อยู่ในหมวด Video Effects > Keying',
    icon: Sparkles
  },
  {
    id: 'essential_sound',
    term: 'Essential Sound',
    badge: 'Audio Panel',
    def: 'พาเนลจัดการระดับความดังเสียง มิกซ์ Dialogue และทำ Auto-Ducking เบาเสียงเพลงเบื้องหลัง',
    hint: 'ช่วยให้เสียงพูดเด่นชัดอัตโนมัติ',
    icon: Volume2
  },
  {
    id: 'rolling',
    term: 'Rolling Edit (N)',
    badge: 'Timeline Tool',
    def: 'ปรับเลื่อนจุดรอยต่อ (Cut Point) ระหว่าง 2 คลิปพร้อมกันโดยความยาวรวมของคลิปไม่เปลี่ยน',
    hint: 'ปรับจังหวะชนคลิปโดยไม่ขยับไทม์ไลน์',
    icon: Film
  }
];

export const DndTermsGame: React.FC<DndTermsGameProps> = ({ onComplete, onScoreUpdate }) => {
  const [terms, setTerms] = useState<TermItem[]>(ALL_TERMS);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [draggedTermId, setDraggedTermId] = useState<string | null>(null);
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);

  const handleMatchAttempt = (termId: string, slotId: string) => {
    if (termId === slotId) {
      // MATCH!
      gameAudio.playCorrect();
      const updated = [...matchedIds, termId];
      setMatchedIds(updated);
      setSelectedTermId(null);
      setDraggedTermId(null);
      setHoveredSlotId(null);

      const score = updated.length * 20;
      onScoreUpdate(score);

      if (updated.length === terms.length) {
        gameAudio.playVictory();
        onComplete(score);
      }
    } else {
      // MISMATCH
      gameAudio.playWrong();
      setSelectedTermId(null);
      setDraggedTermId(null);
      setHoveredSlotId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTermId(id);
    gameAudio.playClick();
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData('text/plain') || draggedTermId;
    if (droppedId) {
      handleMatchAttempt(droppedId, slotId);
    }
  };

  const handleReset = () => {
    setMatchedIds([]);
    setSelectedTermId(null);
    setDraggedTermId(null);
    onScoreUpdate(0);
  };

  const remainingTerms = terms.filter(t => !matchedIds.includes(t.id));

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">จับคู่สำเร็จ:</span>
          <span className="text-[#34D399] font-bold">{matchedIds.length} / {terms.length} รายการ</span>
        </div>
        <div className="text-[11px] text-[#A78BFA] hidden sm:block">
          💡 ลากการ์ดคำศัพท์ หรือคลิกเลือกคำศัพท์แล้วคลิกกล่องคำอธิบาย
        </div>
        <button
          onClick={handleReset}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px] flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>รีเซ็ต</span>
        </button>
      </div>

      {/* Draggable Terms Pool */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 min-h-[56px] flex flex-wrap gap-2 items-center justify-center">
        {remainingTerms.length > 0 ? (
          remainingTerms.map(t => {
            const IconComp = t.icon;
            const isSelected = selectedTermId === t.id;

            return (
              <div
                key={t.id}
                draggable={true}
                onDragStart={e => handleDragStart(e, t.id)}
                onClick={() => {
                  gameAudio.playClick();
                  setSelectedTermId(prev => (prev === t.id ? null : t.id));
                }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-grab active:cursor-grabbing transition-all select-none shadow-md ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-300 scale-105 ring-2 ring-purple-400'
                    : 'bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white border-white/15 hover:scale-102'
                }`}
              >
                <IconComp className="w-4 h-4 text-[#A78BFA]" />
                <span>{t.term}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 font-mono opacity-80">
                  {t.badge}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 py-1">
            <Check className="w-4 h-4" />
            <span>คุณจับคู่คำศัพท์การตัดต่อครบทุกรายการแล้ว!</span>
          </div>
        )}
      </div>

      {/* Target Definition Slots */}
      <div className="space-y-2.5">
        {terms.map(t => {
          const isMatched = matchedIds.includes(t.id);
          const isHovered = hoveredSlotId === t.id;

          return (
            <div
              key={t.id}
              onDragOver={e => {
                e.preventDefault();
                setHoveredSlotId(t.id);
              }}
              onDragLeave={() => setHoveredSlotId(null)}
              onDrop={e => handleDrop(e, t.id)}
              onClick={() => {
                if (selectedTermId && !isMatched) {
                  handleMatchAttempt(selectedTermId, t.id);
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all duration-200 relative ${
                isMatched
                  ? 'bg-emerald-500/15 border-emerald-400/40 text-white'
                  : isHovered
                  ? 'bg-purple-500/20 border-purple-400 scale-[1.01] shadow-lg ring-1 ring-purple-400'
                  : selectedTermId
                  ? 'bg-purple-500/5 hover:bg-purple-500/15 border-dashed border-purple-400/40 cursor-pointer'
                  : 'bg-white/5 border-white/10 text-white/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded">
                      หน้าที่ / คุณสมบัติ
                    </span>
                    <span className="text-[10px] text-[#A78BFA]">{t.hint}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed">
                    {t.def}
                  </p>
                </div>

                {isMatched ? (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t.term}</span>
                  </div>
                ) : (
                  <div className="w-24 sm:w-28 h-8 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[10px] font-mono text-[#94A3B8] shrink-0 bg-black/20">
                    วางคำศัพท์ที่นี่
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
