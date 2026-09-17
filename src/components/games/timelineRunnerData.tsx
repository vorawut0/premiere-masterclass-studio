import React from 'react';

export interface RunnerCharacter {
  id: string;
  name: string;
  alias: string;
  role: string;
  themeColor: string;
  accentColor: string;
  speed: number;
  jumpPower: number;
  slashPower: number;
  perkName: string;
  perkDesc: string;
  lore: string;
  quote: string;
  badge: string;
  isCustom?: boolean;
  // Custom visual attributes
  archetype?: 'editor' | 'droid' | 'colorist' | 'dj' | 'samurai' | 'hacker';
  skinTone?: string;
  hairStyle?: 'anime' | 'twintail' | 'dreads' | 'cyberpunk' | 'antenna' | 'topknot';
  hairColor?: string;
  visorStyle?: 'cyber' | 'sunglasses' | 'lumetri' | 'equalizer' | 'scanner' | 'none';
  visorColor?: string;
  suitColor?: string;
  weapon?: 'razor' | 'pen' | 'orb' | 'scythe' | 'katana';
  perkId?: string;
}

export interface StageBiome {
  id: 'cyber_dark' | 'lumetri_neon' | 'retrowave_sunset' | 'render_core' | 'matrix_void' | 'kru_phutsa_lab';
  name: string;
  nameTh: string;
  desc: string;
  bgTop: string;
  bgMid: string;
  bgBottom: string;
  trackBorder: string;
  groundColor: string;
  needleColor: string;
  glowColor: string;
  ambientParticleColor: string;
  iconName: string;
}

export const STAGE_BIOMES: Record<string, StageBiome> = {
  kru_phutsa_lab: {
    id: 'kru_phutsa_lab',
    name: 'Kru Phutsa EdTech & Coding Studio',
    nameTh: 'สตูดิโอห้องเรียนดิจิทัล ครูพุทรา',
    desc: 'ห้องแล็บสร้างสื่อดิจิทัล สโลแกน "ทำง่าย ใช้ได้จริง ครูทำได้ นักเรียนชอบ" ออร่าแสงสีฟ้า-ทอง พร้อมไอคอนโค้ด </> และหลอดไฟไอเดีย 💡',
    bgTop: '#021B35',
    bgMid: '#062B55',
    bgBottom: '#010E1D',
    trackBorder: 'rgba(56, 189, 248, 0.4)',
    groundColor: '#0284C7',
    needleColor: '#F59E0B',
    glowColor: '#38BDF8',
    ambientParticleColor: '#FBBF24',
    iconName: 'Code'
  },
  cyber_dark: {
    id: 'cyber_dark',
    name: 'Cyber Premiere Pro Dark',
    nameTh: 'ไซเบอร์ไทม์ไลน์สตูดิโอ',
    desc: 'บรรยากาศห้องตัดต่อดาร์กโหมดสุดเท่ พร้อมแสงเลเซอร์นีออนสีครามและม่วง',
    bgTop: '#090B12',
    bgMid: '#101424',
    bgBottom: '#07090E',
    trackBorder: 'rgba(139, 92, 246, 0.25)',
    groundColor: '#6366F1',
    needleColor: '#38BDF8',
    glowColor: '#8B5CF6',
    ambientParticleColor: '#38BDF8',
    iconName: 'Laptop'
  },
  lumetri_neon: {
    id: 'lumetri_neon',
    name: 'Lumetri Color Neon City',
    nameTh: 'มหานครนีออนคัลเลอร์ริสต์',
    desc: 'ดินแดนแห่งวงแหวนสี Lumetri ประกายดาวสีชมพูมาเจนต้าและสเปกตรัมแสง',
    bgTop: '#180B1E',
    bgMid: '#281132',
    bgBottom: '#0F0514',
    trackBorder: 'rgba(236, 72, 153, 0.3)',
    groundColor: '#EC4899',
    needleColor: '#F43F5E',
    glowColor: '#EC4899',
    ambientParticleColor: '#F472B6',
    iconName: 'Palette'
  },
  retrowave_sunset: {
    id: 'retrowave_sunset',
    name: '80s Retrowave Sunset',
    nameTh: 'เรโทรเวฟพระอาทิตย์ตกดิน',
    desc: 'ตารางกราฟิกซินธ์เวฟยุค 80s ดวงอาทิตย์โพลีกอนสีส้มทอง และเส้นทางวิ่งสีม่วงนีออน',
    bgTop: '#1F0C28',
    bgMid: '#38123A',
    bgBottom: '#100516',
    trackBorder: 'rgba(245, 158, 11, 0.3)',
    groundColor: '#F59E0B',
    needleColor: '#FBBF24',
    glowColor: '#F97316',
    ambientParticleColor: '#FBBF24',
    iconName: 'Sun'
  },
  render_core: {
    id: 'render_core',
    name: 'Darkroom GPU Render Core',
    nameTh: 'แกนพลังงานเรนเดอร์ GPU',
    desc: 'ห้องประมวลผลเซิร์ฟเวอร์เรนเดอร์ 128 คอร์ ประกายไฟแคชสีเขียวและฮีตซิงก์นีออน',
    bgTop: '#041812',
    bgMid: '#06291E',
    bgBottom: '#020C09',
    trackBorder: 'rgba(16, 185, 129, 0.3)',
    groundColor: '#10B981',
    needleColor: '#34D399',
    glowColor: '#10B981',
    ambientParticleColor: '#34D399',
    iconName: 'Cpu'
  },
  matrix_void: {
    id: 'matrix_void',
    name: 'Glitch Matrix Offline Void',
    nameTh: 'มิติดิจิทัลกลิทช์ Media Offline',
    desc: 'มิติหลุดเฟรมที่เต็มไปด้วยคลื่นรบกวน บล็อกแดงเออร์เรอร์ และเส้นรหัสไบนารีเรืองแสง',
    bgTop: '#120407',
    bgMid: '#24080E',
    bgBottom: '#0A0204',
    trackBorder: 'rgba(239, 68, 68, 0.3)',
    groundColor: '#EF4444',
    needleColor: '#F87171',
    glowColor: '#DC2626',
    ambientParticleColor: '#EF4444',
    iconName: 'AlertTriangle'
  }
};

