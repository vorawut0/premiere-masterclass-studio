import React, { useState, useRef, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  Share2, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Loader2, 
  FileDown, 
  Trophy,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { UserState } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/masterclassData';
import { saveCertificateToFirestore } from '../lib/firebase';
import { PremiereLogo } from './PremiereLogo';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onOpenVerification?: (certId?: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userState,
  onOpenVerification
}) => {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [pngSuccess, setPngSuccess] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // Generate deterministic certificate serial ID based on user name
  const hash = Math.abs(
    (userState.profileName + '2026').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const certId = `PMC-2026-${String(hash).padStart(5, '0').slice(-5)}`;
  const issueDateTh = '11 กันยายน 2569';
  const issueDateEn = 'September 11, 2026';

  // Auto-register certificate in Cloud Firestore when opened
  useEffect(() => {
    if (isOpen) {
      saveCertificateToFirestore({
        certId,
        studentName: userState.profileName || 'นักตัดต่อฝึกหัด',
        studentEmail: userState.googleAccount?.email || '',
        studentUid: userState.googleAccount?.uid || undefined,
        issueDate: issueDateTh,
        issueDateEn,
        score: userState.quizBest || 100,
        totalXp: userState.points,
        courseTitle: 'Adobe Premiere Pro Video Editing Masterclass (15 Episodes)',
        verified: true,
        createdAt: new Date().toISOString(),
        instructorName: 'Premiere Masterclass Studio (Bangkok)'
      }).catch(err => console.warn('Could not auto-register certificate in cloud:', err));
    }
  }, [isOpen, certId, userState.profileName]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const sanitizedName = userState.profileName.trim().replace(/\s+/g, '_') || 'Student';
      const filename = `Premiere_Certificate_${sanitizedName}_${certId}.pdf`;

      const options = {
        margin: [6, 6, 6, 6],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0d0d16'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape'
        }
      };

      // Safely resolve html2pdf in ESM/Vite bundler environment
      const generator = typeof (html2pdf as any).default === 'function' 
        ? (html2pdf as any).default 
        : html2pdf;

      await generator().set(options).from(certRef.current).save();
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating certificate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!certRef.current || isGeneratingPng) return;
    setIsGeneratingPng(true);
    setPngSuccess(false);

    try {
      const sanitizedName = userState.profileName.trim().replace(/\s+/g, '_') || 'Student';
      const filename = `Premiere_Certificate_${sanitizedName}_${certId}.png`;

      const options = {
        image: { type: 'png', quality: 1.0 },
        html2canvas: {
          scale: 2.2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0d0d16'
        }
      };

      const generator = typeof (html2pdf as any).default === 'function' 
        ? (html2pdf as any).default 
        : html2pdf;

      const worker = generator().set(options).from(certRef.current);
      const canvas: HTMLCanvasElement = await worker.toCanvas().get('canvas');
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPngSuccess(true);
      setTimeout(() => setPngSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating certificate PNG:', err);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleShareLinkedIn = () => {
    const verifyUrl = `${window.location.origin}/#verify?id=${certId}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const verifyUrl = `${window.location.origin}/#verify?id=${certId}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verifyUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#verify?id=${certId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShareAchievement = async () => {
    const unlockedBadges = ACHIEVEMENTS_DATA.filter(badge => 
      userState.badges?.includes(badge.id)
    );

    const badgesSummary = unlockedBadges.length > 0
      ? unlockedBadges.map(b => `• 🏆 ${b.name}: ${b.desc}`).join('\n')
      : '• (กำลังสะสมตราสัญลักษณ์ความสำเร็จ)';

    const completionRate = Math.min(100, Math.round(((userState.completedLessons?.length || 0) / 15) * 100));
    const verifyUrl = `${window.location.origin}/#verify?id=${certId}`;

    const summaryText = `🎓 PREMIERE MASTERCLASS • STUDENT ACHIEVEMENT 🎓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 นักเรียน (Student): ${userState.profileName}
🆔 รหัสใบประกาศ (Cert ID): ${certId}
📅 วันที่ออกเอกสาร: ${issueDateTh} (${issueDateEn})

📊 ความคืบหน้าการเรียนรู้ (Progress):
• บทเรียนที่จบ: ${userState.completedLessons?.length || 0} / 15 บท (${completionRate}%)
• คะแนนสะสม: ${userState.points || 0} XP
• ระดับฝีมือ: ${userState.skillLevel || 'Beginner'}
• ความต่อเนื่อง: ${userState.dailyStreak || 1} วันติดต่อกัน 🔥

🎖️ ตราสัญลักษณ์ความสำเร็จที่ปลดล็อก (${unlockedBadges.length} / ${ACHIEVEMENTS_DATA.length} ตรา):
${badgesSummary}

🔗 ตรวจสอบใบประกาศนียบัตรอย่างเป็นทางการ:
${verifyUrl}

🎬 พัฒนาทักษะการตัดต่อวิดีโอระดับมืออาชีพกับ Premiere Masterclass Academy!
#PremiereMasterclass #VideoEditing #AdobePremierePro #Achievement`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = summaryText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy achievement:', err);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  return (
    <div 
      id="certificate-modal-backdrop"
      className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div 
        id="certificate-modal-container"
        className="w-full max-w-4xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]"
      >
        {/* Header Bar (Hidden in Print) */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <PremiereLogo className="w-8 h-8 rounded-lg shadow-md" withGlow />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#EDEDF4]">
                ใบประกาศนียบัตรวิชาชีพ (Official Certificate)
              </h3>
              <p className="text-[11px] font-mono text-[#9A9AB0]">
                ID: {certId} • ได้รับการรับรองหลักสูตรมาตรฐาน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(l => (l === 'th' ? 'en' : 'th'))}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="สลับภาษาใบประกาศ"
            >
              <Globe className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>{lang === 'th' ? 'TH | EN' : 'EN | TH'}</span>
            </button>

            {/* Share Achievement Header Button */}
            <button
              id="share-achievement-header-btn"
              onClick={handleShareAchievement}
              className="px-3 py-1.5 rounded-full bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer hidden md:flex"
              title="คัดลอกสรุปผลงานและความสำเร็จ"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-300">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Share Achievement</span>
                </>
              )}
            </button>

            {/* Header Download PNG Button */}
            <button
              id="download-cert-png-header-btn"
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className="px-3 py-1.5 rounded-full bg-cyan-600/25 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              title="ดาวน์โหลดใบประกาศเป็นไฟล์รูปภาพ PNG ความละเอียดสูง"
            >
              {isGeneratingPng ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>สร้าง PNG...</span>
                </>
              ) : pngSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>บันทึกแล้ว!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                  <span>บันทึกเป็น PNG</span>
                </>
              )}
            </button>

            {/* Header Download PDF Button */}
            <button
              id="download-cert-pdf-header-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="gradient-btn px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              title="ดาวน์โหลดใบประกาศเป็นไฟล์ PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังสร้าง PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>บันทึกเป็น PDF</span>
                </>
              )}
            </button>

            {/* Verify Status Online Button */}
            {onOpenVerification && (
              <button
                id="cert-modal-open-verify-btn"
                onClick={() => onOpenVerification(certId)}
                className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                title="ตรวจสอบสถานะในฐานข้อมูลกลาง"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ตรวจสถานะออนไลน์</span>
              </button>
            )}

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-all"
              title="พิมพ์ผ่านเบราว์เซอร์"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-[#9A9AB0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex items-center justify-center bg-zinc-950/60 print:p-0 print:bg-white">
          <div 
            ref={certRef}
            id="printable-certificate"
            className="w-full max-w-3xl aspect-[1.414/1] bg-[#0d0d16] text-[#EDEDF4] p-6 sm:p-10 rounded-2xl border-2 border-amber-500/40 relative shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col justify-between overflow-hidden print:border-4 print:border-amber-700 print:text-black print:bg-white print:shadow-none"
          >
            {/* Background Decorative Guilloche / Geometry */}
            <div className="absolute inset-2 border border-amber-500/20 rounded-xl pointer-events-none print:border-amber-600/50" />
            <div className="absolute inset-3.5 border border-purple-500/20 rounded-lg pointer-events-none print:border-amber-600/30" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none print:hidden" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent rounded-tr-full pointer-events-none print:hidden" />

            {/* Certificate Header */}
            <div className="text-center relative z-10 pt-2">
              <div className="flex items-center justify-center gap-2.5 mb-2">
                <PremiereLogo className="w-10 h-10 rounded-xl shadow-md" withGlow />
                <span className="font-display font-black text-lg tracking-wider text-amber-300 print:text-amber-800">
                  PREMIERE MASTERCLASS ACADEMY
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wider print:text-black">
                {lang === 'th' ? 'ใบประกาศนียบัตรสำเร็จหลักสูตร' : 'Certificate of Completion'}
              </h1>
              <p className="text-xs font-mono text-amber-400/90 tracking-widest uppercase mt-1 print:text-amber-900">
                {lang === 'th' ? 'สถาบันพัฒนาทักษะวิชาชีพการตัดต่อวิดีโอระดับสากล' : 'Professional Video Editing Master Certification'}
              </p>
            </div>

            {/* Recipient Info */}
            <div className="text-center relative z-10 my-4 space-y-3">
              <p className="text-xs sm:text-sm text-[#9A9AB0] font-serif italic print:text-zinc-600">
                {lang === 'th' ? 'ขอมอบใบประกาศนียบัตรฉบับนี้ไว้เพื่อแสดงว่า' : 'This is proudly presented to certify that'}
              </p>

              <div className="py-2 border-b border-amber-500/30 inline-block px-8 max-w-md mx-auto print:border-amber-700">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-300 tracking-wide print:text-amber-900 drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)]">
                  {userState.profileName}
                </h2>
                {userState.googleAccount && (
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-emerald-400 print:text-emerald-700 mt-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Verified Account: {userState.googleAccount.email}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#EDEDF4] max-w-xl mx-auto leading-relaxed pt-1 print:text-zinc-800">
                {lang === 'th' ? (
                  <>
                    ได้ผ่านการเรียนรู้ ฝึกปฏิบัติ และผ่านการประเมินทักษะในหลักสูตร{' '}
                    <strong className="text-amber-300 print:text-amber-800">Professional Video Editing with Adobe Premiere Pro</strong>{' '}
                    ครบถ้วนตามเกณฑ์มาตรฐาน ทั้งทักษะการตัดต่อ การแต่งสี Lumetri Color, การจัดการระบบเสียง Essential Sound, กราฟิกโมชั่น และ Workflow ระดับมืออาชีพ
                  </>
                ) : (
                  <>
                    has successfully completed the comprehensive curriculum and practical benchmark for{' '}
                    <strong className="text-amber-300 print:text-amber-800">Professional Video Editing with Adobe Premiere Pro</strong>,{' '}
                    demonstrating mastery in timeline management, Lumetri color grading, audio dynamics, motion graphics, and industry-grade workflows.
                  </>
                )}
              </p>
            </div>

            {/* Footer Signatures & Official Stamp */}
            <div className="relative z-10 pt-4 flex items-end justify-between border-t border-white/10 print:border-zinc-300 px-4">
              {/* Left Signature */}
              <div className="text-center">
                <div className="w-28 border-b border-white/30 mb-1 mx-auto print:border-black font-serif italic text-sm text-[#B794F6] print:text-purple-800">
                  P. Vorawut
                </div>
                <div className="text-[11px] font-bold text-white print:text-black">คุณวรวุฒิ เพ็ชรไร</div>
                <div className="text-[9px] font-mono text-[#9A9AB0] print:text-zinc-600">Lead Senior Video Editor</div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400/80 bg-gradient-to-tr from-amber-500/20 to-amber-300/10 flex flex-col items-center justify-center text-center p-1 shadow-[0_0_20px_rgba(245,158,11,0.2)] print:border-amber-700">
                  <ShieldCheck className="w-6 h-6 text-amber-400 print:text-amber-700" />
                  <span className="text-[7px] font-mono uppercase font-bold text-amber-300 tracking-tighter print:text-amber-900">
                    VERIFIED
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#6B6B85] mt-1 print:text-zinc-500">
                  {lang === 'th' ? issueDateTh : issueDateEn}
                </span>
              </div>

              {/* Right Verification Details */}
              <div className="text-center">
                <div className="w-28 border-b border-white/30 mb-1 mx-auto print:border-black font-serif italic text-sm text-[#34D399] print:text-emerald-800">
                  Academic Board
                </div>
                <div className="text-[11px] font-bold text-white print:text-black">Premiere Masterclass</div>
                <div className="text-[9px] font-mono text-amber-400 print:text-amber-800">{certId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-white/5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2 text-[#9A9AB0]">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ใบประกาศนียบัตรนี้ออกให้แบบดิจิทัลความละเอียดสูง สามารถดาวน์โหลดเป็นไฟล์ PDF หรือสั่งพิมพ์ได้ทันที</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Share Achievement Button */}
            <button
              id="share-achievement-btn"
              onClick={handleShareAchievement}
              className="px-3 py-2 rounded-full bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-400/40 font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98"
              title="คัดลอกสรุปผลงานความสำเร็จและตราสัญลักษณ์เพื่อแชร์"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-300">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Share Text</span>
                </>
              )}
            </button>

            {/* Share to LinkedIn */}
            <button
              id="share-linkedin-btn"
              onClick={handleShareLinkedIn}
              className="px-3 py-2 rounded-full bg-[#0A66C2]/20 hover:bg-[#0A66C2]/35 text-[#70B5F9] border border-[#0A66C2]/40 font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98"
              title="แชร์ความสำเร็จลงบน LinkedIn"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </button>

            {/* Share to Facebook */}
            <button
              id="share-facebook-btn"
              onClick={handleShareFacebook}
              className="px-3 py-2 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2]/35 text-[#79A6F7] border border-[#1877F2]/40 font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98"
              title="แชร์ไปยัง Facebook"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="พิมพ์ผ่านเบราว์เซอร์"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์</span>
            </button>

            {/* Download as PNG Image */}
            <button
              id="download-certificate-png-btn"
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className="px-3.5 py-2 rounded-full bg-cyan-600/30 hover:bg-cyan-600/45 text-cyan-200 border border-cyan-400/40 font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              title="ดาวน์โหลดใบประกาศเป็นไฟล์รูปภาพ PNG ความละเอียดสูง"
            >
              {isGeneratingPng ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังสร้าง PNG...</span>
                </>
              ) : pngSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>บันทึก PNG สำเร็จ!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Download PNG</span>
                </>
              )}
            </button>

            {/* Download Certificate as PDF Button */}
            <button
              id="download-certificate-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="gradient-btn px-4.5 py-2 rounded-full font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-102 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-white"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังสร้าง PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>ดาวน์โหลด PDF สำเร็จ!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
