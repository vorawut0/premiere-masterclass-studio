import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Scissors, 
  PenTool, 
  Music, 
  Zap, 
  Shield, 
  Dices, 
  Save, 
  Play, 
  Check, 
  Palette,
  Eye,
  Sliders,
  Award,
  ChevronRight
} from 'lucide-react';
import { 
  RunnerCharacter, 
  CharacterAvatarSvg, 
  WEAPON_TYPES, 
  PERK_LIST, 
  saveCustomHero 
} from './timelineRunnerData';
import { gameAudio } from '../../utils/gameAudio';

interface CharacterCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndPlay: (hero: RunnerCharacter) => void;
  existingHero?: RunnerCharacter | null;
}

const SKIN_TONES = [
  { label: 'Golden Gold', value: '#FDE047' },
  { label: 'Peach Rose', value: '#FFE4E6' },
  { label: 'Warm Bronze', value: '#D97706' },
  { label: 'Deep Espresso', value: '#78350F' },
  { label: 'Cyber Blue', value: '#93C5FD' },
  { label: 'Matrix Green', value: '#34D399' }
];

const HAIR_COLORS = [
  { label: 'Cyber Indigo', value: '#312E81' },
  { label: 'Neon Pink', value: '#EC4899' },
  { label: 'Sky Cyan', value: '#38BDF8' },
  { label: 'Electric Purple', value: '#8B5CF6' },
  { label: 'Golden Blonde', value: '#F59E0B' },
  { label: 'Stealth Carbon', value: '#18181B' },
  { label: 'Emerald Mint', value: '#10B981' }
];

const VISOR_COLORS = [
  { label: 'Cyan Laser', value: '#38BDF8' },
  { label: 'Magenta Prism', value: '#F43F5E' },
  { label: 'Golden Spark', value: '#EAB308' },
  { label: 'Emerald Scan', value: '#10B981' },
  { label: 'Violet Void', value: '#A855F7' }
];