export interface RunnerStage {
  id: string;
  title: string;
  titleTh: string;
  desc: string;
  biomeId: 'cyber_dark' | 'lumetri_neon' | 'retrowave_sunset' | 'render_core' | 'matrix_void' | 'kru_phutsa_lab';
  distance: number; // in meters (e.g. 500, 800, 1000, 1500)
  speedMultiplier: number;
  obstacleRate: 'low' | 'normal' | 'high' | 'dense';
  itemRate: 'rare' | 'normal' | 'abundant';
  bpm: number;
  badge: string;
  isUserCreated?: boolean;
}

export const PRESET_STAGES: RunnerStage[] = [
  {
    id: 'stage_kru_phutsa',
    title: 'SPECIAL: Kru Phutsa Media Lab',
    titleTh: 'ด่านพิเศษ: ห้องสร้างสื่อครูพุทรา (ทำง่าย ใช้ได้จริง)',
    desc: 'วิ่งตะลุยห้องแล็บดิจิทัลครูพุทรา เก็บหลอดไฟไอเดีย 💡 บล็อกโค้ดดิ้ง </> สโลแกน "ทำง่าย ใช้ได้จริง ครูทำได้ นักเรียนชอบ!"',
    biomeId: 'kru_phutsa_lab',
    distance: 850,
    speedMultiplier: 1.0,
    obstacleRate: 'normal',
    itemRate: 'abundant',
    bpm: 124,
    badge: 'EDUTECH SPECIAL'
  },
  {
    id: 'stage_tutorial',
    title: 'SEQ 01: Rough Cut Sprint',
    titleTh: 'ด่าน 1: รอฟคัตสปีดรัน (สำหรับมือใหม่)',
    desc: 'ด่านเริ่มต้นเส้นทางตัดต่อ อุปสรรคไม่หนาแน่น เน้นจับจังหวะกระโดดและทดสอบใบมีดเลเซอร์',
    biomeId: 'cyber_dark',
    distance: 500,
    speedMultiplier: 0.9,
    obstacleRate: 'low',
    itemRate: 'abundant',
    bpm: 110,
    badge: 'NORMAL'
  },
  {
    id: 'stage_lumetri',
    title: 'SEQ 02: Lumetri Prism Rush',
    titleTh: 'ด่าน 2: มหานครเกรดสี 10-Bit',
    desc: 'วิ่งฝ่าม่านแสงสีและเก็บ 3D LUT Cube ทำคะแนนคอมโบสูง พร้อมสไลด์ลอดคานเรนเดอร์ลอยฟ้า',
    biomeId: 'lumetri_neon',
    distance: 800,
    speedMultiplier: 1.05,
    obstacleRate: 'normal',
    itemRate: 'abundant',
    bpm: 128,
    badge: 'COLOR GRADE'
  },
  {
    id: 'stage_retrowave',
    title: 'SEQ 03: 80s Retrowave Synth',
    titleTh: 'ด่าน 3: ซินธ์เวฟเรนเดอร์ 60FPS',
    desc: 'ไทม์ไลน์ความเร็วสูงตามจังหวะบีตเพลง 135 BPM อุปสรรคเรนเดอร์บาร์แดงถี่ขึ้น ท้าทายรีเฟล็กซ์',
    biomeId: 'retrowave_sunset',
    distance: 1000,
    speedMultiplier: 1.15,
    obstacleRate: 'high',
    itemRate: 'normal',
    bpm: 135,
    badge: 'FAST TEMPO'
  },
  {
    id: 'stage_render_core',
    title: 'SEQ 04: GPU Overclock 4K',
    titleTh: 'ด่าน 4: แกนโอเวอร์คล็อกเรนเดอร์ไฟลุก',
    desc: 'วิกฤตความร้อนฮาร์ดแวร์ก่อนส่งงานลูกค้า! บาร์แดงพุ่งเข้ามาต่อเนื่อง ต้องอาศัยเกราะแคชและการสับมีดที่เฉียบคม',
    biomeId: 'render_core',
    distance: 1200,
    speedMultiplier: 1.25,
    obstacleRate: 'dense',
    itemRate: 'normal',
    bpm: 145,
    badge: 'HARDCORE'
  },
  {
    id: 'stage_matrix',
    title: 'SEQ 05: Glitch Void Apocalypse',
    titleTh: 'ด่าน 5: มิติมืดกลิทช์ Media Offline',
    desc: 'ด่านระดับตำนานสุดโหด ไทม์ไลน์หลุดเฟรม กล่องแดง Media Offline ขนาบสองข้างทาง สับให้ไวถึงเส้นชัย 1,500m',
    biomeId: 'matrix_void',
    distance: 1500,
    speedMultiplier: 1.35,
    obstacleRate: 'dense',
    itemRate: 'rare',
    bpm: 160,
    badge: 'NIGHTMARE'
  }
];

