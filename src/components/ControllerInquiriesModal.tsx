import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Trash2, 
  RefreshCw, 
  Send, 
  ExternalLink,
  Database,
  UserCheck,
  Tag,
  Check,
  Bell
} from 'lucide-react';

import { ContactMessage } from '../types';
import { 
  subscribeToInquiries, 
  subscribeToWorkshopSubmissions,
  updateInquiryStatusInFirestore, 
  deleteInquiryFromFirestore,
  updateWorkshopSubmissionGradeInFirestore,
  sendSystemNotification,
  ADMIN_EMAIL,
  isUserAdmin,
  auth
} from '../lib/firebase';
import {
  Briefcase,
  Layers,
  Star,
  FileCheck,
  LogIn
} from 'lucide-react';
import { PremiereLogo } from './PremiereLogo';

interface ControllerInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string | null;
  onTriggerToast: (msg: string) => void;
  onSignInWithGoogle?: () => void;
}

export const ControllerInquiriesModal: React.FC<ControllerInquiriesModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
  onTriggerToast,
  onSignInWithGoogle
}) => {
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [workshopSubmissions, setWorkshopSubmissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'workshops' | 'notifications'>('inquiries');
  const [selectedWorkshop, setSelectedWorkshop] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'resolved'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactMessage | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Broadcast Notification Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'system' | 'lesson' | 'workshop'>('system');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // Workshop grading state for instructor
  const [gradingScore, setGradingScore] = useState<number>(95);
  const [gradingGrade, setGradingGrade] = useState<string>('A');
  const [gradingFeedback, setGradingFeedback] = useState<string>('');
  const [isGradingSaving, setIsGradingSaving] = useState<boolean>(false);

  const handleSelectWorkshop = (ws: any) => {
    setSelectedWorkshop(ws);
    setGradingScore(ws.score ?? 95);
    setGradingGrade(ws.grade ?? 'A');
    setGradingFeedback(ws.feedback ?? 'ผลงานผ่านเกณฑ์การประเมินมาตรฐาน');
  };

  const handleSaveWorkshopGrading = async () => {
    if (!selectedWorkshop?.id) return;
    setIsGradingSaving(true);
    try {
      await updateWorkshopSubmissionGradeInFirestore(selectedWorkshop.id, {
        score: Number(gradingScore),
        grade: gradingGrade,
        feedback: gradingFeedback,
        status: 'reviewed'
      });
      setSelectedWorkshop((prev: any) => ({
        ...prev,
        score: Number(gradingScore),
        grade: gradingGrade,
        feedback: gradingFeedback
      }));
      setWorkshopSubmissions((prev: any[]) =>
        prev.map(item => item.id === selectedWorkshop.id
          ? { ...item, score: Number(gradingScore), grade: gradingGrade, feedback: gradingFeedback }
          : item
        )
      );

      // Trigger real-time system notification for student
      if (selectedWorkshop.senderUid) {
        sendSystemNotification({
          title: `🏆 ผลการตรวจเวิร์กช็อป #${selectedWorkshop.projectId}`,
          message: `อาจารย์ได้ประเมินผลงาน "${selectedWorkshop.projectTitle || ''}" แล้ว — ได้คะแนน ${gradingScore}/100 เกรด ${gradingGrade}`,
          type: 'workshop',
          targetUid: selectedWorkshop.senderUid,
          recipientEmail: selectedWorkshop.senderEmail
        }).catch(err => console.warn('Could not post grading notification:', err));
      }

      onTriggerToast('บันทึกเกรดและส่งผลประเมินถึงผู้เรียนสำเร็จแล้ว');
    } catch (err: any) {
      console.error('Error saving workshop grade:', err);
      onTriggerToast('เกิดข้อผิดพลาดในการบันทึกเกรด');
    } finally {
      setIsGradingSaving(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // Per React Firebase setup guideline: Only attach onSnapshot listeners if auth is ready and user is authenticated
    if (!auth.currentUser) {
      setLoading(false);
      setInquiries([]);
      setWorkshopSubmissions([]);
      return;
    }

    setLoading(true);
    const unsubInquiries = subscribeToInquiries(
      (items) => {
        setInquiries(items);
        setLoading(false);
      },
      (error) => {
        console.warn('Subscription notice in Controller modal:', error);
        setLoading(false);
      }
    );

    const unsubWorkshops = subscribeToWorkshopSubmissions(
      (submissions) => {
        setWorkshopSubmissions(submissions);
      },
      (error) => {
        console.warn('Workshop subscription notice:', error);
      }
    );

    return () => {
      unsubInquiries();
      unsubWorkshops();
    };
  }, [isOpen, currentUserEmail]);

  if (!isOpen) return null;

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && item.status === statusFilter;
  });

  const pendingCount = inquiries.filter(i => i.status === 'pending' || !i.status || i.status === 'ได้รับแล้ว').length;
  const inReviewCount = inquiries.filter(i => i.status === 'in_review' || i.status === 'กำลังตรวจสอบ').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved' || i.status === 'ตอบกลับแล้ว').length;

  const handleUpdateStatus = async (
    id: string, 
    newStatus: 'pending' | 'in_review' | 'resolved', 
    note?: string
  ) => {
    setIsUpdating(true);
    try {
      await updateInquiryStatusInFirestore(id, newStatus, note);
      onTriggerToast(`อัปเดตสถานะเป็น "${newStatus === 'resolved' ? 'ตอบกลับแล้ว' : newStatus === 'in_review' ? 'กำลังตรวจสอบ' : 'รอดำเนินการ'}" สำเร็จ`);
      
      // If replying or resolving, send real-time notification to the inquirer
      if (selectedInquiry && selectedInquiry.senderUid && selectedInquiry.senderUid !== 'guest') {
        const statusText = newStatus === 'resolved' ? 'อาจารย์ตอบกลับคำถามของคุณแล้ว' : 'กำลังดำเนินการตรวจสอบข้อความของคุณ';
        sendSystemNotification({
          title: `💬 อัปเดตคำถาม: ${selectedInquiry.topic || 'คำถามของคุณ'}`,
          message: `${statusText}${note ? ` — "${note.substring(0, 100)}"` : ''}`,
          type: 'inquiry',
          targetUid: selectedInquiry.senderUid,
          recipientEmail: selectedInquiry.email
        }).catch(err => console.warn('Could not post inquiry reply notification:', err));
      }

      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus, adminNotes: note ?? prev.adminNotes } : null);
      }
    } catch (err: any) {
      console.error('Error updating inquiry status:', err);
      onTriggerToast('เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคำถามนี้ออกจากฐานข้อมูล?')) return;
    try {
      await deleteInquiryFromFirestore(id);
      onTriggerToast('ลบรายการออกจากระบบฐานข้อมูลแล้ว');
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      onTriggerToast('ไม่สามารถลบรายการได้');
    }
  };

  return (
    <div 
      id="controller-inquiries-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="controller-inquiries-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[90vh] bg-[#0E111D] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#EDEDF4]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-[#13172B] to-[#0E111D] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <PremiereLogo className="w-10 h-10 rounded-xl shadow-md" withGlow />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  ระบบฐานข้อมูลคำถาม & ศูนย์ควบคุมผู้สอน
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Firestore Sync</span>
                </span>
              </div>
              <p className="text-xs text-[#9A9AB0] mt-0.5">
                กล่องข้อความคำถามจากนักเรียน ส่งตรงเข้าฐานข้อมูลเพื่อให้ผู้ดูแล/ผู้สอน ({ADMIN_EMAIL}) จัดการ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9A9AB0] hover:text-white transition-colors cursor-pointer shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/20 shrink-0 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#0E111D] border-purple-500/40 text-white'
                : 'bg-transparent border-transparent text-[#9A9AB0] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>คำถาม & ข้อความติดต่อ</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'workshops'
                ? 'bg-[#0E111D] border-amber-500/40 text-white'
                : 'bg-transparent border-transparent text-[#9A9AB0] hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>งานส่งตรวจ Workshop</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
              {workshopSubmissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-[#0E111D] border-indigo-500/40 text-white'
                : 'bg-transparent border-transparent text-[#9A9AB0] hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>ส่งแจ้งเตือนระบบเรียลไทม์</span>
          </button>
        </div>


        {/* Stats Strip */}
        {activeTab === 'inquiries' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-white/2 border-b border-white/5 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'all' 
                  ? 'bg-purple-600/20 border-purple-500/40 text-white shadow-xs' 
                  : 'bg-white/5 border-white/5 text-[#9A9AB0] hover:bg-white/10'
              }`}
            >
              <span className="text-[11px] font-mono block text-[#9A9AB0]">ข้อความทั้งหมด</span>
              <span className="text-lg sm:text-xl font-bold text-white">{inquiries.length}</span>
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'pending' 
                  ? 'bg-amber-500/20 border-amber-500/40 text-white shadow-xs' 
                  : 'bg-white/5 border-white/5 text-[#9A9AB0] hover:bg-white/10'
              }`}
            >
              <span className="text-[11px] font-mono block text-amber-300/90">🟡 รอผู้ควบคุมตอบ</span>
              <span className="text-lg sm:text-xl font-bold text-amber-400">{pendingCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter('in_review')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'in_review' 
                  ? 'bg-blue-500/20 border-blue-500/40 text-white shadow-xs' 
                  : 'bg-white/5 border-white/5 text-[#9A9AB0] hover:bg-white/10'
              }`}
            >
              <span className="text-[11px] font-mono block text-blue-300/90">🔵 กำลังตรวจสอบ</span>
              <span className="text-lg sm:text-xl font-bold text-blue-400">{inReviewCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter('resolved')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'resolved' 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-white shadow-xs' 
                  : 'bg-white/5 border-white/5 text-[#9A9AB0] hover:bg-white/10'
              }`}
            >
              <span className="text-[11px] font-mono block text-emerald-300/90">🟢 ตอบกลับแล้ว</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">{resolvedCount}</span>
            </button>
          </div>
        ) : (
          <div className="p-3 sm:p-4 bg-amber-500/5 border-b border-amber-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">
                งานโปรเจกต์ที่นักเรียนส่งเข้ามาในระบบ Cloud Firestore ({workshopSubmissions.length} รายการ)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#9A9AB0]">
              อัปเดตแบบ Realtime
            </span>
          </div>
        )}

        {/* Auth Notice Banner if not signed in */}
        {!currentUserEmail && (
          <div className="p-3 sm:p-4 bg-purple-950/40 border-b border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-xs">
                <p className="text-white font-semibold">ต้องลงชื่อเข้าใช้งานเพื่อเชื่อมต่อ Cloud Firestore</p>
                <p className="text-[#9A9AB0]">
                  กรุณาเข้าสู่ระบบด้วยบัญชี Google ({ADMIN_EMAIL}) เพื่อปลดล็อกศูนย์ควบคุมและรายการคำถาม/งานส่งตรวจ
                </p>
              </div>
            </div>
            {onSignInWithGoogle && (
              <button
                onClick={onSignInWithGoogle}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบด้วย Google</span>
              </button>
            )}
          </div>
        )}

        {/* Student View Banner if signed in as non-admin */}
        {currentUserEmail && !isUserAdmin(currentUserEmail) && (
          <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-indigo-300 shrink-0 gap-1">
            <span>👤 เข้าสู่ระบบในฐานะผู้เรียน: แสดงเฉพาะรายการที่คุณส่ง ({currentUserEmail})</span>
            <span className="text-[10px] text-[#9A9AB0] font-mono">เข้าสู่ระบบด้วย {ADMIN_EMAIL} เพื่อสลับเป็นผู้ควบคุมระบบเต็มรูปแบบ</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-white/5 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-[#6B6B85] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้เรียน, อีเมล, รหัสตั๋ว (#INQ), หรือข้อความ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-[#6B6B85] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <span className="text-xs text-[#9A9AB0] font-mono whitespace-nowrap">
              พบ {filteredInquiries.length} รายการ
            </span>
          </div>
        </div>

        {/* Content Body: Split View (List & Detail) */}
        {activeTab === 'inquiries' ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* List Column */}
          <div className="lg:col-span-5 border-r border-white/10 overflow-y-auto p-3 space-y-2.5">
            {loading ? (
              <div className="py-16 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
                <p className="text-xs text-[#9A9AB0]">กำลังดึงข้อมูลคำถามจาก Cloud Firestore...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#6B6B85] space-y-3 px-4">
                <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
                <p className="text-sm font-semibold text-white">
                  {!currentUserEmail ? 'กรุณาลงชื่อเข้าใช้เพื่อดูข้อมูล' : 'ไม่มีรายการคำถามในหมวดหมู่นี้'}
                </p>
                <p className="text-xs text-[#9A9AB0] max-w-xs mx-auto">
                  {!currentUserEmail 
                    ? 'รายการคำถามจะซิงก์จาก Cloud Firestore เมื่อคุณลงชื่อเข้าสู่ระบบ' 
                    : 'เมื่อมีนักเรียนส่งคำถามผ่านแบบฟอร์ม รายการจะปรากฏที่นี่แบบเรียลไทม์'}
                </p>
                {!currentUserEmail && onSignInWithGoogle && (
                  <button
                    onClick={onSignInWithGoogle}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md mx-auto"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-purple-400 hover:underline text-xs block mx-auto mt-2"
                  >
                    ล้างการค้นหา
                  </button>
                )}
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                const isResolved = inq.status === 'resolved' || inq.status === 'ตอบกลับแล้ว';
                const isInReview = inq.status === 'in_review' || inq.status === 'กำลังตรวจสอบ';

                return (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setSelectedInquiry(inq);
                      setAdminNoteInput(inq.adminNotes || '');
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-400/50 shadow-md ring-1 ring-purple-400/40'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-[11px] font-bold text-purple-400 shrink-0">
                          {inq.ticketId || '#INQ'}
                        </span>
                        <span className="font-semibold text-xs text-white truncate">
                          {inq.name}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium shrink-0 ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isInReview
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isResolved ? 'ตอบแล้ว' : isInReview ? 'กำลังตรวจ' : 'รอดำเนินการ'}
                      </span>
                    </div>

                    <p className="text-xs text-[#9A9AB0] line-clamp-2 leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B85] pt-1 border-t border-white/5">
                      <span className="truncate max-w-[150px]">{inq.topic || 'ทั่วไป'}</span>
                      <span>{inq.timestamp || inq.createdAt?.split('T')[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail Column */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto bg-black/20 flex flex-col justify-between">
            {selectedInquiry ? (
              <div className="space-y-5">
                {/* Header Info */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-purple-400">
                          {selectedInquiry.ticketId || '#INQ'}
                        </span>
                        <h3 className="font-bold text-base text-white">
                          {selectedInquiry.name}
                        </h3>
                      </div>
                      <a 
                        href={`mailto:${selectedInquiry.email}?subject=ตอบกลับคำถามจากผู้สอน Premiere Masterclass (${selectedInquiry.ticketId || ''})`}
                        className="text-xs text-purple-300 hover:text-white flex items-center gap-1 mt-1 font-mono hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{selectedInquiry.email}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedInquiry.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value as any, adminNoteInput)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                      >
                        <option value="pending" className="bg-[#121626]">🟡 รอดำเนินการ (Pending)</option>
                        <option value="in_review" className="bg-[#121626]">🔵 กำลังตรวจสอบ (In Review)</option>
                        <option value="resolved" className="bg-[#121626]">🟢 ตอบกลับแล้ว (Resolved)</option>
                      </select>

                      <button
                        onClick={() => handleDelete(selectedInquiry.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 cursor-pointer transition-colors"
                        title="ลบคำถามนี้ออกจากฐานข้อมูล"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#9A9AB0]">
                    <div>
                      <span className="text-[#6B6B85]">หมวดหมู่: </span>
                      <span className="text-white">{selectedInquiry.topic || 'ทั่วไป'}</span>
                    </div>
                    <div>
                      <span className="text-[#6B6B85]">เวลาที่ส่ง: </span>
                      <span className="text-white">{selectedInquiry.timestamp || selectedInquiry.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider">
                    ข้อความหรือคำถามจากผู้เรียน:
                  </label>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-[#EDEDF4] whitespace-pre-wrap leading-relaxed">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Instructor / Controller Response Notes */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-emerald-300 uppercase tracking-wider">
                      บันทึกคำตอบ / ผลการตรวจจากผู้สอน (Instructor Notes):
                    </label>
                    <span className="text-[11px] text-[#6B6B85] font-mono">บันทึกลงฐานข้อมูล Firestore</span>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="พิมพ์ข้อความตอบกลับ หรือบันทึกผลการตรวจสอบสำหรับคำถามนี้..."
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-[#6B6B85] focus:outline-none focus:border-emerald-400 transition-all resize-none"
                  />

                  <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedInquiry.id, 'resolved', adminNoteInput)}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>บันทึก & ทำเครื่องหมายตอบกลับแล้ว</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedInquiry.id, selectedInquiry.status || 'pending', adminNoteInput)}
                        disabled={isUpdating}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors"
                      >
                        บันทึกโน้ต
                      </button>
                    </div>

                    <a
                      href={`mailto:${selectedInquiry.email}?subject=ตอบกลับคำถามจากผู้สอน Premiere Masterclass (${selectedInquiry.ticketId || ''})&body=${encodeURIComponent(`สวัสดีคุณ ${selectedInquiry.name},\n\nจากคำถามที่คุณส่งมาว่า:\n"${selectedInquiry.message}"\n\nผู้สอนขอแนะนำดังนี้:\n${adminNoteInput || ''}\n\nขอแสดงความนับถือ,\nทีมงาน Premiere Masterclass`)}`}
                      className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ส่งอีเมลตอบผู้เรียน</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#9A9AB0] space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                  <MessageSquare className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">เลือกคำถามจากรายการด้านซ้าย</h4>
                  <p className="text-xs text-[#6B6B85] mt-1 max-w-sm">
                    คลิกเลือกคำถามของนักเรียนเพื่อดูรายละเอียด อัปเดตสถานะ หรือเขียนคำตอบกลับไปยังผู้เรียน
                  </p>
                </div>
              </div>
            )}

            {/* Footer Control Notice */}
            <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#6B6B85]">
              <span>ฐานข้อมูล: ai-studio-premieremastercl-...</span>
              <span>สิทธิ์การควบคุม: ผู้สอน / แอดมิน ({ADMIN_EMAIL})</span>
            </div>
          </div>
        </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Workshop List Column */}
            <div className="lg:col-span-5 border-r border-white/10 overflow-y-auto p-3 space-y-2.5">
              {workshopSubmissions.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#6B6B85] space-y-3 px-4">
                  <Briefcase className="w-8 h-8 mx-auto opacity-40 text-amber-400" />
                  <p className="text-sm font-semibold text-white">
                    {!currentUserEmail ? 'กรุณาลงชื่อเข้าใช้เพื่อดูงานเวิร์กช็อป' : 'ยังไม่มีรายการงานเวิร์กช็อปที่ส่งเข้ามา'}
                  </p>
                  <p className="text-xs text-[#9A9AB0] max-w-xs mx-auto">
                    {!currentUserEmail 
                      ? 'รายการงานที่ส่งตรวจจะโหลดโดยอัตโนมัติเมื่อลงชื่อเข้าสู่ระบบ' 
                      : 'เมื่อนักเรียนกดส่งงานในหน้า Workshop รายการจะปรากฏที่นี่ทันที'}
                  </p>
                  {!currentUserEmail && onSignInWithGoogle && (
                    <button
                      onClick={onSignInWithGoogle}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md mx-auto"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>เข้าสู่ระบบด้วย Google</span>
                    </button>
                  )}
                </div>
              ) : (
                workshopSubmissions.map((ws) => {
                  const isSelected = selectedWorkshop?.id === ws.id;
                  return (
                    <div
                      key={ws.id || ws.submissionId}
                      onClick={() => handleSelectWorkshop(ws)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400/50 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          โปรเจกต์ #{ws.projectId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {ws.score}/100 ({ws.grade})
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white truncate">
                        {ws.projectTitle}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9A9AB0]">
                        <span className="truncate">{ws.senderName || ws.senderEmail || 'นักเรียน'}</span>
                        <span>{ws.submittedAt?.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Workshop Detail Column */}
            <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto bg-black/20 flex flex-col justify-between">
              {selectedWorkshop ? (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono text-amber-400">โจทย์โปรเจกต์ #{selectedWorkshop.projectId}</span>
                        <h3 className="text-base font-bold text-white">{selectedWorkshop.projectTitle}</h3>
                        <p className="text-xs text-[#9A9AB0] mt-0.5">ผู้ส่ง: {selectedWorkshop.senderName || selectedWorkshop.senderEmail || 'นักเรียน'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-amber-400">{selectedWorkshop.score}</span>
                        <span className="text-xs text-[#9A9AB0]">/100 ({selectedWorkshop.grade})</span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Links / Files */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <h4 className="text-xs font-mono uppercase text-amber-300">ไฟล์และลิงก์ผลงาน:</h4>
                    {selectedWorkshop.projectUrl && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                        <a 
                          href={selectedWorkshop.projectUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-blue-300 hover:underline break-all"
                        >
                          {selectedWorkshop.projectUrl}
                        </a>
                      </div>
                    )}
                    {selectedWorkshop.fileName && (
                      <div className="text-xs text-white flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>ไฟล์ที่แนบ: {selectedWorkshop.fileName} ({selectedWorkshop.fileSize || 'N/A'})</span>
                      </div>
                    )}
                    <div className="text-xs text-[#9A9AB0]">
                      เวอร์ชัน Premiere Pro ที่ใช้: {selectedWorkshop.softwareVersion || 'Premiere Pro 2024'}
                    </div>
                  </div>

                  {/* Criteria Scores */}
                  {selectedWorkshop.criteriaScores && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <h4 className="text-xs font-mono uppercase text-purple-300">คะแนนตามเกณฑ์ประเมิน:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-white/5">
                          <span className="text-[10px] text-[#9A9AB0] block">Pacing</span>
                          <span className="text-sm font-bold text-white">{selectedWorkshop.criteriaScores.pacing}/25</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <span className="text-[10px] text-[#9A9AB0] block">Color</span>
                          <span className="text-sm font-bold text-white">{selectedWorkshop.criteriaScores.color}/25</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <span className="text-[10px] text-[#9A9AB0] block">Audio</span>
                          <span className="text-sm font-bold text-white">{selectedWorkshop.criteriaScores.audio}/25</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <span className="text-[10px] text-[#9A9AB0] block">Creativity</span>
                          <span className="text-sm font-bold text-white">{selectedWorkshop.criteriaScores.creativity || selectedWorkshop.criteriaScores.creative}/25</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student Notes & Feedback */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-amber-300">บันทึกจากผู้เรียน:</h4>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed whitespace-pre-wrap">
                      {selectedWorkshop.notes || 'ไม่มีบันทึกเพิ่มเติม'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-emerald-300">ผลการประเมินและข้อแนะนำ:</h4>
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed whitespace-pre-wrap">
                      {selectedWorkshop.feedback || 'ผลงานผ่านเกณฑ์การประเมินมาตรฐาน'}
                    </div>
                  </div>

                  {/* Instructor Grading & Feedback Form */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span>ปรับปรุงเกรดและส่งผลประเมิน (Instructor Evaluation)</span>
                      </h4>
                      <span className="text-[10px] font-mono text-[#9A9AB0]">บันทึกตรงสู่ Cloud Firestore</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#9A9AB0] block mb-1">คะแนน (Score 0-100):</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradingScore}
                          onChange={(e) => setGradingScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#9A9AB0] block mb-1">เกรด (Grade):</label>
                        <select
                          value={gradingGrade}
                          onChange={(e) => setGradingGrade(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-amber-400 outline-none"
                        >
                          <option value="A+">A+ (ดีเยี่ยมที่สุด 98-100)</option>
                          <option value="A">A (ดีเยี่ยม 90-97)</option>
                          <option value="B+">B+ (ดีมาก 85-89)</option>
                          <option value="B">B (ดี 80-84)</option>
                          <option value="C+">C+ (ปานกลาง 75-79)</option>
                          <option value="C">C (ผ่านเกณฑ์ 70-74)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#9A9AB0] block mb-1">คำติชม & คำแนะนำจากผู้สอน:</label>
                      <textarea
                        rows={3}
                        value={gradingFeedback}
                        onChange={(e) => setGradingFeedback(e.target.value)}
                        placeholder="พิมพ์ข้อเสนอแนะ เทคนิคที่ควรปรับปรุง หรือคำชมแก่นักเรียน..."
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-400 outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleSaveWorkshopGrading}
                        disabled={isGradingSaving}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isGradingSaving ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>กำลังบันทึก...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>บันทึกผลการตรวจและส่งข้อเสนอแนะ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#9A9AB0] space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    <Briefcase className="w-8 h-8 opacity-60" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">เลือกชิ้นงานเวิร์กช็อปจากรายการด้านซ้าย</h4>
                    <p className="text-xs text-[#6B6B85] mt-1 max-w-sm">
                      คลิกเลือกงานของนักเรียนเพื่อดูลิงก์ส่งงาน สเกลคะแนน และรายละเอียดเทคนิคที่นำมาประยุกต์ใช้
                    </p>
                  </div>
                </div>
              )}

              {/* Footer Control Notice */}
              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#6B6B85]">
                <span>ฐานข้อมูล: ai-studio-premieremastercl-...</span>
                <span>สิทธิ์การควบคุม: ผู้สอน / แอดมิน ({ADMIN_EMAIL})</span>
              </div>
            </div>
          </div>
        )}
        {/* Tab 3: Broadcast Notifications */}
        {activeTab === 'notifications' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
            <div className="max-w-xl w-full bg-[#13172B] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">ส่งการแจ้งเตือนจากระบบจริง (Real-time Broadcast)</h3>
                  <p className="text-xs text-[#9A9AB0]">
                    ข้อความจะถูกบันทึกลง Cloud Firestore และส่งถึงผู้เรียนทุกคนในระบบทันทีแบบเรียลไทม์ (จุดสีแดงจะขึ้นที่กระดิ่งทันที)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#9A9AB0] block mb-1 font-medium">หัวข้อการแจ้งเตือน (Title):</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="เช่น: 🔔 อัปเดตคอร์สเรียน Premiere Pro 2025 ใหม่!"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-indigo-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#9A9AB0] block mb-1 font-medium">ประเภทการแจ้งเตือน:</label>
                    <select
                      value={broadcastType}
                      onChange={(e: any) => setBroadcastType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-indigo-400 outline-none font-mono"
                    >
                      <option value="system">📢 ประกาศระบบ (System Notice)</option>
                      <option value="lesson">📚 บทเรียนใหม่ (Lesson Update)</option>
                      <option value="workshop">🎬 เวิร์กช็อป (Workshop Event)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#9A9AB0] block mb-1 font-medium">กลุ่มเป้าหมาย:</label>
                    <div className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono">
                      ผู้เรียนทุกคน (Broadcast 'all')
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#9A9AB0] block mb-1 font-medium">รายละเอียดข้อความ (Message):</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="พิมพ์เนื้อหาการแจ้งเตือนที่ต้องการส่งถึงทุกคนในระบบ..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-indigo-400 outline-none resize-none"
                  />
                </div>

                <button
                  disabled={!broadcastTitle.trim() || !broadcastMessage.trim() || isSendingBroadcast}
                  onClick={async () => {
                    setIsSendingBroadcast(true);
                    try {
                      await sendSystemNotification({
                        title: broadcastTitle.trim(),
                        message: broadcastMessage.trim(),
                        type: broadcastType,
                        targetUid: 'all'
                      });
                      onTriggerToast('ส่งการแจ้งเตือนจากระบบจริงสำเร็จ! ผู้เรียนจะเห็นจุดแดงบนกระดิ่งทันที');
                      setBroadcastTitle('');
                      setBroadcastMessage('');
                    } catch (err: any) {
                      console.error('Failed to send broadcast notification:', err);
                      onTriggerToast('เกิดข้อผิดพลาดในการส่งแจ้งเตือน');
                    } finally {
                      setIsSendingBroadcast(false);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSendingBroadcast ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังส่งแจ้งเตือนเข้าสู่ระบบจริง...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ส่งการแจ้งเตือนแบบเรียลไทม์ถึงทุกคน</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-[#6B6B85] bg-black/20 p-3 rounded-xl border border-white/5 space-y-1 font-mono">
                <p>💡 ระบบใช้ Firebase Firestore onSnapshot listeners</p>
                <p>🔴 กระดิ่งจะปรากฏจุดสีแดงเฉพาะเมื่อมีข้อความแจ้งเตือนที่ยังไม่ได้อ่านเท่านั้น</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

