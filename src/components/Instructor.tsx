import React from 'react';
import { Award, Film, Users, Star, CheckCircle, Video } from 'lucide-react';

export const Instructor: React.FC = () => {
  return (
    <section id="instructor" className="py-20 relative">
      <div className="studio-container">
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#818CF8] uppercase tracking-wider font-semibold">
            <span className="w-4 h-px bg-[#818CF8]"></span>
            LEAD EDITOR & COURSE INSTRUCTOR
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">แนะนำผู้สอน</h2>
        </div>

        <div className="bg-[#161922] p-6 sm:p-10 border border-[#252A3A] rounded-xl shadow-md">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Avatar Profile */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-[#1B1F2B] border border-[#2B3142] flex flex-col items-center justify-center text-white shadow-inner">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#818CF8]">ณ</span>
                <span className="text-[11px] font-mono text-[#646D82] mt-1">Editor Nat</span>
              </div>
              <div className="absolute -bottom-2.5 -right-2.5 px-2.5 py-1 rounded-md bg-emerald-500 text-[#072416] text-[11px] font-bold font-mono flex items-center gap-1 shadow-sm">
                <CheckCircle className="w-3 h-3" />
                VERIFIED PRO
              </div>
            </div>

            {/* Info & Credentials */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  ณัฐวุฒิ เจริญวิดีโอ (Editor Nat)
                </h3>
                <p className="text-[#818CF8] font-medium text-sm mt-0.5">
                  Senior Video Editor, Colorist & Motion Designer
                </p>
              </div>

              <p className="text-[#949CAE] text-sm sm:text-base leading-relaxed max-w-2xl">
                ผ่านงานตัดต่อโฆษณาโทรทัศน์, มิวสิควิดีโอศิลปินชั้นนำ, และช่อง YouTube ระดับล้านซับสไครบ์มากว่า 12 ปี 
                เชี่ยวชาญการตัดต่อแบบ Fast-Paced, การเกรดสีขั้นสูง Lumetri, และการแก้ปัญหาเสียงในงานจริง 
                เน้นหลักการคิดและเวิร์กโฟลว์มาตรฐานอุตสาหกรรมที่นำไปรับงานได้จริงทันที
              </p>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#1B1F2B] border border-[#252A3A] p-3.5 rounded-lg text-center">
                  <div className="flex items-center justify-center text-[#818CF8] mb-1">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="block font-display font-bold text-lg text-white">12 ปี</span>
                  <span className="text-[11px] text-[#646D82]">ประสบการณ์ตรง</span>
                </div>

                <div className="bg-[#1B1F2B] border border-[#252A3A] p-3.5 rounded-lg text-center">
                  <div className="flex items-center justify-center text-[#60A5FA] mb-1">
                    <Film className="w-4 h-4" />
                  </div>
                  <span className="block font-display font-bold text-lg text-white">180+</span>
                  <span className="text-[11px] text-[#646D82]">โปรเจกต์เชิงพาณิชย์</span>
                </div>

                <div className="bg-[#1B1F2B] border border-[#252A3A] p-3.5 rounded-lg text-center">
                  <div className="flex items-center justify-center text-cyan-400 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="block font-display font-bold text-lg text-white">4,300+</span>
                  <span className="text-[11px] text-[#646D82]">นักเรียนที่จบแล้ว</span>
                </div>

                <div className="bg-[#1B1F2B] border border-[#252A3A] p-3.5 rounded-lg text-center">
                  <div className="flex items-center justify-center text-amber-400 mb-1">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="block font-display font-bold text-lg text-white">4.9 / 5.0</span>
                  <span className="text-[11px] text-[#646D82]">คะแนนความพึงพอใจ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
