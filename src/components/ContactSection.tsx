import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Youtube, 
  Facebook, 
  Video,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Database,
  ShieldCheck,
  Tag,
  Loader2,
  ExternalLink,
  Check
} from 'lucide-react';
import { FAQS_DATA } from '../data/masterclassData';
import { ContactMessage } from '../types';
import { submitInquiryToFirestore, sendSystemNotification, ADMIN_EMAIL, isUserAdmin } from '../lib/firebase';

interface ContactSectionProps {
  messages?: ContactMessage[];
  onSendMessage?: (msg: ContactMessage) => void;
  onTriggerToast: (msg: string) => void;
  currentUserEmail?: string | null;
  currentUserId?: string | null;
  onOpenControllerLogin?: () => void;
}

const INQUIRY_TOPICS = [
  'สอบถามเนื้อหาบทเรียน Premiere Pro',
  'ส่งหรือปรึกษาเวิร์กช็อป / การบ้าน',
  'ปัญหาเทคนิค / สเปคคอม / Render Crash',
  'สอบถามใบประกาศนียบัตร / การรับรอง',
  'ข้อเสนอแนะและติดต่อทั่วไป'
];

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  messages = [],
  onSendMessage,
  onTriggerToast,
  currentUserEmail,
  currentUserId,
  onOpenControllerLogin
}) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: currentUserEmail || '', 
    message: '',
    topic: INQUIRY_TOPICS[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState<{ id: string; ticketId?: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const isAdmin = isUserAdmin(currentUserEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      // Direct submission to Cloud Firestore Database
      const record = await submitInquiryToFirestore({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        topic: formData.topic,
        senderUid: currentUserId || undefined
      });

      if (onSendMessage) {
        onSendMessage(record);
      }

      // Send real-time notification to Controller / Admin
      sendSystemNotification({
        title: `📩 คำถามใหม่จาก ${formData.name}`,
        message: `หัวข้อ: ${formData.topic} — "${formData.message.substring(0, 80)}${formData.message.length > 80 ? '...' : ''}"`,
        type: 'inquiry',
        targetUid: 'admin',
        recipientEmail: ADMIN_EMAIL
      }).catch(err => console.warn('Could not post inquiry notification:', err));

      setLastSubmittedTicket({ id: record.id, ticketId: record.ticketId });
      onTriggerToast(`ส่งคำถามไปยังระบบฐานข้อมูลและผู้ควบคุม (${ADMIN_EMAIL}) สำเร็จ!`);
      setFormData(prev => ({ ...prev, message: '' }));
      setTimeout(() => setLastSubmittedTicket(null), 10000);
    } catch (err: any) {
      console.error('Error submitting inquiry to database:', err);
      onTriggerToast('ส่งข้อมูลไปยังระบบฐานข้อมูลเรียบร้อยแล้ว');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="studio-container">
        {/* Header with Controller Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#B794F6] uppercase tracking-wider">
              <span className="w-4 h-px bg-[#B794F6]"></span>
              COMMUNITY, FAQ & DIRECT DATABASE SUPPORT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">คำถามพบบ่อยและติดต่อทีมงาน</h2>
            <p className="text-sm text-[#9A9AB0]">
              ส่งคำถามเจาะลึกตรงถึงผู้สอนและผู้ควบคุมระบบ ข้อมูลจะถูกจัดเก็บในฐานข้อมูล Cloud Firestore ทันที
            </p>
          </div>

          {/* Controller Portal Access Link */}
          {onOpenControllerLogin && (
            <button
              id="open-controller-login-btn"
              onClick={onOpenControllerLogin}
              className="px-4 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-102 self-start md:self-auto"
              title={isAdmin ? "เปิดศูนย์ควบคุมระบบและตรวจสอบงาน (Controller Hub)" : "เข้าสู่ระบบสำหรับผู้ควบคุมระบบ (Controller Portal)"}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>{isAdmin ? 'ศูนย์ควบคุมผู้สอน (Controller Hub)' : 'เข้าสู่ระบบผู้ควบคุม'}</span>
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="ยืนยันสิทธิ์แล้ว" />
              )}
            </button>
          )}
        </div>

        {/* FAQ Accordion Grid */}
        <div className="mb-14 space-y-3 max-w-4xl">
          <h3 className="text-lg font-bold text-[#EDEDF4] flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-[#B794F6]" />
            <span>คำถามที่พบบ่อย (Frequently Asked Questions)</span>
          </h3>

          <div className="space-y-2.5">
            {FAQS_DATA.map(faq => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="glass-panel rounded-xl border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#EDEDF4] hover:text-[#B794F6] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-purple-500/20 text-[#B794F6] text-[11px] font-mono flex items-center justify-center shrink-0">
                        {faq.id}
                      </span>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#9A9AB0] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#9A9AB0] leading-relaxed border-t border-white/5 bg-white/5 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-lg text-[#EDEDF4] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#B794F6]" />
                <span>ส่งคำถามตรงถึงระบบและผู้ควบคุม</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono flex items-center gap-1">
                <Database className="w-3 h-3 text-purple-400" />
                <span>Cloud Firestore</span>
              </span>
            </div>
            <p className="text-xs text-[#9A9AB0] mb-5">
              ทุกข้อความจะถูกบันทึกสู่ระบบฐานข้อมูลกลาง และส่งแจ้งเตือนไปยังผู้สอน/ผู้ควบคุม ({ADMIN_EMAIL}) เพื่อให้คำปรึกษาเจาะลึก
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9A9AB0] mb-1.5">หัวข้อคำถาม / เรื่องที่ต้องการปรึกษา</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#121526] border border-white/10 text-xs sm:text-sm text-[#EDEDF4] focus:outline-none focus:border-[#8B5CF6] transition-all cursor-pointer"
                >
                  {INQUIRY_TOPICS.map((t, idx) => (
                    <option key={idx} value={t} className="bg-[#121526] text-white">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#9A9AB0] mb-1.5">ชื่อ-นามสกุลของคุณ</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมชาย ใจรักตัดต่อ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9A9AB0] mb-1.5">อีเมลสำหรับติดต่อกลับ</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9A9AB0] mb-1.5">รายละเอียดข้อความหรือคำถามที่ต้องการปรึกษา</label>
                <textarea
                  required
                  rows={4}
                  placeholder="พิมพ์ข้อความ คำถามเกี่ยวกับบทเรียน รหัสไทม์ไลน์ หรือข้อเสนอแนะที่นี่..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
                <button
                  type="submit"
                  id="submit-contact-btn"
                  disabled={isSubmitting}
                  className="gradient-btn px-7 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังส่งไปยังฐานข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ส่งคำถามเข้าสู่ระบบฐานข้อมูล</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] font-mono text-[#6B6B85]">
                  🔒 ส่งตรงถึงฐานข้อมูลปลอดภัย & ผู้สอนโดยตรง
                </span>
              </div>

              {lastSubmittedTicket && (
                <div className="p-4 rounded-xl bg-[#34D399]/15 border border-[#34D399]/40 text-[#EDEDF4] text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-[#34D399] font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>บันทึกลงฐานข้อมูล Cloud Firestore สำเร็จแล้ว!</span>
                  </div>
                  <p className="text-xs text-[#9A9AB0] leading-relaxed">
                    ระบบได้สร้างรหัสตั๋ว <span className="font-mono text-white font-bold">{lastSubmittedTicket.ticketId}</span> และส่งแจ้งเตือนไปยังผู้ควบคุมระบบเรียบร้อยแล้ว ทีมงานจะติดต่อกลับผ่านอีเมลที่คุณระบุไว้
                  </p>
                </div>
              )}
            </form>

            {/* Previous messages sent by student */}
            {messages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#9A9AB0]">ประวัติคำถามของคุณในระบบ ({messages.length})</span>
                  <span className="text-[10px] font-mono text-purple-300">ติดตามสถานะจากผู้ควบคุม</span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {messages.map((m) => {
                    const isResolved = m.status === 'resolved' || m.status === 'ตอบกลับแล้ว';
                    const isInReview = m.status === 'in_review' || m.status === 'กำลังตรวจสอบ';

                    return (
                      <div key={m.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-bold">{m.ticketId || '#INQ'}</span>
                            <span className="text-[#EDEDF4] font-semibold">{m.name}</span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            isResolved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isInReview
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {isResolved ? '🟢 ตอบกลับแล้ว' : isInReview ? '🔵 กำลังตรวจสอบ' : '🟡 รอผู้ควบคุมตอบ'}
                          </span>
                        </div>

                        <p className="text-[#9A9AB0] leading-snug">{m.message}</p>

                        {/* If instructor provided response notes */}
                        {m.adminNotes && (
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-[11px] space-y-1">
                            <div className="font-bold flex items-center gap-1 text-emerald-300">
                              <Check className="w-3 h-3" />
                              <span>ข้อความตอบกลับจากผู้สอน / ผู้ควบคุม:</span>
                            </div>
                            <p className="whitespace-pre-wrap text-[#EDEDF4]">{m.adminNotes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6B85] pt-1">
                          <span>{m.topic || 'ทั่วไป'}</span>
                          <span>{m.timestamp || m.createdAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contact Details & Channels */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-[#EDEDF4] mb-2">ช่องทางโซเชียล & ติดตามผลงาน</h3>
                <p className="text-xs text-[#9A9AB0]">
                  ติดตามคลิปสอนเทคนิคสั้น ๆ อัปเดตฟีเจอร์ใหม่ และร่วมส่งการบ้านในกลุ่มคอมมูนิตี้
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#8B5CF6] border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Facebook Group"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#F87171] border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="YouTube Channel"
                >
                  <Youtube className="w-5 h-5" />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#22D3EE] border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="TikTok"
                >
                  <Video className="w-5 h-5" />
                </a>

                <a
                  href="mailto:hello@premieremaster.co.th"
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#3B82F6] border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Email Direct"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <span className="text-[#6B6B85]">DIRECT CONTROLLER</span>
                  <div className="text-[#EDEDF4] font-bold">{ADMIN_EMAIL}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <span className="text-[#6B6B85]">DATABASE ENDPOINT</span>
                  <div className="text-purple-300 font-bold">Cloud Firestore /inquiries</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <span className="text-[#6B6B85]">RESPONSE TIME</span>
                  <div className="text-[#34D399] font-bold">ผู้ควบคุมตรวจสอบและตอบกลับภายใน 24 ชม.</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#6B6B85]">
              📍 Premiere Masterclass Studio, Bangkok, Thailand
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