export const RUNNER_CHARACTERS: RunnerCharacter[] = [
  {
    id: 'kru_phutsa',
    name: 'ครูพุทรา (Kru Phutsa)',
    alias: 'มาสเตอร์สร้างสื่อแบบง่ายๆ',
    role: 'EdTech & Coding Master',
    themeColor: '#D97706',
    accentColor: '#0284C7',
    speed: 95,
    jumpPower: 92,
    slashPower: 96,
    perkName: 'ทำง่าย ใช้ได้จริง (Easy Media Pulse)',
    perkDesc: 'ปล่อยพลังคลื่นโค้ดดิ้ง </> และหลอดไฟไอเดีย 💡 สับทำลายบาร์แดงได้กว้าง เริ่มเกมด้วยเกราะครูพุทราชิลด์ และได้คะแนนโบนัส x2',
    lore: 'ครูผู้สร้างแรงบันดาลใจแห่งเพจ "ครูพุทรา สร้างสื่อแบบง่ายๆ" ผู้เปลี่ยนการเขียนโค้ด การตัดต่อ และเทคโนโลยีการศึกษาให้กลายเป็นเรื่องง่าย สโลแกนประจำใจ "ทำง่าย ใช้ได้จริง ครูทำได้ นักเรียนชอบ!"',
    quote: '"ทำง่าย ใช้ได้จริง ครูทำได้ นักเรียนชอบ!"',
    badge: 'STAR CREATOR',
    weapon: 'pen'
  },
  {
    id: 'kai',
    name: 'Kai (ไค)',
    alias: 'The Razor Cutter',
    role: 'Lead Video Editor',
    themeColor: '#8B5CF6',
    accentColor: '#38BDF8',
    speed: 92,
    jumpPower: 88,
    slashPower: 98,
    perkName: 'Razor Blade Rush',
    perkDesc: 'ฟันทำลายสิ่งกีดขวางสีแดงได้แม่นยำ ได้แต้มโบนัส x2 เมื่อใช้มีดตัดสำเร็จ',
    lore: 'มือตัดต่อระดับพระกาฬแห่งไทม์ไลน์ สวมหูฟังไฮเทคและพกใบมีดเลเซอร์ C-Key คู่ใจ ไม่เคยมีคัตไหนที่เขาตัดไม่ทัน',
    quote: '"ตัดให้คม สับให้ไว เส้นไทม์ไลน์ไม่มีคำว่าพลาด!"',
    badge: 'C-Tool Master',
    weapon: 'razor'
  },
  {
    id: 'byte',
    name: 'Byte-3000',
    alias: 'The Render Droid',
    role: 'GPU Acceleration Unit',
    themeColor: '#10B981',
    accentColor: '#34D399',
    speed: 80,
    jumpPower: 82,
    slashPower: 85,
    perkName: 'Green Cache Shield',
    perkDesc: 'เริ่มต้นด้วยเกราะแคชสีเขียว (Green Bar) ป้องกันการชนผิดพลาดได้ 1 ครั้ง',
    lore: 'หุ่นยนต์ปัญญาประดิษฐ์ผู้คุมเครื่องเรนเดอร์ขนาด 128 คอร์ มีไอพ่นและหัวใจเป็น GPU พร้อมแบกรับทุกไฟล์บวม',
    quote: '"คำนวณเฟรมเรต 100% เรนเดอร์บาร์เขียวพร้อมลุย!"',
    badge: 'Crash Immune',
    weapon: 'razor'
  },
  {
    id: 'lumi',
    name: 'Lumi (ลูมิ)',
    alias: 'Prism Colorist',
    role: 'Color Master',
    themeColor: '#EC4899',
    accentColor: '#F43F5E',
    speed: 86,
    jumpPower: 96,
    slashPower: 82,
    perkName: '3D LUT Multiplier',
    perkDesc: 'เมื่อเก็บลูกบาศก์สี 3D LUT Cube จะได้รับคะแนนเพิ่มขึ้น x2 และกระโดดได้สูงขึ้น',
    lore: 'จอมเวทสาวผู้มองเห็นเฉดสีกว่า 1 พันล้านสี มีวงแหวน Lumetri ลอยรอบตัว เปลี่ยนฟุตเทจจืดให้กลายเป็นงานศิลป์',
    quote: '"โลกนี้ไม่ได้มีแค่ขาวดำ... ใส่ LUT แล้วส่องประกาย!"',
    badge: '10-Bit Color',
    weapon: 'orb'
  },
  {
    id: 'rex',
    name: 'DJ Rex (เร็กซ์)',
    alias: 'Waveform Lion',
    role: 'Sound Designer',
    themeColor: '#F59E0B',
    accentColor: '#EAB308',
    speed: 88,
    jumpPower: 86,
    slashPower: 90,
    perkName: 'Sonic Beat Pulse',
    perkDesc: 'เมื่อเก็บคลื่นเสียง Master Wave จะปล่อยพลังคลื่นโซนิคกวาดอุปสรรคข้างหน้าให้หายไป',
    lore: 'สิงโตซาวด์เอนจิเนียร์ผู้มิกซ์เสียงเบสสะเทือนปฐพี เชี่ยวชาญการตัดต่อตามจังหวะบีตดนตรี 128 BPM',
    quote: '"ตัดวิดีโอต้องลงบีต! ฟังเสียงกระแทกของไทม์ไลน์!"',
    badge: 'Beat Master',
    weapon: 'scythe'
  }
];

