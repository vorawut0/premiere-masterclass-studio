import React, { useState, useRef } from 'react';
import { 
  User, 
  Award, 
  Zap, 
  Edit3, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Bookmark, 
  Briefcase, 
  Download, 
  Upload,
  FileCode,
  ExternalLink,
  ChevronRight,
  Smile,
  Settings,
  Globe,
  Eye,
  Mail
} from 'lucide-react';
import { UserState, WorkshopSubmission } from '../types';
import { ACHIEVEMENTS_DATA, AVATAR_OPTIONS, LESSONS_DATA } from '../data/masterclassData';
import { EditProfileModal } from './EditProfileModal';
import { WorkshopFeedbackModal } from './WorkshopFeedbackModal';

interface ProfileSectionProps {
  userState: UserState;
  onUpdateName: (newName: string) => void;
  onUpdateAvatar?: (avatar: string) => void;
  onUpdateProfile?: (updated: Partial<UserState>) => void;
  onResetProgress: () => void;
  onOpenCertificate?: () => void;
  onSelectLesson?: (lessonId: number) => void;
  onOpenAuthModal?: () => void;
  onTriggerToast?: (msg: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userState,
  onUpdateName,
  onUpdateAvatar,
  onUpdateProfile,
  onResetProgress,
  onOpenCertificate,
  onSelectLesson,
  onOpenAuthModal,
  onTriggerToast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFullProfileModalOpen, setIsFullProfileModalOpen] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [tempName, setTempName] = useState(userState.profileName);
  const [selectedSubmissionForFeedback, setSelectedSubmissionForFeedback] = useState<WorkshopSubmission | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const level = Math.max(1, Math.floor(userState.points / 100) + 1);
  const currentLevelProgress = userState.points % 100;

  const handleSave = () => {
    onUpdateName(tempName.trim() || 'นักตัดต่อฝึกหัด');
    setIsEditing(false);
  };

