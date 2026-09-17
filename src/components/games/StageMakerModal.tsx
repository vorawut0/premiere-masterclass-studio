import React, { useState } from 'react';
import { 
  X, 
  Map, 
  Sliders, 
  Play, 
  Save, 
  Dices, 
  Sparkles, 
  Check, 
  Clock, 
  Zap, 
  Layers, 
  Cpu, 
  Palette, 
  Sun, 
  AlertTriangle,
  Flame,
  Activity,
  Award
} from 'lucide-react';
import { 
  RunnerStage, 
  STAGE_BIOMES, 
  saveCustomStage 
} from './timelineRunnerData';
import { gameAudio } from '../../utils/gameAudio';

interface StageMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndPlay: (stage: RunnerStage) => void;
  existingStage?: RunnerStage | null;
}

export const StageMakerModal: React.FC<StageMakerModalProps> = ({
  isOpen,
  onClose,
  onSaveAndPlay,
  existingStage
}) => {
  const [title, setTitle] = useState(existingStage?.title || 'SEQ 99: Midnight Render Sprint');
  const [titleTh, setTitleTh] = useState(existingStage?.titleTh || 'ด่านกำหนดเอง: เรนเดอร์เที่ยงคืนไฟลุก');
  const [desc, setDesc] = useState(
    existingStage?.desc || 'ด่านที่ออกแบบเอง ท้าทายความแม่นยำในการกระโดด สไลด์ และสับมีดเลเซอร์เคลียร์ไทม์ไลน์'
  );
  const [biomeId, setBiomeId] = useState<'cyber_dark' | 'lumetri_neon' | 'retrowave_sunset' | 'render_core' | 'matrix_void'>(
    existingStage?.biomeId || 'cyber_dark'
  );
  const [distance, setDistance] = useState(existingStage?.distance || 800);
  const [speedMultiplier, setSpeedMultiplier] = useState(existingStage?.speedMultiplier || 1.05);
  const [obstacleRate, setObstacleRate] = useState<'low' | 'normal' | 'high' | 'dense'>(
    existingStage?.obstacleRate || 'normal'
  );
  const [itemRate, setItemRate] = useState<'rare' | 'normal' | 'abundant'>(
    existingStage?.itemRate || 'abundant'
  );
  const [bpm, setBpm] = useState(existingStage?.bpm || 128);

  if (!isOpen) return null;

  const currentBiome = STAGE_BIOMES[biomeId] || STAGE_BIOMES.cyber_dark;

  const previewStage: RunnerStage = {
    id: existingStage?.id || `stage_custom_${Date.now()}`,
    title,
    titleTh,
    desc,
    biomeId,
    distance,
    speedMultiplier,
    obstacleRate,
    itemRate,
    bpm,
    badge: 'CUSTOM STAGE',
    isUserCreated: true
  };

  const handleRandomize = () => {
    gameAudio.playClick();
    const biomes: ('cyber_dark' | 'lumetri_neon' | 'retrowave_sunset' | 'render_core' | 'matrix_void')[] = [
      'cyber_dark', 'lumetri_neon', 'retrowave_sunset', 'render_core', 'matrix_void'
    ];
    const pickedBiome = biomes[Math.floor(Math.random() * biomes.length)];
    const titles = [
      { en: 'SEQ 42: Cyberpunk Tokyo Cut', th: 'ด่านไซเบอร์พังก์ โตเกียวสปีด' },
      { en: 'SEQ 88: Retrowave Neon Highway', th: 'ด่านซินธ์เวฟ ไฮเวย์นีออน' },
      { en: 'SEQ 60: 4K 120FPS Hyperdrive', th: 'ด่านไฮเปอร์ดไรฟ์ 120FPS' },
      { en: 'SEQ 77: Colorist Paradise', th: 'ด่านสรวงสวรรค์คัลเลอร์ริสต์' },
      { en: 'SEQ 99: Final Cut Deadline 3AM', th: 'ด่านเดดไลน์ตีสาม ส่งงานลูกค้า' }
    ];
    const pickedTitle = titles[Math.floor(Math.random() * titles.length)];
    const distances = [500, 750, 1000, 1250, 1500];
    const pickedDistance = distances[Math.floor(Math.random() * distances.length)];
    const bpms = [110, 128, 138, 150, 165];
    const pickedBpm = bpms[Math.floor(Math.random() * bpms.length)];
    const obsRates: ('low' | 'normal' | 'high' | 'dense')[] = ['low', 'normal', 'high', 'dense'];
    const itemRates: ('rare' | 'normal' | 'abundant')[] = ['rare', 'normal', 'abundant'];

    setBiomeId(pickedBiome);
    setTitle(pickedTitle.en);
    setTitleTh(pickedTitle.th);
    setDistance(pickedDistance);
    setBpm(pickedBpm);
    setSpeedMultiplier(0.9 + (pickedBpm - 110) * 0.007);
    setObstacleRate(obsRates[Math.floor(Math.random() * obsRates.length)]);
    setItemRate(itemRates[Math.floor(Math.random() * itemRates.length)]);
  };

  const handleSaveOnly = () => {
    gameAudio.playPowerup();
    saveCustomStage(previewStage);
    onClose();
  };

  const handleSaveAndPlayNow = () => {
    gameAudio.playPowerup();
    saveCustomStage(previewStage);
    onSaveAndPlay(previewStage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  STAGE MAKER STUDIO
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ตัวสร้างด่านไทม์ไลน์
                </span>
              </div>
              <p className="text-xs text-slate-400">
                สร้างด่านไทม์ไลน์ เลือกระบบธีมภาพ (Biome) ปรับระยะทาง และกำหนดจังหวะสปีดรัน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-300 font-medium transition-colors"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>สุ่มด่าน (Random)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 overflow-y-auto">
          
          {/* Left Column: Biome Visual Preview & Sequencer Mockup */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Visual Biome Display Card */}
            <div 
              className="w-full rounded-2xl border p-4 relative overflow-hidden shadow-xl flex flex-col transition-all duration-300"
              style={{ 
                background: `linear-gradient(180deg, ${currentBiome.bgTop} 0%, ${currentBiome.bgMid} 60%, ${currentBiome.bgBottom} 100%)`,
                borderColor: currentBiome.groundColor
              }}
            >
              {/* Biome Header Tag */}
              <div className="flex items-center justify-between z-10 mb-2">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                  style={{ 
                    borderColor: currentBiome.glowColor, 
                    color: currentBiome.ambientParticleColor,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}
                >
                  {currentBiome.nameTh}
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  {bpm} BPM
                </span>
              </div>

              {/* Stage Names */}
              <div className="z-10 mt-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {title}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {titleTh}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* Timeline Tracks Visual Simulation */}
              <div className="w-full mt-4 p-2.5 rounded-xl bg-black/60 border border-slate-700/60 z-10 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>TIMELINE SEQUENCER PREVIEW</span>
                  <span>GOAL: {distance}m</span>
                </div>

                {/* Simulated Tracks */}
                <div className="h-6 rounded bg-slate-900/90 border border-sky-500/20 flex items-center px-2 relative overflow-hidden">
                  <span className="text-[9px] font-mono text-sky-400">V2 Overlays</span>
                  {/* Mock collectibles */}
                  <div className="absolute left-[30%] w-3 h-3 rotate-45 bg-sky-400 rounded-xs shadow-sm" />
                  <div className="absolute left-[65%] w-3 h-3 bg-pink-500 rounded shadow-sm" />
                </div>

                <div className="h-7 rounded bg-slate-900/90 border border-purple-500/20 flex items-center px-2 relative overflow-hidden">
                  <span className="text-[9px] font-mono text-purple-400">V1 Main Cut</span>
                  {/* Mock obstacles */}
                  <div className="absolute left-[45%] w-5 h-4 bg-red-600 rounded-xs shadow-sm" />
                  <div className="absolute left-[80%] w-6 h-5 bg-red-500 border border-white/50 rounded-xs" />
                </div>

                <div className="h-6 rounded bg-slate-900/90 border border-emerald-500/20 flex items-center px-2 relative overflow-hidden">
                  <span className="text-[9px] font-mono text-emerald-400">A1 Audio</span>
                  <div className="absolute left-[20%] w-4 h-3 bg-emerald-500 rounded shadow-sm" />
                  <div className="absolute left-[70%] w-4 h-3 bg-amber-400 rounded shadow-sm" />
                </div>

                {/* Ground Playhead Bar */}
                <div 
                  className="h-1.5 w-full rounded-full mt-1"
                  style={{ backgroundColor: currentBiome.groundColor }}
                />
              </div>

              {/* Parameters Summary */}
              <div className="grid grid-cols-3 gap-2 mt-4 z-10 pt-3 border-t border-slate-800">
                <div className="text-center p-2 rounded-lg bg-black/40 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-mono">DISTANCE</div>
                  <div className="text-xs font-bold text-white">{distance}m</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-black/40 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-mono">OBSTACLES</div>
                  <div className="text-xs font-bold text-rose-400 uppercase">{obstacleRate}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-black/40 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-mono">LOOT RATE</div>
                  <div className="text-xs font-bold text-emerald-400 uppercase">{itemRate}</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Stage Builder Controls */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* 1. Pick Biome Visual Atmosphere */}
            <div>
              <label className="text-xs font-semibold text-slate-200 mb-2 block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. เลือกธีมภาพและบรรยากาศ (Stage Biome)</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(STAGE_BIOMES).map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setBiomeId(b.id as any); gameAudio.playClick(); }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      biomeId === b.id
                        ? 'bg-slate-800 border-white/60 text-white shadow-md ring-1 ring-white/30'
                        : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: b.groundColor }}
                        />
                        <span className="text-xs font-bold">{b.nameTh}</span>
                      </div>
                      {biomeId === b.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Distance Target */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-sky-400" />
                  <span>2. ระยะทางถึงจุดส่งงาน (Stage Distance Goal)</span>
                </label>
                <span className="font-mono font-bold text-sky-400">{distance} เมตร (Meters)</span>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[
                  { m: 300, label: '300m (Quick)' },
                  { m: 500, label: '500m (Sprint)' },
                  { m: 800, label: '800m (Standard)' },
                  { m: 1000, label: '1,000m (Master)' },
                  { m: 1500, label: '1,500m (Epic)' }
                ].map(d => (
                  <button
                    key={d.m}
                    onClick={() => { setDistance(d.m); gameAudio.playClick(); }}
                    className={`p-2 rounded-lg text-center border text-xs transition-all ${
                      distance === d.m
                        ? 'bg-sky-500/25 border-sky-500 text-sky-200 font-bold'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Tempo & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>จังหวะบีตดนตรี (BPM)</span>
                  </label>
                  <span className="font-mono font-bold text-amber-400">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="165"
                  value={bpm}
                  onChange={(e) => {
                    const newBpm = Number(e.target.value);
                    setBpm(newBpm);
                    setSpeedMultiplier(0.9 + (newBpm - 100) * 0.007);
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>ความถี่อุปสรรค (Obstacle Rate)</span>
                  </label>
                  <span className="font-mono font-bold text-rose-400 uppercase">{obstacleRate}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low', 'normal', 'high', 'dense'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => { setObstacleRate(r); gameAudio.playClick(); }}
                      className={`p-1.5 rounded text-center border text-[11px] uppercase transition-all ${
                        obstacleRate === r
                          ? 'bg-rose-500/25 border-rose-500 text-rose-200 font-bold'
                          : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Collectibles Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ความหนาแน่นไอเทมคะแนน & 3D LUT (Item Density)</span>
                </label>
                <span className="font-mono font-bold text-emerald-400 uppercase">{itemRate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['rare', 'normal', 'abundant'] as const).map(rate => (
                  <button
                    key={rate}
                    onClick={() => { setItemRate(rate); gameAudio.playClick(); }}
                    className={`p-2 rounded-lg text-center border text-xs capitalize transition-all ${
                      itemRate === rate
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {rate === 'rare' ? 'หายาก (Rare)' : rate === 'normal' ? 'ปานกลาง (Normal)' : 'สมบูรณ์แบบ (Abundant)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Stage Names Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">ชื่อด่านภาษาอังกฤษ (Stage Title)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={35}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="เช่น SEQ 99: Midnight Render"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">ชื่อด่านภาษาไทย (Thai Title)</label>
                  <input
                    type="text"
                    value={titleTh}
                    onChange={(e) => setTitleTh(e.target.value)}
                    maxLength={35}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="เช่น ด่านซินธ์เวฟเรนเดอร์ 60FPS"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">คำอธิบายด่าน (Description)</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  maxLength={70}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="เช่น ด่านความเร็วสูง อุปสรรคเรนเดอร์บาร์แดงถี่ขึ้น"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Action Footer Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            ด่านที่สร้างจะถูกเพิ่มลงในเมนูเลือกด่านของ Timeline Runner
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveOnly}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกด่าน (Save Stage)</span>
            </button>
            <button
              onClick={handleSaveAndPlayNow}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-500 hover:from-emerald-500 hover:to-sky-400 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>บันทึกและเปิดเล่นทันที (Save & Launch)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
