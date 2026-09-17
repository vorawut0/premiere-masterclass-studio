import React from 'react';
import { ArrowUp, Facebook, Youtube, Video, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { PremiereLogo } from './PremiereLogo';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenControllerLogin?: () => void;
  onOpenVerificationModal?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onScrollToTop, 
  onOpenControllerLogin,
  onOpenVerificationModal,
  isAdmin 
}) => {
  return (
    <footer className="border-t border-white/10 pt-16 pb-12 bg-black/40 text-xs text-[#9A9AB0] relative">
      <div className="studio-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5 font-display font-extrabold text-base text-white">
              <PremiereLogo className="w-6 h-6 rounded-md shadow-xs" withGlow />
              Premiere<span className="text-[#B794F6]">Master</span>
            </div>
            <p className="text-xs text-[#9A9AB0] leading-relaxed">
              แพลตฟอร์มการเรียนตัดต่อวิดีโอออนไลน์ด้วย Adobe Premiere Pro ครบวงจร 
              ตั้งแต่เริ่มต้นจนถึงระดับผู้กำกับตัดต่อมืออาชีพ
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs font-mono text-white uppercase tracking-wider">เรียนรู้ & ฝึกฝน</h5>
            <ul className="space-y-2">
              <li><a href="#lessons" className="hover:text-[#B794F6] transition-colors">บทเรียน 15 บท</a></li>
              <li><a href="#videos" className="hover:text-[#B794F6] transition-colors">คลังวิดีโอ</a></li>
              <li><a href="#media" className="hover:text-[#B794F6] transition-colors">สื่อการเรียน / Assets</a></li>
              <li><a href="#quiz" className="hover:text-[#B794F6] transition-colors">แบบทดสอบ Certification</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs font-mono text-white uppercase tracking-wider">กิจกรรม & สถิติ</h5>
            <ul className="space-y-2">
              <li><a href="#games" className="hover:text-[#B794F6] transition-colors">8 มินิเกมทักษะ</a></li>
              <li><a href="#workshop" className="hover:text-[#B794F6] transition-colors">10 เวิร์กช็อปโปรเจกต์</a></li>
              <li><a href="#blog" className="hover:text-[#B794F6] transition-colors">บทความจากห้องตัด</a></li>
              <li><a href="#dashboard" className="hover:text-[#B794F6] transition-colors">Dashboard & Badges</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs font-mono text-white uppercase tracking-wider">ติดตามเรา</h5>
            <p className="text-xs text-[#9A9AB0]">ร่วมพูดคุยแลกเปลี่ยนเทคนิคในกลุ่มคอมมูนิตี้ตัดต่อ</p>
            <div className="flex items-center gap-2 pt-1">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#8B5CF6] text-white flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#F87171] text-white flex items-center justify-center transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#22D3EE] text-white flex items-center justify-center transition-all">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Sprockets divider */}
        <div className="flex items-center gap-3 py-6 border-t border-white/10 opacity-60">
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded bg-[#B794F6]" />
            ))}
          </div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#6B6B85]">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© 2569 PremiereMaster. All rights reserved.</span>
            {onOpenVerificationModal && (
              <>
                <span className="hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  id="footer-verify-cert-link"
                  className="text-[#9A9AB0] hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  title="ตรวจสอบความถูกต้องของใบประกาศนียบัตรออนไลน์"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>ตรวจสอบใบประกาศฯ (Verify Certificate)</span>
                </button>
              </>
            )}
            {onOpenControllerLogin && (
              <>
                <span className="hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={onOpenControllerLogin}
                  id="footer-controller-portal-link"
                  className="text-[#9A9AB0] hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  title={isAdmin ? "เปิดศูนย์ควบคุมระบบและตรวจสอบงาน (Controller Hub)" : "เข้าสู่ระบบพอร์ทัลผู้ควบคุมระบบ"}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isAdmin ? 'ศูนย์ควบคุมผู้สอน (Controller Hub)' : 'เข้าสู่ระบบผู้ควบคุม (Controller Login)'}</span>
                </button>
              </>
            )}
          </div>
          <span className="text-[#B794F6]">Cut. Edit. Export. Repeat.</span>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={onScrollToTop}
        id="back-to-top-btn"
        title="กลับขึ้นด้านบน"
        className="fixed bottom-6 right-20 sm:right-6 z-[800] w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
};
