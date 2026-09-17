import React, { useState } from 'react';
import { 
  Keyboard, 
  Search, 
  X, 
  Copy, 
  Check, 
  Laptop, 
  Sparkles,
  Layers,
  Play,
  Volume2,
  Share2,
  Sliders,
  Printer,
  FileDown,
  Download
} from 'lucide-react';
import { SHORTCUTS_DATA } from '../data/masterclassData';
import { ShortcutItem } from '../types';
import { PremiereLogo } from './PremiereLogo';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [os, setOs] = useState<'win' | 'mac'>('win');
  const [activeCategory, setActiveCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = ['ทั้งหมด', 'Tools', 'Timeline', 'Playback', 'Audio', 'Export'];

  const filteredShortcuts = SHORTCUTS_DATA.filter(item => {
    const matchCat = activeCategory === 'ทั้งหมด' || item.category === activeCategory;
    const matchQuery = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.windowsKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.macKey.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleCopy = (item: ShortcutItem) => {
    const key = os === 'win' ? item.windowsKey : item.macKey;
    navigator.clipboard.writeText(`${item.name} (${key}) - ${item.description}`).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const osName = os === 'win' ? 'Windows' : 'macOS';
    const lines = filteredShortcuts.map(item => {
      const key = os === 'win' ? item.windowsKey : item.macKey;
      return `[${item.category}] ${item.name.padEnd(24)} : ${key.padEnd(14)} - ${item.description}`;
    });
    const text = `====================================================
ADOBE PREMIERE PRO KEYBOARD SHORTCUTS CHEAT SHEET (${osName})
Category: ${activeCategory} | Total Shortcuts: ${filteredShortcuts.length}
====================================================

${lines.join('\n')}

====================================================
Issued by Premiere Masterclass Studio (Bangkok)
`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    });
  };

  const handleExportTextFile = () => {
    const osName = os === 'win' ? 'Windows' : 'macOS';
    const lines = filteredShortcuts.map(item => {
      const key = os === 'win' ? item.windowsKey : item.macKey;
      return `[${item.category}] ${item.name.padEnd(24)} : ${key.padEnd(14)} - ${item.description}`;
    });
    const content = `====================================================
ADOBE PREMIERE PRO KEYBOARD SHORTCUTS CHEAT SHEET (${osName})
หมวดหมู่: ${activeCategory} | จำนวนคีย์ลัด: ${filteredShortcuts.length}
====================================================

${lines.join('\n')}

เคล็ดลับระดับมืออาชีพ:
- วางมือซ้ายไว้บริเวณปุ่ม Q, W, E, R เพื่อการตัดต่อที่รวดเร็วโดยไม่ต้องมองคีย์บอร์ด
- ใช้ปุ่ม J - K - L สำหรับการฟังและพรีวิวไทม์ไลน์ 1x, 2x, 4x
- สามารถปรับแต่งคีย์ลัดเพิ่มเติมได้ที่ Edit > Keyboard Shortcuts (Windows) หรือ Premiere Pro > Keyboard Shortcuts (Mac)

====================================================
Premiere Masterclass Academy Bangkok
====================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Premiere_Pro_Shortcuts_${osName}_CheatSheet.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="shortcuts-modal-backdrop"
      className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div 
        id="shortcuts-modal-window"
        className="w-full max-w-4xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <PremiereLogo className="w-8 h-8 rounded-lg shadow-sm" withGlow />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#EDEDF4]">
                Premiere Pro Keyboard Shortcuts Cheat Sheet
              </h3>
              <p className="text-[11px] text-[#9A9AB0]">
                คีย์ลัดตัดต่องานไวขึ้น 300% ครอบคลุม Windows และ Mac
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* OS Toggle */}
            <div className="bg-white/10 p-0.5 rounded-full flex items-center text-xs font-mono">
              <button
                onClick={() => setOs('win')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  os === 'win' ? 'bg-[#8B5CF6] text-white font-bold shadow-sm' : 'text-[#9A9AB0] hover:text-white'
                }`}
              >
                Windows (Ctrl)
              </button>
              <button
                onClick={() => setOs('mac')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  os === 'mac' ? 'bg-[#8B5CF6] text-white font-bold shadow-sm' : 'text-[#9A9AB0] hover:text-white'
                }`}
              >
                macOS (⌘ Cmd)
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-[#9A9AB0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-sm'
                    : 'bg-white/5 text-[#9A9AB0] hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#9A9AB0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเครื่องมือ หรือปุ่มคีย์..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        {/* Shortcuts List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2">
          {filteredShortcuts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredShortcuts.map(item => {
                const keyDisplay = os === 'win' ? item.windowsKey : item.macKey;
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#EDEDF4]">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#9A9AB0] border border-white/5">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9A9AB0] leading-snug">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Keyboard Key Badge */}
                      <kbd className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/20 text-[#EDEDF4] font-mono text-xs font-extrabold shadow-inner min-w-[36px] text-center">
                        {keyDisplay}
                      </kbd>

                      <button
                        onClick={() => handleCopy(item)}
                        title="คัดลอกคำสั่ง"
                        className="p-1.5 rounded-lg text-[#6B6B85] hover:text-[#B794F6] hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#9A9AB0]">
              ไม่พบคีย์ลัดที่ตรงกับคำค้นหา "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9A9AB0]">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>เคล็ดลับ: ปรับแต่งคีย์ลัดเองได้ที่ Edit &gt; Keyboard Shortcuts</span>
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="คัดลอกรายการคีย์ลัดทั้งหมดในหมวดหมู่นี้ลงใน Clipboard"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">คัดลอกทั้งหมดแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกทั้งหมด</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="พิมพ์เอกสารสรุปคีย์ลัดสำหรับพกพา"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์</span>
            </button>

            <button
              onClick={handleExportTextFile}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102"
              title="ดาวน์โหลด Cheat Sheet เป็นไฟล์ข้อความสำหรับเปิดอ่านออฟไลน์"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ส่งออกสำเร็จ!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export Cheat Sheet (TXT)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