const SUIT_THEMES = [
  { name: 'Premiere Indigo', theme: '#8B5CF6', accent: '#38BDF8' },
  { name: 'Render Emerald', theme: '#059669', accent: '#34D399' },
  { name: 'Lumetri Pink', theme: '#DB2777', accent: '#FB7185' },
  { name: 'Retrowave Amber', theme: '#D97706', accent: '#FBBF24' },
  { name: 'Cyber Stealth', theme: '#27272A', accent: '#A1A1AA' },
  { name: 'Crimson Offline', theme: '#DC2626', accent: '#F87171' }
];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveAndPlay,
  existingHero
}) => {
  const [name, setName] = useState(existingHero?.name || 'Neo Cutter');
  const [alias, setAlias] = useState(existingHero?.alias || 'The Frame Shifter');
  const [role, setRole] = useState(existingHero?.role || 'VFX & Motion Specialist');
  const [quote, setQuote] = useState(existingHero?.quote || '"ตัดต่อด้วยสปีดแสง เรนเดอร์แรงทุกคัต!"');
  
  const [skinTone, setSkinTone] = useState(existingHero?.skinTone || '#FDE047');
  const [hairStyle, setHairStyle] = useState<'anime' | 'twintail' | 'dreads' | 'cyberpunk' | 'antenna' | 'topknot'>(
    existingHero?.hairStyle || 'cyberpunk'
  );
  const [hairColor, setHairColor] = useState(existingHero?.hairColor || '#8B5CF6');
  const [visorStyle, setVisorStyle] = useState<'cyber' | 'sunglasses' | 'lumetri' | 'equalizer' | 'scanner' | 'none'>(
    existingHero?.visorStyle || 'cyber'
  );
  const [visorColor, setVisorColor] = useState(existingHero?.visorColor || '#38BDF8');
  
  const [suitTheme, setSuitTheme] = useState(
    existingHero ? { name: 'Custom', theme: existingHero.themeColor, accent: existingHero.accentColor } : SUIT_THEMES[0]
  );
  const [weapon, setWeapon] = useState<'razor' | 'pen' | 'orb' | 'scythe' | 'katana'>(
    existingHero?.weapon || 'razor'
  );
  
  // Stats (Speed, Jump, Slash - balanced max total 265)
  const [speed, setSpeed] = useState(existingHero?.speed || 90);
  const [jumpPower, setJumpPower] = useState(existingHero?.jumpPower || 86);
  const [slashPower, setSlashPower] = useState(existingHero?.slashPower || 92);
  
  // Perk
  const [selectedPerkId, setSelectedPerkId] = useState(existingHero?.perkId || 'razor_rush');
  
  // Active Tab: 'visual' | 'stats' | 'perk'
  const [activeTab, setActiveTab] = useState<'visual' | 'stats' | 'perk'>('visual');

  if (!isOpen) return null;

  // Selected Perk Details
  const currentPerk = PERK_LIST.find(p => p.id === selectedPerkId) || PERK_LIST[0];

  // Construct current custom character preview object
  const previewChar: RunnerCharacter = {
    id: existingHero?.id || `custom_${Date.now()}`,
    name,
    alias,
    role,
    quote,
    themeColor: suitTheme.theme,
    accentColor: suitTheme.accent,
    speed,
    jumpPower,
    slashPower,
    perkName: currentPerk.name,
    perkDesc: currentPerk.desc,
    perkId: currentPerk.id,
    lore: `ตัวละครที่ผู้ใช้สร้างขึ้นเองใน Game Studio มาพร้อมสไตล์ ${role} และอาวุธ ${weapon}`,
    badge: 'CUSTOM HERO',
    isCustom: true,
    skinTone,
    hairStyle,
    hairColor,
    visorStyle,
    visorColor,
    suitColor: suitTheme.theme,
    weapon
  };

  // Randomize preset
  const handleRandomize = () => {
    gameAudio.playClick();
    const names = ['Viper Cut', 'Nova Key', 'Cyber Pixie', 'Glitch Master', 'Chrono Blade', 'Pulse Editor', 'Echo Flow'];
    const aliases = ['The Sub-frame Slicer', 'Master of Timelines', 'The 4K Overclocker', 'Audio Wizard', 'Prism Witch'];
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value;
    const randomHairCol = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomVisorCol = VISOR_COLORS[Math.floor(Math.random() * VISOR_COLORS.length)].value;
    const hairStyles: ('anime' | 'twintail' | 'cyberpunk' | 'topknot' | 'antenna')[] = ['anime', 'twintail', 'cyberpunk', 'topknot', 'antenna'];
    const randomHairStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
    const visorStyles: ('cyber' | 'sunglasses' | 'equalizer' | 'none')[] = ['cyber', 'sunglasses', 'equalizer', 'none'];
    const randomVisorStyle = visorStyles[Math.floor(Math.random() * visorStyles.length)];
    const randomSuit = SUIT_THEMES[Math.floor(Math.random() * SUIT_THEMES.length)];
    const weapons: ('razor' | 'pen' | 'orb' | 'scythe' | 'katana')[] = ['razor', 'pen', 'orb', 'scythe', 'katana'];
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    const randomPerk = PERK_LIST[Math.floor(Math.random() * PERK_LIST.length)];

    setName(names[Math.floor(Math.random() * names.length)]);
    setAlias(aliases[Math.floor(Math.random() * aliases.length)]);
    setSkinTone(randomSkin);
    setHairStyle(randomHairStyle);
    setHairColor(randomHairCol);
    setVisorStyle(randomVisorStyle);
    setVisorColor(randomVisorCol);
    setSuitTheme(randomSuit);
    setWeapon(randomWeapon);
    setSelectedPerkId(randomPerk.id);

    // Randomize balanced stats
    setSpeed(75 + Math.floor(Math.random() * 22));
    setJumpPower(75 + Math.floor(Math.random() * 22));
    setSlashPower(75 + Math.floor(Math.random() * 22));
  };

  const handleSaveOnly = () => {
    gameAudio.playPowerup();
    saveCustomHero(previewChar);
    onClose();
  };

  const handleSaveAndPlayNow = () => {
    gameAudio.playPowerup();
    saveCustomHero(previewChar);
    onSaveAndPlay(previewChar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-950/60 via-slate-900 to-sky-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  HERO CREATOR STUDIO
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  ตัวสร้างตัวละคร
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ออกแบบฮีโร่นักตัดต่อ สวมชุดไฮเทค ปรับแต่งสกิลและอาวุธประจำตัว
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-amber-300 font-medium transition-colors"
              title="สุ่มรูปลักษณ์และสเตตัส"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>สุ่มสร้าง (Random)</span>
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
          
          {/* Left Column: Live Character Hologram Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col items-center relative overflow-hidden shadow-xl">
              
              {/* Subtle background glow matching theme */}
              <div 
                className="absolute inset-0 opacity-15 blur-2xl pointer-events-none"
                style={{ backgroundColor: suitTheme.theme }}
              />

              {/* Character Badge */}
              <div className="flex items-center justify-between w-full mb-3 z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  CUSTOM HERO
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  TOOL: {weapon.toUpperCase()}
                </span>
              </div>

              {/* Vector Hologram Avatar Display */}
              <div className="relative my-2 p-3 flex items-center justify-center">
                <CharacterAvatarSvg char={previewChar} size={135} isSelected={true} />
              </div>

              {/* Identity Details */}
              <div className="text-center w-full mt-2 z-10">
                <h3 className="text-xl font-extrabold text-white tracking-wide">
                  {name || 'Unknown Hero'}
                </h3>
                <p className="text-xs font-semibold text-sky-400 mt-0.5">
                  {alias || 'The Timeline Runner'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {role}
                </p>

                {/* Catchphrase Quote */}
                <div className="mt-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 italic">
                  {quote}
                </div>
              </div>

              {/* Stat Gauges Mini Preview */}
              <div className="w-full grid grid-cols-3 gap-2 mt-4 z-10 pt-3 border-t border-slate-800/80">
                <div className="text-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">SPEED</div>
                  <div className="text-sm font-bold text-sky-400">{speed}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">JUMP</div>
                  <div className="text-sm font-bold text-violet-400">{jumpPower}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">SLASH</div>
                  <div className="text-sm font-bold text-rose-400">{slashPower}</div>
                </div>
              </div>

              {/* Equipped Perk Pill */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-gradient-to-r from-violet-900/30 to-slate-900 border border-violet-500/20 flex items-center gap-2.5 z-10">
                <Award className="w-4 h-4 text-violet-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-violet-300 truncate">
                    {currentPerk.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {currentPerk.desc}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Customization Controls & Tabs */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Customization Tabs */}
            <div className="flex border-b border-slate-800 gap-1 pb-1">
              <button
                onClick={() => { setActiveTab('visual'); gameAudio.playClick(); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'visual'
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>1. รูปลักษณ์ & อุปกรณ์</span>
              </button>
              <button
                onClick={() => { setActiveTab('stats'); gameAudio.playClick(); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'stats'
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>2. สเตตัส & พลัง</span>
              </button>
              <button
                onClick={() => { setActiveTab('perk'); gameAudio.playClick(); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'perk'
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>3. สกิล & ประวัติ</span>
              </button>
            </div>

            {/* TAB 1: VISUAL & GEAR */}
            {activeTab === 'visual' && (
              <div className="space-y-4 pr-1">
                
                {/* Weapon Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-sky-400" />
                    <span>อาวุธประจำตัว (Signature Tool / Weapon)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WEAPON_TYPES.map(w => (
                      <button
                        key={w.id}
                        onClick={() => { setWeapon(w.id as any); gameAudio.playClick(); }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          weapon === w.id
                            ? 'bg-sky-500/15 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/40'
                            : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{w.name}</span>
                          {weapon === w.id && <Check className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{w.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hairstyle */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">ทรงผม / ส่วนหัว (Hairstyle / Headware)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'cyberpunk', name: 'Cyber Mohawk' },
                      { id: 'anime', name: 'Anime Spike' },
                      { id: 'twintail', name: 'Twin Tails' },
                      { id: 'topknot', name: 'Samurai Knot' },
                      { id: 'antenna', name: 'AI Antenna' }
                    ].map(h => (
                      <button
                        key={h.id}
                        onClick={() => { setHairStyle(h.id as any); gameAudio.playClick(); }}
                        className={`p-2 rounded-lg text-center border text-xs transition-all ${
                          hairStyle === h.id
                            ? 'bg-violet-600/30 border-violet-500 text-violet-200 font-bold'
                            : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color Swatches */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">สีผม (Hair Color)</label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => { setHairColor(c.value); gameAudio.playClick(); }}
                        style={{ backgroundColor: c.value }}
                        className={`w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center border-2 ${
                          hairColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-slate-700'
                        }`}
                        title={c.label}
                      >
                        {hairColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visor & Eyewear Style */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">แว่น / ไวเซอร์โฮโลแกรม (Eyewear / Visor)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'cyber', name: 'Cyber Visor' },
                      { id: 'sunglasses', name: 'Dark Shades' },
                      { id: 'equalizer', name: 'Equalizer Bar' },
                      { id: 'none', name: 'No Eyewear' }
                    ].map(v => (
                      <button
                        key={v.id}
                        onClick={() => { setVisorStyle(v.id as any); gameAudio.playClick(); }}
                        className={`p-2 rounded-lg text-center border text-xs transition-all ${
                          visorStyle === v.id
                            ? 'bg-sky-500/25 border-sky-500 text-sky-200 font-bold'
                            : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suit Theme Preset */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">โทนสีชุดแจ็คเก็ต (Suit / Jacket Palette)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SUIT_THEMES.map(t => (
                      <button
                        key={t.name}
                        onClick={() => { setSuitTheme(t); gameAudio.playClick(); }}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 text-xs transition-all ${
                          suitTheme.name === t.name
                            ? 'bg-slate-800 border-white/40 text-white shadow-md'
                            : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex gap-1 shrink-0">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.theme }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.accent }} />
                        </div>
                        <span className="truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: STATS & ATTRIBUTES */}
            {activeTab === 'stats' && (
              <div className="space-y-5 pr-1">
                <div className="p-3 bg-violet-950/20 border border-violet-500/20 rounded-xl text-xs text-violet-300">
                  💡 <strong>ระบบจัดสรรพลัง (Attribute Points):</strong> ปรับแต่งความเร็ววิ่ง แรงกระโดดข้ามสิ่งกีดขวาง และพลังตัดสะบั้นบาร์แดงได้ตามสไตล์การเล่นของคุณ
                </div>

                {/* Speed Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      <span>ความเร็ววิ่ง (Speed)</span>
                    </span>
                    <span className="font-mono font-bold text-sky-400">{speed} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <p className="text-[10px] text-slate-400">ส่งผลต่อความเร็วการเลื่อนของไทม์ไลน์และระยะการวิ่ง</p>
                </div>

                {/* Jump Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      <span>แรงกระโดด (Jump Impulse)</span>
                    </span>
                    <span className="font-mono font-bold text-violet-400">{jumpPower} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={jumpPower}
                    onChange={(e) => setJumpPower(Number(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <p className="text-[10px] text-slate-400">กระโดดได้สูงขึ้นเพื่อข้ามกล่อง Media Offline และคว้า Keyframe บนฟ้า</p>
                </div>

                {/* Slash Power Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-rose-400" />
                      <span>พลังฟันดาบเลเซอร์ (Slash Power)</span>
                    </span>
                    <span className="font-mono font-bold text-rose-400">{slashPower} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={slashPower}
                    onChange={(e) => setSlashPower(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <p className="text-[10px] text-slate-400">เพิ่มคะแนนโบนัสและคูลดาวน์สับใบมีดให้ไวกว่าเดิม</p>
                </div>

                {/* Skin Tone Selector */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">โทนสีผิว (Skin Tone)</label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map(s => (
                      <button
                        key={s.value}
                        onClick={() => { setSkinTone(s.value); gameAudio.playClick(); }}
                        style={{ backgroundColor: s.value }}
                        className={`w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center border-2 ${
                          skinTone === s.value ? 'border-white scale-110 shadow-lg' : 'border-slate-700'
                        }`}
                        title={s.label}
                      >
                        {skinTone === s.value && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PERK & LORE */}
            {activeTab === 'perk' && (
              <div className="space-y-4 pr-1">
                
                {/* Perk Cards Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">เลือกสกิลประจำตัว (Signature Perk)</label>
                  <div className="space-y-2">
                    {PERK_LIST.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPerkId(p.id); gameAudio.playClick(); }}
                        className={`w-full p-3 rounded-xl text-left border transition-all flex items-start gap-3 ${
                          selectedPerkId === p.id
                            ? 'bg-violet-600/20 border-violet-500 text-white shadow-md ring-1 ring-violet-500/40'
                            : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          selectedPerkId === p.id ? 'bg-violet-500 text-white' : 'bg-slate-700/60 text-slate-400'
                        }`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{p.name}</span>
                            {selectedPerkId === p.id && <Check className="w-4 h-4 text-violet-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Identity Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">ชื่อตัวละคร (Hero Name)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={20}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                      placeholder="เช่น Neo Cutter"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">ฉายา (Alias)</label>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      maxLength={25}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                      placeholder="เช่น The Frame Slicer"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">คำคมประจำตัว (Catchphrase)</label>
                    <input
                      type="text"
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      maxLength={50}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                      placeholder="เช่น ตัดให้คม สับให้ไว!"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Action Footer Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            พร้อมใช้งานทันทีในโหมดเกม Timeline Runner
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveOnly}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกตัวละคร (Save Hero)</span>
            </button>
            <button
              onClick={handleSaveAndPlayNow}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>บันทึกและเล่นทันที (Save & Play Now)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
