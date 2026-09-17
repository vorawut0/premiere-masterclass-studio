import React, { useState, useRef } from 'react';
import { 
  Download, 
  FileText, 
  Presentation, 
  FolderArchive, 
  SlidersHorizontal, 
  Film, 
  Type, 
  Image as ImageIcon, 
  Volume2, 
  Layers, 
  GitCompare, 
  Sparkles, 
  LayoutGrid,
  Check,
  Play,
  Pause,
  ExternalLink,
  Eye,
  X,
  FileCheck2,
  Package,
  Music,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { MEDIA_CATEGORIES } from '../data/masterclassData';
import { MediaCategory } from '../types';
import { 
  generateSfxAudio, 
  generateRealCubeLut, 
  generateTransparentPng, 
  generateRealPremiereXml, 
  generateRealEffectPreset, 
  buildRealPdfCheatsheetHtml, 
  generateFullZipPackage 
} from '../utils/realAssets';

interface MediaSectionProps {
  onTriggerToast: (msg: string) => void;
}

const ICON_MAP: Record<string, any> = {
  FileText,
  Presentation,
  FolderArchive,
  SlidersHorizontal,
  Film,
  Type,
  Image: ImageIcon,
  Volume2,
  Layers,
  GitCompare,
  Sparkles,
  LayoutGrid
};

export const MediaSection: React.FC<MediaSectionProps> = ({ onTriggerToast }) => {
  const [downloadedItems, setDownloadedItems] = useState<string[]>([]);
  const [activePreviewItem, setActivePreviewItem] = useState<MediaCategory | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Audio Preview State for SFX
  const [playingSfx, setPlayingSfx] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Helper: Trigger native file download
  const triggerFileDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Play Real Synthesized Audio in Browser
  const handlePlaySound = (type: 'whoosh' | 'pop' | 'click' | 'boom') => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    if (playingSfx === type) {
      setPlayingSfx(null);
      return;
    }

    try {
      const { url } = generateSfxAudio(type);
      const audio = new Audio(url);
      activeAudioRef.current = audio;
      setPlayingSfx(type);

      audio.onended = () => {
        setPlayingSfx(null);
        activeAudioRef.current = null;
      };

      audio.play().catch(e => {
        console.warn("Audio play error:", e);
        setPlayingSfx(null);
      });
    } catch (err) {
      console.error(err);
      setPlayingSfx(null);
    }
  };

  // Download Individual Real File
  const handleDownloadSingleFile = async (item: MediaCategory) => {
    setIsProcessing(item.id);
    try {
      if (item.id === 'pdf') {
        // Generate real PDF Cheatsheet
        const element = document.createElement('div');
        element.innerHTML = buildRealPdfCheatsheetHtml();
        document.body.appendChild(element);

        const opt = {
          margin: 10,
          filename: 'PremiereMaster_Cheatsheet_Official.pdf',
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        await html2pdf().set(opt).from(element).save();
        document.body.removeChild(element);
        onTriggerToast(`ดาวน์โหลดเอกสารสรุป PDF จริงเรียบร้อยแล้ว!`);

      } else if (item.id === 'cube') {
        // Real .cube 3D LUT
        const content = generateRealCubeLut('01_Teal_and_Orange_Cinematic', 'teal_orange');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        triggerFileDownload(blob, '01_Teal_and_Orange_Cinematic.cube');
        onTriggerToast(`ดาวน์โหลด 3D LUT (.cube) สำหรับ Lumetri Color เรียบร้อยแล้ว!`);

      } else if (item.id === 'mp3') {
        // Real .wav SFX audio file
        const { blob } = generateSfxAudio('whoosh');
        triggerFileDownload(blob, 'SFX_Cinematic_Whoosh_Transition.wav');
        onTriggerToast(`ดาวน์โหลดไฟล์เสียงเอฟเฟกต์ SFX (.wav) จริงเรียบร้อยแล้ว!`);

      } else if (item.id === 'png') {
        // Real transparent PNG graphic
        const blob = await generateTransparentPng('lowerthird');
        triggerFileDownload(blob, 'Graphic_Lower_Third_Transparent.png');
        onTriggerToast(`ดาวน์โหลดกราฟิก PNG โปร่งใสจริงเรียบร้อยแล้ว!`);

      } else if (item.id === 'prproj' || item.id === 'template') {
        // Real Premiere Sequence XML
        const xml = generateRealPremiereXml('PremiereMaster_Master_1080p24_Sequence');
        const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
        triggerFileDownload(blob, 'PremiereMaster_Master_Sequence_1080p24.xml');
        onTriggerToast(`ดาวน์โหลดไฟล์ Sequence (.xml) นำเข้า Premiere Pro ได้ทันที!`);

      } else if (item.id === 'preset') {
        // Real Effect Preset
        const prfpset = generateRealEffectPreset('Smooth_Zoom_In_Ease');
        const blob = new Blob([prfpset], { type: 'application/xml;charset=utf-8' });
        triggerFileDownload(blob, 'Smooth_Zoom_In_Ease.prfpset');
        onTriggerToast(`ดาวน์โหลด Effect Preset (.prfpset) เรียบร้อยแล้ว!`);

      } else {
        // Default: Full zip bundle
        const zipBlob = await generateFullZipPackage(item.id, item.name);
        triggerFileDownload(zipBlob, `PremiereMaster_${item.id}_Pack.zip`);
        onTriggerToast(`ดาวน์โหลดชุดไฟล์ ${item.name} (.zip) เรียบร้อยแล้ว!`);
      }

      if (!downloadedItems.includes(item.id)) {
        setDownloadedItems(prev => [...prev, item.id]);
      }
    } catch (error) {
      console.error("Download failed:", error);
      onTriggerToast(`เกิดข้อผิดพลาดในการสร้างไฟล์`);
    } finally {
      setIsProcessing(null);
    }
  };

  // Download Full ZIP Archive with all items
  const handleDownloadZipPackage = async (item: MediaCategory) => {
    setIsProcessing(item.id + '_zip');
    try {
      const zipBlob = await generateFullZipPackage(item.id, item.name);
      triggerFileDownload(zipBlob, `PremiereMaster_${item.id}_Complete_Package.zip`);
      
      if (!downloadedItems.includes(item.id)) {
        setDownloadedItems(prev => [...prev, item.id]);
      }
      onTriggerToast(`ดาวน์โหลดแพ็กเกจรวม ZIP สำหรับ ${item.name} สำเร็จ!`);
    } catch (err) {
      console.error(err);
      onTriggerToast(`ไม่สามารถสร้างแพ็กเกจ ZIP ได้`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <section id="media" className="py-20 relative bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
      <div className="studio-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#B794F6] uppercase tracking-wider">
              <span className="w-4 h-px bg-[#B794F6]"></span>
              EXCLUSIVE ASSETS & PROJECT FILES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">สื่อการเรียน & ดาวน์โหลด</h2>
            <p className="text-sm text-[#9A9AB0] max-w-xl">
              ดาวน์โหลดไฟล์โปรเจกต์ตัวอย่าง, LUTs โทนสีภาพยนตร์, พรีเซ็ตเอฟเฟกต์, 
              ฟอนต์ภาษาไทย, และ Sound Effects สำหรับใช้ฝึกทำตามในบทเรียน
            </p>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MEDIA_CATEGORIES.map(media => {
            const IconComponent = ICON_MAP[media.icon] || FileText;
            const isDownloaded = downloadedItems.includes(media.id);
            const isLoading = isProcessing === media.id;

            return (
              <div
                key={media.id}
                id={`media-item-${media.id}`}
                onClick={() => setActivePreviewItem(media)}
                className="glass-panel p-4 rounded-2xl border border-white/10 card-interactive flex items-center justify-between gap-4 group cursor-pointer hover:border-[#8B5CF6]/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#B794F6] group-hover:bg-[#8B5CF6]/20 group-hover:text-white transition-all shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#EDEDF4] truncate group-hover:text-[#B794F6] transition-colors">
                      {media.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B6B85] mt-0.5">
                    <span>{media.count} ไฟล์</span>
                    <span>•</span>
                    <span className="text-[#3B82F6]">.{media.ext}</span>
                    <span>•</span>
                    <span>{media.size}</span>
                  </div>
                  <p className="text-xs text-[#9A9AB0] truncate mt-1">
                    {media.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setActivePreviewItem(media)}
                    title="เปิดดูพรีวิวตัวอย่างไฟล์"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-[#9A9AB0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDownloadSingleFile(media)}
                    id={`download-media-btn-${media.id}`}
                    title={`ดาวน์โหลดไฟล์จริง ${media.name}`}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isDownloaded
                        ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                        : 'bg-white/5 border border-white/10 text-[#EDEDF4] hover:bg-[#8B5CF6] hover:text-white hover:border-transparent'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                    ) : isDownloaded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Inspection & Real Preview Modal */}
      {activePreviewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePreviewItem(null)}
        >
          <div 
            className="glass-panel w-full max-w-2xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-[#0F0F16]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#B794F6]">
                  {React.createElement(ICON_MAP[activePreviewItem.icon] || FileText, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{activePreviewItem.name}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      .{activePreviewItem.ext}
                    </span>
                  </div>
                  <p className="text-xs text-[#9A9AB0] mt-0.5">{activePreviewItem.desc}</p>
                </div>
              </div>

              <button
                onClick={() => setActivePreviewItem(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-[#9A9AB0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Specialized Real Preview according to category */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Category 1: Sound Effects (SFX) with Real Web Audio Player */}
              {activePreviewItem.id === 'mp3' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-[#9A9AB0] uppercase tracking-wider flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                      ทดลองฟังเสียงจริง (Interactive Audio Player)
                    </h4>
                    <span className="text-[11px] font-mono text-[#34D399]">PCM 44.1kHz • 16-Bit WAV</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'whoosh', name: 'Cinematic Whoosh Transition', dur: '0.65s', desc: 'เสียงเคลื่อนไหวฟึ่บสำหรับสลับฉาก Cut/Transition' },
                      { id: 'pop', name: 'UI Bubble Pop Notification', dur: '0.25s', desc: 'เสียงป๊อปใสสำหรับเปิดตัวอักษร ข้อความ หรือไอคอน' },
                      { id: 'click', name: 'Camera Shutter Click', dur: '0.08s', desc: 'เสียงคลิกชัตเตอร์กล้องถ่ายภาพแบบคมกริบ' },
                      { id: 'boom', name: 'Cinematic Sub Bass Boom', dur: '1.20s', desc: 'เสียงเบสกระแทกต่ำสร้างความตื่นเต้นในจังหวะดร็อป' }
                    ].map(sfx => (
                      <div 
                        key={sfx.id} 
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3"
                      >
                        <button
                          onClick={() => handlePlaySound(sfx.id as any)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                            playingSfx === sfx.id
                              ? 'bg-[#38BDF8] text-slate-950 shadow-md shadow-[#38BDF8]/40 animate-pulse'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {playingSfx === sfx.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white truncate">{sfx.name}</span>
                            <span className="text-[10px] font-mono text-[#6B6B85]">{sfx.dur}</span>
                          </div>
                          <p className="text-[11px] text-[#9A9AB0] truncate mt-0.5">{sfx.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            const { blob } = generateSfxAudio(sfx.id as any);
                            triggerFileDownload(blob, `SFX_${sfx.id}.wav`);
                            onTriggerToast(`ดาวน์โหลด ${sfx.name} (.wav) เรียบร้อย!`);
                          }}
                          title="ดาวน์โหลดไฟล์ .wav นี้"
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#8B5CF6] text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2: 3D LUTs (Cube) with Real Visual Preview */}
              {activePreviewItem.id === 'cube' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-[#9A9AB0] uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#B794F6]" />
                      ตัวอย่างการเกรดสีจริง (Real Lumetri Color Simulation)
                    </h4>
                    <span className="text-[11px] font-mono text-[#B794F6]">17x17x17 3D Lattice</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl overflow-hidden border border-white/10 relative group">
                      <div className="h-32 bg-gradient-to-tr from-slate-800 via-gray-600 to-slate-700 flex items-center justify-center p-4">
                        <div className="text-center opacity-80">
                          <span className="text-xs font-mono text-white/80 bg-black/40 px-2 py-1 rounded">BEFORE: Flat Log / Rec.709</span>
                          <p className="text-[10px] text-white/60 mt-1">ภาพดิบก่อนย้อมโทนสี คอนทราสต์ต่ำ</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-[#38BDF8]/40 relative group shadow-lg shadow-cyan-950/30">
                      <div className="h-32 bg-gradient-to-tr from-cyan-950 via-teal-900 to-amber-700 flex items-center justify-center p-4">
                        <div className="text-center">
                          <span className="text-xs font-mono text-amber-300 bg-black/60 px-2 py-1 rounded border border-amber-400/30 font-bold">AFTER: Teal & Orange</span>
                          <p className="text-[10px] text-cyan-200 mt-1">เงาสีฟ้าอมเขียว ผิวโทนส้มอบอุ่น</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code snippet preview of actual .cube structure */}
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-[11px] text-[#A5B4FC] overflow-x-auto space-y-1">
                    <div className="text-[#64748B]"># PremiereMaster 3D LUT ASCII Format (.cube)</div>
                    <div>TITLE "01_Teal_and_Orange_Cinematic"</div>
                    <div>LUT_3D_SIZE 17</div>
                    <div className="text-[#38BDF8]">0.000000 0.020000 0.050000</div>
                    <div className="text-[#38BDF8]">0.062500 0.082500 0.112500</div>
                    <div className="text-[#64748B]">... (ตารางสี 4,913 พิกเซล RGB พร้อมนำเข้าใช้งาน)</div>
                  </div>
                </div>
              )}

              {/* Category 3: Transparent PNG Graphics */}
              {activePreviewItem.id === 'png' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-[#9A9AB0] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#34D399]" />
                      พรีวิวกราฟิกโปร่งใส (Alpha Transparency Grid)
                    </h4>
                    <span className="text-[11px] font-mono text-[#34D399]">32-Bit RGBA PNG</span>
                  </div>

                  {/* Checkered pattern background */}
                  <div 
                    className="p-6 rounded-xl border border-white/15 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                    style={{
                      backgroundImage: `repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%)`,
                      backgroundSize: '16px 16px'
                    }}
                  >
                    {/* Rendered graphic element demo */}
                    <div className="w-full max-w-md bg-slate-900/90 border-l-4 border-cyan-400 p-3 rounded-lg flex items-center justify-between shadow-xl">
                      <div>
                        <div className="text-white font-bold text-xs tracking-wider">VORAWUT PHETRAI</div>
                        <div className="text-slate-400 text-[10px] font-mono">LEAD VIDEO EDITOR & MOTION DESIGNER</div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        PNG Overlay
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-rose-600 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-rose-600/30">
                        <span className="text-xs font-bold text-white tracking-wider">SUBSCRIBE</span>
                        <span className="text-xs">🔔</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-[#00005B] border border-[#9999FF] flex items-center justify-center text-[#9999FF] font-bold text-sm">
                        Pr
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#9A9AB0]">กราฟิกทุกชิ้นถูกเรนเดอร์แบบพื้นหลังโปร่งแสง 100% สามารถลากวางบน Timeline ช่อง V2/V3 ทับวิดีโอได้ทันทีโดยไม่ติดขอบดำ</p>
                </div>
              )}

              {/* Category 4: PDF Cheatsheet & Documentation */}
              {activePreviewItem.id === 'pdf' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-[#9A9AB0] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#818CF8]" />
                      เนื้อหาในเอกสาร PDF (Curriculum & Cheatsheet)
                    </h4>
                    <span className="text-[11px] font-mono text-[#818CF8]">พร้อมพิมพ์ A4 / ค้นหาได้</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-white">
                      <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span><b>คีย์ลัดตัดต่อ 50+ คำสั่ง:</b> Selection (V), Razor (C), Top/Tail Trim (Q/W), Ripple Delete (Shift+Del)</span>
                    </div>
                    <div className="flex items-start gap-2 text-white">
                      <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span><b>คู่มือ Lumetri Scopes:</b> วิธีอ่านกราฟ Waveform, RGB Parade และเส้นสกินโทน (Skin Tone Line 75%)</span>
                    </div>
                    <div className="flex items-start gap-2 text-white">
                      <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span><b>ตารางมาตรฐานความดังเสียง:</b> YouTube & Social Media (-14 LUFS), Dialogue (-12 dB), Music (-20 dB)</span>
                    </div>
                    <div className="flex items-start gap-2 text-white">
                      <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span><b>สูตรการ Export วิดีโอ:</b> การตั้งค่า Bitrate, 2-Pass VBR, Color Space Rec.709 และ H.264/ProRes</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 5: Premiere Sequence / Project File */}
              {(activePreviewItem.id === 'prproj' || activePreviewItem.id === 'template') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-[#9A9AB0] uppercase tracking-wider flex items-center gap-1.5">
                      <FolderArchive className="w-3.5 h-3.5 text-[#F59E0B]" />
                      โครงสร้าง Sequence และ Track ภายในไฟล์ XML
                    </h4>
                    <span className="text-[11px] font-mono text-[#F59E0B]">1920x1080 @ 24fps</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-blue-300 flex items-center justify-between">
                      <span>Track V3: Motion Graphics & Lower Thirds (.png)</span>
                      <span className="text-[10px] bg-blue-900/60 px-2 py-0.5 rounded">V3</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-indigo-300 flex items-center justify-between">
                      <span>Track V2: B-Roll Cutaway Footage (Overlay Clips)</span>
                      <span className="text-[10px] bg-indigo-900/60 px-2 py-0.5 rounded">V2</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-purple-300 flex items-center justify-between">
                      <span>Track V1: A-Roll Main Interview Narrative (Base)</span>
                      <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded">V1</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-center justify-between">
                      <span>Track A1/A2/A3: Dialogue (48kHz) / Music / Whoosh SFX</span>
                      <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded">AUDIO</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General Package Details */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9A9AB0]">ประเภทไฟล์และขนาด:</span>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">
                    .{activePreviewItem.ext} ({activePreviewItem.count} ไฟล์ • {activePreviewItem.size})
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#34D399]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Genuine File</span>
                </div>
              </div>

            </div>

            {/* Modal Footer: Action Buttons */}
            <div className="p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3 bg-white/[0.02]">
              <button
                onClick={() => handleDownloadSingleFile(activePreviewItem)}
                disabled={isProcessing !== null}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/15"
              >
                {isProcessing === activePreviewItem.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#38BDF8]" />
                ) : (
                  <Download className="w-4 h-4 text-[#38BDF8]" />
                )}
                <span>ดาวน์โหลดไฟล์เดี่ยว (.{activePreviewItem.ext})</span>
              </button>

              <button
                onClick={() => handleDownloadZipPackage(activePreviewItem)}
                disabled={isProcessing !== null}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
              >
                {isProcessing === activePreviewItem.id + '_zip' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                <span>ดาวน์โหลดครบชุด ZIP (.zip)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
