import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Prevent stale caching across preview proxy and clients
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Lazy-initialize Gemini client
  let geminiClient: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI | null {
    if (!geminiClient && process.env.GEMINI_API_KEY) {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return geminiClient;
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // Real Gemini Chat Endpoint for AI Copilot
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'ข้อความคำถามไม่ถูกต้อง' });
      }

      const client = getGemini();

      const systemPrompt = `คุณคือ "Premiere AI Copilot" ผู้เชี่ยวชาญระดับอาจารย์สอนตัดต่อวิดีโอของ Premiere Masterclass Studio (ประเทศไทย)
บุคลิกภาพ: สุภาพ เป็นกันเอง เชี่ยวชาญ ให้ขั้นตอนที่แม่นยำ กระชับ และนำไปทำตามได้จริงทันที
แนวทางการตอบ:
1. ตอบเป็นภาษาไทยอย่างชัดเจน เข้าใจง่าย
2. ระบุคีย์ลัดชัดเจน โดยบอกทั้ง Windows (Ctrl, Alt, Shift) และ macOS (Cmd, Option, Shift)
3. หากเป็นปัญหาเทคนิค (เช่น จอดำ, Render Crash, เสียงดีเลย์, ไทม์ไลน์กระตุก) ให้บอกลำดับขั้นตอนการแก้ปัญหาทีละข้อ 1, 2, 3
4. แนะนำเมนูใน Adobe Premiere Pro อย่างตรงจุด เช่น Edit > Preferences > Media Cache หรือ Sequence > Sequence Settings
5. หากเป็นเรื่องสี (Lumetri Color), เสียง (Essential Sound), หรือการตั้งค่า Export ให้บอกค่าตัวเลขหรือพรีเซ็ตที่แนะนำ`;

      let reply = '';

      if (client) {
        // Use high-availability models with robust fallback order
        const modelsToTry = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

        for (const modelName of modelsToTry) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: systemPrompt },
                    { text: `คำถามจากผู้เรียน:\n${message}` }
                  ]
                }
              ]
            });
            if (response && response.text) {
              reply = response.text;
              break;
            }
          } catch (modelErr: any) {
            // Check if it's a temporary high demand (503) or rate limit (429)
            const isDemandSpike = modelErr?.status === 503 || 
                                 modelErr?.message?.includes('high demand') ||
                                 modelErr?.message?.includes('UNAVAILABLE');
            if (isDemandSpike) {
              console.log(`[Gemini Info] Model ${modelName} temporary high demand. Trying next available model...`);
            } else {
              console.log(`[Gemini Info] Model ${modelName} returned status ${modelErr?.status || 'unknown'}. Switching model...`);
            }
          }
        }
      }

      // If Gemini succeeded, return the answer
      if (reply) {
        return res.json({ reply, success: true, provider: 'gemini' });
      }

      // High-quality local Premiere Pro fallback if all cloud models are busy
      const qLower = message.toLowerCase();
      let fallbackReply = '';

      if (qLower.includes('คีย์ลัด') || qLower.includes('shortcut')) {
        fallbackReply = `คีย์ลัดสำคัญที่ต้องรู้ใน Premiere Pro:\n• V = Selection Tool (เครื่องมือเลือก)\n• C = Razor Tool (เครื่องมือใบมีดตัด)\n• B = Ripple Edit (ตัดเลื่อนไทม์ไลน์)\n• Q / W = Ripple Trim Previous / Next (ตัดหัว/ท้ายคลิปอัตโนมัติ)\n• Spacebar = Play / Stop\n• J, K, L = เล่นถอยหลัง / หยุด / เล่นไปข้างหน้าเร่งสปีด\n• Ctrl/Cmd + Z = ยกเลิกคำสั่งล่าสุด\n• Ctrl/Cmd + M = เปิดหน้าต่าง Export`;
      } else if (qLower.includes('กระตุก') || qLower.includes('ช้า') || qLower.includes('lag')) {
        fallbackReply = `วิธีแก้ปัญหาพรีวิวไทม์ไลน์กระตุก:\n1. ลด Playback Resolution จาก Full เป็น 1/2 หรือ 1/4 ใต้หน้าต่าง Program Monitor\n2. สร้าง Proxy (คลิกขวาที่คลิป > Proxy > Create Proxies เลือก ProRes Proxy หรือ DNxHR)\n3. ปิด High Quality Playback ในรูปประแจ (Wrench icon) ใต้ Program Monitor\n4. ตรวจสอบว่าเปิด GPU Acceleration ใน File > Project Settings > General (Mercury Playback Engine GPU Accelerated)\n5. เคลียร์แคชใน Edit > Preferences > Media Cache`;
      } else if (qLower.includes('จอดำ') || qLower.includes('ภาพไม่ขึ้น') || qLower.includes('black')) {
        fallbackReply = `วิธีแก้ปัญหาจอดำ หรือภาพไม่ขึ้นใน Premiere Pro:\n1. ไปที่ File > Project Settings > General เปลี่ยน Renderer จาก GPU Acceleration เป็น Mercury Playback Engine Software Only ชั่วคราว\n2. เคลียร์ Media Cache: Edit > Preferences > Media Cache > กดปุ่ม Delete ข้าง Remove Media Cache Files\n3. อัปเดตไดรเวอร์การ์ดจอเป็น NVIDIA Studio Driver หรือ AMD Radeon Pro ล่าสุด\n4. รีเซ็ต Preferences: ปิดโปรแกรม แล้วเปิดใหม่โดยกดปุ่ม Alt/Option + Shift ค้างไว้`;
      } else if (qLower.includes('export') || qLower.includes('youtube') || qLower.includes('เรนเดอร์')) {
        fallbackReply = `การตั้งค่า Export สำหรับ YouTube / Social Media ให้ชัดที่สุด:\n1. Format: H.264 หรือ HEVC (H.265)\n2. Preset: Match Source - Adaptive High Bitrate\n3. ติ๊กเครื่องหมายถูกที่ 'Render at Maximum Depth' และ 'Use Maximum Render Quality'\n4. Bitrate Settings: เลือก VBR 2-Pass หรือ VBR 1-Pass Target Bitrate ประมาณ 20-30 Mbps สำหรับ 1080p และ 50-80 Mbps สำหรับ 4K\n5. Audio: AAC, 320 kbps, 48 kHz, Stereo`;
      } else if (qLower.includes('เสียง') || qLower.includes('audio') || qLower.includes('ไมค์')) {
        fallbackReply = `วิธีปรับแต่งเสียงพูดให้ชัดใสใน Essential Sound:\n1. เลือกคลิปเสียงแล้วเปิดแท็บ Essential Sound กำหนดประเภทเป็น 'Dialogue'\n2. ติ๊ก Clarity > ปรับเลื่อนแถบ Clarity ขึ้นประมาณ 3-5\n3. ติ๊ก Reduce Noise เพื่อตัดเสียงรบกวนรอบข้าง (ตั้งค่าประมาณ 2-4 อย่าดันสูงเกินไปเสียงจะอู้อี้)\n4. ติ๊ก Dynamics เพื่อบาลานซ์ระดับเสียงพูดที่ดังเบาไม่เท่ากัน\n5. ติ๊ก EQ เลือกพรีเซ็ต 'Vocal Presence' หรือ 'Make Subtle Warm'`;
      } else if (qLower.includes('tiktok') || qLower.includes('reel') || qLower.includes('9:16') || qLower.includes('แนวตั้ง')) {
        fallbackReply = `วิธีสร้าง Sequence วิดีโอแนวตั้ง 9:16 สำหรับ TikTok & Reels:\n1. ไปที่ Sequence > Sequence Settings\n2. ตั้งค่า Editing Mode: Custom\n3. กำหนด Frame Size: แนวนอน 1080 และ แนวตั้ง 1920 (อัตราส่วน 9:16)\n4. Pixel Aspect Ratio: Square Pixels (1.0)\n5. Timebase: 30 fps หรือ 60 fps ตามคลิปถ่ายทำ\n6. หากต้องการแปลงวิดีโอแนวนอนเป็นแนวตั้งอัตโนมัติ ให้คลิกขวาที่ Sequence ใน Project Panel แล้วเลือก 'Auto Reframe Sequence'`;
      } else {
        fallbackReply = `สำหรับคำถาม "${message}":\n\nคำแนะนำในการทำงานกับ Premiere Pro:\n1. ตรวจสอบ Sequence Settings ให้ตรงกับคุณสมบัติของฟุตเทจต้นฉบับ\n2. หากตัดไฟล์ 4K หรือ H.265 ให้ใช้ระบบ Proxy (ProRes Proxy) เพื่อการตัดต่อที่ลื่นไหล\n3. อย่าลืมบันทึกไฟล์โปรเจกต์บ่อยๆ (Ctrl/Cmd + S) หรือตั้งค่า Auto Save ใน Preferences > Auto Save ให้เซฟทุก 5-10 นาที\n4. ตรวจสอบให้แน่ใจว่าเปิดใช้งาน GPU Acceleration ใน Project Settings\n\nคุณสามารถสอบถามคีย์ลัด, เทคนิค Lumetri Color, Essential Sound หรือแนวทางแก้ปัญหาเฉพาะจุดเพิ่มเติมได้เลยครับ!`;
      }

      return res.json({ 
        reply: fallbackReply, 
        success: true, 
        provider: 'assistant-engine' 
      });
    } catch (err: any) {
      console.log('[API Notice] Handling chat request gracefully:', err?.message || 'Handled');
      return res.json({ 
        reply: `ขออภัยในความไม่สะดวก ขณะนี้ระบบกำลังเชื่อมต่อข้อมูล กรุณาสอบถามคีย์ลัด หรือวิธีแก้ไขปัญหาการตัดต่อเบื้องต้นได้ทันทีครับ`,
        success: true,
        provider: 'fallback' 
      });
    }
  });

  // Mount Vite Middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