export const WEAPON_TYPES = [
  { id: 'razor', name: 'Laser Razor Blade (ใบมีดเลเซอร์ C)', icon: 'Scissors', desc: 'ฟันไว ระยะกว้าง สับบาร์แดงระเบิดเป็นละอองดาว' },
  { id: 'pen', name: 'Bezier Pen Tool (สไตลัสเวกเตอร์ P)', icon: 'PenTool', desc: 'แทงทะลวงเส้นทาง วาดเส้น Bezier ป้องกันสะท้อนกลับ' },
  { id: 'orb', name: 'Lumetri Prism Orb (ลูกแก้วพลังสี)', icon: 'Sparkles', desc: 'ระเบิดคลื่นแสงสเปกตรัม ลอยกลางอากาศได้นานขึ้น' },
  { id: 'scythe', name: 'Audio Wave Scythe (เคียวคลื่นเสียงเบส)', icon: 'Music', desc: 'เหวี่ยงคลื่นเสียงสะเทือน ทำลายสิ่งกีดขวางเป็นวงกว้าง' },
  { id: 'katana', name: 'Timecode Katana (ดาบซามูไรไทม์โค้ด)', icon: 'Zap', desc: 'ฟันเร็วดั่งแสง สับเฟรม 1/60 วินาทีทะลุทุกอุปสรรค' }
];

export const PERK_LIST = [
  { id: 'razor_rush', name: 'Razor Blade Rush', desc: 'ฟันทำลายบาร์แดงได้คะแนนโบนัส x2 และฟันได้ไวกว่าเดิม 30%' },
  { id: 'green_shield', name: 'Green Cache Shield', desc: 'เริ่มต้นเกมด้วยเกราะแคชสีเขียว ป้องกันการชนล้มเหลว 1 ครั้ง' },
  { id: 'lut_multiplier', name: '3D LUT Multiplier', desc: 'เมื่อเก็บ 3D LUT จะได้รับแต้มพิเศษ และกระโดดลอยตัวได้นานขึ้น' },
  { id: 'sonic_pulse', name: 'Sonic Beat Pulse', desc: 'เมื่อเก็บคลื่นเสียง จะระเบิดโซนิคเวฟกวาดอุปสรรคข้างหน้าออกไป' },
  { id: 'magnet_keyframe', name: 'Keyframe Magnet', desc: 'สนามแม่เหล็กดูดเพชร Keyframe และไอเทมเข้าหาตัวอัตโนมัติ' },
  { id: 'time_dilation', name: 'Time Dilation (สโลว์ไทม์)', desc: 'หน่วงเวลาให้ช้าลง 20% ทำให้หลบและเล็งฟันอุปสรรคได้ง่ายขึ้น' }
];

