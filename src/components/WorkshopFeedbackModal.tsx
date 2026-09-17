import React from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  ExternalLink, 
  FileCheck, 
  Film, 
  Sliders, 
  Volume2, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';
import { WorkshopSubmission } from '../types';
import { PremiereLogo } from './PremiereLogo';

interface WorkshopFeedbackModalProps {
  submission: WorkshopSubmission | null;
  onClose: () => void;
}

export const WorkshopFeedbackModal: React.FC<WorkshopFeedbackModalProps> = ({
  submission,
  onClose
}) => {
  if (!submission) return null;

  const handleDownloadReceipt = () => {
    const text = `=====================================================
PREMIERE MASTERCLASS — WORKSHOP EVALUATION REPORT
=====================================================
Project ID: #${submission.projectId}
Title: ${submission.projectTitle}
Submission Date: ${submission.submittedAt}
Status: VERIFIED & GRADED

OVERALL GRADE: ${submission.grade}
TOTAL SCORE: ${submission.score} / 100

CRITERIA RUBRIC BREAKDOWN:
- Pacing & Cut Rhythm: ${submission.criteriaScores?.pacing || 24} / 25
- Lumetri Color Grade: ${submission.criteriaScores?.color || 24} / 25
- Audio Mix & SFX: ${submission.criteriaScores?.audio || 24} / 25
- Story & Creativity: ${submission.criteriaScores?.creativity || submission.criteriaScores?.creative || 24} / 25

STUDENT NOTES:
${submission.notes || 'N/A'}

INSTRUCTOR FEEDBACK & RECOMMENDATIONS:
${submission.feedback || 'งานตัดต่อทำออกมาได้มาตรฐานระดับมืออาชีพ ผ่านเกณฑ์การประเมินเรียบร้อย'}

DELIVERABLES:
- Project URL: ${submission.projectUrl || 'N/A'}
- Attached File: ${submission.fileName || 'N/A'} (${submission.fileSize || 'N/A'})
- Premiere Pro Version: ${submission.softwareVersion || 'Premiere Pro 2024'}
- Key Techniques: ${(submission.keyTechniques || submission.techniquesUsed || []).join(', ') || 'Lumetri, J/L Cuts'}

Issued by Premiere Masterclass Studio (Bangkok)
Verification Hash: PM-WS-${submission.projectId}-${Math.floor(Date.now() / 1000)}
=====================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Workshop_Project_${submission.projectId}_Evaluation_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pacing = submission.criteriaScores?.pacing ?? 24;
  const color = submission.criteriaScores?.color ?? 24;
  const audio = submission.criteriaScores?.audio ?? 24;
  const creative = submission.criteriaScores?.creativity ?? submission.criteriaScores?.creative ?? 24;

  return (
    <div 
      id="workshop-feedback-modal-backdrop"
      className="fixed inset-0 z-[3200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div 
        id="workshop-feedback-modal-window"
        className="w-full max-w-2xl glass-panel-strong border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <PremiereLogo className="w-9 h-9 rounded-xl shadow-md" withGlow />
            <div>
              <h3 className="font-bold text-base text-[#EDEDF4]">
                ผลการตรวจประเมิน & คำติชมจากผู้สอน
              </h3>
              <p className="text-[11px] font-mono text-[#9A9AB0]">
                โปรเจกต์ #{submission.projectId}: {submission.projectTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-[#9A9AB0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Main Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider">
                คะแนนรวมทั้งหมด
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {submission.score}
                </span>
                <span className="text-xs text-[#9A9AB0]">/ 100 คะแนน</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs">
                  เกรด {submission.grade}
                </span>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-[#9A9AB0] space-y-0.5">
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>ส่งงาน: {submission.submittedAt}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ผ่านเกณฑ์ประเมินมาตรฐาน</span>
              </div>
            </div>
          </div>

          {/* 4 Rubric Criteria Score Sliders */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#EDEDF4]">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>เกณฑ์การประเมิน 4 มิติ (Rubric Evaluation)</span>
              </span>
              <span className="font-mono text-[11px] text-[#9A9AB0]">เต็ม 25 คะแนนต่อด้าน</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Pacing */}
              <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9A9AB0] flex items-center gap-1">
                    <Film className="w-3 h-3 text-purple-400" />
                    จังหวะการตัดต่อ (Pacing & Rhythm)
                  </span>
                  <span className="font-mono text-purple-300 font-bold">{pacing}/25</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${(pacing / 25) * 100}%` }} />
                </div>
              </div>

              {/* Color */}
              <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9A9AB0] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    การเกรดสี (Lumetri Color & Match)
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{color}/25</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${(color / 25) * 100}%` }} />
                </div>
              </div>

              {/* Audio */}
              <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9A9AB0] flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    มิกซ์เสียง & SFX (Audio Balancing)
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{audio}/25</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(audio / 25) * 100}%` }} />
                </div>
              </div>

              {/* Story / Creative */}
              <div className="p-2.5 rounded-lg bg-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#9A9AB0] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    ความคิดสร้างสรรค์ (Story & Execution)
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{creative}/25</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(creative / 25) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Feedback / Comments */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>คำวิจารณ์และข้อเสนอแนะจากผู้ทรงคุณวุฒิ (Instructor Feedback)</span>
            </div>
            <p className="text-[#EDEDF4] leading-relaxed text-xs sm:text-[13px] bg-black/20 p-3 rounded-lg border border-emerald-500/10">
              "{submission.feedback}"
            </p>
          </div>

          {/* Deliverables Info */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-[11px] font-mono uppercase text-[#9A9AB0]">รายละเอียดไฟล์และข้อมูลที่ส่ง:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {submission.projectUrl && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 truncate">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <a 
                    href={submission.projectUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-300 hover:underline truncate"
                  >
                    {submission.projectUrl}
                  </a>
                </div>
              )}

              {submission.fileName && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-[#EDEDF4] truncate">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{submission.fileName} ({submission.fileSize || 'N/A'})</span>
                </div>
              )}

              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-[#9A9AB0]">
                <span>เวอร์ชัน Premiere Pro:</span>
                <span className="text-white font-mono">{submission.softwareVersion || 'Premiere Pro 2024'}</span>
              </div>

              {(submission.keyTechniques || submission.techniquesUsed)?.length ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-[#9A9AB0] truncate">
                  <span>เทคนิคที่ใช้:</span>
                  <span className="text-purple-300 font-mono truncate">
                    {(submission.keyTechniques || submission.techniquesUsed)?.join(', ')}
                  </span>
                </div>
              ) : null}
            </div>

            {submission.notes && (
              <div className="pt-2 text-[11px] text-[#9A9AB0] border-t border-white/5">
                <span className="font-semibold text-white">บันทึกของผู้เรียน: </span>
                {submission.notes}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-[#6B6B85] font-mono hidden sm:inline">
            คะแนนได้รับการรับรองความถูกต้องในระบบ Cloud
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadReceipt}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="ดาวน์โหลดใบบันทึกผลตรวจงานฉบับเต็ม"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดรายงานผลตรวจ (TXT)</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all cursor-pointer shadow-md"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
