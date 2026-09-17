import React, { useState } from 'react';
import { Share2, HardDrive, Cpu, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { gameAudio } from '../../utils/gameAudio';

interface ExportChallengeGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface ExportScenario {
  id: number;
  client: string;
  projectName: string;
  brief: string;
  requirements: string[];
  expected: {
    format: string;
    resolution: string;
    fps: string;
    bitrate: string;
  };
}

const SCENARIOS: ExportScenario[] = [
  {
    id: 1,
    client: 'Travel YouTuber (1.2M Subs)',
    projectName: 'Japan Autumn 4K Cinematic Vlog',
    brief: 'ต้องการส่งออกไฟล์สำหรับอัปโหลดขึ้น YouTube คุณภาพ 4K สูงสุด ภาพคมชัด ไม่แตกตอนฉายบนทีวีจอยักษ์',
    requirements: [
      'Format ยอดนิยมที่ YouTube รองรับอย่างสมบูรณ์แบบ',
      'Resolution คมชัด 4K Ultra HD (3840 x 2160)',
      'Framerate สไตล์ภาพยนตร์ 24 fps',
      'บิตเรตสูงแบบ 2-Pass เพื่อเก็บดีเทลใบไม้'
    ],
    expected: {
      format: 'H.264 / MP4',
      resolution: '3840 x 2160 (4K UHD)',
      fps: '24 fps',
      bitrate: 'VBR 2-Pass (High Quality)'
    }
  },
  {
    id: 2,
    client: 'แบรนด์เครื่องดื่มชาเขียว',
    projectName: 'Viral TikTok & Instagram Reels (30s)',
    brief: 'ลูกค้าต้องการวิดีโอแนวตั้ง 9:16 สำหรับยิงแอดบน TikTok และ Reels ขนาดไฟล์ต้องไม่เกิน 30MB เพื่อให้โหลดเร็วทันที',
    requirements: [
      'วิดีโอต้องเป็นอัตราส่วนแนวตั้ง 9:16 พอดีหน้าจอมือถือ',
      'ความละเอียด Full HD แนวตั้ง (1080 x 1920)',
      'Framerate ลื่นไหล 30 หรือ 60 fps',
      'Format บีบอัดขนาดกะทัดรัด (H.264)'
    ],
    expected: {
      format: 'H.264 / MP4',
      resolution: '1080 x 1920 (9:16 Vertical)',
      fps: '30 fps',
      bitrate: 'VBR 1-Pass (Fast Web)'
    }
  },
  {
    id: 3,
    client: 'ผู้กำกับเทศกาลภาพยนตร์สากล',
    projectName: 'Short Film Master Archive (หนังสั้นฉายโรง)',
    brief: 'ต้องการส่งออก Master File คุณภาพสูงสุด ไม่บีบอัด เพื่อนำไปฉายในโรงภาพยนตร์และเก็บสำรองในสตูดิโอ',
    requirements: [
      'Format มาตรฐานสตูดิโอภาพยนตร์ (Apple ProRes)',
      'ไม่บีบอัดหรือสูญเสียพิกเซลแม้แต่น้อย (422 HQ)',
      'Framerate สากลของโรงภาพยนตร์ 24 fps',
      'คุณภาพเสียง Uncompressed PCM 48kHz'
    ],
    expected: {
      format: 'Apple ProRes 422 HQ',
      resolution: '1920 x 1080 (Full HD)',
      fps: '24 fps',
      bitrate: 'ProRes Master (Uncompressed)'
    }
  }
];

export const ExportChallengeGame: React.FC<ExportChallengeGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [score, setScore] = useState(0);

  // User form choices
  const [selectedFormat, setSelectedFormat] = useState('H.264 / MP4');
  const [selectedResolution, setSelectedResolution] = useState('1920 x 1080 (Full HD)');
  const [selectedFps, setSelectedFps] = useState('24 fps');
  const [selectedBitrate, setSelectedBitrate] = useState('VBR 1-Pass (Fast Web)');

  // Rendering animation state
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [evaluation, setEvaluation] = useState<{
    correctCount: number;
    points: number;
    passed: boolean;
    feedback: string;
  } | null>(null);

  const currentScenario = SCENARIOS[scenarioIdx];

  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setEvaluation(null);
    gameAudio.playClick();

    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          evaluateExport();
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const evaluateExport = () => {
    const exp = currentScenario.expected;
    let matchCount = 0;

    if (selectedFormat === exp.format) matchCount++;
    if (selectedResolution === exp.resolution) matchCount++;
    if (selectedFps === exp.fps) matchCount++;
    if (selectedBitrate === exp.bitrate) matchCount++;

    const roundPoints = matchCount * 8.5;
    const isPassed = matchCount >= 3;

    if (isPassed) {
      gameAudio.playCorrect();
    } else {
      gameAudio.playWrong();
    }

    const newScore = Math.round(score + roundPoints);
    setScore(newScore);
    onScoreUpdate(newScore);

    setEvaluation({
      correctCount: matchCount,
      points: Math.round(roundPoints),
      passed: isPassed,
      feedback: isPassed
        ? 'ลูกค้าพึงพอใจมาก! การตั้งค่าตรงตามโจทย์ทุกประการ'
        : 'มีบางจุดที่ไม่ตรงกับสเปกของลูกค้า เช่น อัตราส่วนหรือฟอร์แมตไฟล์'
    });
  };

  const handleNext = () => {
    setEvaluation(null);
    setRenderProgress(0);

    if (scenarioIdx + 1 < SCENARIOS.length) {
      setScenarioIdx(i => i + 1);
    } else {
      gameAudio.playVictory();
      onComplete(score);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Scenario Brief Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-black/40 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[#A78BFA] font-semibold">
            โจทย์ที่ {scenarioIdx + 1} / {SCENARIOS.length}
          </span>
          <span className="text-[#94A3B8]">ลูกค้า: {currentScenario.client}</span>
        </div>
        <h3 className="text-base font-bold text-white">{currentScenario.projectName}</h3>
        <p className="text-xs text-white/90 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
          💬 "{currentScenario.brief}"
        </p>
      </div>

      {/* Adobe Media Encoder Simulator Form */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-white/10">
          <Share2 className="w-4 h-4 text-[#A78BFA]" />
          <span>Export Settings (ตั้งค่าการส่งออกไฟล์):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Format */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8]">1. Format (ฟอร์แมตไฟล์):</label>
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
              disabled={isRendering}
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-purple-400"
            >
              <option value="H.264 / MP4">H.264 / MP4 (มาตรฐานเว็บ & โซเชียล)</option>
              <option value="Apple ProRes 422 HQ">Apple ProRes 422 HQ (Master ไม่บีบอัด)</option>
              <option value="HEVC / H.265">HEVC / H.265 (บีบอัดสูงพิเศษ)</option>
              <option value="Animated GIF">Animated GIF (ภาพเคลื่อนไหวไร้เสียง)</option>
            </select>
          </div>

          {/* Resolution */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8]">2. Resolution & Aspect (ความละเอียด):</label>
            <select
              value={selectedResolution}
              onChange={e => setSelectedResolution(e.target.value)}
              disabled={isRendering}
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-purple-400"
            >
              <option value="3840 x 2160 (4K UHD)">3840 x 2160 (4K UHD 16:9 แนวนอน)</option>
              <option value="1920 x 1080 (Full HD)">1920 x 1080 (Full HD 16:9 แนวนอน)</option>
              <option value="1080 x 1920 (9:16 Vertical)">1080 x 1920 (9:16 แนวตั้ง Reels/TikTok)</option>
              <option value="1280 x 720 (HD Ready)">1280 x 720 (HD Ready 16:9)</option>
            </select>
          </div>

          {/* Framerate */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8]">3. Frame Rate (อัตราเฟรม):</label>
            <select
              value={selectedFps}
              onChange={e => setSelectedFps(e.target.value)}
              disabled={isRendering}
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-purple-400"
            >
              <option value="24 fps">24 fps (Cinematic สไตล์ภาพยนตร์)</option>
              <option value="30 fps">30 fps (มาตรฐาน YouTube / Broadcast)</option>
              <option value="60 fps">60 fps (Ultra Smooth เกมมิ่ง / กีฬา)</option>
            </select>
          </div>

          {/* Bitrate Encoding */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8]">4. Bitrate Encoding (การบีบอัดบิตเรต):</label>
            <select
              value={selectedBitrate}
              onChange={e => setSelectedBitrate(e.target.value)}
              disabled={isRendering}
              className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-purple-400"
            >
              <option value="VBR 2-Pass (High Quality)">VBR 2-Pass (High Quality คุณภาพสูง)</option>
              <option value="VBR 1-Pass (Fast Web)">VBR 1-Pass (Fast Web ขนาดไฟล์กะทัดรัด)</option>
              <option value="CBR (Constant)">CBR (บิตเรตคงที่)</option>
              <option value="ProRes Master (Uncompressed)">ProRes Master (Uncompressed ไร้บีบอัด)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Render Progress Bar */}
      {isRendering && (
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Rendering via GPU Hardware Acceleration...</span>
            </span>
            <span className="text-emerald-400 font-bold">{renderProgress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-150"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div
          className={`p-4 rounded-2xl border text-center space-y-2 ${
            evaluation.passed
              ? 'bg-emerald-500/15 border-emerald-400/40 text-white'
              : 'bg-amber-500/15 border-amber-400/40 text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {evaluation.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-sm font-bold">
              ความถูกต้อง: {evaluation.correctCount} / 4 หัวข้อ (+{evaluation.points} pts)
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">{evaluation.feedback}</p>
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-lg transition-all cursor-pointer mt-2"
          >
            {scenarioIdx + 1 < SCENARIOS.length ? 'โจทย์ถัดไป →' : 'สรุปผลคะแนน'}
          </button>
        </div>
      )}

      {/* Render Trigger Button */}
      {!isRendering && !evaluation && (
        <div className="text-center">
          <button
            onClick={handleStartRender}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>เริ่มเรนเดอร์และส่งงานลูกค้า (Render & Export)</span>
          </button>
        </div>
      )}
    </div>
  );
};