// LocalStorage helpers for custom user creations
const STORAGE_HEROES_KEY = 'premiere_runner_custom_heroes';
const STORAGE_STAGES_KEY = 'premiere_runner_custom_stages';

export const loadCustomHeroes = (): RunnerCharacter[] => {
  try {
    const raw = localStorage.getItem(STORAGE_HEROES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.id) : [];
  } catch {
    return [];
  }
};

export const saveCustomHero = (hero: RunnerCharacter) => {
  try {
    const existing = loadCustomHeroes();
    const updated = [hero, ...existing.filter(h => h.id !== hero.id)];
    localStorage.setItem(STORAGE_HEROES_KEY, JSON.stringify(updated));
  } catch {}
};

export const deleteCustomHero = (heroId: string) => {
  try {
    const existing = loadCustomHeroes();
    const updated = existing.filter(h => h.id !== heroId);
    localStorage.setItem(STORAGE_HEROES_KEY, JSON.stringify(updated));
  } catch {}
};

export const loadCustomStages = (): RunnerStage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_STAGES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && item.id) : [];
  } catch {
    return [];
  }
};

export const saveCustomStage = (stage: RunnerStage) => {
  try {
    const existing = loadCustomStages();
    const updated = [stage, ...existing.filter(s => s.id !== stage.id)];
    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(updated));
  } catch {}
};

export const deleteCustomStage = (stageId: string) => {
  try {
    const existing = loadCustomStages();
    const updated = existing.filter(s => s.id !== stageId);
    localStorage.setItem(STORAGE_STAGES_KEY, JSON.stringify(updated));
  } catch {}
};

