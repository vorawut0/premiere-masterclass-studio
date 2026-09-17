import React, { useState, useEffect } from 'react';
import { Film, Eye, RotateCcw, Check, Sparkles } from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface SlidingPuzzleGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface TileInfo {
  num: number;
  title: string;
  emoji: string;
}

const STORY_TILES: Record<number, TileInfo> = {
  1: { num: 1, title: 'Opening Wide', emoji: '🎬' },
  2: { num: 2, title: 'Actor Walk In', emoji: '🚶' },
  3: { num: 3, title: 'Close-Up Face', emoji: '👤' },
  4: { num: 4, title: 'Dialogue Shot', emoji: '💬' },
  5: { num: 5, title: 'Action Climax', emoji: '💥' },
  6: { num: 6, title: 'Sunset B-Roll', emoji: '🌅' },
  7: { num: 7, title: 'Drive Away', emoji: '🚗' },
  8: { num: 8, title: 'Final Fade', emoji: '✨' }
};

export const SlidingPuzzleGame: React.FC<SlidingPuzzleGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [board, setBoard] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState(0);
  const [showGoal, setShowGoal] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Generate 100% SOLVABLE puzzle by starting from solved state and taking legal random walks
  const shuffleBoard = () => {
    let currentBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let emptyIdx = 8;
    let lastMoved = -1;

    // Perform 30 random valid slide moves
    for (let step = 0; step < 30; step++) {
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      const neighbors: number[] = [];

      if (row > 0) neighbors.push(emptyIdx - 3); // Up
      if (row < 2) neighbors.push(emptyIdx + 3); // Down
      if (col > 0) neighbors.push(emptyIdx - 1); // Left
      if (col < 2) neighbors.push(emptyIdx + 1); // Right

      // Exclude immediately undoing last move to ensure good dispersal
      const validNeighbors = neighbors.filter(n => n !== lastMoved);
      const targetIdx = validNeighbors[Math.floor(Math.random() * validNeighbors.length)] ?? neighbors[0];

      currentBoard[emptyIdx] = currentBoard[targetIdx];
      currentBoard[targetIdx] = 0;
      lastMoved = emptyIdx;
      emptyIdx = targetIdx;
    }

    setBoard(currentBoard);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    shuffleBoard();
  }, []);

  const handleTileClick = (idx: number) => {
    if (isWon) return;
    const emptyIdx = board.indexOf(0);

    const rowClicked = Math.floor(idx / 3);
    const colClicked = idx % 3;
    const rowEmpty = Math.floor(emptyIdx / 3);
    const colEmpty = emptyIdx % 3;

    const isAdjacent =
      (Math.abs(rowClicked - rowEmpty) === 1 && colClicked === colEmpty) ||
      (Math.abs(colClicked - colEmpty) === 1 && rowClicked === rowEmpty);

    if (isAdjacent) {
      gameAudio.playSlide();
      const newBoard = [...board];
      newBoard[emptyIdx] = newBoard[idx];
      newBoard[idx] = 0;

      setBoard(newBoard);
      const newMoves = moves + 1;
      setMoves(newMoves);

      // Check win condition [1, 2, 3, 4, 5, 6, 7, 8, 0]
      const won = newBoard.slice(0, 8).every((val, i) => val === i + 1);
      if (won) {
        setIsWon(true);
        gameAudio.playVictory();
        const score = Math.max(30, 100 - Math.floor(newMoves * 1.5));
        onScoreUpdate(score);
        setTimeout(() => {
          onComplete(score);
        }, 600);
      }
    } else {
      gameAudio.playWrong();
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#94A3B8]">จำนวนครั้งที่เลื่อน:</span>
          <span className="text-[#34D399] font-bold">{moves} ครั้ง</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGoal(prev => !prev)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px] flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>{showGoal ? 'ซ่อนเป้าหมาย' : 'ดูเป้าหมาย'}</span>
          </button>
          <button
            onClick={shuffleBoard}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px] flex items-center gap-1"
            title="สลับช็อตใหม่"
          >
            <RotateCcw className="w-3 h-3" />
            <span>สลับใหม่</span>
          </button>
        </div>
      </div>

      {/* Goal Preview Overlay if toggled */}
      {showGoal && (
        <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2 animate-in fade-in">
          <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
            <Film className="w-4 h-4 text-purple-400" />
            <span>ลำดับช็อตที่ถูกต้อง (1 ถึง 8):</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono text-white/90">
            {Object.values(STORY_TILES).map(t => (
              <div key={t.num} className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                <span>{t.emoji} {t.num}. {t.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3x3 Puzzle Board */}
      <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto p-3 rounded-3xl bg-black/50 border border-white/15 shadow-2xl">
        {board.map((val, idx) => {
          if (val === 0) {
            return (
              <div
                key={idx}
                className="aspect-square rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-[10px] font-mono text-white/20"
              >
                ว่าง
              </div>
            );
          }

          const tileInfo = STORY_TILES[val];

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className="aspect-square rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white p-2 flex flex-col items-center justify-between shadow-lg shadow-purple-500/20 cursor-pointer active:scale-95 transition-all border border-white/20 select-none group"
            >
              <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
                  {val}
                </span>
                <span className="text-sm group-hover:scale-110 transition-transform">
                  {tileInfo?.emoji}
                </span>
              </div>
              <span className="text-[10px] font-bold leading-tight line-clamp-1 opacity-90">
                {tileInfo?.title}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[#94A3B8]">
        คลิกที่ช่องติดกับช่องว่างเพื่อเลื่อนช็อตฟุตเทจเรียงลำดับ 1 ถึง 8 ให้ถูกต้อง (รับประกันเล่นผ่านได้ 100%)
      </p>
    </div>
  );
};
