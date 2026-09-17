import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Smile, 
  Upload, 
  Check, 
  Sparkles, 
  Briefcase, 
  Globe, 
  Target, 
  Layers, 
  Camera, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { UserState } from '../types';
import { AVATAR_OPTIONS } from '../data/masterclassData';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onSaveProfile: (updated: Partial<UserState>) => void;
}

const SKILL_LEVELS = [
  { id: 'Beginner', label: 'เริ่มต้น (Beginner)', desc: 'เพิ่งเริ่มใช้ Premiere Pro กำลังศึกษาพื้นฐาน' },
  { id: 'Intermediate', label: 'ปานกลาง (Intermediate)', desc: 'ตัดต่อคลิปได้คล่อง ใช้คีย์ลัดและเอฟเฟกต์บ่อย' },
  { id: 'Professional', label: 'มืออาชีพ (Professional)', desc: 'รับงานเชิงพาณิชย์ ตัดต่อ ละคร โฆษณา มิวสิควิดีโอ' }
];

const LEARNING_GOALS = [
  'ตัดคลิปสั้น Reels / TikTok / Shorts ให้ดึงดูด',
  'ทำช่อง YouTube คุณภาพสูงแบบมืออาชีพ',
  'รับงานตัดต่อวิดีโอฟรีแลนซ์ / Commercial',
  'ย้อมสี Lumetri Color และทำเกรดภาพยนตร์',
  'มิกซ์เสียงและทำ Sound Design ให้กระหึ่มชัด'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userState,
  onSaveProfile
}) => {
  const [name, setName] = useState(userState.profileName || 'นักตัดต่อฝึกหัด');
  const [bio, setBio] = useState(userState.bio || 'นักตัดต่อวิดีโอ Premiere Pro ที่หลงใหลในการเล่าเรื่องด้วยภาพ');
  const [skillLevel, setSkillLevel] = useState(userState.skillLevel || 'Beginner');
  const [learningGoal, setLearningGoal] = useState(userState.learningGoal || LEARNING_GOALS[0]);
  const [portfolioUrl, setPortfolioUrl] = useState(userState.portfolioUrl || '');
  
  const [avatarType, setAvatarType] = useState<'emoji' | 'custom' | 'google'>(
    userState.avatarType || (userState.customAvatarUrl ? 'custom' : 'emoji')
  );
  const [selectedEmoji, setSelectedEmoji] = useState(userState.avatarIcon || '🎬');
  const [customAvatarUrl, setCustomAvatarUrl] = useState(userState.customAvatarUrl || '');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    // Limit to 1.5MB to ensure snappy local storage and Firestore performance
    if (file.size > 1.5 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์รูปต้องไม่เกิน 1.5 MB');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomAvatarUrl(event.target.result);
        setAvatarType('custom');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim() || 'นักตัดต่อฝึกหัด';
    
    onSaveProfile({
      profileName: trimmedName,
      bio: bio.trim(),
      skillLevel,
      learningGoal,
      portfolioUrl: portfolioUrl.trim(),
      avatarType,
      avatarIcon: selectedEmoji,
      customAvatarUrl: avatarType === 'custom' ? customAvatarUrl : undefined
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[2200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="edit-profile-modal"
        className="w-full max-w-xl glass-panel-strong rounded-3xl border border-purple-500/30 p-6 sm:p-7 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-[#B794F6] flex items-center justify-center border border-purple-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">แก้ไขข้อมูลโปรไฟล์ผู้เรียน</h3>
              <p className="text-xs text-[#94A3B8]">ปรับเปลี่ยนชื่อ อวตาร ฉายา และเป้าหมายการเรียน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-edit-profile-btn"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 pt-4">
          {/* Avatar Selector Section */}
          <div className="p-4 rounded-2xl bg-[#121626] border border-white/10 space-y-3">
            <label className="block text-xs font-mono text-[#EDEDF4] font-semibold">
              รูปอวตาร / ภาพโปรไฟล์
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Circle */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-purple-500/30 overflow-hidden">
                  {avatarType === 'custom' && customAvatarUrl ? (
                    <img 
                      src={customAvatarUrl} 
                      alt="Custom Avatar" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : avatarType === 'google' && userState.googleAccount?.photoURL ? (
                    <img 
                      src={userState.googleAccount.photoURL} 
                      alt="Google Avatar" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{selectedEmoji}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-md cursor-pointer transition-colors"
                  title="อัปโหลดรูปจากเครื่อง"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Avatar Type Options */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex gap-2 flex-wrap text-xs">
                  <button
                    type="button"
                    onClick={() => setAvatarType('emoji')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      avatarType === 'emoji'
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-white/5 text-[#94A3B8] border-white/10 hover:bg-white/10'
                    }`}
                  >
                    🎨 เลือกไอคอน / อีโมจิ
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      avatarType === 'custom'
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-white/5 text-[#94A3B8] border-white/10 hover:bg-white/10'
                    }`}
                  >
                    📷 อัปโหลดรูปภาพจริง
                  </button>

                  {userState.googleAccount?.photoURL && (
                    <button
                      type="button"
                      onClick={() => setAvatarType('google')}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        avatarType === 'google'
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-white/5 text-[#94A3B8] border-white/10 hover:bg-white/10'
                      }`}
                    >
                      🌐 ใช้รูป Google
                    </button>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/png,image/jpeg,image/webp,image/jpg" 
                  className="hidden" 
                />

                {uploadError && (
                  <p className="text-[11px] text-red-400 font-mono">{uploadError}</p>
                )}

                {avatarType === 'emoji' && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {AVATAR_OPTIONS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedEmoji(av.icon)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer border ${
                          selectedEmoji === av.icon 
                            ? 'bg-purple-600 border-purple-300 scale-110 shadow-sm' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        title={av.label}
                      >
                        {av.icon}
                      </button>
                    ))}
                  </div>
                )}

                {avatarType === 'custom' && customAvatarUrl && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-[#94A3B8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ใช้รูปที่อัปโหลดส่วนตัว</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAvatarUrl('');
                        setAvatarType('emoji');
                      }}
                      className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> ลบรูป
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Name & Bio */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-[#EDEDF4] mb-1 font-semibold">
                ชื่อผู้เรียน / ชื่อที่แสดงในระบบ และใบประกาศนียบัตร *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="edit-profile-name-input"
                placeholder="เช่น วรวุฒิ เพชรไร หรือ Vorawut Editor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-[#EDEDF4] placeholder-[#64748B] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#EDEDF4] mb-1 font-semibold">
                คำแนะนำตัว / ฉายา / ความสนใจ (Bio)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                id="edit-profile-bio-input"
                placeholder="เช่น นักตัดต่อคลิป YouTube / Colorist มือใหม่ / ช่างตัดต่อโฆษณา"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-[#EDEDF4] placeholder-[#64748B] focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Skill Level Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#EDEDF4] font-semibold">
              ระดับความชำนาญใน Premiere Pro
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SKILL_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSkillLevel(lvl.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    skillLevel === lvl.id
                      ? 'bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500/50'
                      : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-1 leading-snug">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goal */}
          <div>
            <label className="block text-xs font-mono text-[#EDEDF4] mb-1 font-semibold">
              เป้าหมายการเรียนหลักของคุณ
            </label>
            <select
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121626] border border-white/15 text-xs text-[#EDEDF4] focus:outline-none focus:border-purple-500"
            >
              {LEARNING_GOALS.map((goal, idx) => (
                <option key={idx} value={goal} className="bg-[#0D101D] text-white">
                  {goal}
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio Link */}
          <div>
            <label className="block text-xs font-mono text-[#EDEDF4] mb-1 font-semibold">
              ลิงก์ผลงาน หรือช่องทางติดต่อ (Portfolio / YouTube / Behance)
            </label>
            <div className="relative">
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://youtube.com/@yourchannel หรือ https://behance.net/..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-[#EDEDF4] placeholder-[#64748B] focus:outline-none focus:border-purple-500 font-mono"
              />
              <Globe className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              id="save-profile-btn"
              className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
