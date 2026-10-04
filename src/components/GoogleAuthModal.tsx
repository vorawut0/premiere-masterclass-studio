import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  ShieldCheck, 
  Award, 
  LogOut, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Inbox,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { GoogleAccountInfo } from '../types';
import { 
  ADMIN_EMAIL, 
  isUserAdmin, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPasswordEmail 
} from '../lib/firebase';
import { PremiereLogo } from './PremiereLogo';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GoogleAccountInfo | null;
  onSignInWithGoogle?: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onOpenControllerInbox?: () => void;
  initialTab?: 'student' | 'controller';
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
  onOpenControllerInbox,
  initialTab = 'student'
}) => {
  // Auth Modes: 'signin' (เข้าสู่ระบบ) | 'signup' (สมัครสมาชิก) | 'forgot' (ลืมรหัสผ่าน)
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setPassword('');
      setConfirmPassword('');
      setAuthMode('signin');
    }
  }, [isOpen, initialTab, currentUser]);

  if (!isOpen) return null;

  const isAdmin = isUserAdmin(currentUser?.email);

  // Handle Email & Password Sign-In / Sign-Up
  const handleSubmitEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('กรุณากรอกอีเมลของคุณ');
      return;
    }

    if (!password) {
      setError('กรุณากรอกรหัสผ่าน');
      return;
    }

    if (authMode === 'signup') {
      const cleanName = displayName.trim();
      if (!cleanName) {
        setError('กรุณาระบุชื่อ-นามสกุล หรือชื่อที่ใช้แสดง');
        return;
      }
      if (password.length < 6) {
        setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return;
      }
      if (password !== confirmPassword) {
        setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
        return;
      }

      try {
        setLoading(true);
        await signUpWithEmail(cleanEmail, password, cleanName);
        setSuccessMsg('สร้างบัญชีผู้ใช้และเข้าสู่ระบบสำเร็จ');
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      } finally {
        setLoading(false);
      }
    } else {
      // Sign in mode
      try {
        setLoading(true);
        await signInWithEmail(cleanEmail, password);
        setSuccessMsg('เข้าสู่ระบบสำเร็จ');
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Forgot Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('กรุณาระบุอีเมลที่ใช้ลงทะเบียนเพื่อรับลิงก์รีเซ็ต');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordEmail(cleanEmail);
      setSuccessMsg(`ระบบส่งคำแนะนำในการรีเซ็ตรหัสผ่านไปยัง ${cleanEmail} เรียบร้อยแล้ว กรุณาตรวจสอบกล่องข้อความหรืออีเมลขยะ`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await onSignOut();
      onClose();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการออกจากระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenController = () => {
    onClose();
    if (onOpenControllerInbox) {
      onOpenControllerInbox();
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="auth-modal"
        className="w-full max-w-md glass-panel-strong rounded-3xl border border-indigo-500/25 p-6 sm:p-7 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-slate-100"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar with Brand & Close Button */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <PremiereLogo className="w-6 h-6 rounded-md shadow-xs" withGlow />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-purple-300">
              PREMIERE MASTERCLASS
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            id="auth-modal-close-btn"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STATE A: USER IS ALREADY LOGGED IN (ACCOUNT PROFILE CARD)                */}
        {/* ========================================================================= */}
        {currentUser ? (
          <div className="space-y-5 relative z-10 py-1">
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl mx-auto border-2 border-indigo-500/50 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/20">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#090B10]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <span>{currentUser.displayName}</span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                      ADMIN
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{currentUser.email}</p>
              </div>

              {/* Role Status Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#CBD5E1]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isAdmin ? 'สิทธิ์การใช้งาน: ผู้ควบคุมระบบหลัก (Master Instructor)' : 'สิทธิ์การใช้งาน: บัญชีผู้เรียน (Student)'}
                </span>
              </div>
            </div>

            {/* Quick Stats / Info Card */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-[#94A3B8] text-[11px] mb-0.5">สถานะการเชื่อมต่อ</span>
                <span className="font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ซิงค์ Cloud เรียบร้อย
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-[#94A3B8] text-[11px] mb-0.5">ใบประกาศนียบัตร</span>
                <span className="font-semibold text-amber-300 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5" /> พร้อมออกใบรับรอง
                </span>
              </div>
            </div>

            {/* Admin Hub Access Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenController}
                id="logged-in-open-controller-btn"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                <Inbox className="w-4 h-4" />
                <span>เปิดศูนย์ควบคุมระบบและคำร้อง (Controller Hub)</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#CBD5E1] text-xs font-medium transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                id="auth-signout-btn"
                className="flex-1 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STATE B: NOT LOGGED IN - STANDARD LOGIN / REGISTER / FORGOT INTERFACE      */
          /* ========================================================================= */
          <div className="space-y-5 relative z-10">
            {/* Header Title */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-1">
                <PremiereLogo className="w-12 h-12 rounded-xl shadow-[0_0_24px_rgba(153,153,255,0.4)]" withGlow />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {authMode === 'signin' && 'เข้าสู่ระบบ'}
                {authMode === 'signup' && 'สร้างบัญชีผู้ใช้ใหม่'}
                {authMode === 'forgot' && 'รีเซ็ตรหัสผ่าน'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {authMode === 'signin' && 'ยินดีต้อนรับกลับสู่ระบบการเรียนรู้ Premiere Pro'}
                {authMode === 'signup' && 'สมัครเพื่อบันทึกประวัติการเรียนรู้และรับ Certificate'}
                {authMode === 'forgot' && 'กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่'}
              </p>
            </div>

            {/* Vercel Host Friendly Notice */}
            {typeof window !== 'undefined' && (window.location.hostname.endsWith('.vercel.app') || window.location.hostname.includes('vercel')) && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-white">พร้อมใช้งานบน Vercel:</span> แนะนำให้สมัครสมาชิกหรือเข้าสู่ระบบด้วย <strong className="text-purple-300">อีเมลและรหัสผ่าน</strong> ด้านล่างเพื่อเริ่มเรียนได้ทันทีครับ
                </div>
              </div>
            )}

            {/* Standard Mode Switcher (Sign In vs Sign Up Tabs) */}
            {authMode !== 'forgot' && (
              <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  id="tab-mode-signin-btn"
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'signin'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  id="tab-mode-signup-btn"
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>สมัครสมาชิก</span>
                </button>
              </div>
            )}

            {/* Error Notification Alert */}
            {error && (() => {
              const isWrongCredentials = error.includes('ไม่ถูกต้อง') || error.includes('invalid-credential') || error.includes('wrong-password') || error.includes('user-not-found');

              return (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span className="leading-relaxed font-medium">{error}</span>
                  </div>

                  {isWrongCredentials && (
                    <div className="pt-2 border-t border-red-500/20 space-y-2 text-[11px]">
                      <p className="text-[#CBD5E1]">
                        💡 <strong>หากลืมรหัสผ่าน:</strong> สามารถกดส่งลิงก์เพื่อตั้งรหัสผ่านใหม่ทางอีเมลได้ทันที หรือสลับไปสมัครสมาชิกใหม่:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot');
                            setError(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>ส่งลิงก์ตั้งรหัสผ่านใหม่ ({email.trim() || 'อีเมลนี้'})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signup');
                            setError(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[#EDEDF4] font-medium text-xs transition-colors cursor-pointer"
                        >
                          สลับไปสมัครสมาชิก
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Success Notification Alert */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Form Mode: Forgot Password */}
            {authMode === 'forgot' ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#EDEDF4] mb-1.5">
                    ที่อยู่อีเมลของคุณ
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-500 focus:outline-none text-xs text-white placeholder:text-[#64748B] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="send-reset-email-btn"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                  >
                    ← กลับสู่หน้าเข้าสู่ระบบ
                  </button>
                </div>
              </form>
            ) : (
              /* Form Mode: Sign In or Sign Up */
              <form onSubmit={handleSubmitEmailAuth} className="space-y-3.5">
                {/* Full Name / Display Name (Sign Up only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#EDEDF4] mb-1">
                      ชื่อ-นามสกุล หรือชื่อแสดงในระบบ <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="เช่น สมชาย ใจดี หรือ Premiere Cutter"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-500 focus:outline-none text-xs text-white placeholder:text-[#64748B] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#EDEDF4] mb-1">
                    อีเมล (Email) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-500 focus:outline-none text-xs text-white placeholder:text-[#64748B] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#EDEDF4]">
                      รหัสผ่าน (Password) <span className="text-red-400">*</span>
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setError(null);
                          setSuccessMsg(null);
                        }}
                        id="forgot-password-link"
                        className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        ลืมรหัสผ่าน?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-500 focus:outline-none text-xs text-white placeholder:text-[#64748B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#EDEDF4] mb-1">
                      ยืนยันรหัสผ่านอีกครั้ง <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="พิมพ์รหัสผ่านเดิมซ้ำอีกครั้ง"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-purple-500 focus:outline-none text-xs text-white placeholder:text-[#64748B] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me Checkbox (Sign In only) */}
                {authMode === 'signin' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember-me-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me-checkbox" className="text-xs text-[#94A3B8] cursor-pointer select-none">
                      จดจำการเข้าสู่ระบบบนอุปกรณ์นี้
                    </label>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  id="email-auth-submit-btn"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : authMode === 'signup' ? (
                    <UserPlus className="w-4 h-4" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>
                    {authMode === 'signup' ? 'สร้างบัญชีผู้ใช้ใหม่' : 'เข้าสู่ระบบ'}
                  </span>
                </button>
              </form>
            )}

            {/* Bottom Switch between Sign In / Sign Up */}
            <div className="pt-3 border-t border-white/10 text-center text-xs text-[#94A3B8]">
              {authMode === 'signin' ? (
                <p>
                  ยังไม่มีบัญชีใช่หรือไม่?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    id="switch-to-signup-link"
                    className="font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    สมัครสมาชิกฟรี
                  </button>
                </p>
              ) : authMode === 'signup' ? (
                <p>
                  มีบัญชีอยู่แล้วใช่หรือไม่?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    id="switch-to-signin-link"
                    className="font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    เข้าสู่ระบบที่นี่
                  </button>
                </p>
              ) : null}
            </div>

            {/* Discreet Admin/Instructor Note */}
            <p className="text-[11px] text-center text-[#64748B] pt-1 leading-relaxed">
              สำหรับอาจารย์ผู้สอนและผู้ควบคุมระบบ ระบบจะเปิดสิทธิ์การจัดการให้อัตโนมัติเมื่อเข้าสู่ระบบด้วยอีเมลที่ได้รับอนุญาต
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