// Rich Vector Character Avatar Renderer (Supports Official & User-Created Custom Heroes)
export const CharacterAvatarSvg: React.FC<{ 
  char?: RunnerCharacter | { id: string; themeColor?: string; accentColor?: string; [key: string]: any };
  charId?: string;
  size?: number; 
  isSelected?: boolean;
}> = ({ 
  char, 
  charId: propCharId,
  size = 80,
  isSelected = false 
}) => {
  const resolvedChar = char || (propCharId ? RUNNER_CHARACTERS.find(c => c.id === propCharId) : undefined) || { id: propCharId || 'kai' };
  const charId = resolvedChar.id;
  const theme = resolvedChar.themeColor || '#8B5CF6';
  const accent = resolvedChar.accentColor || '#38BDF8';
  const skin = resolvedChar.skinTone || '#FDE047';
  const hair = resolvedChar.hairColor || '#1E1B4B';
  const hairStyle = resolvedChar.hairStyle || 'anime';
  const visor = resolvedChar.visorStyle || 'cyber';
  const visorCol = resolvedChar.visorColor || accent;

  // Custom User Character Dynamic Renderer
  if (resolvedChar.isCustom || !['kru_phutsa', 'kai', 'byte', 'lumi', 'rex'].includes(charId)) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id={`grad-${charId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
          <filter id={`glow-${charId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Aura Ring */}
        <circle cx="50" cy="50" r="46" fill={`url(#grad-${charId})`} opacity={isSelected ? 0.35 : 0.15} stroke={theme} strokeWidth={isSelected ? "3" : "1.5"} />

        {/* Cyber Headphones Arc */}
        <path d="M 22 46 A 28 28 0 0 1 78 46" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" filter={`url(#glow-${charId})`} />
        
        {/* Head */}
        <ellipse cx="50" cy="52" rx="21" ry="23" fill={skin} />

        {/* Hair Styles */}
        {hairStyle === 'anime' && (
          <path d="M 28 42 Q 34 20 50 18 Q 66 20 72 42 Q 62 34 50 36 Q 38 34 28 42 Z" fill={hair} />
        )}
        {hairStyle === 'twintail' && (
          <>
            <path d="M 28 35 Q 12 55 18 78 Q 24 65 30 52 Z" fill={hair} />
            <path d="M 72 35 Q 88 55 82 78 Q 76 65 70 52 Z" fill={hair} />
            <path d="M 30 40 Q 50 28 70 40 Q 64 34 50 34 Q 36 34 30 40 Z" fill={hair} />
          </>
        )}
        {hairStyle === 'cyberpunk' && (
          <>
            <path d="M 32 38 L 50 12 L 68 38 Z" fill={hair} />
            <path d="M 44 14 L 50 6 L 56 14 Z" fill={accent} />
          </>
        )}
        {hairStyle === 'topknot' && (
          <>
            <circle cx="50" cy="18" r="8" fill={hair} />
            <path d="M 28 40 Q 50 26 72 40 Z" fill={hair} />
          </>
        )}
        {hairStyle === 'antenna' && (
          <>
            <line x1="50" y1="28" x2="50" y2="16" stroke={accent} strokeWidth="3" />
            <circle cx="50" cy="14" r="5" fill={theme} />
          </>
        )}

        {/* Visor / Glasses */}
        {visor === 'cyber' && (
          <rect x="32" y="44" width="36" height="12" rx="3" fill={visorCol} opacity="0.9" filter={`url(#glow-${charId})`} />
        )}
        {visor === 'sunglasses' && (
          <>
            <circle cx="42" cy="49" r="8" fill="#18181B" stroke={theme} strokeWidth="2" />
            <circle cx="58" cy="49" r="8" fill="#18181B" stroke={theme} strokeWidth="2" />
            <line x1="50" y1="49" x2="50" y2="49" stroke={theme} strokeWidth="2" />
          </>
        )}
        {visor === 'equalizer' && (
          <g>
            <rect x="30" y="44" width="40" height="12" rx="3" fill="#18181B" stroke={visorCol} strokeWidth="1.5" />
            <rect x="34" y="47" width="4" height="6" fill="#10B981" />
            <rect x="42" y="45" width="4" height="8" fill="#EAB308" />
            <rect x="50" y="46" width="4" height="7" fill="#EAB308" />
            <rect x="58" y="47" width="4" height="6" fill="#EF4444" />
          </g>
        )}
        {visor === 'none' && (
          <g>
            <circle cx="42" cy="49" r="2.5" fill="#1E1B4B" />
            <circle cx="58" cy="49" r="2.5" fill="#1E1B4B" />
          </g>
        )}

        {/* Smile */}
        <path d="M 44 64 Q 50 69 56 64" fill="none" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Earcups */}
        <rect x="18" y="40" width="10" height="18" rx="5" fill="#1E1B4B" stroke={accent} strokeWidth="2" />
        <rect x="72" y="40" width="10" height="18" rx="5" fill="#1E1B4B" stroke={accent} strokeWidth="2" />

        {/* Collar Suit */}
        <path d="M 32 76 Q 50 82 68 76 L 74 96 L 26 96 Z" fill={theme} stroke={accent} strokeWidth="1.5" />
      </svg>
    );
  }

  // Kru Phutsa - The Master EdTech Educator from the Facebook Channel
  if (charId === 'kru_phutsa') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="kpGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="kpKhakiShirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D5BE93" />
            <stop offset="100%" stopColor="#B39766" />
          </linearGradient>
          <linearGradient id="kpHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
          <filter id="kpGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Tech Aura (Golden-Yellow theme from the banner) */}
        <circle cx="50" cy="50" r="47" fill="#FEF3C7" opacity="0.15" />
        <circle cx="50" cy="50" r="46" fill="url(#kpGoldRing)" opacity={isSelected ? 0.35 : 0.15} stroke="#F59E0B" strokeWidth={isSelected ? "3.5" : "2"} />
        
        {/* Tech Circuit Rings & Nodes */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#0284C7" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
        <circle cx="16" cy="30" r="2.5" fill="#38BDF8" />
        <circle cx="84" cy="30" r="2.5" fill="#FBBF24" />

        {/* Floating Mini Idea Lightbulb 💡 (Top Right) */}
        <g transform="translate(73, 8) scale(0.65)" filter="url(#kpGlow)">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26C17.81 13.47 19 11.38 19 9a7 7 0 0 0-7-7z" fill="#FBBF24" />
          <path d="M9 21h6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Mini Code Tag </> (Top Left) */}
        <g transform="translate(8, 10) scale(0.65)">
          <rect x="0" y="0" width="26" height="18" rx="4" fill="#0284C7" />
          <text x="13" y="13" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
        </g>

        {/* Floating Mini Laptop with Video Play Button (Bottom Left) */}
        <g transform="translate(3, 66) scale(0.65)">
          <rect x="0" y="0" width="24" height="16" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          <polygon points="9,5 17,9 9,13" fill="#EF4444" />
          <rect x="-3" y="16" width="30" height="3" rx="1" fill="#475569" />
        </g>

        {/* Body & Khaki Teacher Uniform (ชุดข้าราชการครูสีกากี) */}
        {/* Neck */}
        <rect x="44" y="66" width="12" height="10" fill="#FCD34D" />

        {/* Khaki Shirt Torso */}
        <path d="M 22 74 Q 50 78 78 74 L 84 98 L 16 98 Z" fill="url(#kpKhakiShirt)" stroke="#927344" strokeWidth="1.2" />

        {/* Shirt Collar Points */}
        <polygon points="34,74 50,84 44,74" fill="#E2D1B1" stroke="#927344" strokeWidth="1" />
        <polygon points="66,74 50,84 56,74" fill="#E2D1B1" stroke="#927344" strokeWidth="1" />

        {/* Golden Epaulettes on Shoulders (อินทรธนูทอง) */}
        <rect x="18" y="74" width="13" height="5" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
        <circle cx="21" cy="76.5" r="1.2" fill="#78350F" />
        <rect x="69" y="74" width="13" height="5" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
        <circle cx="79" cy="76.5" r="1.2" fill="#78350F" />

        {/* Royal Decoration Ribbon Bar (แถบแพรเครื่องราชฯ บนอกซ้าย) */}
        <g transform="translate(30, 84)">
          <rect x="0" y="0" width="13" height="4" rx="0.5" fill="#0F172A" />
          <rect x="0" y="0" width="3" height="4" fill="#EF4444" />
          <rect x="3" y="0" width="3" height="4" fill="#3B82F6" />
          <rect x="6" y="0" width="4" height="4" fill="#EAB308" />
          <rect x="10" y="0" width="3" height="4" fill="#10B981" />
        </g>

        {/* Name Tag "ครูพุทรา" (อกขวา) */}
        <rect x="55" y="84" width="16" height="4" rx="0.8" fill="#18181B" stroke="#FBBF24" strokeWidth="0.5" />
        <text x="63" y="87.2" fill="#FFFFFF" fontSize="3" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">ครูพุทรา</text>

        {/* Head & Face */}
        <ellipse cx="50" cy="46" rx="20" ry="22" fill="#FDE68A" />

        {/* Cheerful Friendly Eyebrows */}
        <path d="M 36 37 Q 42 35 46 37" fill="none" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />
        <path d="M 54 37 Q 58 35 64 37" fill="none" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />

        {/* Warm Smiling Eyes */}
        <path d="M 37 43 Q 41 40 45 43" fill="none" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="41" cy="43.5" r="1.5" fill="#18181B" />
        <path d="M 55 43 Q 59 40 63 43" fill="none" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="59" cy="43.5" r="1.5" fill="#18181B" />

        {/* Nose */}
        <path d="M 50 44 Q 52 48 49 50" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

        {/* Friendly Big Smile */}
        <path d="M 42 54 Q 50 62 58 54" fill="#FFFFFF" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        <path d="M 45 54 Q 50 59 55 54" fill="#EF4444" />

        {/* Rosy Cheeks */}
        <circle cx="34" cy="51" r="3.5" fill="#F87171" opacity="0.4" />
        <circle cx="66" cy="51" r="3.5" fill="#F87171" opacity="0.4" />

        {/* Black Styled Hair (Neat Side Part, matching the Facebook banner cartoon) */}
        <path d="M 28 42 Q 30 22 50 18 Q 70 20 72 40 Q 64 30 52 30 Q 38 30 28 42 Z" fill="url(#kpHair)" />
        <path d="M 44 20 Q 56 16 66 24 Q 60 26 50 24 Z" fill="#3F3F46" />

        {/* Thumbs Up Gesture (Right Hand 👍 from banner) */}
        <g transform="translate(74, 68) scale(0.7)">
          <circle cx="10" cy="10" r="11" fill="#F59E0B" opacity="0.2" />
          <path d="M 6 12 L 6 18 Q 6 20 8 20 L 14 20 Q 16 20 16 18 L 16 12 Q 16 10 14 10 L 11 10 L 12 6 Q 12 4 10 4 L 9 5 Q 8 7 7 10 L 6 12 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <text x="21" y="17" fill="#F59E0B" fontSize="11">👍</text>
        </g>
      </svg>
    );
  }

  // Pre-configured official heroes (Kai, Byte, Lumi, Rex)
  if (charId === 'kai') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="kaiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="60%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="neonGlowKai" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#kaiGrad)" opacity={isSelected ? 0.3 : 0.15} stroke="#8B5CF6" strokeWidth={isSelected ? "3" : "1.5"} />
        <path d="M 22 46 A 28 28 0 0 1 78 46" fill="none" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" filter="url(#neonGlowKai)" />
        <ellipse cx="50" cy="52" rx="22" ry="24" fill="#FDE047" />
        <path d="M 28 42 Q 34 22 50 20 Q 66 22 72 42 Q 62 36 50 38 Q 38 36 28 42 Z" fill="url(#hairGrad)" />
        <path d="M 40 22 L 48 10 L 52 22 Z" fill="#8B5CF6" />
        <path d="M 54 22 L 62 13 L 64 24 Z" fill="#3B82F6" />
        <rect x="32" y="44" width="36" height="12" rx="4" fill="#0EA5E9" opacity="0.9" filter="url(#neonGlowKai)" />
        <rect x="35" y="46" width="30" height="2" fill="#FFFFFF" opacity="0.7" />
        <path d="M 43 64 Q 50 70 57 64" fill="none" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="18" y="40" width="10" height="18" rx="5" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="2" />
        <rect x="72" y="40" width="10" height="18" rx="5" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="2" />
        <path d="M 32 76 Q 50 82 68 76 L 74 96 L 26 96 Z" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="1.5" />
      </svg>
    );
  }

  if (charId === 'byte') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="byteBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#10B981" opacity={isSelected ? 0.25 : 0.1} stroke="#10B981" strokeWidth={isSelected ? "3" : "1.5"} />
        <circle cx="50" cy="18" r="7" fill="#F59E0B" stroke="#FBBF24" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="34" stroke="#6EE7B7" strokeWidth="3" />
        <rect x="24" y="32" width="52" height="42" rx="14" fill="url(#byteBody)" stroke="#34D399" strokeWidth="2.5" />
        <rect x="30" y="38" width="40" height="28" rx="8" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="40" cy="48" r="3.5" fill="#34D399" filter="url(#greenGlow)" />
        <circle cx="60" cy="48" r="3.5" fill="#34D399" filter="url(#greenGlow)" />
        <path d="M 44 56 Q 50 61 56 56" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 38 74 L 62 74 L 56 86 L 44 86 Z" fill="#065F46" />
        <path d="M 45 86 Q 50 96 55 86 Z" fill="#F59E0B" filter="url(#greenGlow)" />
      </svg>
    );
  }

  if (charId === 'lumi') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="lumiHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="33%" stopColor="#10B981" />
            <stop offset="66%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#EC4899" opacity={isSelected ? 0.25 : 0.1} stroke="#EC4899" strokeWidth={isSelected ? "3" : "1.5"} />
        <circle cx="50" cy="22" r="14" fill="none" stroke="url(#wheelGrad)" strokeWidth="3" filter="url(#pinkGlow)" />
        <path d="M 28 35 Q 12 55 18 78 Q 24 65 30 52 Z" fill="url(#lumiHair)" />
        <path d="M 72 35 Q 88 55 82 78 Q 76 65 70 52 Z" fill="url(#lumiHair)" />
        <ellipse cx="50" cy="52" rx="20" ry="22" fill="#FFE4E6" />
        <path d="M 30 40 Q 50 28 70 40 Q 64 34 50 34 Q 36 34 30 40 Z" fill="url(#lumiHair)" />
        <circle cx="42" cy="49" r="8" fill="#F43F5E" opacity="0.6" stroke="#EC4899" strokeWidth="2" />
        <circle cx="58" cy="49" r="8" fill="#3B82F6" opacity="0.6" stroke="#8B5CF6" strokeWidth="2" />
        <line x1="50" y1="49" x2="50" y2="49" stroke="#EC4899" strokeWidth="3" />
        <path d="M 45 62 Q 50 67 55 62" fill="none" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // DJ Rex
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
      <defs>
        <linearGradient id="rexFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="rexMane" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#F59E0B" opacity={isSelected ? 0.25 : 0.1} stroke="#F59E0B" strokeWidth={isSelected ? "3" : "1.5"} />
      <circle cx="50" cy="52" r="32" fill="url(#rexMane)" />
      <ellipse cx="50" cy="53" rx="20" ry="21" fill="url(#rexFur)" />
      <circle cx="30" cy="30" r="8" fill="url(#rexMane)" />
      <circle cx="70" cy="30" r="8" fill="url(#rexMane)" />
      <rect x="30" y="44" width="40" height="12" rx="3" fill="#18181B" stroke="#EAB308" strokeWidth="2" />
      <rect x="34" y="47" width="4" height="6" fill="#10B981" />
      <rect x="42" y="46" width="4" height="7" fill="#10B981" />
      <rect x="50" y="45" width="4" height="9" fill="#EAB308" />
      <rect x="58" y="47" width="4" height="6" fill="#EF4444" />
      <ellipse cx="50" cy="62" rx="10" ry="7" fill="#FEF3C7" />
      <path d="M 22 45 A 30 30 0 0 1 78 45" fill="none" stroke="#F59E0B" strokeWidth="5" />
      <rect x="18" y="40" width="10" height="18" rx="5" fill="#18181B" stroke="#F59E0B" strokeWidth="2" />
      <rect x="72" y="40" width="10" height="18" rx="5" fill="#18181B" stroke="#F59E0B" strokeWidth="2" />
    </svg>
  );
};

