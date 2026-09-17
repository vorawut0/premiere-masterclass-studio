import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  RotateCcw, 
  X, 
  Layers, 
  Palette, 
  Share2, 
  Zap, 
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  Activity,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MINIGAMES_DATA } from '../data/masterclassData';
import { MinigameInfo, GameScoreRecord } from '../types';
import { gameAudio } from '../utils/gameAudio';

// Import all 6 Interactive Studio games & game over modal
import { BeatCutterGame } from './games/BeatCutterGame';
import { LumetriColorLabGame } from './games/LumetriColorLabGame';
import { AudioMixerGame } from './games/AudioMixerGame';
import { KeyframeCurvesGame } from './games/KeyframeCurvesGame';
import { TimelineRushGame } from './games/TimelineRushGame';
import { ExportTycoonGame } from './games/ExportTycoonGame';
import { GameOverModal } from './games/GameOverModal';

interface GamesSectionProps {
  gameScores: Record<string, GameScoreRecord[]>;
  onFinishGame: (gameId: string, score: number, timeSec: number) => void;
  onTriggerToast: (msg: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Music,
  Palette,
  Activity,
  Sparkles,
  Zap,
  Share2,
  Gamepad2,
  Layers,
  Sliders: Activity
};

export const GamesSection: React.FC<GamesSectionProps> = ({
  gameScores,
  onFinishGame,
  onTriggerToast
}) => {
  const [activeGame, setActiveGame] = useState<MinigameInfo | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [gameInstanceKey, setGameInstanceKey] = useState(0);

  const timerRef = useRef<any>(null);

  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    gameAudio.enabled = !nextState;
  };