  const handleExportJsonBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        userState: {
          ...userState,
          googleAccount: undefined // do not leak auth tokens
        }
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const sanitizedName = (userState.profileName || 'student').trim().replace(/\s+/g, '_');
      link.download = `Premiere_Backup_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (onTriggerToast) onTriggerToast('สำรองข้อมูลการเรียน (JSON) สำเร็จเรียบร้อย');
    } catch (err: any) {
      console.error('Export error:', err);
      if (onTriggerToast) onTriggerToast('เกิดข้อผิดพลาดในการสำรองข้อมูล');
    }
  };

  const handleImportJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const importedState = parsed.userState || parsed;

        if (typeof importedState !== 'object' || !importedState) {
          throw new Error('รูปแบบไฟล์สำรองไม่ถูกต้อง');
        }

        if (onUpdateProfile) {
          onUpdateProfile(importedState);
        } else {
          if (importedState.profileName) onUpdateName(importedState.profileName);
        }

        if (onTriggerToast) {
          onTriggerToast('นำเข้าและกู้คืนข้อมูลความคืบหน้าการเรียนสำเร็จแล้ว!');
        }
      } catch (err: any) {
        console.error('Import backup error:', err);
        if (onTriggerToast) {
          onTriggerToast('ไฟล์สำรองไม่ถูกต้อง ไม่สามารถกู้คืนข้อมูลได้');
        }
      } finally {
        if (backupFileInputRef.current) {
          backupFileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveFullProfile = (updated: Partial<UserState>) => {
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    } else {
      if (updated.profileName) onUpdateName(updated.profileName);
      if (updated.avatarIcon && onUpdateAvatar) onUpdateAvatar(updated.avatarIcon);
    }
  };

  const bookmarkedLessons = (userState.bookmarks || [])
    .map(id => LESSONS_DATA.find(l => l.id === id))
    .filter(Boolean);

  const workshopSubmissionsList: WorkshopSubmission[] = Object.values(userState.workshopSubmissions || {});

  const handleDownloadIdCard = () => {
    const cardData = `=====================================================
PREMIERE MASTERCLASS — VERIFIED STUDENT ID
=====================================================
Student Name: ${userState.profileName}
Role / Bio: ${userState.bio || 'Premiere Pro Video Editor'}
Skill Level: ${userState.skillLevel || 'Beginner'}
Student Level: Level ${level}
Total Earned XP: ${userState.points} XP
Lessons Completed: ${userState.completedLessons.length} / 15
Study Time: ${userState.studyMinutes} Minutes
Badges Unlocked: ${userState.badges.length} / ${ACHIEVEMENTS_DATA.length}
Workshop Submissions: ${workshopSubmissionsList.length} Projects
Learning Goal: ${userState.learningGoal || 'Commercial Video Editing'}
Portfolio: ${userState.portfolioUrl || 'N/A'}
Issued Date: ${new Date().toLocaleDateString('th-TH')}
Status: ACTIVE ENROLLED
Credential ID: PMC-ID-${userState.points.toString(16).toUpperCase()}-${Math.floor(Date.now() / 1000)}
=====================================================
`;
    const blob = new Blob([cardData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Premiere_Student_Card_${userState.profileName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine avatar to render
  const renderAvatarContent = () => {
    if (userState.avatarType === 'custom' && userState.customAvatarUrl) {
      return (
        <img 
          src={userState.customAvatarUrl} 
          alt="Avatar" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
      );
    }
    if (userState.avatarType === 'google' && userState.googleAccount?.photoURL) {
      return (
        <img 
          src={userState.googleAccount.photoURL} 
          alt="Avatar" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
      );
    }
    if (userState.customAvatarUrl) {
      return (
        <img 
          src={userState.customAvatarUrl} 
          alt="Avatar" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
      );
    }
    if (userState.avatarIcon) {
      return <span className="text-5xl">{userState.avatarIcon}</span>;
    }
    return userState.profileName.charAt(0).toUpperCase() || 'น';
  };

  return (
    <section id="profile" className="py-14 relative bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="studio-container">
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#EDEDF4]">
              โปรไฟล์ผู้เรียน
            </h2>
            <p className="text-xs sm:text-sm text-[#9A9AB0] mt-1">
              ข้อมูลส่วนตัวและความคืบหน้าการเรียนรู้ของคุณ
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsFullProfileModalOpen(true)}
              id="open-edit-profile-modal-btn"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>แก้ไขโปรไฟล์</span>
            </button>

            {onOpenCertificate && (
              <button
                onClick={onOpenCertificate}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>ใบประกาศนียบัตร</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Student Identity (No duplicate levels or confusing bars) */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <div 
                onClick={() => setIsFullProfileModalOpen(true)}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] flex items-center justify-center text-white font-display text-4xl font-extrabold shadow-xl mx-auto ring-4 ring-purple-500/20 cursor-pointer hover:ring-purple-400/50 transition-all overflow-hidden"
                title="คลิกเพื่อแก้ไขโปรไฟล์หรือเปลี่ยนรูป"
              >
                {renderAvatarContent()}
              </div>
              <button
                onClick={() => setIsFullProfileModalOpen(true)}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-500 cursor-pointer"
                title="แก้ไขโปรไฟล์"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name & Bio */}
            <div className="space-y-1 w-full">
              {isEditing ? (
                <div className="flex items-center gap-2 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    id="profile-name-input"
                    className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-purple-500 text-sm text-center text-[#EDEDF4] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    className="p-2 rounded-lg bg-[#34D399] text-[#062c19] hover:bg-[#34D399]/90 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-bold text-lg text-[#EDEDF4]">{userState.profileName}</h3>
                  <button
                    onClick={() => {
                      setTempName(userState.profileName);
                      setIsEditing(true);
                    }}
                    title="แก้ไขชื่อ"
                    className="text-[#9A9AB0] hover:text-[#B794F6] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-xs text-[#9A9AB0] max-w-xs mx-auto leading-relaxed">
                {userState.bio || 'นักตัดต่อวิดีโอ Premiere Pro ที่มุ่งมั่นยกระดับทักษะ'}
              </p>

              {userState.portfolioUrl && (
                <div className="pt-1 flex justify-center">
                  <a
                    href={userState.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center gap-1 transition-colors"
                  >
                    <Globe className="w-2.5 h-2.5" />
                    <span>Portfolio</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Member Account Status - Clean 1-liner */}
            <div className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[#EDEDF4] text-[11px] truncate">
                  {userState.googleAccount ? userState.googleAccount.email : 'บัญชีสมาชิก'}
                </span>
              </div>
              {userState.googleAccount ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" /> เข้าสู่ระบบแล้ว
                </span>
              ) : (
                onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer shrink-0 font-medium"
                  >
                    เข้าสู่ระบบ
                  </button>
                )
              )}
            </div>

            {/* 4 Essential Stats: Clean, Direct & Practical */}
            <div className="w-full grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="block text-xl font-bold text-white">
                  {userState.completedLessons.length} <span className="text-xs text-[#6B6B85] font-normal">/ 15</span>
                </span>
                <span className="text-[11px] text-[#9A9AB0]">บทเรียนที่จบ</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="block text-xl font-bold text-[#34D399]">
                  {workshopSubmissionsList.length} <span className="text-xs text-[#6B6B85] font-normal">/ 6</span>
                </span>
                <span className="text-[11px] text-[#9A9AB0]">งานที่ส่งตรวจ</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="block text-xl font-bold text-purple-300">
                  {userState.points}
                </span>
                <span className="text-[11px] text-[#9A9AB0]">คะแนน XP</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="block text-xl font-bold text-orange-400">
                  🔥 {userState.dailyStreak || 1}
                </span>
                <span className="text-[11px] text-[#9A9AB0]">Streak วัน</span>
              </div>
            </div>

            {/* Quick Actions, Backup & Reset */}
            <div className="w-full pt-3 border-t border-white/10 space-y-2 text-xs text-[#9A9AB0]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadIdCard}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px]"
                  title="ดาวน์โหลดข้อมูลสถานะนักเรียน"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>บัตรนักเรียน (.txt)</span>
                </button>

                <button
                  onClick={handleExportJsonBackup}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-[11px]"
                  title="สำรองข้อมูลการเรียนทั้งหมดเป็นไฟล์ JSON เพื่อนำไปใช้บนอุปกรณ์อื่น"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>สำรองข้อมูล (.json)</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <input 
                  type="file" 
                  ref={backupFileInputRef} 
                  onChange={handleImportJsonBackup} 
                  accept=".json" 
                  className="hidden" 
                />
                <button
                  onClick={() => backupFileInputRef.current?.click()}
                  className="hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                  title="นำเข้าไฟล์สำรองเพื่อกู้คืนความคืบหน้า"
                >
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>นำเข้าข้อมูลสำรอง</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('คุณต้องการรีเซ็ตข้อมูลความคืบหน้าทั้งหมดหรือไม่?')) {
                      onResetProgress();
                    }
                  }}
                  className="text-[#6B6B85] hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>รีเซ็ตข้อมูล</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clear Learning Progress & Meaningful Records */}
          <div className="lg:col-span-8 space-y-5">
            {/* 1. Overall Course Progress & Certificate Status */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#EDEDF4] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>ความคืบหน้าหลักสูตร Premiere Masterclass</span>
                  </h3>
                  <p className="text-xs text-[#9A9AB0] mt-0.5">
                    เรียนจบครบ 15 บทเรียนเพื่อปลดล็อกใบประกาศนียบัตรอย่างเป็นทางการ
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-purple-300">
                  {Math.round((userState.completedLessons.length / 15) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((userState.completedLessons.length / 15) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#9A9AB0] font-mono">
                  <span>เรียนแล้ว {userState.completedLessons.length} จาก 15 บท</span>
                  <span>คงเหลือ {Math.max(0, 15 - userState.completedLessons.length)} บท</span>
                </div>
              </div>

              {/* Certificate Readiness Card */}
              {userState.completedLessons.length >= 15 ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white">ยินดีด้วย! คุณเรียนจบหลักสูตรแล้ว</p>
                      <p className="text-[11px] text-amber-300/80">ใบประกาศนียบัตรพร้อมเปิดและพิมพ์ใช้งานได้ทันที</p>
                    </div>
                  </div>
                  {onOpenCertificate && (
                    <button
                      onClick={onOpenCertificate}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
                    >
                      เปิดใบประกาศนียบัตร
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-[#9A9AB0]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>อีก {15 - userState.completedLessons.length} บทเรียนเพื่อรับใบประกาศนียบัตรจบหลักสูตร</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Workshop Submissions History */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#EDEDF4] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#34D399]" />
                  <span>ผลงานเวิร์กช็อปที่ส่งตรวจ ({workshopSubmissionsList.length})</span>
                </h3>
                <a 
                  href="#workshop" 
                  className="text-xs text-purple-300 hover:text-white transition-colors"
                >
                  ไปที่หน้า Workshop →
                </a>
              </div>

              {workshopSubmissionsList.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {workshopSubmissionsList.map(sub => (
                    <div 
                      key={sub.projectId}
                      onClick={() => setSelectedSubmissionForFeedback(sub)}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs hover:border-emerald-500/40 hover:bg-white/[0.08] transition-all cursor-pointer group"
                      title="คลิกเพื่อดูผลตรวจประเมิน 4 มิติ และคำติชมฉบับเต็ม"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#34D399] font-mono font-bold text-[10px]">
                            เกรด {sub.grade}
                          </span>
                          <span className="font-bold text-[#EDEDF4] truncate group-hover:text-emerald-300 transition-colors">
                            {sub.projectTitle}
                          </span>
                        </div>
                        {sub.feedback && (
                          <p className="text-[11px] text-[#9A9AB0] line-clamp-1 group-hover:text-slate-300 transition-colors">
                            "{sub.feedback}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-[#34D399] font-bold">
                          {sub.score} / 100
                        </span>
                        <div className="p-1 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 text-[#9A9AB0] group-hover:text-emerald-300 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-[#9A9AB0] space-y-1">
                  <p>ยังไม่มีประวัติส่งผลงานเวิร์กช็อป</p>
                  <p className="text-[11px] text-[#6B6B85]">
                    สามารถฝึกตัดต่อและส่งงานในแถบ Workshop ด้านบนเพื่อรับการตรวจประเมินเกรดและรับ +50 XP
                  </p>
                </div>
              )}
            </div>

            {/* 3. Bookmarked Lessons (If any) */}
            {bookmarkedLessons.length > 0 && (
              <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#EDEDF4] flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>บทเรียนที่บันทึกไว้ ({bookmarkedLessons.length})</span>
                  </h3>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {bookmarkedLessons.map(lesson => lesson && (
                    <div 
                      key={lesson.id}
                      onClick={() => onSelectLesson && onSelectLesson(lesson.id)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/5 flex items-center justify-between text-xs cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-purple-400 font-bold">#{lesson.id}</span>
                        <span className="text-[#EDEDF4] group-hover:text-purple-300 transition-colors truncate">
                          {lesson.title}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9A9AB0] group-hover:text-white transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Badges (Compact & Meaningful) */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#EDEDF4] flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>ตราสัญลักษณ์ความสำเร็จ</span>
                </h3>
                <span className="text-xs font-mono text-purple-300">
                  ปลดล็อกแล้ว {userState.badges.length} / {ACHIEVEMENTS_DATA.length} ตรา
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ACHIEVEMENTS_DATA.map(badge => {
                  const isUnlocked = userState.badges.includes(badge.id);

                  return (
                    <div
                      key={badge.id}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isUnlocked
                          ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-sm'
                          : 'bg-white/5 border-white/10 opacity-40 text-[#9A9AB0]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center ${
                        isUnlocked 
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm' 
                          : 'bg-white/10 text-[#6B6B85]'
                      }`}>
                        {isUnlocked ? <Award className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                      </div>
                      <p className="text-xs font-bold text-[#EDEDF4] truncate">{badge.name}</p>
                      <p className="text-[10px] text-[#9A9AB0] line-clamp-1 mt-0.5">{badge.condition}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Full Profile Modal */}
      <EditProfileModal
        isOpen={isFullProfileModalOpen}
        onClose={() => setIsFullProfileModalOpen(false)}
        userState={userState}
        onSaveProfile={handleSaveFullProfile}
      />

      {/* Workshop Feedback & Grade Review Modal */}
      <WorkshopFeedbackModal
        submission={selectedSubmissionForFeedback}
        onClose={() => setSelectedSubmissionForFeedback(null)}
      />
    </section>
  );
};
