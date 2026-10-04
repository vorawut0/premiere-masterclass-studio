import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Sparkles,
  BookOpen,
  Film,
  FolderDown,
  HelpCircle,
  Gamepad2,
  Briefcase,
  FileText,
  BarChart3,
  User,
  Mail
} from 'lucide-react';
import { GoogleAccountInfo, UserState, AppNotification } from '../types';
import { isUserAdmin } from '../lib/firebase';
import { ShieldCheck, CheckCheck, Inbox } from 'lucide-react';
import { PremiereLogo } from './PremiereLogo';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  openSearch: () => void;
  notifications?: AppNotification[];
  unreadNotificationsCount?: number;
  onMarkNotificationAsRead?: (notifId: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  currentUser?: GoogleAccountInfo | null;
  userState?: UserState;
  onOpenAuthModal: () => void;
  onOpenControllerInbox?: () => void;
}


const NAV_ITEMS = [
  { href: '#home', label: 'Home', icon: Sparkles },
  { href: '#lessons', label: 'บทเรียน', icon: BookOpen },
  { href: '#ebook', label: 'E-Book', icon: BookOpen },
  { href: '#videos', label: 'วิดีโอ', icon: Film },
  { href: '#media', label: 'สื่อการเรียน', icon: FolderDown },
  { href: '#quiz', label: 'แบบทดสอบ', icon: HelpCircle },
  { href: '#games', label: 'เกม', icon: Gamepad2 },
  { href: '#workshop', label: 'เวิร์กช็อป', icon: Briefcase },
  { href: '#blog', label: 'บทความ', icon: FileText },
  { href: '#dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '#profile', label: 'โปรไฟล์', icon: User },
  { href: '#contact', label: 'ติดต่อ', icon: Mail }
];

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  openSearch,
  notifications = [],
  unreadNotificationsCount = 0,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  currentUser,
  userState,
  onOpenAuthModal,
  onOpenControllerInbox
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Helper to render user avatar consistently with ProfileSection
  const renderNavAvatar = (size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
    const textClasses = size === 'sm' ? 'text-xs' : 'text-sm';

    if (userState?.avatarType === 'custom' && userState.customAvatarUrl) {
      return (
        <img
          src={userState.customAvatarUrl}
          alt="Avatar"
          className={`${sizeClasses} rounded-full border border-indigo-400/50 object-cover shrink-0`}
          referrerPolicy="no-referrer"
        />
      );
    }
    if (userState?.avatarType === 'google' && currentUser?.photoURL) {
      return (
        <img
          src={currentUser.photoURL}
          alt={currentUser.displayName}
          className={`${sizeClasses} rounded-full border border-indigo-400/50 object-cover shrink-0`}
          referrerPolicy="no-referrer"
        />
      );
    }
    if (userState?.customAvatarUrl) {
      return (
        <img
          src={userState.customAvatarUrl}
          alt="Avatar"
          className={`${sizeClasses} rounded-full border border-indigo-400/50 object-cover shrink-0`}
          referrerPolicy="no-referrer"
        />
      );
    }
    if (userState?.avatarIcon) {
      return (
        <div className={`${sizeClasses} rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center ${textClasses} shrink-0`}>
          <span>{userState.avatarIcon}</span>
        </div>
      );
    }
    if (currentUser?.photoURL) {
      return (
        <img
          src={currentUser.photoURL}
          alt={currentUser.displayName}
          className={`${sizeClasses} rounded-full border border-indigo-400/50 object-cover shrink-0`}
          referrerPolicy="no-referrer"
        />
      );
    }
    const letter = (userState?.profileName || currentUser?.displayName || 'U').charAt(0).toUpperCase();
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
        {letter}
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map(i => i.href.substring(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const secId = sections[i];
        const el = document.getElementById(secId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(secId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'เมื่อสักครู่';
      if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} วันที่แล้ว`;
    } catch {
      return 'เมื่อสักครู่';
    }
  };

  const isLight = theme === 'light';

  return (
    <nav 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled 
          ? isLight
            ? 'py-2.5 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md'
            : 'py-2.5 bg-[#090B10]/90 backdrop-blur-xl border-b border-indigo-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)]' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="studio-container">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a 
            href="#home" 
            id="nav-brand"
            className="flex items-center gap-2.5 group"
          >
            <PremiereLogo 
              className="w-8 h-8 rounded-lg shadow-[0_0_16px_rgba(153,153,255,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(153,153,255,0.6)] transition-all" 
              withGlow
            />
            <div className="flex flex-col">
              <span className={`font-display font-bold text-sm tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Premiere <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#38BDF8]">Masterclass</span>
              </span>
              <span className={`text-[10px] font-mono leading-none ${isLight ? 'text-indigo-600 font-semibold' : 'text-[#818CF8]/80'}`}>Pro Video Curriculum</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className={`hidden xl:flex items-center gap-1 backdrop-blur-md rounded-full px-2 py-1 ${
            isLight
              ? 'bg-slate-100/95 border border-slate-300/80 shadow-xs'
              : 'bg-[#121624]/90 border border-indigo-500/20 shadow-inner shadow-black/40'
          }`}>
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  id={`nav-link-${item.href.substring(1)}`}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-150 ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-xs' 
                      : isLight
                        ? 'text-slate-700 hover:text-slate-950 hover:bg-white font-medium'
                        : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-2">
            {/* Global Search Button */}
            <button
              onClick={openSearch}
              id="search-trigger-btn"
              title="ค้นหาด่วน (Ctrl+K)"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-950'
                  : 'bg-indigo-500/10 border border-indigo-500/25 text-[#C7D2FE] hover:text-white hover:border-indigo-400 hover:bg-indigo-500/20'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                id="notif-trigger-btn"
                title="การแจ้งเตือนจากระบบจริง"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-950'
                    : 'bg-white/5 border border-white/10 text-[#EDEDF4] hover:text-[#B794F6] hover:border-[#8B5CF6]/50 hover:bg-white/10'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span 
                    id="realtime-notification-red-dot" 
                    className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#0D101B] shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" 
                  />
                )}
              </button>

              {/* Real-time Notification Drawer Panel */}
              {showNotifications && (
                <div 
                  id="notifications-panel"
                  className={`absolute right-0 mt-3 w-80 sm:w-96 p-4 shadow-2xl z-50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${
                    isLight 
                      ? 'bg-white border border-slate-200 text-slate-900 shadow-slate-300/60' 
                      : 'bg-[#0E121E] border border-indigo-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  <div className={`flex items-center justify-between pb-3 mb-3 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-indigo-600' : 'text-[#B794F6]'}`}>
                        การแจ้งเตือนระบบจริง
                      </span>
                      {unreadNotificationsCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          {unreadNotificationsCount} ใหม่
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && onMarkAllNotificationsAsRead && (
                      <button
                        onClick={onMarkAllNotificationsAsRead}
                        id="mark-all-notifications-read-btn"
                        className={`text-[11px] flex items-center gap-1 font-medium transition-colors ${
                          isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-indigo-300'
                        }`}
                      >
                        <CheckCheck className="w-3 h-3" />
                        อ่านทั้งหมด
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Inbox className={`w-8 h-8 mx-auto mb-2 opacity-40 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-[#8E8EA8]'}`}>ไม่มีการแจ้งเตือนใหม่ในระบบ</p>
                      <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-[#5B5B72]'}`}>ระบบเชื่อมต่อ Cloud Firestore เรียลไทม์</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {notifications.map(n => {
                        const isUnread = !n.read;
                        return (
                          <div 
                            key={n.id} 
                            onClick={() => onMarkNotificationAsRead && onMarkNotificationAsRead(n.id)}
                            className={`p-3 rounded-xl text-xs transition-all border cursor-pointer relative group ${
                              isUnread
                                ? isLight
                                  ? 'bg-indigo-50/80 hover:bg-indigo-100/70 border-indigo-200 text-slate-900 shadow-xs'
                                  : 'bg-[#151B2E] hover:bg-[#1A223B] border-indigo-500/40 text-white shadow-xs'
                                : isLight 
                                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 opacity-80' 
                                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-[#B0B0C4] opacity-75'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 font-semibold">
                                {isUnread && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                )}
                                <span className={isLight ? 'text-slate-900' : 'text-white'}>
                                  {n.title}
                                </span>
                              </div>
                              <span className={`text-[10px] font-mono shrink-0 ${isLight ? 'text-slate-400' : 'text-[#6B6B85]'}`}>
                                {formatTimeAgo(n.createdAt)}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed pl-3 ${isLight ? 'text-slate-600' : 'text-[#9A9AB0]'}`}>
                              {n.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              title={theme === 'dark' ? 'สลับเป็นโหมดสว่าง (พื้นหลังขาว ตัวหนังสือดำชัด)' : 'สลับเป็นโหมดมืด'}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800'
                  : 'bg-white/5 border border-white/10 text-[#EDEDF4] hover:text-[#B794F6] hover:border-[#8B5CF6]/50 hover:bg-white/10'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Controller Portal Access Button for Admin */}
            {currentUser && isUserAdmin(currentUser.email) && onOpenControllerInbox && (
              <button
                onClick={onOpenControllerInbox}
                id="navbar-controller-hub-btn"
                title="เปิดศูนย์ควบคุมระบบ & ตรวจสอบงาน (Controller Hub)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer transform hover:scale-105 shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">ศูนย์ควบคุม</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Authentication Trigger Button */}
            {currentUser ? (
              <button
                onClick={onOpenAuthModal}
                id="navbar-user-btn"
                title={`เข้าสู่ระบบด้วย: ${currentUser.displayName} (${currentUser.email})`}
                className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all cursor-pointer shadow-xs group ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-slate-900'
                    : 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 border-indigo-500/35'
                }`}
              >
                {renderNavAvatar('sm')}
                <span className={`hidden sm:inline text-xs font-semibold max-w-[100px] truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {userState?.profileName?.split(' ')[0] || currentUser.displayName.split(' ')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] shrink-0" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                id="navbar-signin-btn"
                title="เข้าสู่ระบบ หรือ สมัครสมาชิก"
                className={`flex items-center justify-center px-4 py-1.5 rounded-full font-bold text-xs transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-sm ${
                  isLight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    : 'bg-white hover:bg-slate-100 text-slate-900 shadow-md shadow-white/10'
                }`}
              >
                <span>เข้าสู่ระบบ</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className={`xl:hidden w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800'
                  : 'bg-white/5 border border-white/10 text-[#EDEDF4] hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu-drawer"
            className={`xl:hidden mt-3 p-4 shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-2 space-y-3 ${
              isLight 
                ? 'bg-white border border-slate-200 text-slate-900 shadow-slate-300/70' 
                : 'glass-panel border border-white/10'
            }`}
          >
            {/* Mobile Google Auth Card */}
            <div className="p-3 rounded-xl bg-[#121626] border border-indigo-500/20 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderNavAvatar('md')}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{userState?.profileName || currentUser.displayName}</p>
                    <p className="text-[10px] text-indigo-300 font-mono truncate">{currentUser.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-[#94A3B8]">ยังไม่ได้เข้าสู่ระบบ</span>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                {currentUser ? 'จัดการบัญชี' : 'เข้าสู่ระบบ'}
              </button>
            </div>

            {/* Mobile Controller Hub Button for Admin */}
            {currentUser && isUserAdmin(currentUser.email) && onOpenControllerInbox && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenControllerInbox();
                }}
                id="mobile-controller-hub-btn"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>เปิดศูนย์ควบคุมผู้สอน (Controller Hub)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-[#5A56E0] text-white shadow-xs font-semibold' 
                        : 'text-[#EDEDF4] hover:bg-white/10 bg-[#161922] border border-[#252A3A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
