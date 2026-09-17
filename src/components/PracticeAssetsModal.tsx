import React, { useState } from 'react';
import { 
  X, 
  FolderDown, 
  Download, 
  Film, 
  Volume2, 
  Sparkles, 
  Layers, 
  FileCode, 
  Check, 
  ExternalLink, 
  Search, 
  Play, 
  Sliders, 
  Package,
  HardDrive,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import JSZip from 'jszip';
import { 
  generateRealCubeLut, 
  generateSfxAudio, 
  generateRealPremiereXml 
} from '../utils/realAssets';
import { PremiereLogo } from './PremiereLogo';

interface AssetCard {
  id: string;
  title: string;
  category: 'footage' | 'sfx' | 'lut' | 'template' | 'graphic';
  description: string;
  format: string;
  size: string;
  badge: string;
  previewNote?: string;
  externalUrl?: string;
  downloadHandler?: () => Promise<void> | void;
}

interface PracticeAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast?: (msg: string) => void;
}

export const PracticeAssetsModal: React.FC<PracticeAssetsModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingBundle, setDownloadingBundle] = useState(false);

  if (!isOpen) return null;

  // Real Generators for individual downloads
  const downloadLut = (name: string, tone: 'teal_orange' | 'warm' | 'moody' | 'vintage') => {
    const content = generateRealCubeLut(name, tone);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.cube`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onTriggerToast) onTriggerToast(`ดาวน์โหลดไฟล์ LUT ${name}.cube สำเร็จ!`);
  };

  const downloadSfx = (name: string, type: 'whoosh' | 'pop' | 'click' | 'boom') => {
    const { blob } = generateSfxAudio(type);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onTriggerToast) onTriggerToast(`ดาวน์โหลดไฟล์เสียง ${name}.wav สำเร็จ!`);
  };

  const downloadXml = (name: string, sequenceName: string) => {
    const content = generateRealPremiereXml(sequenceName);
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onTriggerToast) onTriggerToast(`ดาวน์โหลด Template ลำดับงาน ${name}.xml สำเร็จ!`);
  };

  const downloadPngGraphic = (name: string, titleText: string, subtitleText: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear transparent
      ctx.clearRect(0, 0, 1920, 1080);
      // Draw modern Lower Third banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(120, 840, 680, 120, 16);
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText(titleText, 160, 895);

      ctx.fillStyle = '#A78BFA';
      ctx.font = '22px sans-serif';
      ctx.fillText(subtitleText, 160, 935);

      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${name}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          if (onTriggerToast) onTriggerToast(`ดาวน์โหลดกราฟิก ${name}.png สำเร็จ!`);
        }
      }, 'image/png');
    }
  };

  const handleDownloadCompleteBundle = async () => {
    setDownloadingBundle(true);
    try {
      const zip = new JSZip();
      // LUTs
      const lutsFolder = zip.folder('01_LUTs_Color_Grading');
      lutsFolder?.file('Teal_and_Orange_Blockbuster.cube', generateRealCubeLut('Teal and Orange Blockbuster', 'teal_orange'));
      lutsFolder?.file('Warm_Cinematic_Vlog.cube', generateRealCubeLut('Warm Cinematic Vlog', 'warm'));
      lutsFolder?.file('Moody_Nordic_Film.cube', generateRealCubeLut('Moody Nordic Film', 'moody'));
      lutsFolder?.file('Black_and_White_Vintage.cube', generateRealCubeLut('Black and White Vintage', 'vintage'));

      // SFX
      const sfxFolder = zip.folder('02_Sound_Effects_WAV');
      sfxFolder?.file('Whoosh_Transition_Fast.wav', generateSfxAudio('whoosh').blob);
      sfxFolder?.file('Pop_Digital_Impact.wav', generateSfxAudio('pop').blob);
      sfxFolder?.file('Camera_Shutter_Click.wav', generateSfxAudio('click').blob);
      sfxFolder?.file('Deep_Sub_Bass_Drop.wav', generateSfxAudio('boom').blob);

      // Templates
      const xmlFolder = zip.folder('03_Sequence_Templates_XML');
      xmlFolder?.file('Sequence_YouTube_1080p60.xml', generateRealPremiereXml('YouTube Vlog 1080p60 Master'));
      xmlFolder?.file('Sequence_Cinematic_4K_24fps.xml', generateRealPremiereXml('Cinematic 4K 23.976fps Master'));
      xmlFolder?.file('Sequence_Vertical_9x16_Reels.xml', generateRealPremiereXml('Instagram Reels TikTok 1080x1920'));

      // Readme & Free Footage Sources Guide
      const guideText = `================================================================
PREMIERE MASTERCLASS — COMPLETE PRACTICE ASSET BUNDLE (FREE)
================================================================
ชุดไฟล์สำหรับการฝึกซ้อมตัดต่อวิดีโอมืออาชีพ โดย Premiere Masterclass Studio

เนื้อหาภายในชุด Bundle นี้:
1. [01_LUTs_Color_Grading] : 4 ไฟล์ LUT (.cube) แท้ พร้อมใช้ในแผง Lumetri Color
   - Teal_and_Orange_Blockbuster.cube
   - Warm_Cinematic_Vlog.cube
   - Moody_Nordic_Film.cube
   - Black_and_White_Noir.cube

2. [02_Sound_Effects_WAV] : 4 ไฟล์เสียงเอฟเฟกต์ 44.1kHz WAV สด ไม่ติดลิขสิทธิ์
   - Whoosh_Transition_Fast.wav
   - Glitch_Digital_Impact.wav
   - Camera_Shutter_Click.wav
   - Deep_Sub_Bass_Drop.wav

3. [03_Sequence_Templates_XML] : โครงสร้าง Sequence ไทม์ไลน์สำเร็จรูป Import ใน Premiere Pro ได้ทันที
   - Sequence_YouTube_1080p60.xml
   - Sequence_Cinematic_4K_24fps.xml
   - Sequence_Vertical_9x16_Reels.xml

แหล่งดาวน์โหลดฟุตเทจฟรี (Public Domain & Free Commercial License):
- Pexels Videos : https://www.pexels.com/videos/ (4K / Full HD ฟรี 100%)
- Mixkit Free Assets : https://mixkit.co/free-stock-video/ (ฟุตเทจ, เพลง, SFX)
- Coverr Co : https://coverr.co/ (ฟุตเทจภาพสวยเหมาะทำ B-Roll)

ขอให้สนุกกับการสร้างสรรค์ผลงานตัดต่อครับ!
================================================================
`;
      zip.file('README_Asset_Guide.txt', guideText);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Premiere_Masterclass_Complete_Practice_Assets.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (onTriggerToast) onTriggerToast('ดาวน์โหลดชุด Asset Bundle รวม (.zip) เรียบร้อยแล้ว!');
    } catch (err) {
      console.error('Failed to bundle assets:', err);
    } finally {
      setDownloadingBundle(false);
    }
  };

  const assets: AssetCard[] = [
    // LUTs
    {
      id: 'lut-teal-orange',
      title: 'Teal & Orange Hollywood Look',
      category: 'lut',
      description: 'ปรับโทนสีผิวธรรมชาติ ขับเน้นสีท้องฟ้าและเงามืดสไตล์ภาพยนตร์ฟอร์มยักษ์',
      format: '.CUBE (3D LUT 33x33x33)',
      size: '220 KB',
      badge: 'ยอดนิยมสูงสุด',
      downloadHandler: () => downloadLut('Teal_and_Orange_Hollywood', 'teal_orange')
    },
    {
      id: 'lut-warm-vlog',
      title: 'Warm Golden Hour Vlog Look',
      category: 'lut',
      description: 'โทนสีอบอุ่น นุ่มนวล เหมาะสำหรับวิดีโอคาเฟ่ ท่องเที่ยว และ Lifestyle Story',
      format: '.CUBE (3D LUT 33x33x33)',
      size: '220 KB',
      badge: 'Lifestyle / Travel',
      downloadHandler: () => downloadLut('Warm_Golden_Hour_Vlog', 'warm')
    },
    {
      id: 'lut-moody-film',
      title: 'Moody Nordic Film Look',
      category: 'lut',
      description: 'คุมโทนสีเขียวอมฟ้า ตัดคอนทราสต์จัดจ้าน เพิ่มความลึกลับและอารมณ์ดราม่า',
      format: '.CUBE (3D LUT 33x33x33)',
      size: '220 KB',
      badge: 'Dramatic Film',
      downloadHandler: () => downloadLut('Moody_Nordic_Film', 'moody')
    },
    {
      id: 'lut-bw-noir',
      title: 'Monochrome Film Noir Look',
      category: 'lut',
      description: 'ขาวดำคอนทราสต์สูง สไตล์กล้องฟิล์มคลาสสิก พร้อมเกรนภาพจำลอง',
      format: '.CUBE (3D LUT 33x33x33)',
      size: '220 KB',
      badge: 'Classic Noir',
      downloadHandler: () => downloadLut('Monochrome_Film_Noir', 'vintage')
    },

    // Sound FX
    {
      id: 'sfx-whoosh',
      title: 'Fast Cinematic Whoosh Transition',
      category: 'sfx',
      description: 'เสียงลมหวดสะบัดความถี่สูงสำหรับประกอบการสลับฉาก Whip Pan หรือ Zoom Cut',
      format: 'WAV (44.1kHz, 16-bit Mono)',
      size: '85 KB',
      badge: 'Essential SFX',
      downloadHandler: () => downloadSfx('Fast_Cinematic_Whoosh', 'whoosh')
    },
    {
      id: 'sfx-glitch',
      title: 'Digital Glitch & Data Hit',
      category: 'sfx',
      description: 'เสียงคลื่นสัญญาณรบกวนและไฟช็อตสไตล์ไซเบอร์ เหมาะกับจังหวะ Transition ด่วน',
      format: 'WAV (44.1kHz, 16-bit Mono)',
      size: '95 KB',
      badge: 'Cyber / Tech',
      downloadHandler: () => downloadSfx('Digital_Glitch_Data_Hit', 'pop')
    },
    {
      id: 'sfx-sub-bass',
      title: 'Deep Sub-Bass Impact Boom',
      category: 'sfx',
      description: 'เสียงเบสต่ำ 40-80Hz สั่นสะเทือนอารมณ์สำหรับจุดไคลแมกซ์หรือเปิดหัวไตเติล',
      format: 'WAV (44.1kHz, 16-bit Mono)',
      size: '140 KB',
      badge: 'Cinematic Hit',
      downloadHandler: () => downloadSfx('Deep_Sub_Bass_Boom', 'boom')
    },
    {
      id: 'sfx-camera',
      title: 'Mechanical Camera Shutter Click',
      category: 'sfx',
      description: 'เสียงชัตเตอร์กล้องถ่ายรูปและกดสวิตช์ สำหรับจังหวะ Freeze Frame หรือแสดงภาพนิ่ง',
      format: 'WAV (44.1kHz, 16-bit Mono)',
      size: '45 KB',
      badge: 'UI & Texture',
      downloadHandler: () => downloadSfx('Mechanical_Camera_Shutter', 'click')
    },

    // Templates
    {
      id: 'tpl-youtube',
      title: 'YouTube 1080p60 Timeline Sequence',
      category: 'template',
      description: 'ไทม์ไลน์มาตรฐาน Full HD 60fps ตั้งค่าแทร็ก V1-V3, A1-A4 พร้อม Color Marker',
      format: 'Premiere XML Interchange (.xml)',
      size: '15 KB',
      badge: 'YouTube Ready',
      downloadHandler: () => downloadXml('Sequence_YouTube_1080p60', 'YouTube Master 1080p60')
    },
    {
      id: 'tpl-cinematic',
      title: 'Cinematic 4K 23.976fps Master Sequence',
      category: 'template',
      description: 'ไทม์ไลน์ภาพยนตร์ 3840x2160 อัตราส่วน 24p สำหรับเกรดสีและมิกซ์เสียงรอบทิศทาง',
      format: 'Premiere XML Interchange (.xml)',
      size: '16 KB',
      badge: 'Cinematic 4K',
      downloadHandler: () => downloadXml('Sequence_Cinematic_4K_24fps', 'Cinematic 4K Master')
    },
    {
      id: 'tpl-vertical',
      title: 'Vertical 9:16 Shorts / Reels Sequence',
      category: 'template',
      description: 'โครงสร้างลำดับงานแนวตั้ง 1080x1920 30fps สำหรับคลิป TikTok และ Instagram Reels',
      format: 'Premiere XML Interchange (.xml)',
      size: '15 KB',
      badge: 'Shorts & TikTok',
      downloadHandler: () => downloadXml('Sequence_Vertical_Shorts_Reels', 'TikTok Reels 9x16 Master')
    },

    // Graphics
    {
      id: 'gfx-lower-third-1',
      title: 'Modern Glass Lower Third Graphic',
      category: 'graphic',
      description: 'แบนเนอร์แสดงชื่อและตำแหน่งแบบโปร่งแสง Alpha Transparent ลากลง V3 ใช้งานได้ทันที',
      format: 'PNG (1920x1080 Transparent)',
      size: '110 KB',
      badge: 'Transparent Overlay',
      downloadHandler: () => downloadPngGraphic('Lower_Third_Speaker', 'VORAWUT PHETRAI', 'Premiere Pro Certified Lead Instructor')
    },
    {
      id: 'gfx-lower-third-2',
      title: 'Topic Chapter Title Card',
      category: 'graphic',
      description: 'กราฟิกหัวข้อบทเรียนและสัญลักษณ์เวลาสำหรับคั่นช่วงวิดีโออย่างเป็นระบบ',
      format: 'PNG (1920x1080 Transparent)',
      size: '95 KB',
      badge: 'Chapter Title',
      downloadHandler: () => downloadPngGraphic('Chapter_Break_Overlay', 'CHAPTER 03 : COLOR GRADING', 'Lumetri Color Deep Dive Workshop')
    },

    // Footage Resources
    {
      id: 'ftg-pexels',
      title: 'Pexels 4K Free Stock Video Vault',
      category: 'footage',
      description: 'คลังฟุตเทจวิดีโอ 4K และ Full HD ฟรี 100% สำหรับฝึก B-Roll, Drone, อาหาร และเมือง',
      format: 'External Source (Free Commercial License)',
      size: 'Unlimited',
      badge: '4K Public Domain',
      externalUrl: 'https://www.pexels.com/videos/'
    },
    {
      id: 'ftg-mixkit',
      title: 'Mixkit Free B-Roll & Transitions',
      category: 'footage',
      description: 'คลิปฟุตเทจคัดพิเศษจากครีเอเตอร์ระดับโลก โหลดได้ไม่ต้องลงทะเบียน',
      format: 'External Source (Mixkit Free License)',
      size: 'High Bitrate',
      badge: 'Curated Footage',
      externalUrl: 'https://mixkit.co/free-stock-video/'
    }
  ];

  const filteredAssets = assets.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.format.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'lut': return <Sliders className="w-4 h-4 text-purple-400" />;
      case 'sfx': return <Volume2 className="w-4 h-4 text-amber-400" />;
      case 'template': return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'graphic': return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'footage': return <Film className="w-4 h-4 text-blue-400" />;
      default: return <Package className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div 
      id="practice-assets-modal-backdrop"
      className="fixed inset-0 z-[3100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div 
        id="practice-assets-modal-window"
        className="w-full max-w-5xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <PremiereLogo className="w-10 h-10 rounded-xl shadow-md" withGlow />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#EDEDF4]">
                  คลังไฟล์ฝึกซ้อม & ฟุตเทจฟรี (Practice Assets Hub)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  FREE 100%
                </span>
              </div>
              <p className="text-xs text-[#9A9AB0]">
                ดาวน์โหลด LUTs, Sound Effects, Premiere Sequence Templates และ Lower Thirds สำหรับฝึกตัดต่อ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download All Bundle Button */}
            <button
              onClick={handleDownloadCompleteBundle}
              disabled={downloadingBundle}
              className="gradient-btn px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102 transition-all disabled:opacity-60 text-white"
              title="ดาวน์โหลดไฟล์ทั้งหมดรวมกันในไฟล์ ZIP ไฟล์เดียว"
            >
              <Package className="w-4 h-4" />
              <span>{downloadingBundle ? 'กำลังรวมไฟล์...' : 'ดาวน์โหลดชุดรวม (All-in-One ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-[#9A9AB0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'lut', label: 'Color LUTs (.cube)' },
              { id: 'sfx', label: 'Sound FX (.wav)' },
              { id: 'template', label: 'Sequence XML' },
              { id: 'graphic', label: 'Graphic Overlays' },
              { id: 'footage', label: 'Free Footage' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-white/5 text-[#9A9AB0] hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#9A9AB0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา Asset, LUT, SFX..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredAssets.map(asset => {
              return (
                <div
                  key={asset.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.08] transition-all flex flex-col justify-between group space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                          {getCategoryIcon(asset.category)}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#9A9AB0] border border-white/5">
                          {asset.badge}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6B6B85]">
                        {asset.size}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[#EDEDF4] group-hover:text-purple-300 transition-colors">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-[#9A9AB0] mt-1 leading-relaxed">
                        {asset.description}
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-cyan-300/80 bg-black/30 px-2.5 py-1 rounded-lg border border-white/5 truncate">
                      {asset.format}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-[#6B6B85]">
                      {asset.externalUrl ? 'เว็บไซต์ภายนอก' : 'ดาวน์โหลดไฟล์จริง'}
                    </span>

                    {asset.externalUrl ? (
                      <a
                        href={asset.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600/25 hover:bg-blue-600/40 text-blue-200 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>เปิดคลังคลิป</span>
                      </a>
                    ) : (
                      <button
                        onClick={async () => {
                          setDownloadingId(asset.id);
                          if (asset.downloadHandler) {
                            await asset.downloadHandler();
                          }
                          setTimeout(() => setDownloadingId(null), 1500);
                        }}
                        disabled={downloadingId === asset.id}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer group-hover:scale-102"
                      >
                        {downloadingId === asset.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">ดาวน์โหลดแล้ว!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-purple-300" />
                            <span>ดาวน์โหลด</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12 text-xs text-[#9A9AB0]">
              ไม่พบไฟล์ Asset ที่ตรงกับคำค้นหา "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-[#9A9AB0] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ทุกไฟล์สามารถนำไปใช้งานเชิงพาณิชย์และส่งงาน Workshop ในหลักสูตรได้โดยไม่มีข้อจำกัดด้านลิขสิทธิ์</span>
          </div>
          <span className="font-mono text-[11px] text-purple-300">
            {filteredAssets.length} รายการพร้อมใช้งาน
          </span>
        </div>
      </div>
    </div>
  );
};