  const openGame = (game: MinigameInfo) => {
    setActiveGame(game);
    setCurrentScore(0);
    setSeconds(0);
    setGameFinished(false);
    setGameInstanceKey(prev => prev + 1);

    gameAudio.playClick();

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const closeGame = () => {
    clearInterval(timerRef.current);
    setActiveGame(null);
    setGameFinished(false);
  };

  const restartCurrentGame = () => {
    setCurrentScore(0);
    setSeconds(0);
    setGameFinished(false);
    setGameInstanceKey(prev => prev + 1);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const handleEndGame = (finalScore: number) => {
    clearInterval(timerRef.current);
    setCurrentScore(finalScore);
    setGameFinished(true);

    if (activeGame) {
      onFinishGame(activeGame.id, finalScore, seconds);
      onTriggerToast(`🎉 เกมจบแล้ว! คุณได้ ${finalScore} คะแนน (+${finalScore} XP)`);

      if (finalScore >= 50) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Get current personal best
  const currentBest = activeGame && gameScores[activeGame.id]?.length
    ? Math.max(...gameScores[activeGame.id].map(s => s.score))
    : 0;

  return (
    <section id="games" className="py-20 relative bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="studio-container">
        {/* Section Header */}
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 uppercase tracking-wider font-semibold">
            <span className="w-4 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"></span>
            PRO STUDIO • INTERACTIVE SKILLS & RHYTHM SUITE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            <span className="text-gradient">เกมจำลองสตูดิโอตัดต่อ</span> & มินิเกมฝึกทักษะระดับโปร
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
            ยกระดับทักษะ Premiere Pro ด้วยชุดเกมจำลองสตูดิโอและริธึมเกมแบบ Interactive: สับคลิปตามจังหวะบีทเพลง, เกรดสีด้วย Lumetri Scopes, มิกซ์เสียงมาตรฐานบรอดแคสต์, ดัดกราฟคีย์เฟรม Bezier Curve, และกู้วิกฤตไทม์ไลน์ 60 FPS
          </p>
        </div>

        {/* Featured Flagship Game Hero Card 1: BEAT CUTTER */}
        <div 
          onClick={() => {
            const beatGame = MINIGAMES_DATA.find(g => g.id === 'beat_cutter');
            if (beatGame) openGame(beatGame);
          }}
          id="featured-beat-cutter-hero-card"
          className="relative mb-8 overflow-hidden rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-950/50 via-[#100E22]/90 to-purple-950/60 p-6 sm:p-8 cursor-pointer group shadow-[0_10px_40px_rgba(236,72,153,0.2)] hover:border-pink-400 hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-300"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/30 transition-all" />
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>★ NEW: RHYTHM SLICER GAME ★</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-400/40">
                  🎵 60 FPS AUDIO SLICER
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/30">
                  ⚡ SHORTCUTS: Q • W • C • SPACE
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-300 via-purple-200 group-hover:to-cyan-300 transition-all">
                  BEAT CUTTER: RHYTHM SLICER
                </h3>
                <div className="font-mono text-xs sm:text-sm text-pink-400 tracking-widest uppercase font-bold mt-0.5">
                  RETRO-FUTURISTIC AUDIO-VISUAL SLICER
                </div>
              </div>

              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                ฝึกจังหวะการตัดต่อ (Cutting on the Beat) ตามโน้ตดนตรี Synthwave และ Lo-Fi! สับคัตหัวคลิปด้วย <strong className="text-cyan-300">Q</strong>, ท้ายคลิปด้วย <strong className="text-emerald-300">W</strong>, สับใบมีดด้วย <strong className="text-purple-300">C</strong>, และดรอปบีทด้วย <strong className="text-pink-300">SPACEBAR</strong> พร้อมระบบเสียงสังเคราะห์ Web Audio สดและกราฟิกคลื่นเสียง Real-time
              </p>

              {/* Lane Keys preview */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-mono">
                <span className="text-slate-400 mr-1">ปุ่มควบคุม:</span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">Q (Ripple In)</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">W (Ripple Out)</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">C (Razor Blade)</span>
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold">SPACE (Beat Drop)</span>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="flex flex-col items-center gap-3">
              <button 
                id="launch-beat-cutter-banner-btn"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 group-hover:from-pink-500 group-hover:to-indigo-500 text-white font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(236,72,153,0.6)] cursor-pointer transition-all duration-300 group-hover:scale-105 flex items-center gap-3"
              >
                <Music className="w-6 h-6 animate-bounce" />
                <span>เล่น BEAT CUTTER เลย</span>
              </button>
              <div className="text-[11px] font-mono text-pink-300/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>กราฟิกโมเดิร์นสวยสะกด พร้อมเสียงสังเคราะห์ Real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Flagship Game Hero Card 2: LUMETRI COLOR LAB */}
        <div 
          onClick={() => {
            const colorGame = MINIGAMES_DATA.find(g => g.id === 'lumetri_lab');
            if (colorGame) openGame(colorGame);
          }}
          id="featured-color-lab-hero-card"
          className="relative mb-10 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/50 via-[#0A1020]/90 to-purple-950/40 p-6 sm:p-8 cursor-pointer group shadow-[0_10px_40px_rgba(6,182,212,0.2)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all" />
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>★ PRO STUDIO SUITE ★</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/40">
                  🎨 LIVE LUMETRI SCOPES
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-400/30">
                  🎯 CINEMA LUT MATCHING
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 via-amber-200 group-hover:to-pink-300 transition-all">
                  LUMETRI COLOR LAB
                </h3>
                <div className="font-mono text-xs sm:text-sm text-cyan-400 tracking-widest uppercase font-bold mt-0.5">
                  STUDIO GRADE MONITOR & SCOPES MASTER
                </div>
              </div>

              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                ห้องทดลองเกรดสีระดับสตูดิโอ อ่านกราฟ <strong className="text-cyan-300">Waveform & Vectorscope</strong> แบบ Real-time ปรับค่า <strong className="text-amber-300">Temperature, Tint, Exposure, Contrast, และ Saturation</strong> ให้ตรงกับโทนหนังฮอลลีวูด เช่น Teal & Orange, Cyberpunk และ Nordic Crime!
              </p>

              {/* Scope modes preview */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-mono">
                <span className="text-slate-400 mr-1">ระบบในแล็บ:</span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">RGB Parade Waveform</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">Vectorscope Chroma</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">Accuracy Match %</span>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="flex flex-col items-center gap-3">
              <button 
                id="launch-color-lab-banner-btn"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-500 text-white font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer transition-all duration-300 group-hover:scale-105 flex items-center gap-3"
              >
                <Palette className="w-6 h-6 animate-pulse" />
                <span>เปิดห้องแล็บเกรดสีเลย</span>
              </button>
              <div className="text-[11px] font-mono text-cyan-300/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>สตูดิโอเกรดสีระดับโปร พร้อมการประมวลผลสีสด</span>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MINIGAMES_DATA.map(game => {
            const IconComp = ICON_MAP[game.icon] || Gamepad2;
            const scores = gameScores[game.id] || [];
            const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;

            return (
              <div
                key={game.id}
                onClick={() => openGame(game)}
                id={`minigame-card-${game.id}`}
                className="glass-panel rounded-2xl overflow-hidden cursor-pointer card-interactive flex flex-col justify-between group border border-white/10 hover:border-purple-500/40 transition-all shadow-xl hover:shadow-purple-500/10"
              >
                <div>
                  {/* Card Cover Image Header */}
                  <div className="h-32 relative overflow-hidden bg-slate-900">
                    {game.coverImage && (
                      <img
                        src={game.coverImage}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1b] via-[#0d0d1b]/60 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#B794F6] group-hover:bg-gradient-to-tr group-hover:from-[#8B5CF6] group-hover:to-[#3B82F6] group-hover:text-white transition-all shadow">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold backdrop-blur-md border ${
                          game.difficulty === 'ง่าย'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : game.difficulty === 'ปานกลาง'
                            ? 'bg-purple-500/20 text-[#B794F6] border-purple-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Bottom Tag on Cover */}
                    {game.badgeText && (
                      <div className="absolute bottom-2 left-3 font-mono text-[10px] text-white/80 tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B794F6] animate-pulse" />
                        {game.badgeText}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-bold text-sm sm:text-base text-[#EDEDF4] group-hover:text-[#B794F6] transition-colors leading-snug">
                      {game.name}
                    </h4>
                    <p className="text-xs text-[#9A9AB0] line-clamp-2 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>
                </div>

                {/* Footer stats */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#6B6B85]">
                    <span>สถิติดีสุด: <b className="text-[#34D399]">{bestScore} pts</b></span>
                    <span className="text-[#B794F6] group-hover:translate-x-1 transition-transform font-bold inline-flex items-center gap-0.5">
                      เล่นเลย →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTIVE GAME MODAL */}
        {activeGame && (
          <div 
            id="game-modal-backdrop"
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
          >
            <div className="w-full max-w-5xl p-3 sm:p-6 glass-panel-strong border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl space-y-4 animate-in zoom-in-95 my-auto max-h-[96vh] overflow-y-auto">
              {/* Game Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-[#B794F6] flex items-center justify-center">
                    {React.createElement(ICON_MAP[activeGame.icon] || Gamepad2, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#EDEDF4]">{activeGame.name}</h3>
                    <p className="text-xs text-[#9A9AB0]">{activeGame.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sound Toggle */}
                  <button
                    onClick={toggleSound}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title={soundMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียง'}
                  >
                    {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#34D399]" />}
                  </button>

                  <div className="text-right font-mono hidden sm:block">
                    <div className="text-[10px] text-[#9A9AB0]">คะแนน</div>
                    <div className="text-base font-bold text-[#34D399]">{currentScore} pts</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-[10px] text-[#9A9AB0]">เวลา</div>
                    <div className="text-base font-bold text-[#EDEDF4]">{formatTimer(seconds)}</div>
                  </div>
                  <button
                    onClick={closeGame}
                    id="close-game-modal-btn"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Game Stage Body or Game Over Screen */}
              <div className="min-h-[280px] flex flex-col justify-center">
                {gameFinished ? (
                  <GameOverModal
                    gameName={activeGame.name}
                    score={currentScore}
                    timeSeconds={seconds}
                    personalBest={currentBest}
                    onPlayAgain={restartCurrentGame}
                    onClose={closeGame}
                  />
                ) : (
                  <div key={gameInstanceKey}>
                    {activeGame.id === 'beat_cutter' && (
                      <BeatCutterGame onComplete={handleEndGame} onScoreUpdate={setCurrentScore} />
                    )}
                    {activeGame.id === 'lumetri_lab' && (
                      <LumetriColorLabGame onComplete={handleEndGame} onScoreUpdate={setCurrentScore} />
                    )}
                    {activeGame.id === 'audio_mixer' && (
                      <AudioMixerGame onComplete={handleEndGame} onScoreUpdate={setCurrentScore} />
                    )}
                    {activeGame.id === 'keyframe_curves' && (
                      <KeyframeCurvesGame onComplete={handleEndGame} onScoreUpdate={setCurrentScore} />
                    )}
                    {activeGame.id === 'timeline_rush' && (
                      <TimelineRushGame onComplete={handleEndGame} onScoreUpdate={setCurrentScore} />
                    )}
                    {activeGame.id === 'export_tycoon' && (
                      <ExportTycoonGame onComplete={handleEndGame} onScoreUpdate={setCurrentScore} />
                    )}
                  </div>
                )}
              </div>

              {/* Leaderboard Table for this game */}
              {!gameFinished && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#B794F6] font-semibold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Leaderboard ล่าสุด (5 อันดับสูงสุด)</span>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {(gameScores[activeGame.id] || []).length > 0 ? (
                      (gameScores[activeGame.id] || []).map((rec, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 text-xs font-mono"
                        >
                          <span className="text-[#9A9AB0]">#{i + 1} • {rec.date}</span>
                          <span className="text-[#EDEDF4] font-semibold">{rec.score} คะแนน ({rec.time}s)</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#6B6B85] py-1">ยังไม่มีสถิติ เล่นให้จบเกมเพื่อบันทึกคะแนน</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
