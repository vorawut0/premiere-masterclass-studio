import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  MousePointer, 
  Palette, 
  Sparkles, 
  Key, 
  MapPin, 
  RotateCcw, 
  Share2,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface MemoryMatchGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface CardItem {
  id: number;
  pairId: number;
  label: string;
  sublabel: string;
  icon: any;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARDS_DATA = [
  { pairId: 1, label: 'Razor Tool (C)', sublabel: 'ตัดแบ่งคลิป', icon: Scissors, color: 'from-blue-500 to-cyan-500' },
  { pairId: 2, label: 'Selection (V)', sublabel: 'เลือก/เลื่อนคลิป', icon: MousePointer, color: 'from-indigo-500 to-purple-500' },
  { pairId: 3, label: 'Lumetri Color', sublabel: 'เกรดสีย้อมโทน', icon: Palette, color: 'from-amber-500 to-rose-500' },
  { pairId: 4, label: 'Ultra Key', sublabel: 'เจาะฉากเขียว', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
  { pairId: 5, label: 'Keyframe', sublabel: 'แอนิเมชันจุดขยับ', icon: Key, color: 'from-fuchsia-500 to-pink-500' },
  { pairId: 6, label: 'Marker (M)', sublabel: 'มาร์กจังหวะบีต', icon: MapPin, color: 'from-red-500 to-orange-500' },
  { pairId: 7, label: 'Ripple Edit (B)', sublabel: 'ตัดเลื่อนคลิปชิด', icon: RotateCcw, color: 'from-purple-500 to-indigo-500' },
  { pairId: 8, label: 'Export (Ctrl+M)', sublabel: 'ส่งออกไฟล์วิดีโอ', icon: Share2, color: 'from-cyan-500 to-blue-600' }
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete, onScoreUpdate }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [mismatchedIds, setMismatchedIds] = useState<number[]>([]);

  const setupDeck = () => {
    const deck: CardItem[] = [];
    let idCounter = 0;

    CARDS_DATA.forEach(item => {
      // Add first card of pair
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        label: item.label,
        sublabel: item.sublabel,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false
      });
      // Add second card of pair
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        label: item.label,
        sublabel: item.sublabel,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle deck
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setMismatchedIds([]);
  };

  useEffect(() => {
    setupDeck();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedIds.length >= 2) return;
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    gameAudio.playCardFlip();

    const newDeck = cards.map(c => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(newDeck);
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = newDeck.find(c => c.id === firstId)!;
      const second = newDeck.find(c => c.id === secondId)!;

      if (first.pairId === second.pairId) {
        // MATCH!
        setTimeout(() => {
          gameAudio.playCorrect();
          setCards(prev =>
            prev.map(c => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setFlippedIds([]);
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);

          const calculatedScore = Math.max(10, newMatched * 15 - Math.floor(moves * 1.5));
          onScoreUpdate(calculatedScore);

          if (newMatched === CARDS_DATA.length) {
            gameAudio.playVictory();
            onComplete(calculatedScore);
          }
        }, 350);
      } else {
        // MISMATCH
        setTimeout(() => {
          gameAudio.playWrong();
          setMismatchedIds([firstId, secondId]);

          setTimeout(() => {
            setCards(prev =>
              prev.map(c => (newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c))
            );
            setFlippedIds([]);
            setMismatchedIds([]);
          }, 600);
        }, 400);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">เปิดคู่สำเร็จ:</span>
          <span className="text-[#34D399] font-bold">{matchedCount} / {CARDS_DATA.length} คู่</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">จำนวนครั้งที่เปิด:</span>
          <span className="text-white font-bold">{moves} ครั้ง</span>
        </div>
        <button
          onClick={setupDeck}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px] flex items-center gap-1"
          title="สลับการ์ดใหม่"
        >
          <RotateCcw className="w-3 h-3" />
          <span>เริ่มใหม่</span>
        </button>
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map(card => {
          const IconComp = card.icon;
          const isError = mismatchedIds.includes(card.id);
          const showFace = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || card.isFlipped}
              className={`aspect-square rounded-2xl p-1.5 flex flex-col items-center justify-center transition-all duration-300 relative cursor-pointer border select-none ${
                card.isMatched
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 scale-95 opacity-90'
                  : isError
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                  : showFace
                  ? `bg-gradient-to-tr ${card.color} text-white border-white/30 shadow-lg scale-100`
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/40 hover:scale-105 active:scale-95'
              }`}
            >
              {showFace ? (
                <div className="flex flex-col items-center justify-center text-center p-1">
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6 mb-1 filter drop-shadow" />
                  <span className="text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-1">
                    {card.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] opacity-80 leading-tight hidden sm:block">
                    {card.sublabel}
                  </span>
                  {card.isMatched && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/30">
                  <HelpCircle className="w-6 h-6" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-[#94A3B8]">
        คลิกเปิดการ์ดเพื่อจับคู่คีย์ลัดและฟังก์ชันตัดต่อที่เหมือนกันให้ครบทั้ง 8 คู่
      </p>
    </div>
  );
};
