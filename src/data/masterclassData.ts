import { Lesson, VideoItem, MediaCategory, QuizQuestion, MinigameInfo, WorkshopProject, BlogPost, AchievementBadge, ShortcutItem } from '../types';

export const LESSONS_DATA: Lesson[] = [
  {
    id: 1,
    title: "สอนตัดต่อวิดีโอพื้นฐาน Premiere Pro เข้าใจง่ายใน 8 นาที",
    dur: "8 นาที",
    category: "Basic",
    youtubeId: "_SSSpNDWckc",
    instructor: "JaLearn",
    desc: "เรียนรู้ภาพรวมโปรแกรม หน้าต่างทำงาน (Workspace) และขั้นตอนการเริ่มต้นตัดต่อวิดีโอตัวแรกตั้งแต่ต้นจนจบอย่างเข้าใจง่าย",
    learn: [
      "โครงสร้างหน้าต่าง Workspace และการนำเข้าไฟล์ Footage เข้าสู่โปรแกรม",
      "การสร้าง Sequence ที่เหมาะสมกับความละเอียดและเฟรมเรตของวิดีโอ",
      "เครื่องมือตัดพื้นฐาน (Selection Tool V & Razor Tool C)",
      "การเรียงคลิปบน Timeline และการ Export ไฟล์คลิปแรกอย่างถูกต้อง"
    ],
    exercise: "เปิดโปรแกรม Premiere Pro นำเข้าคลิปตัวอย่าง 2 คลิป วางบน Timeline แล้วตัดต่อให้ต่อเนื่องกัน"
  },
  {
    id: 2,
    title: "สอนโปรแกรมตัดต่อ Premiere Pro พื้นฐานโดยละเอียดฉบับมืออาชีพ",
    dur: "34 นาที",
    category: "Basic",
    youtubeId: "I87RVVVGZVw",
    instructor: "LONG LIFE ล้งไลฟ์",
    desc: "บทเรียนสอนตัดต่อโดยนักตัดต่อมืออาชีพ เจาะลึกโครงสร้างโปรแกรม การตั้งค่า Workspace, Preferences และพื้นฐานสำคัญ",
    learn: [
      "การตั้งค่า Scratch Disks และ Memory Preferences เพื่อการทำงานที่เสถียรไม่หลุดบ่อย",
      "ความแตกต่างและหน้าที่ของ Source Monitor กับ Program Monitor",
      "การใช้คีย์ลัดพื้นฐานในการควบคุมและเลื่อนดูคลิปอย่างคล่องแคล่ว",
      "หลักการทำงานแบบ Non-destructive editing บน Premiere Pro"
    ],
    exercise: "ตั้งค่า Preferences ของโปรแกรมให้รองรับประสิทธิภาพเครื่อง และจัดหน้าต่าง Workspace ให้เหมาะสมกับงาน"
  },
  {
    id: 3,
    title: "Learn Premiere Pro in 20 Minutes - Fast Track Masterclass",
    dur: "20 นาที",
    category: "Basic",
    youtubeId: "Hls3Tp7JS8E",
    instructor: "Kriscoart",
    desc: "คอร์สเร่งรัดสอนตัดต่อ Premiere Pro ครบถ้วนทุกกระบวนการพื้นฐานภายใน 20 นาที เรียนจบเริ่มตัดงานได้ทันที",
    learn: [
      "Panel layout 4 ส่วนหลักและการตั้งค่า New Project อย่างถูกต้อง",
      "เทคนิคการเลือก In-Point (I) และ Out-Point (O) ใน Source Monitor ก่อนดึงลง Timeline",
      "การวางคลิปลงใน Timeline และการปรับขนาด Scale / Position ใน Effect Controls",
      "การใส่เพลงประกอบ ปรับระดับเสียง และการ Export วิดีโอพร้อมแชร์ลงสื่อออนไลน์"
    ],
    exercise: "ฝึกเลือกช่วง In-Out Point ใน Source Monitor ก่อนดึงเฉพาะภาพหรือเสียงลงมาจัดเรียงบน Timeline"
  },
  {
    id: 4,
    title: "วิธีสร้าง Proxy ตัดต่อฟุตเทจ 4K ให้ลื่นไหลไม่กระตุก",
    dur: "10 นาที",
    category: "Assets",
    youtubeId: "hQyuHlffkAA",
    instructor: "John The Video Guy",
    desc: "เทคนิคการ Import และสร้างไฟล์ Proxy เพื่อให้คอมพิวเตอร์สเปคทั่วไปสามารถตัดต่อคลิปความละเอียดสูง 4K ได้อย่างลื่นไหล",
    learn: [
      "หลักการทำงานของ Proxy Workflow และความแตกต่างจากไฟล์ Original",
      "การสร้าง Ingest Preset ด้วย Adobe Media Encoder แปลงเป็น ProRes Proxy",
      "วิธีเปิดใช้งานปุ่ม Toggle Proxies บนหน้าต่าง Program Monitor",
      "การสลับกลับมาใช้ไฟล์ Full Resolution อัตโนมัติเมื่อกด Export เพื่อภาพคมชัดสูงสุด"
    ],
    exercise: "สร้างไฟล์ Proxy จากวิดีโอความละเอียดสูง และทดลองเปิด-ปิดปุ่ม Toggle Proxies เพื่อดูความแตกต่างของความลื่นไหล"
  },
  {
    id: 5,
    title: "ตัดต่อเร็วขึ้น 100 เท่าด้วยคีย์ลัด Razor Tool และ Ripple Delete",
    dur: "7 นาที",
    category: "Cutting",
    youtubeId: "cGp2J0cScBU",
    instructor: "Rapid Edits",
    desc: "เร่งสปีดการตัดต่อแบบก้าวกระโดดด้วยคีย์ลัด Razor Tool, การใช้ปุ่ม Q และ W สำหรับ Ripple Trim หัว-ท้ายคลิปในเสี้ยววินาที",
    learn: [
      "การใช้คีย์ลัด Add Edit (Ctrl/Cmd + K) แทนการหยิบมีดโกน Razor Tool",
      "การใช้ปุ่ม Q (Ripple Trim Previous) ลบหัวคลิปและดึงคลิปมาชนทันที",
      "การใช้ปุ่ม W (Ripple Trim Next) ลบท้ายคลิปโดยไม่ต้องคลิกลบช่องว่าง",
      "เทคนิคการตัดต่อแบบสองมือ (Two-Handed Editing) เพื่อความเร็วสูงสุด"
    ],
    exercise: "นำฟุตเทจดิบความยาว 2 นาทีมาตัดช่องว่างและช่วงเดดแอร์ออกทั้งหมดโดยใช้เฉพาะคีย์ลัด Q, W และ Ctrl/Cmd+K"
  },
  {
    id: 6,
    title: "สร้าง Smooth Zoom Blur Transition ใน Premiere Pro",
    dur: "8 นาที",
    category: "Transition",
    youtubeId: "niMcUQ0Bkxg",
    instructor: "Justin Odisho",
    desc: "วิธีทำทรานซิชันซูมเบลอแบบเนียนตาด้วย Adjustment Layer และ Transform Effect ยกระดับความน่าสนใจให้มิวสิควิดีโอและ Vlog",
    learn: [
      "การวาง Adjustment Layer คร่อมระหว่างรอยต่อสองคลิป",
      "การใช้ Transform Effect และปลดล็อก Shutter Angle เป็น 360 องศาเพื่อ Motion Blur",
      "การตั้งคีย์เฟรม Scale และการใช้ Temporal Interpolation แบบ Ease Out",
      "การบันทึก Effect เป็น Preset เพื่อนำกลับมาใช้ซ้ำในคลิกเดียว"
    ],
    exercise: "สร้าง Smooth Zoom Transition ระหว่าง 2 ช็อตบน Adjustment Layer แล้วบันทึกเป็น Effect Preset"
  },
  {
    id: 7,
    title: "สร้างตัวอักษรและแอนิเมชันคำบรรยายซับไตเติล (Animated Captions)",
    dur: "9 นาที",
    category: "Text",
    youtubeId: "7AINFLKC7Ks",
    instructor: "Solid Coast",
    desc: "การออกแบบข้อความไตเติล จัดวาง Typography และทำแอนิเมชันคำบรรยายซับไตเติลเคลื่อนไหวตามคำพูดสไตล์คอนเทนต์ยอดนิยม",
    learn: [
      "การใช้งาน Essential Graphics Panel ปรับแต่งฟอนต์ ขนาด สี และ Stroke",
      "การจัดตำแหน่งกึ่งกลางหน้าจอด้วย Align and Transform",
      "การแปลงไฟล์คำบรรยาย Captions ให้กลายเป็น Editable Graphic Text",
      "การใส่คีย์เฟรม Scale และ Opacity ให้คำบรรยายเด้งตามจังหวะคำพูด (Pop Text)"
    ],
    exercise: "สร้างข้อความ Title เปิดคลิปพร้อมแอนิเมชันเด้งเข้า และทำซับไตเติลความยาว 1 ประโยค"
  },
  {
    id: 8,
    title: "เทคนิค Mask Tracking เบลอใบหน้าและติดตามวัตถุอัตโนมัติ",
    dur: "6 นาที",
    category: "Effects",
    youtubeId: "JeZBkXzMBYY",
    instructor: "John The Video Guy",
    desc: "สอนวิธีใช้ Mask ร่วมกับ Fast Blur หรือ Mosaic เพื่อเบลอเซ็นเซอร์ใบหน้า ป้ายทะเบียน และให้ระบบแทร็กตามการเคลื่อนที่อัตโนมัติ",
    learn: [
      "การสร้าง Ellipse Mask และ 4-Point Polygon Mask บน Effect",
      "การตั้งค่า Mask Feather เพื่อให้ขอบเบลอดูกลืนเป็นธรรมชาติ",
      "การใช้ฟังก์ชัน Track Selected Mask Forward ให้คำนวณตามวัตถุอัตโนมัติ",
      "การแก้ไขจุดคีย์เฟรมด้วยมือเมื่อวัตถุถูกบดบังหรือเคลื่อนที่เร็วเกินไป"
    ],
    exercise: "ใส่เอฟเฟกต์เบลอเซ็นเซอร์บนใบหน้าคนในคลิปที่มีการเดินเคลื่อนไหว แล้วแทร็กตามอย่างแม่นยำ"
  },
  {
    id: 9,
    title: "Color Grading ฉบับมืออาชีพด้วย Lumetri Color",
    dur: "16 นาที",
    category: "Color",
    youtubeId: "rsabrtaUFPw",
    instructor: "Aidin Robbins",
    desc: "คู่มือเกรดสีและย้อมอารมณ์ภาพระดับภาพยนตร์ การอ่านค่า Lumetri Scopes การปรับ Exposure, Contrast และการใช้ Curves",
    learn: [
      "ความแตกต่างระหว่าง Basic Correction (แก้สมดุลแสงสี) กับ Creative Looks",
      "การอ่านกราฟ Lumetri Scopes (Waveform และ Vectorscope)",
      "การใช้ Curves (RGB Curves & Hue Saturation Curves) ควบคุมสีเฉพาะเจาะจง",
      "การเลือกโทนสีสกินโทน (Skin Tone Line) ให้ผิวมนุษย์ดูเป็นธรรมชาติสมจริง"
    ],
    exercise: "แก้สีคลิปที่มีปัญหา White Balance ให้ถูกต้อง จากนั้นย้อมโทนสี Cinematic สไตล์ที่คุณชื่นชอบ"
  },
  {
    id: 10,
    title: "Essential Sound ครบทุกฟังก์ชัน ปรับเสียงให้ใส มิกซ์เพลงให้ลงตัว",
    dur: "12 นาที",
    category: "Audio",
    youtubeId: "13OCb1gMDUs",
    instructor: "Premiere Basics",
    desc: "บริหารจัดการระบบเสียงทั้งหมดในหน้าต่าง Essential Sound ลดเสียงรบกวน ปรับเสียงพูดให้อิ่ม และทำ Auto-Ducking หรี่เสียงเพลงอัตโนมัติ",
    learn: [
      "การจำแนกแทร็กเสียงเป็น Dialogue, Music, Sound Effects (SFX) และ Ambience",
      "การใช้งาน Reduce Noise และ Reduce Reverb แก้ปัญหาเสียงสะท้อนในห้อง",
      "การเปิดใช้ Ducking ให้เพลงหรี่เสียงลงอัตโนมัติเมื่อมีเสียงพูด Dialogue",
      "การปรับระดับความดังรวม (Loudness) ให้ได้มาตรฐาน -14 LUFS สำหรับแพลตฟอร์มออนไลน์"
    ],
    exercise: "นำเข้าไฟล์เสียงพูดที่มีเสียงรบกวน คลีนเสียงด้วย Essential Sound และมิกซ์ร่วมกับเพลงประกอบโดยใช้ Ducking"
  },
  {
    id: 11,
    title: "สร้างแอนิเมชันขยับภาพและกราฟิกอย่างนุ่มนวลด้วย Keyframe",
    dur: "9 นาที",
    category: "Animation",
    youtubeId: "qmvyFL2Hdtc",
    instructor: "Gavin Herman",
    desc: "เข้าใจกลไกของ Keyframe อย่างลึกซึ้ง วิธีการตั้งค่า Position, Scale, Rotation พร้อมปรับกราฟความเร็ว Velocity Curves ให้นุ่มนวล",
    learn: [
      "หลักการเปิด Stop Watch เพื่อบันทึกการเปลี่ยนแปลงของพารามิเตอร์ตามเวลา",
      "ความแตกต่างระหว่าง Linear, Ease In, Ease Out และ Continuous Bezier",
      "การดึง Handle บน Velocity Graph เพื่อสร้างจังหวะ Slow-Fast-Slow",
      "เทคนิคการทำ Dynamic Zoom In เข้าหาจุดโฟกัสของภาพนิ่ง"
    ],
    exercise: "นำภาพนิ่งมาสร้างแอนิเมชัน Slow Zoom และใส่ข้อความวิ่งลอยเข้ามาพร้อมการหน่วงสปีดแบบ Ease Out"
  },
  {
    id: 12,
    title: "วิธีติดตั้งและใช้งาน Motion Graphics Templates (.mogrt)",
    dur: "7 นาที",
    category: "Motion",
    youtubeId: "Jj67NBCiRfY",
    instructor: "HowTech",
    desc: "ยกระดับงานตัดต่อด้วยกราฟิกและไตเติลสำเร็จรูป (.mogrt) วิธีติดตั้ง นำเข้า แก้ไขข้อความ สีสัน และการจัดเก็บเป็นหมวดหมู่",
    learn: [
      "ความเข้าใจเกี่ยวกับไฟล์ .mogrt (Motion Graphics Templates)",
      "วิธีการ Install Motion Graphics Template เข้าสู่ Essential Graphics",
      "การปรับแต่ง Property ในแถบ Edit: เปลี่ยนฟอนต์ ข้อความ สี แสงเงา",
      "การจัดการแก้ปัญหา Font Missing หรือไฟล์ Offline ในเทมเพลต"
    ],
    exercise: "ติดตั้งไฟล์ .mogrt ตัวอย่าง 1 ชิ้น ดึงลง Timeline ปรับแต่งข้อความเป็นชื่อโปรเจกต์ของคุณและเปลี่ยนโทนสี"
  },
  {
    id: 13,
    title: "เจาะฉากเขียวเนียนตาด้วย Ultra Key ไร้ขอบเขียวสะท้อน",
    dur: "10 นาที",
    category: "Effects",
    youtubeId: "07UBIRiKAOE",
    instructor: "CINE ACADEMY",
    desc: "เทคนิคการตัดพื้นหลังสีเขียวอย่างสมบูรณ์แบบด้วย Ultra Key การลบแสงเขียวสะท้อน (Spill) และการปรับแต่ง Matte ให้ขอบคมเนียน",
    learn: [
      "การใช้ Eyedropper เลือกตัวอย่างสีเขียวใกล้ตัวแบบที่สุด",
      "การสลับมุมมองไปที่ Alpha Channel เพื่อตรวจเช็คความทึบแสง (ขาว=ทึบ, ดำ=โปร่งใส)",
      "การปรับ Matte Generation (Transparency, Pedestal) และ Matte Cleanup (Choke, Soften)",
      "การใช้ Spill Suppression กำจัดแสงเขียวสะท้อนตามเส้นผมและเสื้อผ้า"
    ],
    exercise: "ตัดต่อคลิปคนหน้าฉากเขียวด้วย Ultra Key เช็ค Alpha Channel ให้เนียน และเปลี่ยนใส่พื้นหลังภาพเคลื่อนไหวใหม่"
  },
  {
    id: 14,
    title: "ตั้งค่า Export วิดีโอให้คมชัดสูงสุดสำหรับ YouTube & 4K/1080p",
    dur: "15 นาที",
    category: "Export",
    youtubeId: "DHSw4yghUZs",
    instructor: "Matt WhoisMatt Johnson",
    desc: "วิธีตั้งค่า Export Media ใน Premiere Pro ให้ได้ภาพที่คมชัดสูงสุด สีตรง ไม่เพี้ยน และขนาดไฟล์เหมาะสมสำหรับอัปโหลดลง YouTube",
    learn: [
      "การเลือก Format H.264 และ H.265 (HEVC) ตามความเหมาะสมของแพลตฟอร์ม",
      "การตั้งค่า Bitrate Encoding: VBR 1-Pass vs VBR 2-Pass และ Target Bitrate แนะนำ",
      "การเปิดใช้ Render at Maximum Depth และ Use Maximum Render Quality",
      "การตั้งค่า Audio Format เป็น AAC 320 kbps เพื่อเสียงที่คมชัดระดับพรีเมียม"
    ],
    exercise: "Export วิดีโอโปรเจกต์ของคุณด้วยพรีเซ็ต YouTube 1080p หรือ 4K พร้อมบันทึกเป็น Custom Export Preset ไว้ใช้งานประจำ"
  },
  {
    id: 15,
    title: "เวิร์กโฟลว์ตัดต่อ Vlog ฉบับสมบูรณ์ (Real-World Vlog Workflow)",
    dur: "18 นาที",
    category: "Project",
    youtubeId: "x-EOuT2VZ9Y",
    instructor: "Adobe Video",
    desc: "ประมวลผลทักษะทั้งหมดลงมือสร้างโปรเจกต์จริง เวิร์กโฟลว์การตัดต่อ Vlog ตั้งแต่การคัดฟุตเทจ การเล่าเรื่อง A-Roll/B-Roll จนถึง Final Master",
    learn: [
      "การคัดเลือก Selects และการร้อยเรียงโครงเรื่องหลัก (Story Arc)",
      "การแทรกภาพ B-Roll กลบรอยต่อและเพิ่มมิติให้เนื้อหาการพูดคุย",
      "การควบคุม Pace และ Rhythm ของคลิปให้คนดูติดตามอย่างต่อเนื่อง",
      "การตรวจสอบคุณภาพรอบสุดท้าย (Quality Check) ก่อนเผยแพร่สู่สาธารณะ"
    ],
    exercise: "สร้างชิ้นงาน Vlog หรือวิดีโอแนะนำตัวความยาว 60-90 วินาทีให้เสร็จสมบูรณ์ พร้อมเสียงดนตรีและเกรดสี"
  }
];

export const VIDEOS_DATA: VideoItem[] = [
  { id: 1, title: "สอนตัดต่อวิดีโอง่ายๆ ด้วย Premiere Pro ใน 8 นาที", cat: "พื้นฐาน", dur: "8:45", youtubeId: "_SSSpNDWckc", instructor: "JaLearn", previewColor: "from-purple-900 to-indigo-900", views: "340K+", description: "สรุปขั้นตอนตั้งแต่เปิดโปรแกรมจนเรนเดอร์คลิปแรกสำหรับมือใหม่ เข้าใจง่าย นำไปใช้ได้จริงทันที" },
  { id: 2, title: "สอนโปรแกรมตัดต่อ Premiere Pro พื้นฐานโดยละเอียด", cat: "พื้นฐาน", dur: "34:10", youtubeId: "I87RVVVGZVw", instructor: "LONG LIFE ล้งไลฟ์", previewColor: "from-blue-900 to-slate-900", views: "185K+", description: "สอนโดยนักตัดต่อมืออาชีพแบบไม่มีกั๊ก โครงสร้างโปรแกรมและการตั้งค่าพื้นฐานที่ถูกต้อง" },
  { id: 3, title: "สอนใช้งาน Premiere Pro ตัดต่อคลิปเบื้องต้น มือใหม่ตัดเป็น", cat: "พื้นฐาน", dur: "18:25", youtubeId: "PLL84pZYr0c", instructor: "RKunTii", previewColor: "from-sky-900 to-slate-900", views: "120K+", description: "ก้าวแรกสู่การตัดต่อวิดีโอ เริ่มตั้งแต่เปิดโปรแกรม นำเข้าไฟล์ จนถึงเรนเดอร์งานส่งต่อ" },
  { id: 4, title: "Learn Premiere Pro in 20 Minutes Crash Course", cat: "พื้นฐาน", dur: "20:15", youtubeId: "Hls3Tp7JS8E", instructor: "Kriscoart", previewColor: "from-indigo-900 to-slate-900", views: "2.4M+", description: "คอร์สเร่งรัดระดับโลก เรียนรู้ทุกเครื่องมือหลักที่จำเป็นสำหรับการตัดต่อใน 20 นาที" },
  { id: 5, title: "Learn Premiere Pro in 10 Minutes - Beginner Tutorial", cat: "พื้นฐาน", dur: "10:18", youtubeId: "oUlpbue-Gw0", instructor: "Gavin Herman", previewColor: "from-violet-900 to-fuchsia-900", views: "580K+", description: "คอร์สสรุปด่วน 10 นาที เข้าใจเครื่องมือหลักและกระบวนการทำงานแบบรวดเร็ว" },
  { id: 6, title: "ตัดต่อเร็วขึ้น 100 เท่าด้วย Razor Tool & Ripple Delete", cat: "ตัดต่อ", dur: "6:40", youtubeId: "cGp2J0cScBU", instructor: "Rapid Edits", previewColor: "from-cyan-900 to-blue-900", views: "210K+", description: "เคล็ดลับคีย์ลัดตัดต่อด้วยมีดโกนและลบช่องว่างอัตโนมัติ ประหยัดเวลาตัดต่อได้มหาศาล" },
  { id: 7, title: "วิธีตัดคลิปที่เร็วที่สุดใน Premiere Pro (Shortcuts)", cat: "ตัดต่อ", dur: "5:30", youtubeId: "7EqP4mQa36A", instructor: "Justin Serran", previewColor: "from-pink-900 to-rose-900", views: "190K+", description: "เทคนิคการตัดคลิปด้วยคีย์ลัดมือเดียวและสองมือที่จะทำให้คุณเลิกใช้เมาส์คลิกตัด" },
  { id: 8, title: "คีย์ลัดการตัดแบบเทพๆ มือใหม่ตัดเร็วขึ้นแน่นอน", cat: "ตัดต่อ", dur: "12:50", youtubeId: "mxaweKKidYQ", instructor: "LONG LIFE ล้งไลฟ์", previewColor: "from-emerald-900 to-teal-900", views: "95K+", description: "รวมชอร์ตคัตทรงพลังที่มืออาชีพใช้งานจริง ช่วยเพิ่มสปีดการทำงานแบบก้าวกระโดด" },
  { id: 9, title: "แปลงวิดีโอแนวนอนเป็นแนวตั้งด้วย Auto Reframe", cat: "Shorts & AI", dur: "7:25", youtubeId: "VCHWqaqbxzc", instructor: "Anthony Mediaz", previewColor: "from-amber-900 to-rose-900", views: "85K+", description: "เปลี่ยนคลิป 16:9 เป็น 9:16 สำหรับ TikTok และ Reels โดยให้ AI แทร็กตัวคนให้อยู่กลางจอ" },
  { id: 10, title: "Text-Based Editing ตัดต่อผ่านบทพูดอัตโนมัติด้วย AI", cat: "Shorts & AI", dur: "28:15", youtubeId: "Kly2kyKwOm0", instructor: "Adobe Live", previewColor: "from-orange-900 to-cyan-900", views: "140K+", description: "ฟีเจอร์ AI ถอดเสียงเป็นข้อความ ลบคำซ้ำหรือช่วงเงียบโดยการลบตัวอักษรได้ทันที" },
  { id: 11, title: "วิธีใส่ Automatic Subtitles ซับไตเติลอัตโนมัติ", cat: "Shorts & AI", dur: "6:50", youtubeId: "rwiWFFdPFt8", instructor: "Adobe Made Simple", previewColor: "from-sky-900 to-indigo-900", views: "115K+", description: "สร้างคำบรรยายซับไตเติลภาษาไทยและอังกฤษอัตโนมัติด้วยฟังก์ชัน Speech to Text" },
  { id: 12, title: "How I Color Grade in Adobe Premiere Pro CC", cat: "สี", dur: "16:20", youtubeId: "rsabrtaUFPw", instructor: "Aidin Robbins", previewColor: "from-blue-900 to-cyan-900", views: "1.1M+", description: "ขั้นตอนการย้อมสีและปรับมู้ดภาพยนตร์แบบเต็มกระบวนการด้วย Lumetri Color" },
  { id: 13, title: "Adobe Premiere Pro Color Grading Tutorial", cat: "สี", dur: "14:10", youtubeId: "1wZym4fQGig", instructor: "Zac Watson", previewColor: "from-purple-900 to-pink-900", views: "260K+", description: "สอนการแก้สีและเกรดสีอย่างเป็นขั้นตอน เข้าใจการบาลานซ์แสงและ Contrast" },
  { id: 14, title: "วิธีใช้งาน Lumetri Color & Scopes เจาะลึก", cat: "สี", dur: "11:45", youtubeId: "WSDWy9CfAJY", instructor: "Zac Watson", previewColor: "from-pink-900 to-purple-900", views: "175K+", description: "อ่านค่า Waveform, RGB Parade และการดึง Curves เพื่อผลลัพธ์สีที่แม่นยำไม่หลอกตา" },
  { id: 15, title: "Essential Sound Panel ปรับเสียงให้ใส ครบจบที่เดียว", cat: "เสียง", dur: "12:30", youtubeId: "13OCb1gMDUs", instructor: "Premiere Basics", previewColor: "from-violet-900 to-blue-900", views: "430K+", description: "การคลีนเสียงไมค์ ลดเสียง Noise และการมิกซ์เสียงรอบทิศทางในหน้าต่างเดียว" },
  { id: 16, title: "Auto-Ducking บาลานซ์เสียงพูดกับเพลงอัตโนมัติ", cat: "เสียง", dur: "4:55", youtubeId: "u1x5NUH4vZ4", instructor: "Justin Serran", previewColor: "from-indigo-900 to-purple-900", views: "160K+", description: "เทคนิคหรี่เพลงอัตโนมัติเมื่อมีเสียงพูด โดยไม่ต้องเสียเวลาสร้างคีย์เฟรมปรับลดเดซิเบลด้วยมือ" },
  { id: 17, title: "Save Time Editing AUDIO ด้วย Audio Track Mixer", cat: "เสียง", dur: "8:15", youtubeId: "0AK23LqgYmQ", instructor: "Mario So", previewColor: "from-green-900 to-teal-900", views: "75K+", description: "ควบคุมและใส่เอฟเฟกต์เสียงระดับ Master Track และปรับเกนเสียงแบบองค์รวม" },
  { id: 18, title: "Smooth Keyframe Animation ขยับวัตถุให้นุ่มนวล", cat: "Motion", dur: "9:20", youtubeId: "qmvyFL2Hdtc", instructor: "Gavin Herman", previewColor: "from-red-900 to-purple-900", views: "220K+", description: "ปรับกราฟความเร็ว Velocity Curves และตั้ง Easing ให้ภาพกราฟิกขยับได้อย่างมีสไตล์" },
  { id: 19, title: "The Easiest Way to Speed Ramp in Premiere Pro", cat: "Motion", dur: "8:40", youtubeId: "U2TukFGyqew", instructor: "Justin Serran", previewColor: "from-slate-900 to-purple-900", views: "310K+", description: "เทคนิคเร่ง-ผ่อนสปีดคลิปวิดีโอ (Speed Ramp) แบบภาพยนตร์แอ็กชันยอดฮิต" },
  { id: 20, title: "วิธีสร้าง Proxy ตัดต่อฟุตเทจ 4K ให้ลื่นไหลไม่กระตุก", cat: "Workflow", dur: "9:50", youtubeId: "hQyuHlffkAA", instructor: "John The Video Guy", previewColor: "from-teal-900 to-blue-900", views: "145K+", description: "สร้างไฟล์ Proxy แปลง ProRes ให้คอมสเปคเริ่มต้นตัดต่อ 4K ได้ลื่นไหลไม่มีสะดุด" },
  { id: 21, title: "10 ข้อผิดพลาดที่มือใหม่ชอบทำใน Premiere Pro", cat: "Workflow", dur: "11:20", youtubeId: "LnDhksZ6hBs", instructor: "Andrew James", previewColor: "from-rose-900 to-red-900", views: "310K+", description: "10 จุดพลาดเรื่อง Sequence, เสียงแตก, สีเพี้ยน, และการจัดระเบียบไฟล์งานที่ควรระวัง" },
  { id: 22, title: "Auto Track & Blur เบลอใบหน้าตามการเคลื่อนไหว", cat: "VFX", dur: "6:10", youtubeId: "JeZBkXzMBYY", instructor: "John The Video Guy", previewColor: "from-blue-900 to-purple-900", views: "160K+", description: "ล็อกเป้าใบหน้าหรือวัตถุแล้วแทร็กเบลออัตโนมัติด้วย Mask Tracking ใช้งานง่ายมาก" },
  { id: 23, title: "เจาะฉากเขียว Ultra Key ไร้ขอบเขียวสะท้อน", cat: "VFX", dur: "9:55", youtubeId: "07UBIRiKAOE", instructor: "CINE ACADEMY", previewColor: "from-green-900 to-teal-900", views: "135K+", description: "ตัดฉากหลังเขียวอย่างคมกริบ จัดการขอบฟุ้งและแก้ปัญหาสะท้อนแสงเขียวบนผม" },
  { id: 24, title: "เวิร์กโฟลว์ตัดต่อ Vlog ฉบับสมบูรณ์ (Vlog Guide)", cat: "Workflow", dur: "18:10", youtubeId: "x-EOuT2VZ9Y", instructor: "Adobe Video", previewColor: "from-rose-900 to-purple-900", views: "210K+", description: "เผยสูตรตัดต่อ Vlog ตั้งแต่คัดฟุตเทจ A-Roll/B-Roll ไปจนถึง Final Render คุณภาพสูง" }
];

export const MEDIA_CATEGORIES: MediaCategory[] = [
  { id: "pdf", icon: "FileText", name: "เอกสารประกอบ PDF", count: 15, ext: "pdf", desc: "คู่มือสรุปคีย์ลัด ไวยากรณ์ภาพ และสรุปเนื้อหาบทเรียน", size: "48 MB" },
  { id: "pptx", icon: "Presentation", name: "สไลด์ประกอบการสอน", count: 15, ext: "pptx", desc: "สไลด์บรรยายแบบละเอียดพร้อมภาพตัวอย่างประกอบ", size: "120 MB" },
  { id: "prproj", icon: "FolderArchive", name: "Project File ตัวอย่าง", count: 15, ext: "prproj", desc: "ไฟล์โปรเจกต์ Premiere Pro สำเร็จรูปตามแต่ละบทเรียน", size: "2.4 GB" },
  { id: "preset", icon: "SlidersHorizontal", name: "Preset สี & เอฟเฟกต์", count: 24, ext: "preset", desc: "พรีเซ็ตสำเร็จรูปสำหรับปรับแต่งภาพและเคลื่อนไหวเร็ว", size: "15 MB" },
  { id: "cube", icon: "Film", name: "LUT โทนสีภาพยนตร์", count: 18, ext: "cube", desc: "3D LUTs เกรดสี Cinematic, Teal & Orange, Moody และ Vintage", size: "8 MB" },
  { id: "ttf", icon: "Type", name: "ฟอนต์สำหรับงานวิดีโอ", count: 20, ext: "ttf", desc: "ฟอนต์ไทย-อังกฤษเชิงพาณิชย์ เหมาะสำหรับ Title และ Subtitle", size: "35 MB" },
  { id: "png", icon: "Image", name: "กราฟิก PNG โปร่งใส", count: 40, ext: "png", desc: "ปุ่ม Subscribe, ลูกศร, อิโมจิ, และกรอบข้อความโปร่งใส", size: "65 MB" },
  { id: "mp3", icon: "Volume2", name: "Sound Effect (SFX)", count: 30, ext: "mp3", desc: "เสียง Whoosh, Pop, Click, Glitch, Cinematic Boom คุณภาพสูง", size: "90 MB" },
  { id: "mov", icon: "Layers", name: "Overlay วิดีโอโปร่งแสง", count: 12, ext: "mov", desc: "เอฟเฟกต์แสง Light Leaks, Film Grain, และ Dust Overlays", size: "1.8 GB" },
  { id: "mogrt_trans", icon: "GitCompare", name: "Transition Pack", count: 16, ext: "mogrt", desc: "ทรานซิชันเคลื่อนไหวกราฟิกแบบ Drag & Drop พร้อมเสียง", size: "450 MB" },
  { id: "mogrt", icon: "Sparkles", name: "Motion Graphics Template", count: 10, ext: "mogrt", desc: "เทมเพลต Lower Third, Intro Card, และ Call-out ปรับแก้ง่าย", size: "320 MB" },
  { id: "template", icon: "LayoutGrid", name: "Template โปรเจกต์สำเร็จรูป", count: 8, ext: "prproj", desc: "โครงสร้างโปรเจกต์สำเร็จรูปสำหรับ Vlog, Podcast, และ Commercial", size: "850 MB" }
];

export const QUIZ_BANK: QuizQuestion[] = [
  { q: "เครื่องมือใดใช้สำหรับตัดคลิปใน Timeline โดยตรง?", o: ["Razor Tool (C)", "Type Tool (T)", "Hand Tool (H)", "Zoom Tool (Z)"], a: 0, explanation: "Razor Tool (คีย์ลัด C) เป็นเครื่องมือพื้นฐานที่ใช้ในการแยกคลิปวิดีโอบน Timeline" },
  { q: "Ripple Edit มีผลอย่างไรต่อคลิปอื่นบน Timeline?", o: ["ไม่มีผลใด ๆ", "เลื่อนคลิปถัดไปให้ชิดกันอัตโนมัติ", "ลบคลิปถัดไปทิ้ง", "เพิ่มความยาวคลิปถัดไป"], a: 1, explanation: "Ripple Edit จะปิดช่องว่างที่เกิดขึ้นจากการตัดทอนคลิปโดยเลื่อนคลิปถัดไปเข้ามาชิดทันที" },
  { q: "พาเนลใดใช้สำหรับปรับแต่งโทนสีและแก้สีวิดีโอ?", o: ["Essential Graphics", "Lumetri Color", "Audio Track Mixer", "History Panel"], a: 1, explanation: "Lumetri Color เป็นเวิร์กสเปซและพาเนลหลักสำหรับ Color Correction และ Color Grading ใน Premiere Pro" },
  { q: "Keyframe ใน Premiere Pro ใช้เพื่อจุดประสงค์ใดเป็นหลัก?", o: ["ลบเสียงพื้นหลัง", "สร้างการเคลื่อนไหวและการเปลี่ยนแปลงของค่าตามเวลา", "เปลี่ยนความละเอียดวิดีโอ", "บันทึกไฟล์โปรเจกต์"], a: 1, explanation: "Keyframe ใช้กำหนดค่าของพารามิเตอร์ (เช่น ตำแหน่ง, ขนาด, ความสว่าง) ในช่วงเวลาต่าง ๆ เพื่อสร้างแอนิเมชัน" },
  { q: "Ultra Key เป็นเอฟเฟกต์ที่ใช้ทำสิ่งใด?", o: ["ลบฉากเขียว (Chroma Key)", "เพิ่มความคมชัดของภาพ", "ปรับความเร็ววิดีโอ", "สร้างตัวอักษร 3 มิติ"], a: 0, explanation: "Ultra Key ออกแบบมาเฉพาะสำหรับการเจาะสีพื้นหลัง เช่น Green Screen หรือ Blue Screen" },
  { q: "นามสกุลไฟล์โปรเจกต์หลักของ Adobe Premiere Pro คืออะไร?", o: [".psd", ".prproj", ".aep", ".mp4"], a: 1, explanation: ".prproj ย่อมาจาก Premiere Project ซึ่งเป็นไฟล์โปรเจกต์ของ Premiere Pro" },
  { q: "Cross Dissolve คือทรานซิชันประเภทใด?", o: ["เอฟเฟกต์ปรับเสียง", "การค่อย ๆ จางภาพซ้อนสลับกันระหว่างสองคลิป", "การตัดภาพแบบฉับพลัน", "การสั่นสะเทือนของกล้อง"], a: 1, explanation: "Cross Dissolve เป็นการ Dissolve แบบมาตรฐานที่ภาพช็อตแรกค่อย ๆ จางลงพร้อมกับช็อตที่สองค่อย ๆ ปรากฏขึ้น" },
  { q: "Essential Sound Panel ใช้สำหรับจัดการเรื่องใดเป็นหลัก?", o: ["การแต่งสี", "การจัดการและปรับปรุงคุณภาพเสียง", "การจัดหน้าตัวอักษร", "การเรนเดอร์ไฟล์"], a: 1, explanation: "Essential Sound ช่วยจัดการเรื่อง Dialogue, Music, SFX และ Ambient อย่างรวดเร็วด้วยระบบอัตโนมัติ" },
  { q: "โปรแกรมใดของ Adobe ที่ใช้สำหรับ Render และ Export วิดีโอแบบเบื้องหลัง?", o: ["Adobe Media Encoder", "Adobe Illustrator", "Adobe InDesign", "Adobe Acrobat"], a: 0, explanation: "Adobe Media Encoder ช่วยให้สามารถส่งคิวเรนเดอร์ออกไปทำงานเบื้องหลังได้โดยไม่ต้องหยุดการตัดต่อใน Premiere" },
  { q: "Roll Edit ต่างจาก Ripple Edit อย่างไร?", o: ["Roll Edit ไม่กระทบความยาวรวมของทั้ง Sequence", "Roll Edit จะลบคลิปทิ้งเสมอ", "Roll Edit ใช้กับเสียงเท่านั้น", "ไม่มีความแตกต่างกัน"], a: 0, explanation: "Roll Edit จะปรับจุดตัดระหว่าง 2 คลิปโดยเลื่อนจุด In และ Out พร้อมกัน ทำให้ความยาวรวมของ Sequence ไม่เปลี่ยนแปลง" },
  { q: "Lower Third ในงานวิดีโอมักใช้แสดงข้อมูลใด?", o: ["ชื่อและตำแหน่งของบุคคลหรือหัวข้อที่ปรากฏในวิดีโอ", "ความละเอียดของจอภาพ", "จำนวนเฟรมต่อวินาที (FPS)", "ขนาดไฟล์ของวิดีโอ"], a: 0, explanation: "Lower Third เป็นแถบกราฟิกที่วางอยู่บริเวณ 1 ใน 3 ด้านล่างของจอ มักระบุชื่อ แบรนด์ หรือหัวข้อเรื่อง" },
  { q: "Bitrate ในการ Export วิดีโอส่งผลต่อสิ่งใดมากที่สุด?", o: ["ความเร็วของเสียงพูด", "คุณภาพของภาพและขนาดของไฟล์วิดีโอ", "เปลี่ยนสีของวิดีโอ", "เปลี่ยนอัตราส่วนหน้าจอ"], a: 1, explanation: "Bitrate กำหนดปริมาณข้อมูลต่อวินาที ยิ่งสูงภาพยิ่งคมชัด แต่ขนาดไฟล์จะใหญ่ขึ้นตามลำดับ" },
  { q: "Essential Graphics Panel ใช้สำหรับสร้างสิ่งใดเป็นหลัก?", o: ["ตัวอักษร ข้อความ และโมชันกราฟิก", "การปรับความถี่เสียง", "การตัดต่อคลิปแบบ Ripple", "การลบสัญญาณรบกวน"], a: 0, explanation: "Essential Graphics รวมเครื่องมือสำหรับสร้าง Text, Shapes, Subtitles และการปรับแต่งเทมเพลต Motion Graphics" },
  { q: "การใช้ไฟล์ LUT (.cube) ในงานตัดต่อมีประโยชน์อย่างไร?", o: ["ช่วยลดขนาดไฟล์วิดีโอลงครึ่งหนึ่ง", "แปลงหรือกำหนดโทนสีให้กับภาพได้อย่างรวดเร็ว", "เพิ่มความละเอียดจาก 1080p เป็น 4K", "ลดเสียงลมรบกวนไมโครโฟน"], a: 1, explanation: "LUT (Lookup Table) เป็นตารางแปลงค่าสีที่ช่วยย้อมโทนสีให้ได้ตามสไตล์ที่กำหนดไว้ล่วงหน้าอย่างสม่ำเสมอ" },
  { q: "Frame Rate (อัตราเฟรม) ที่ให้ความรู้สึกแบบภาพยนตร์ (Cinematic) คือเท่าใด?", o: ["24 fps", "60 fps", "120 fps", "10 fps"], a: 0, explanation: "24 fps (หรือ 23.976 fps) เป็นมาตรฐานระดับสากลของภาพยนตร์ ให้ Motion Blur ที่เป็นธรรมชาติ" },
  { q: "Track บนไทม์ไลน์ของ Premiere Pro แบ่งออกเป็นกี่กลุ่มหลัก?", o: ["1 กลุ่ม", "2 กลุ่ม (Video Tracks และ Audio Tracks)", "4 กลุ่ม", "ไม่มีการแบ่งกลุ่ม"], a: 1, explanation: "ไทม์ไลน์แบ่งเป็น Video Tracks ด้านบน (V1, V2, V3...) และ Audio Tracks ด้านล่าง (A1, A2, A3...)" },
  { q: "การ Nest Sequence ใน Premiere Pro คืออะไร?", o: ["การรวม Sequence ย่อยหลายตัวหรือหลายคลิปไว้ในคลิปเดียว", "การลบ Sequence ทิ้ง", "การเปลี่ยนฟอร์แมตไฟล์", "การอัปโหลดขึ้นคลาวด์"], a: 0, explanation: "Nest Sequence คือการรวมคลิปหลายตัวเข้ามาอยู่ในคลิปคอมโพสิตเดียวกัน ช่วยให้ไทม์ไลน์เป็นระเบียบและใส่ Effect ร่วมกันได้ง่าย" },
  { q: "Warp Stabilizer เป็น Effect ที่ใช้แก้ปัญหาใด?", o: ["ภาพสั่นไหวจากการถือกล้องถ่าย", "เสียงแตกหรือเสียงเบาเกินไป", "สีเพี้ยนเนื่องจาก White Balance", "ไฟล์วิดีโอเสียหาย"], a: 0, explanation: "Warp Stabilizer วิเคราะห์การเคลื่อนไหวของพิกเซลในแต่ละเฟรมเพื่อลดการสั่นไหวของกล้อง" },
  { q: "Proxy ในกระบวนการตัดต่อวิดีโอมีไว้เพื่อจุดประสงค์ใด?", o: ["สร้างไฟล์จำลองความละเอียดต่ำเพื่อให้ตัดต่อได้ลื่นไหล", "ใส่เอฟเฟกต์พิเศษ 3D", "ปรับความเร็วเสียง", "แปลงไฟล์เป็นภาพนิ่ง"], a: 0, explanation: "Proxy คือการแปลงไฟล์ 4K/8K เป็นไฟล์ขนาดเล็กความละเอียดต่ำสำหรับตัดต่อ จากนั้นสลับกลับเป็นไฟล์จริงตอน Export" },
  { q: "Marker (คีย์ลัด M) บน Timeline มีประโยชน์อย่างไร?", o: ["ทำเครื่องหมายระบุจุดสำคัญหรือจังหวะดนตรีบนไทม์ไลน์", "ลบคลิปออกจากโปรเจกต์", "ปรับระดับเสียง", "เปลี่ยนความเร็ววิดีโอ"], a: 0, explanation: "Marker ช่วยให้นักตัดต่อสามารถมาร์กจุดคัตติ้ง จังหวะบีตเพลง หรือโน้ตข้อความเตือนความจำบนไทม์ไลน์ได้" }
];

export const MINIGAMES_DATA: MinigameInfo[] = [
  {
    id: "beat_cutter",
    icon: "Music",
    name: "Beat Cutter: Rhythm Slicer",
    desc: "เกมตัดต่อตามจังหวะบีทเพลง กดคีย์ลัด Q, W, C และ SPACE สับคลิปตามโน้ตดนตรี 60 FPS พร้อมเสียงสังเคราะห์สด",
    difficulty: "ท้าทาย",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    themeGradient: "from-pink-600/50 via-purple-900/50 to-black/90",
    badgeText: "★ RHYTHM SLICER"
  },
  {
    id: "lumetri_lab",
    icon: "Palette",
    name: "Lumetri Color Lab: Studio Grade",
    desc: "ห้องทดลองเกรดสีภาพยนตร์ อ่าน Waveform & Vectorscope ปรับ Temp, Tint, Exposure ให้แมตช์ Reference สตูดิโอ",
    difficulty: "ปานกลาง",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    themeGradient: "from-amber-600/40 via-cyan-900/50 to-black/90",
    badgeText: "★ COLOR GRADING"
  },
  {
    id: "audio_mixer",
    icon: "Activity",
    name: "Audio Decibel Master: Peak Hunter",
    desc: "คอนโซลมิกซ์เสียงออกอากาศ คุมเดซิเบล Dialogue, BGM, SFX ให้ได้มาตรฐาน -14 LUFS และเปิด Limiter กันเสียงแตก",
    difficulty: "ปานกลาง",
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
    themeGradient: "from-cyan-600/40 via-teal-900/50 to-black/90",
    badgeText: "★ BROADCAST AUDIO"
  },
  {
    id: "keyframe_curves",
    icon: "Sparkles",
    name: "Keyframe Flow: Bezier Sculptor",
    desc: "ดัดกราฟความเร็ว Speed Graph ดึงก้าน Bezier Tangent สร้างแอนิเมชัน Pop, Easy Ease และ Whip Pan นุ่มนวล 60 FPS",
    difficulty: "ท้าทาย",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    themeGradient: "from-purple-600/40 via-indigo-900/50 to-black/90",
    badgeText: "★ MOTION GRAPHICS"
  },
  {
    id: "timeline_rush",
    icon: "Zap",
    name: "Timeline Rush: Glitch Slayer",
    desc: "อาร์เคดกู้วิกฤตไทม์ไลน์ สับคีย์ลัด Enter เรนเดอร์บาร์แดง, Q ตัดช่องว่าง, C ตัดเฟรมพัง และ L ซิงค์เสียงให้ทัน CTI",
    difficulty: "ท้าทาย",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    themeGradient: "from-rose-600/40 via-pink-900/50 to-black/90",
    badgeText: "★ TIMELINE ARCADE"
  },
  {
    id: "export_tycoon",
    icon: "Share2",
    name: "Export Architect: Bitrate Tycoon",
    desc: "จำลองการส่งออกไฟล์ Media Encoder แมตช์ Container MP4/MOV, Codec ProRes/H.264, และ Bitrate ตามสเปกลูกค้า",
    difficulty: "ปานกลาง",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80",
    themeGradient: "from-blue-600/40 via-purple-900/50 to-black/90",
    badgeText: "★ CODEC & EXPORT"
  }
];

export const WORKSHOP_DATA: WorkshopProject[] = [
  { id: 1, title: "ตัดต่อ Travel Vlog ท่องเที่ยว 1 นาที", desc: "ฝึกเรียงลำดับภาพ เล่าเรื่องให้กระชับ ใส่เพลงจังหวะสนุก และใส่ Motion Title เปิดคลิป", difficulty: "Beginner", duration: "1 ชั่วโมง", deliverable: "MP4 1080p 60s (YouTube Shorts / IG Reel)", tags: ["Vlog", "Music Sync", "Title"], youtubeId: "2Vw8Wk_vAio", instructor: "Masterclass Studio" },
  { id: 2, title: "ทำ Reel โปรโมทร้านอาหาร / เมนูเด็ด", desc: "ตัดต่อสไตล์ Fast-paced คัดเฉพาะช็อตน่ากิน ใส่ซาวด์เอฟเฟกต์เน้นความกรอบอร่อย", difficulty: "Beginner", duration: "45 นาที", deliverable: "9:16 Vertical Video 30s", tags: ["Commercial", "Sound Design", "Vertical"], youtubeId: "8W_xS2D3w4k", instructor: "Adobe Video" },
  { id: 3, title: "ตัดต่อ Music Video เพลงช้าซึ้ง ๆ", desc: "ฝึกการเล่าเรื่องด้วยภาพช้า (Slow-motion) ปรับโทนสี Cinematic Moody และ Transition นุ่มนวล", difficulty: "Intermediate", duration: "2 ชั่วโมง", deliverable: "16:9 Cinematic Video 3 นาที", tags: ["MV", "Color Grading", "Slow Mo"], youtubeId: "GzK3eR8d_yU", instructor: "Daniel Schiffer" },
  { id: 4, title: "ทำวิดีโอรีวิว Gadget / สินค้าไอที", desc: "ตัดต่อผสมระหว่าง Talking Head (A-Roll) กับช็อตเจาะรายละเอียดสินค้า (B-Roll) พร้อม Lower Third", difficulty: "Intermediate", duration: "1.5 ชั่วโมง", deliverable: "1080p Video 5 นาที", tags: ["Review", "A-Roll/B-Roll", "Graphics"], youtubeId: "d_ePz8_q7y4", instructor: "Jack Cole" },
  { id: 5, title: "ตัดต่อ Highlight งานคอนเสิร์ต / Event", desc: "คัดเลือกช็อตไฮไลท์เด็ด ๆ ซิงค์จังหวะบีตดนตรี ใส่ Speed Ramp และ Glitch Transition", difficulty: "Advanced", duration: "2.5 ชั่วโมง", deliverable: "Dynamic Highlight 90s", tags: ["Event", "Speed Ramp", "Glitch"], youtubeId: "e_hMv5H8v1o", instructor: "Jack Cole" },
  { id: 6, title: "วิดีโอสอนทำอาหาร Step-by-Step", desc: "ใส่ข้อความระบุส่วนผสม จับเวลานับถอยหลัง และทำ Picture-in-Picture แสดงภาพมุมสูง", difficulty: "Intermediate", duration: "1.5 ชั่วโมง", deliverable: "Full HD Video 4 นาที", tags: ["Tutorial", "PiP", "Timer"], youtubeId: "FqwtF9tq2eI", instructor: "Justin Odisho" },
  { id: 7, title: "Color Grading ภาพยนตร์ฟีล Teal & Orange", desc: "ฝึกบาลานซ์แสงด้วย Scopes ดึงสกินโทนให้อมส้ม และผลักเงาให้เป็นสีน้ำเงินเข้ม", difficulty: "Advanced", duration: "1 ชั่วโมง", deliverable: "Color Graded Reel + Before/After Stills", tags: ["Color", "Scopes", "Teal-Orange"], youtubeId: "kL3r0i2s5rE", instructor: "Cinecom.net" },
  { id: 8, title: "เจาะ Green Screen รายการข่าว / พอดแคสต์", desc: "ใช้ Ultra Key เจาะฉากเขียว จัดตำแหน่งผู้ประกาศ และวาง Virtual Studio 3 มิติ", difficulty: "Intermediate", duration: "1.5 ชั่วโมง", deliverable: "Virtual Studio Video 2 นาที", tags: ["VFX", "Chroma Key", "Studio"], youtubeId: "eR6gD3g_5iQ", instructor: "Cinecom.net" },
  { id: 9, title: "ตัดต่อ Video Podcast หลายมุมกล้อง", desc: "ซิงค์เสียงจากไมค์ภายนอก และใช้ Multi-Camera Editing สลับมุมกล้องตามคนพูด", difficulty: "Advanced", duration: "2 ชั่วโมง", deliverable: "Multi-cam Show 10 นาที", tags: ["Podcast", "Multi-Camera", "Sync"], youtubeId: "dQ4g_aR2S_8", instructor: "Premiere Gal" },
  { id: 10, title: "Final Capstone: หนังสั้นอิสระของคุณ", desc: "นำทักษะทั้งหมดมาสร้างผลงานหนังสั้น สารคดี หรือโฆษณาตามความคิดสร้างสรรค์ของคุณเอง", difficulty: "Advanced", duration: "4+ ชั่วโมง", deliverable: "Master Video + Project Archive", tags: ["Master", "Portfolio", "Independent"], youtubeId: "2F_H3g5s8kE", instructor: "Justin Odisho" }
];

export const BLOG_DATA: BlogPost[] = [
  {
    id: 1,
    title: "5 เทคนิค Cutting & Shortcuts สปีดรันตัดต่อไวขึ้น 3 เท่า",
    cat: "Premiere Tips",
    readTime: "6 นาที",
    date: "15 ก.ค. 2569",
    highlight: "การเปลี่ยนจาก Razor Tool มาใช้ Ripple Trim และการ Mapping คีย์ลัดมือซ้าย ช่วยลดการขยับเมาส์ลง 70% และเพิ่มสปีดการตัดต่อได้ทันที",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Ripple Trim", "Shortcuts", "Workflow", "Timeline"],
    practicalFormula: [
      { label: "คีย์ลัดตัดหัวคลิป", value: "ปุ่ม Q (Ripple Trim Previous)", note: "ตัดทิ้งตั้งแต่ต้นคลิปถึง Playhead แล้วเลื่อนคลิปหลังมาชิดทันที" },
      { label: "คีย์ลัดตัดท้ายคลิป", value: "ปุ่ม W (Ripple Trim Next)", note: "ตัดทิ้งตั้งแต่ Playhead ถึงจบคลิป แล้วดึงคลิปถัดไปมาชิดอัตโนมัติ" },
      { label: "คีย์ลัดตัดตรงหัวอ่าน", value: "ปุ่ม K หรือ Ctrl+K (Cmd+K)", note: "Add Edit ตัดคลิปทุกแทร็กที่เปิด Sync Lock โดยไม่ต้องคลิกเมาส์" },
      { label: "คีย์ลัดกรอคลิปสปีด", value: "ปุ่ม J - K - L (Shuttle)", note: "กด L ซ้ำเร่ง 2x/4x/8x, กด K หยุด, กด J ถอยหลังสปีด" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "เลิกใช้ Razor Tool (C) พร่ำเพรื่อ แล้วเปลี่ยนมาใช้ Q และ W",
        detail: "การหยิบมีดโกน (C) มาคลิกตัด แล้วกด V เพื่อเลือกคลิป แล้วกด Delete หรือ Ripple Delete ต้องใช้เมาส์ถึง 4 จังหวะ! แต่ถ้าคุณใช้ปุ่ม 'Q' (ตัดหัวคลิปพร้อมชิด) และ 'W' (ตัดท้ายคลิปพร้อมชิด) คุณจะลดเหลือเพียง 1 จังหวะเท่านั้น ตัดเสร็จภายใน 0.5 วินาที",
        shortcut: "Q / W"
      },
      {
        stepNumber: 2,
        title: "สแกนฟุตเทจด้วยมือเดียวผ่านระบบ Shuttle Control (J-K-L)",
        detail: "วางนิ้วชี้ที่ J, นิ้วกลางที่ K, นิ้วนางที่ L กด L 1 ครั้งเพื่อเล่นสปีดปกติ (1x) กด L ครั้งที่สองเพื่อวิ่ง 2x และกดครั้งที่สามเพื่อวิ่ง 4x เมื่อเจอจุดที่ชอบกด K เพื่อหยุด และถ้าเลยไปกด J เพื่อถอยหลัง ทำให้การคัดเลือก Selects เร็วขึ้นกว่าลากเมาส์ 5 เท่า",
        shortcut: "J - K - L"
      },
      {
        stepNumber: 3,
        title: "Custom Shortcuts สำหรับมือซ้าย (One-Handed Workflow)",
        detail: "เข้าไปที่ Edit > Keyboard Shortcuts แล้วจัดแม็ปปิ้งคำสั่งที่ใช้บ่อยที่สุดให้มาอยู่แถบซ้ายมือของคีย์บอร์ด (เช่น ปุ่ม D = Ripple Delete, ปุ่ม S = Split Cut, ปุ่ม F = Match Frame, ปุ่ม E = Extend Next Edit) เพื่อให้มือซ้ายคุมแป้นพิมพ์ มือขวาคุมเมาส์ได้ตลอดเวลาโดยไม่ต้องละสายตา",
        shortcut: "Ctrl + Alt + K (Mac: Opt + Cmd + K)"
      },
      {
        stepNumber: 4,
        title: "ใช้ Adjustment Layer ในการ Batch Effect แทนการปรับทีละคลิป",
        detail: "เมื่อต้องการใส่ Color Grade, ฟิลเตอร์ Film Grain, หรือ Crop แถบดำภาพยนตร์ ให้กดคลิกขวาที่ Project Panel > New Item > Adjustment Layer แล้ววางคลุมไว้บน Video Track บนสุด (เช่น V3 หรือ V4) การปรับแต่งทั้งหมดจะมีผลกับทุกคลิปด้านล่างพร้อมกัน และเปิด-ปิดตาได้ง่าย",
        shortcut: "New Item > Adjustment Layer"
      },
      {
        stepNumber: 5,
        title: "ล็อกแทร็กเพลงและเสียงบรรยายด้วย Sync Lock ป้องกันการตัดหลุดจังหวะ",
        detail: "สังเกตไอคอนรูปโซ่เล็กๆ ข้างชื่อ Track (Sync Lock) ตรวจสอบให้แน่ใจว่าแทร็กเพลงและดนตรีเปิด Sync Lock หรือ Lock Track (รูปแม่กุญแจ) ไว้เสมอเมื่อใช้คำสั่ง Ripple Delete เพื่อไม่ให้ช่วงดนตรีถูกตัดกระชากตามวิดีโอ",
        shortcut: "Sync Lock Toggle"
      }
    ],
    proTips: [
      "ตั้ง Auto-Save ใน Preferences > Auto Save ให้เซฟทุก 5-8 นาที และตั้ง Maximum Project Versions เป็น 30 เพื่อป้องกันงานสูญหายเวลาเครื่องแครช",
      "ใช้ปุ่ม ` (Tilde) เพื่อขยายหน้าต่างใดก็ตามให้เต็มหน้าจอ (Full Screen Panel) โดยไม่ต้องเพ่งสายตา เช่น ขยาย Timeline หรือ Program Monitor",
      "เปิด Timeline Playhead Position Snap (คีย์ลัด S) เสมอ เพื่อให้หัวอ่านและคลิปดูดติดกันพอดี ไม่มีช่องว่างเฟรมดำ (Black Gap) หลุดรอดไป"
    ],
    mistakesToAvoid: [
      "ใช้เมาส์ลากคลิปชนกันเองแล้วปล่อยช่องว่าง 1-2 เฟรมไว้โดยไม่รู้ตัว (เกิดจอกะพริบดำ)",
      "ไม่ตั้งค่า Scratch Disks ให้ตรงกับไดรฟ์ SSD ความเร็วสูง ทำให้เครื่องอ่านแคชช้าลงอย่างเห็นได้ชัด"
    ],
    content: `การตัดต่อที่รวดเร็วของมืออาชีพ ไม่ได้เกิดจากการที่พวกเขารีบเร่ง แต่เกิดจากการ "กำจัดการกระทำซ้ำซ้อนที่ไม่จำเป็น" (Eliminating Redundant Clicks)

หากคุณคำนวณดูว่าใน 1 วันคุณต้องตัดคลิป 500 จุด การคลิกเปลี่ยนเครื่องมือและลากเมาส์ 4 ครั้งต่อ 1 จุดตัด เท่ากับคุณต้องคลิกเมาส์ถึง 2,000 ครั้ง! แต่ถ้าคุณใช้ระบบ Ripple Trim (Q & W) คุณจะลดเหลือเพียง 500 ครั้ง ประหยัดเวลาทำงานไปได้ถึง 2 ชั่วโมงในทุกๆ วัน

### กฎทอง 3 ข้อสู่ความเร็วระดับสตูดิโอ:
1. **มือซ้ายไม่ละจากคีย์บอร์ด**: นิ้วชี้ นิ้วกลาง นิ้วนาง ต้องสแตนด์บายบนแป้นพิมพ์เพื่อออกคำสั่งตลอดเวลา
2. **มือขวาคุมเมาส์เฉพาะตำแหน่ง**: เมาส์มีไว้เพื่อเล็งตำแหน่งและเลือกช็อต ไม่ใช่คลิกเลือก Tool ในทูลบาร์
3. **ตัดแบบ Rough Cut ก่อนเกรดสี**: อย่าย้อมสีหรือใส่เอฟเฟกต์ระหว่างที่โครงเรื่องหลักยังไม่นิ่ง เพราะจะทำให้คอมพิวเตอร์ประมวลผลหนักและเสียสมาธิในการจัดจังหวะเล่าเรื่อง`
  },
  {
    id: 2,
    title: "ถอดรหัส Lumetri Scopes & Color Science อ่านค่าจริงก่อนเริ่มย้อมสี",
    cat: "Color",
    readTime: "8 นาที",
    date: "12 ก.ค. 2569",
    highlight: "อย่าเชื่อสายตาตัวเอง เพราะแสงในห้อง ความเมื่อยล้า และจอภาพสามารถหลอกคุณได้เสมอ Scopes คือความจริงทางคณิตศาสตร์เดียวของสีในงานวิดีโอ",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Color Grading", "Lumetri Scopes", "Waveform", "Vectorscope"],
    practicalFormula: [
      { label: "ช่วงความสว่างปลอดภัย", value: "0 - 100 IRE บน Waveform", note: "ห้ามส่วนมืดจมต่ำกว่า 0 (Crushed Black) และห้ามไฮไลต์เกิน 100 (Clipped White)" },
      { label: "ความสว่างผิวคน (Caucasian/Asian)", value: "60 - 75 IRE บน Waveform", note: "ใบหน้าคนจะดูเป็นธรรมชาติและมีมิติเมื่ออยู่ช่วง 60-70 IRE" },
      { label: "เส้นระบุสีผิว (Skin Tone Line)", value: "แนว 11 นาฬิกา บน Vectorscope", note: "ไม่ว่ามนุษย์เชื้อชาติใด เม็ดสีผิวจะตกอยู่บนเส้นนี้เสมอเมื่อ White Balance ถูกต้อง" },
      { label: "ความอิ่มสีสูงสุดที่ปลอดภัย", value: "ไม่เกินกรอบ 75% บน Vectorscope", note: "ป้องกันไม่ให้สีสดจนแตกพร่า (Oversaturation) เมื่อฉายบนจอทีวีหรือมือถือ" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "เปิดพาเนล Lumetri Scopes และตั้งค่า 3 เครื่องมือหลัก",
        detail: "ไปที่เมนู Window > Lumetri Scopes คลิกไอคอนรูปประแจ (Wrench Icon) เลือกเปิด: 1) Waveform (RGB หรือ Luma), 2) Vectorscope YUV, 3) Parade (RGB) ทั้งสามตัวนี้คือเข็มทิศที่จะนำทางคุณในการเกรดสี",
        shortcut: "Window > Lumetri Scopes"
      },
      {
        stepNumber: 2,
        title: "Color Correction (แก้สีให้ถูกต้องก่อนย้อมมู้ด)",
        detail: "ขั้นแรกคือการบาลานซ์ White Balance: สังเกตแถบ RGB Parade หากแทร็กสีน้ำเงินลอยสูงกว่าสีแดง แสดงว่าภาพติดฟ้า (Cool) ให้ดัน Temperature ไปทางเหลือง จนกว่าระดับยอดคลื่นของ R, G, B ในส่วนที่เป็นสีขาว (เช่น เสื้อขาวหรือก้อนเมฆ) จะอยู่ในระนาบเดียวกัน",
        shortcut: "Lumetri > Basic Correction"
      },
      {
        stepNumber: 3,
        title: "ตั้งค่า Black & White Levels (Contrast & Dynamic Range)",
        detail: "กดปุ่ม Alt ค้างไว้ขณะเลื่อนแถบ Whites และ Blacks ในหน้าต่าง Basic Correction: เลื่อน Whites ให้ยอดคลื่น Waveform แตะที่ประมาณ 95-98 IRE (ห้ามชน 100 จนแบน) และดึง Blacks ลงมาแตะที่ประมาณ 2-5 IRE เพื่อให้ได้ภาพที่มีมิติความลึก ไม่ซีดแบน",
        shortcut: "Whites / Blacks Sliders"
      },
      {
        stepNumber: 4,
        title: "เช็คสกินโทนด้วย Mask บน Vectorscope",
        detail: "วาด Mask วงกลมรอบแก้มหรือหน้าผากของตัวแบบในคลิป สังเกตแถบสีบน Vectorscope แถบจุดสีจะต้องวิ่งเกาะไปตามเส้น 'Skin Tone Line' (แนวเฉียง 11 นาฬิกา) พอดี หากเบี่ยงไปทางเขียว ให้เติม Tint สีชมพู (Magenta) เล็กน้อย",
        shortcut: "Opacity Mask > Vectorscope Check"
      },
      {
        stepNumber: 5,
        title: "Color Grading (ย้อมอารมณ์และสไตล์ของภาพยนตร์)",
        detail: "หลังจากทุกช็อตมีแสงและสีที่สมดุลกันแล้ว (Shot Matching) จึงเริ่มเข้าสู่ Creative Tab: ใส่ Look LUTs หรือใช้ Color Wheels & Match เพื่อดึงเงา (Shadows) ไปทางโทนเขียวอมฟ้า (Teal) และดันไฮไลต์ (Highlights) ไปทางโทนส้มอบอุ่น (Orange)",
        shortcut: "Color Wheels & Match"
      }
    ],
    proTips: [
      "ไม่ควรเปิดไฟห้องสว่างจ้าเกินไปขณะแต่งสี ควรให้แสงสลัวระดับ 20-30% และใช้หลอดไฟค่า CRI 95+ เพื่อให้สายตาไม่ปรับรับแสงผิดพลาด",
      "พักสายตาทุก 30 นาที และเปิดภาพช็อตอ้างอิง (Reference Still) ที่ได้มาตรฐานเปรียบเทียบเสมอด้วยโหมด Comparison View ใน Program Monitor",
      "ใส่ LUT ไว้ในขั้นตอน Creative หรือ Adjustment Layer เสมอ อย่าใส่ไว้ที่ Input LUT หากฟุตเทจยังไม่ได้แปลง Color Space เป็น Rec.709"
    ],
    mistakesToAvoid: [
      "ดึง Saturation สูงเกิน 130% จนสีแดงและน้ำเงินแตกเป็นบล็อกพิกเซล",
      "ข้ามขั้นตอน Color Correction แล้วกระโดดย้อมโทนภาพยนตร์ทันที ทำให้แสงแต่ละช็อตในฉากเดียวกันกระโดดไปมา"
    ],
    content: `หนึ่งในข้อผิดพลาดที่ร้ายแรงที่สุดของนักตัดต่อมือใหม่ คือการนั่งจ้องหน้าจอ Program Monitor แล้วคิดว่า "สีนี้สวยแล้ว"

แต่ความจริงคือ: หากคุณปรับสีในห้องที่มีแดดส่องเข้าหน้าต่าง คุณจะเผลอดึงภาพให้สว่างเกินจริง และเมื่อมีคนเปิดดูคลิปของคุณในห้องนอนตอนกลางคืน ภาพจะสว่างจ้าแสบตาและสีผิวจะซีดขาวทันที!

### ลำดับ 3 ลำดับขั้นที่ถูกต้อง (Hierarchy of Grading):
1. **Normalization**: แปลงฟุตเทจ Log หรือ Flat Profile จากกล้องให้เป็นมาตรฐาน Rec.709
2. **Correction & Balance**: ปรับสมดุล White Balance, Exposure, และ Contrast ให้เป็นกลาง
3. **Shot Matching**: จับคู่ทุกช็อตในฉากให้มีระดับแสงและสกินโทนตรงกัน ไม่กระโดด
4. **Stylistic Grade**: เติมจิตวิญญาณและอารมณ์ของเรื่องเล่า เช่น โทนย้อนยุค Warm Retro หรือโทนสืบสวน Cold Noir`
  },
  {
    id: 3,
    title: "สูตรมิกซ์เสียง Voice-over กับดนตรีให้ดังชัดใสระดับ Broadcast (ไม่มีอู้อี้)",
    cat: "Audio",
    readTime: "7 นาที",
    date: "08 ก.ค. 2569",
    highlight: "คนดูทนดูภาพวิดีโอความละเอียดต่ำ 720p ได้ แต่ไม่มีใครทนฟังเสียงพูดที่แตกพร่า อู้อี้ หรือดนตรีกลบเสียงพูดได้เกิน 5 วินาที",
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Audio Mixing", "Essential Sound", "Voice-over", "Auto Ducking"],
    practicalFormula: [
      { label: "ความดังเสียงพูด (Dialogue)", value: "-6 dB ถึง -12 dB (Peak ไม่เกิน -3 dB)", note: "ระดับมาตรฐานที่ฟังชัดเจน สบายหู ไม่แตกพร่า" },
      { label: "ความดังดนตรีคลอ (BGM)", value: "-18 dB ถึง -24 dB ขณะมีคนพูด", note: "ต้องต่ำกว่าเสียงพูดอย่างน้อย 12-15 dB เพื่อไม่ให้กลบพยางค์" },
      { label: "ความดังเอฟเฟกต์ (SFX)", value: "-12 dB ถึง -18 dB (แล้วแต่น้ำหนัก)", note: "เสียง Whoosh หรือ Click ควรกระชับ ไม่ดังกระแทกหูคนดู" },
      { label: "ค่าความดังรวม YouTube (LUFS)", value: "-14 LUFS (Integrated Loudness)", note: "มาตรฐานของ YouTube หากดังเกินไประบบจะลดเสียงลงอัตโนมัติ (Penalty)" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "ตัดย่านความถี่ต่ำไร้สาระด้วย High-Pass Filter (Cut 80 Hz)",
        detail: "เปิดเอฟเฟกต์ Parametric Equalizer บนแทร็กเสียงพูด แล้วเปิดจุด HP (High-Pass) ตัดย่านเสียงที่ต่ำกว่า 80 Hz ทิ้งทั้งหมด นี่คือย่านความถี่เสียงฮัมของแอร์ เสียงลม เสียงกระทบโต๊ะ หรือเสียงบวมอู้อี้ที่ไม่มีข้อมูลของเสียงมนุษย์",
        shortcut: "Audio Effects > Parametric Equalizer"
      },
      {
        stepNumber: 2,
        title: "เปิดความคมชัดของพยางค์เสียงพูด (Clarity Boost 3 kHz - 5 kHz)",
        detail: "ใน Parametric Equalizer ให้ดึงจุดความถี่ช่วง 3.5 kHz - 4.5 kHz ขึ้นประมาณ +2 ถึง +3.5 dB ด้วยแถบความกว้าง (Q) ปานกลาง จุดนี้คือย่าน 'Presence' ที่ทำให้เสียงพยัญชนะ เสียงริมฝีปาก และเสียงพูดทะลุผ่านดนตรีออกมาได้อย่างชัดเจน",
        shortcut: "Parametric EQ > Band 4 Boost"
      },
      {
        stepNumber: 3,
        title: "ตั้งค่า Auto-Ducking ใน Essential Sound ให้เพลงหรี่เองอัตโนมัติ",
        detail: "1) เลือกคลิปเสียงคนพูดทั้งหมด คลิกแท็บ Essential Sound > กดปุ่ม 'Dialogue' \n2) เลือกคลิปดนตรีทั้งหมด กดปุ่ม 'Music' \n3) ในแท็บ Music ติ๊กเครื่องหมายถูกที่ 'Ducking' > เลือก Duck against Dialogue clips \n4) ตั้ง Sensitivity ที่ 5.0, Duck Amount ที่ -18 dB, และ Fade Duration ที่ 800 ms เพลงจะลดเสียงหลบอัตโนมัติทุกครั้งที่คนเริ่มพูด!",
        shortcut: "Window > Essential Sound > Ducking"
      },
      {
        stepNumber: 4,
        title: "ใช้ Enhance Speech (AI Clear Voice) ขจัดเสียงก้องสะท้อน",
        detail: "หากอัดเสียงในห้องที่ไม่มีผนังซับเสียงจนเกิดเสียงก้อง (Room Reverb) หรือมีเสียงพัดลม ให้คลิกที่คลิปเสียง ในหน้าต่าง Essential Sound ติ๊กถูกที่ 'Enhance Speech' แล้วปรับ Mix Amount ที่ 40-70% AI จะแยกเสียงคนพูดและขจัดบรรยากาศห้องออกอย่างน่าอัศจรรย์",
        shortcut: "Essential Sound > Enhance Speech"
      },
      {
        stepNumber: 5,
        title: "ใส่ Hard Limiter ที่ Master Track ป้องกันเสียงแครชแตก 0 dB",
        detail: "ไปที่ Audio Track Mixer บนแถบ Master Track ด้านขวาสุด ใส่เอฟเฟกต์ Amplitude and Compression > Hard Limiter ตั้งค่า Maximum Amplitude ไว้ที่ -1.0 dB หรือ -2.0 dB การทำเช่นนี้เป็นการการันตีว่าไม่ว่าเสียงระเบิดหรือเสียงหัวเราะจะดังแค่ไหน เสียงรวมจะไม่ชน 0 dB จนเสียงแตกอย่างแน่นอน",
        shortcut: "Audio Track Mixer > Master > Hard Limiter"
      }
    ],
    proTips: [
      "ใช้หูฟัง Studio Monitor หรือหูฟังแบบ Flat ในการมิกซ์เสียงรอบแรก จากนั้นลองเปิดฟังผ่านลำโพงโทรศัพท์มือถือ เพื่อเช็คว่าเสียงพูดยังฟังรู้เรื่องหรือไม่",
      "เสียง S, Sh, Ch ที่แหลมบาดหู (Sibilance) สามารถแก้ไขได้ด้วยการใส่เอฟเฟกต์ DeEsser",
      "จำกัดเสียงรวมของโปรเจกต์ให้ไม่เกิน -14 LUFS สำหรับ YouTube และ -16 LUFS สำหรับ Spotify / Apple Podcasts"
    ],
    mistakesToAvoid: [
      "เร่งเกน (Gain) จนเกจเสียงแตะโซนสีแดง (Red Clipping) เพราะสัญญาณดิจิทัลที่แตกแล้วไม่สามารถกู้คืนได้",
      "ใช้เพลงที่มีเนื้อร้องภาษาไทยหรืออังกฤษเป็นดนตรีประกอบฉากพูด เพราะสมองของคนดูจะพยายามฟังคำร้องจนตีกับเสียงบรรยาย"
    ],
    content: `มีงานวิจัยด้านสื่อดิจิทัลระบุชัดเจนว่า: **"ผู้ชมกว่า 82% จะกดปิดวิดีโอทันทีหากคุณภาพเสียงย่ำแย่ แม้ว่าภาพวิดีโอจะถ่ายด้วยกล้อง Cinema 8K ก็ตาม"**

งานเสียงที่ดีคืองานเสียงที่คนดูไม่สังเกตว่ามีอยู่ เพราะทุกอย่างลื่นไหล เสียงพูดคมชัด และดนตรีช่วยขับเน้นอารมณ์ได้อย่างลงตัว

### กฎการจัดความสำคัญของเสียง (Audio Hierarchy):
1. **Dialogue (อันดับ 1)**: ต้องอยู่หน้าสุดและดังที่สุด ชัดเจนทุกถ้อยคำ
2. **SFX สำคัญ (อันดับ 2)**: เสียงที่สอดคล้องกับภาพ เช่น เสียงคลิกปุ่ม, เสียงเคาะประตู, เสียงเบรกเกอร์
3. **Foley & Ambience (อันดับ 3)**: เสียงสภาพแวดล้อม เสียงลม เสียงนกร้องบางๆ ช่วยเพิ่มความสมจริง
4. **Music (อันดับ 4)**: ฐานรากของอารมณ์ อยู่ด้านหลังสุดและลดบทบาทลงเมื่อมีคนพูด`
  },
  {
    id: 4,
    title: "5 ปลั๊กอิน & เครื่องมือฟรีที่สตูดิโอมืออาชีพใช้ยกระดับงานวิดีโอ",
    cat: "Plugins",
    readTime: "5 นาที",
    date: "02 ก.ค. 2569",
    highlight: "ปลั๊กอินและสคริปต์คือคานผ่อนแรงที่จะเปลี่ยนงานกราฟิกและทรานซิชันที่ต้องใช้เวลาทำ 3 ชั่วโมง ให้เสร็จได้ภายใน 3 วินาที",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Free Plugins", "Premiere Composer", "Mister Horse", "Motion Graphics"],
    practicalFormula: [
      { label: "ปลั๊กอินทรานซิชันฟรีอันดับ 1", value: "Premiere Composer (Mister Horse)", note: "แจกฟรี Transitions, Text Presets, และ Sound FX คุณภาพสตูดิโอ" },
      { label: "เครื่องมือแปลงไฟล์วิดีโอที่ดีที่สุด", value: "Shutter Encoder (Free & Open Source)", note: "แปลงไฟล์ ProRes, H.264, และ WebM ได้ไวกว่าและแก้ไฟล์เสียได้เยี่ยม" },
      { label: "คลังเสียงและดนตรีฟรี", value: "Freesound.org & Mixkit.co", note: "ดาวน์โหลด SFX คุณภาพสูงแบบไม่มีปัญหาลิขสิทธิ์กวนใจ" },
      { label: "สคริปต์จัดการขยะแคช", value: "Clean Pr Caches Script", note: "ลบไฟล์ Render และ Scratch อัตโนมัติ คืนพื้นที่ SSD ได้หลายร้อย GB" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "ติดตั้ง Mister Horse - Premiere Composer",
        detail: "ดาวน์โหลดตัวติดตั้ง Mister Horse Product Portal แล้วเปิดแท็บ Premiere Composer ภายใน Premiere Pro คุณจะสามารถลาก Zoom Blur, Pan Transitions, Lower Thirds, และลูกศรเคลื่อนไหวลงไทม์ไลน์ได้ทันที พร้อมเสียง SFX ในตัวที่ปรับคีย์ความยาวได้อัตโนมัติ",
        shortcut: "misterhorse.com/premiere-composer"
      },
      {
        stepNumber: 2,
        title: "ใช้งาน Shutter Encoder สำหรับแปลงไฟล์ Batch Footage ก่อนตัด",
        detail: "หากเจอฟุตเทจจากโทรศัพท์มือถือที่ถ่ายด้วย Variable Frame Rate (VFR) แล้วตัดใน Premiere มีอาการกระตุกหรือเสียงไม่ตรงกับภาพ (Audio Desync) ให้โยนไฟล์เข้า Shutter Encoder แล้วแปลงเป็น Apple ProRes 422 หรือ DNxHR ด้วย Constant Frame Rate ภายในไม่กี่คลิก",
        shortcut: "shutterencoder.com"
      },
      {
        stepNumber: 3,
        title: "สร้างคลัง Motion Graphics Template (.mogrt) ส่วนตัว",
        detail: "รวบรวมไตเติล โลโก้ และแถบข้อมูลที่ใช้ซ้ำบ่อยๆ ไว้ใน Essential Graphics Panel ตั้งชื่อให้ค้นหาง่าย เมื่อเริ่มโปรเจกต์ใหม่เพียงพิมพ์คำค้นหาแล้วลากวาง ปรับข้อความและสีตามใจชอบได้ทันที",
        shortcut: "Essential Graphics > Install MOGRT"
      },
      {
        stepNumber: 4,
        title: "ใช้ Motion Bro ในการใส่ Glitch และ Dynamic Zoom",
        detail: "Motion Bro เป็นอีกหนึ่ง Extension ฟรีที่ทำงานได้รวดเร็ว เหมาะมากสำหรับการตัดต่อคอนเทนต์แนวเกมมิ่ง สตรีมเมอร์ หรือรีวิวเทคโนโลยีที่ต้องการความฉูดฉาดและรวดเร็ว",
        shortcut: "Window > Extensions > Motion Bro"
      }
    ],
    proTips: [
      "อย่าติดตั้งปลั๊กอินเอฟเฟกต์หนักๆ มากเกินความจำเป็น เพราะอาจทำให้โปรแกรมเปิดช้าและเพิ่มโอกาสแครช ให้เลือกเฉพาะตัวที่ช่วยเพิ่มความเร็วในการทำงานจริง",
      "เก็บไฟล์ฟอนต์ (.ttf / .otf) ที่ใช้ในโปรเจกต์ไว้ในโฟลเดอร์ 03_GRAPHICS/Fonts ของตัวโปรเจกต์เสมอ เพื่อเวลาย้ายเครื่องไปตัดที่อื่นฟอนต์จะไม่สูญหาย"
    ],
    mistakesToAvoid: [
      "ใช้ Transition กราฟิกหวือหวาซ้อนกันทุกๆ 2 วินาทีจนภาพยนตร์ดูรกตาและเสียสมาธิ คนดูควรโฟกัสที่เนื้อหาไม่ใช่ทรานซิชัน",
      "ดาวน์โหลดปลั๊กอินเถื่อนที่ดัดแปลงไฟล์ .dll หรือ .dylib ซึ่งอาจทำให้ Premiere Pro ปิดตัวเองกะทันหันขณะกำลังเรนเดอร์"
    ],
    content: `ในวงการตัดต่อยุคปัจจุบัน "เวลาคือต้นทุนที่แพงที่สุด"

สตูดิโอชั้นนำไม่ได้สร้างแอนิเมชันปุ่ม Subscribe หรือสร้างคลื่นเสียงขึ้นมาใหม่ทุกครั้งที่เปิดโปรเจกต์ แต่พวกเขาใช้เครื่องมือและพรีเซ็ตสำเร็จรูปที่มีคุณภาพสูงเพื่อประหยัดเวลา และนำสมาธิทั้งหมดไปทุ่มเทให้กับการเล่าเรื่องและการตัดต่อตามอารมณ์ตัวละคร

ปลั๊กอินที่ดีคือปลั๊กอินที่ไม่สร้างภาระให้กับเครื่องคอมพิวเตอร์ และช่วยให้งานของคุณดูพรีเมียมขึ้นอย่างเป็นธรรมชาติ`
  },
  {
    id: 5,
    title: "คู่มือ AI Tools ใน Premiere Pro: ใช้ทำงานให้ประหยัดเวลาหลักชั่วโมง",
    cat: "AI",
    readTime: "7 นาที",
    date: "28 มิ.ย. 2569",
    highlight: "AI ในปี 2026 ไม่ได้ถูกสร้างมาเพื่อแทนที่นักตัดต่อ แต่คนที่ใช้ AI ได้อย่างเชี่ยวชาญจะทำงานได้เร็วกว่าและรับงานได้มากกว่าคนที่ไม่ใช้ถึง 3 เท่า",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["AI Video", "Text-Based Editing", "Auto Captions", "Enhance Speech"],
    practicalFormula: [
      { label: "Text-Based Editing", value: "ถอดเสียงเป็นข้อความ > ลบคำพูดใน Script = คลิปในไทม์ไลน์ถูกตัดทันที", note: "ประหยัดเวลาฟังคลิปดิบ 2 ชั่วโมงเหลือเพียง 15 นาที" },
      { label: "Speech to Text Thai", value: "สร้าง Captions ภาษาไทยอัตโนมัติแม่นยำ 95%+", note: "แปลงเสียงเป็นซับไตเติลพร้อมคีย์เวิร์ดแอนิเมชันในคลิกเดียว" },
      { label: "Auto Reframe (16:9 to 9:16)", value: "AI แทร็กจุดสนใจและใบหน้าให้อยู่กลางจอแนวตั้งตลอดเวลา", note: "แปลงคลิปยาวแนวนอนเป็นคลิปสั้น Shorts / Reels ภายใน 10 วินาที" },
      { label: "Scene Edit Detection", value: "AI วิเคราะห์จุดตัดในวิดีโอที่เรนเดอร์มารวมกันแล้วแยกเป็นช็อตๆ", note: "เหมาะสำหรับนำวิดีโอเก่ามาตัดใหม่หรือตัดตัวอย่างหนัง" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "Text-Based Editing: ตัดต่อฟุตเทจสัมภาษณ์เหมือนการตรวจบทความใน Word",
        detail: "เปิดพาเนล Text > Transcribe Sequence ระบบ Adobe Sensei AI จะถอดเสียงพูดของพิธีกรทั้งหมดออกมาเป็นข้อความ เมื่อคุณเห็นช่วงที่พิธีกรพูดผิดหรือพูดซ้ำ เพียงแค่เอาเมาส์ไฮไลท์ข้อความนั้นแล้วกดปุ่ม Delete บนคีย์บอร์ด คลิปวิดีโอบนไทม์ไลน์จะถูก Ripple Delete ออกไปทันที!",
        shortcut: "Window > Text > Transcript"
      },
      {
        stepNumber: 2,
        title: "ค้นหาและลบช่องว่างความเงียบ (Pause Filter) ในคลิกเดียว",
        detail: "ในหน้าต่าง Transcript คลิกไอคอนรูปแว่นขยาย เลือกลิลเตอร์ '...' (Pauses) คุณสามารถกำหนดได้ว่าต้องการค้นหาช่องว่างที่เงียบเกิน 0.5 วินาที หรือ 1.0 วินาที จากนั้นกด 'Delete All' วิดีโอจะถูกตัดช่วง Dead Air ทิ้งทั้งไทม์ไลน์ในพริบตา",
        shortcut: "Transcript > Filter > Delete Pauses"
      },
      {
        stepNumber: 3,
        title: "สร้างซับไตเติลคาราโอเกะสำหรับ Reels / TikTok ด้วย Create Captions",
        detail: "คลิกแท็บ Captions ในหน้าต่าง Text กด 'Create Captions from Transcript' เลือกลักษณะเป็น Subtitle จากนั้นไปที่ Essential Graphics ปรับแต่งฟอนต์ ขนาด สี และใส่เงา พร้อมตั้งค่า Animation ให้ตัวอักษรเด้งขึ้นมาทีละคำตามจังหวะพูด",
        shortcut: "Text > Captions > Create"
      },
      {
        stepNumber: 4,
        title: "Auto Reframe Sequence: ปรับแนวนอนเป็นแนวตั้งโดยไม่ต้องขยับคีย์เฟรมมือ",
        detail: "คลิกขวาที่ Sequence ของคุณใน Project Panel เลือก 'Auto Reframe Sequence' กำหนด Target Aspect Ratio เป็น 9:16 (Vertical) AI จะคำนวณการเคลื่อนไหวของวัตถุหรือคนพูด แล้วสร้างคีย์เฟรมแพนกล้องตามอัตโนมัติ",
        shortcut: "Right Click Sequence > Auto Reframe"
      }
    ],
    proTips: [
      "ก่อนกดถอดข้อความ Transcribe ให้เลือก Audio Analysis เป็นแทร็กไมค์หลักโดยเฉพาะ (เช่น A1 Dialogue) เพื่อไม่ให้เสียงดนตรีรบกวนความแม่นยำของ AI",
      "ใช้ฟังก์ชัน Enhance Speech ควบคู่กับ Text-Based Editing จะทำให้ได้ทั้งบทตัดต่อที่กระชับและเสียงบรรยายที่คมชัดระดับพ็อดแคสต์สากล"
    ],
    mistakesToAvoid: [
      "พึ่งพาคำแปลหรือซับไตเติลภาษาไทยของ AI 100% โดยไม่อ่านทบทวน เพราะคำศัพท์เฉพาะทางหรือชื่อบุคคลอาจสะกดผิดพลาดได้",
      "ลบ Pauses สั้นเกินไป (เช่น ต่ำกว่า 0.3 วินาที) จะทำให้ผู้พูดดูหายใจไม่ทันและจังหวะการเล่าเรื่องดูเกร็งไม่เป็นธรรมชาติ"
    ],
    content: `การมาถึงของ AI ใน Adobe Premiere Pro คือการปฏิวัติครั้งสำคัญที่สุดนับตั้งแต่การเปลี่ยนผ่านจากฟิล์มมาสู่ดิจิทัล

งานที่เคยน่าเบื่อที่สุดของนักตัดต่อ เช่น การนั่งฟังเทปสัมภาษณ์ 3 ชั่วโมงเพื่อจดไทม์โค้ด การพิมพ์ซับไตเติลทีละบรรทัด หรือการลากเมาส์ตัดช่วงหายใจทิ้งทีละจุด บัดนี้สามารถเสร็จสิ้นได้ด้วยการคลิกเพียงไม่กี่ครั้ง

เมื่อคุณปลดล็อกเวลาเหล่านี้ได้ คุณจะมีเวลาเหลือเฟือสำหรับการพัฒนาความคิดสร้างสรรค์ การค้นหาจังหวะดนตรีที่โดนใจ และการเกรดสีที่สร้างแรงสะเทือนอารมณ์ให้กับผู้ชม`
  },
  {
    id: 6,
    title: "การจัดระเบียบโปรเจกต์ & กลยุทธ์สำรองข้อมูล 3-2-1 สำหรับงาน Commercial",
    cat: "Workflow",
    readTime: "6 นาที",
    date: "20 มิ.ย. 2569",
    highlight: "นักตัดต่อมืออาชีพวัดกันที่ความเรียบร้อยของโปรเจกต์และการไม่ทำไฟล์สูญหาย ไม่ใช่แค่ฝีมือตอนส่งงานเสร็จ",
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Project Management", "3-2-1 Backup", "Studio Workflow", "Media Management"],
    practicalFormula: [
      { label: "กฎการตั้งชื่อโปรเจกต์มาตรฐาน", value: "YYMMDD_Client_ProjectName_v01.prproj", note: "ระบุปีเดือนวัน ชื่อลูกค้า ชื่องาน และเลขเวอร์ชันเสมอ" },
      { label: "กฎเหล็ก 3-2-1 Backup", value: "3 สำเนา • 2 สื่อเก็บข้อมูล • 1 สำเนานอกสถานที่", note: "การันตีว่าไฟล์งานและฟุตเทจจะไม่สูญหายแม้เกิดอุบัติเหตุหรือไดรฟ์พัง" },
      { label: "โครงสร้างโฟลเดอร์สตูดิโอ", value: "01_Footage / 02_Audio / 03_Graphics / 04_Project / 05_Exports", note: "มาตรฐานที่คนในทีมเปิดงานต่อกันได้ทันทีโดยไม่งง" },
      { label: "Project Manager Collect", value: "File > Project Manager > Collect Files and Copy to New Location", note: "รวบรวมไฟล์ทั้งหมดที่ใช้จริงในไทม์ไลน์ใส่โฟลเดอร์เดียวเพื่อส่งมอบ" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "สร้าง Master Project Template บนเครื่อง",
        detail: "สร้างโฟลเดอร์หลักขึ้นมา 1 โฟลเดอร์ ตั้งชื่อว่า '_PROJECT_TEMPLATE' ด้านในประกอบด้วย 5 โฟลเดอร์ย่อย: 01_FOOTAGE (Cam A, Cam B), 02_AUDIO (Voice, Music, SFX), 03_GRAPHICS (Logo, Stills, Fonts), 04_PROJECTS (Pr, Ae, Cache), 05_EXPORTS (Draft, Final) เมื่อมีโปรเจกต์ใหม่ให้ Copy โฟลเดอร์นี้ไปใช้ทันที",
        shortcut: "Folder Structure Blueprint"
      },
      {
        stepNumber: 2,
        title: "กฎเหล็กการตั้งชื่อเวอร์ชัน (แบนคำว่า 'Final_Real_Last' ถาวร)",
        detail: "ให้รันเวอร์ชันเป็น v01, v02, v03 ไปเรื่อยๆ เสมอ ทุกครั้งที่มีการแก้ใหญ่วันใหม่ ให้ Duplicate Sequence แล้วเปลี่ยนเป็น v02 เพื่อให้คุณสามารถย้อนกลับไปดูเวอร์ชันแรกที่ลูกค้าเคยชอบได้ตลอดเวลา",
        shortcut: "Sequential Versioning"
      },
      {
        stepNumber: 3,
        title: "การจัด Bin ใน Project Panel ให้ตรงกับโครงสร้างโฟลเดอร์",
        detail: "ใน Premiere Pro ให้สร้าง Bin สีสันต่างๆ โดยใช้สี Color Label แยกประเภท: Footage สีเขียว, Audio สีฟ้าอ่อน, Graphics สีชมพู, Adjustment Layer สีม่วง ช่วยให้มองเห็นภาพรวมบนไทม์ไลน์ได้ทันทีว่าคลิปไหนคืออะไร",
        shortcut: "Right Click > Label Colors"
      },
      {
        stepNumber: 4,
        title: "ใช้ Project Manager ก่อนส่งมอบหรือเก็บเข้าคลัง Archive",
        detail: "เมื่อโปรเจกต์เสร็จสิ้น ไปที่ File > Project Manager เลือก Sequence ที่ต้องการ ติ๊ก 'Collect Files and Copy to New Location' และติ๊ก 'Exclude Unused Clips' เพื่อให้ระบบคัดเฉพาะฟุตเทจที่ถูกใช้จริงบนไทม์ไลน์ไปเก็บ ช่วยประหยัดพื้นที่จัดเก็บได้มหาศาล",
        shortcut: "File > Project Manager"
      }
    ],
    proTips: [
      "ตั้งค่า Scratch Disks ให้ชี้ไปที่ไดรฟ์ SSD ทำงานที่แยกต่างหากจากไดรฟ์ของระบบปฏิบัติการ เพื่อความเร็วในการแคชไฟล์สูงสุด",
      "ใช้โปรแกรมอย่าง Carbon Copy Cloner หรือ FreeFileSync เพื่อแบ็กอัปโฟลเดอร์งานแบบอัตโนมัติทุกๆ เที่ยงคืน"
    ],
    mistakesToAvoid: [
      "ดึงไฟล์เพลงหรือรูปจากโฟลเดอร์ Downloads หรือ Desktop เข้ามาในโปรเจกต์โดยตรง เมื่อวันหนึ่งเผลอลบโฟลเดอร์ Downloads ไฟล์ใน Premiere จะขึ้น Media Offline สีแดงทันที!",
      "เก็บไฟล์ฟุตเทจต้นฉบับไว้ในการ์ด SD ของกล้องเพียงที่เดียวแล้วกดฟอร์แมตการ์ดเพื่อถ่ายงานใหม่"
    ],
    content: `ไม่มีอะไรจะทำลายชื่อเสียงและความน่าเชื่อถือของนักตัดต่อได้เร็วไปกว่าคำว่า: **"ขอโทษครับลูกค้า ฮาร์ดดิสก์พัง ไฟล์งานทั้งหมดหายหมดเลย"**

ในงานระดับมืออาชีพและ Commercial Agency ความปลอดภัยของข้อมูลคือสิ่งสำคัญอันดับหนึ่งก่อนความสวยงามของภาพ

การปฏิบัติตามกฎ 3-2-1 Backup และการมีระเบียบวินัยในการตั้งชื่อไฟล์ จะช่วยให้คุณนอนหลับได้อย่างสบายใจในทุกๆ คืน แม้ว่าโปรเจกต์นั้นจะมีมูลค่าหลักแสนหรือหลักล้านบาทก็ตาม`
  },
  {
    id: 7,
    title: "สูตรตั้งค่า Export วิดีโอคมชัดสูงสุด YouTube, TikTok & Master Archive",
    cat: "Workflow",
    readTime: "6 นาที",
    date: "16 มิ.ย. 2569",
    highlight: "ตัดต่อมาอย่างประณีตแต่ภาพกลับแตก เบลอ หรือสีเพี้ยนเมื่ออัปโหลดขึ้นเน็ต? นี่คือตารางการตั้งค่า Bitrate และ Gamma Fix ที่ถูกต้องที่สุด",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Export Settings", "Bitrate", "4K UHD", "QuickTime Gamma Fix"],
    practicalFormula: [
      { label: "YouTube 4K UHD (3840x2160)", value: "H.264 / VBR 2-Pass Target 65-80 Mbps", note: "กระตุ้นให้ YouTube ใช้ VP09/AV01 Codec ภาพคมกริบแม้ดูบนทีวีจอใหญ่" },
      { label: "YouTube 1080p (1920x1080)", value: "H.264 / VBR 2-Pass Target 18-24 Mbps", note: "สมดุลระหว่างคุณภาพสูงและขนาดไฟล์ที่พอเหมาะ" },
      { label: "TikTok & Reels 9:16 (1080x1920)", value: "H.264 / VBR 1-Pass Target 15-20 Mbps / 30fps", note: "ขนาดไฟล์ไม่เกิน 40 MB ป้องกันแอปพลิเคชันบีบอัดซ้ำจนภาพแตก" },
      { label: "Studio Master Archive", value: "Apple ProRes 422 HQ / Uncompressed Audio", note: "ไฟล์ต้นฉบับคุณภาพสูงสุดแบบไร้การสูญเสียพิกเซลสำหรับเก็บบันทึก" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "เปิดหน้าต่าง Export Media (Ctrl + M หรือ Cmd + M)",
        detail: "เลือก Format เป็น 'H.264' สำหรับเผยแพร่บนอินเทอร์เน็ตทั่วไป หรือเลือก 'QuickTime' > 'Apple ProRes 422' สำหรับงานฉายโรงและงานส่งต่อสถานีโทรทัศน์",
        shortcut: "Ctrl + M (Mac: Cmd + M)"
      },
      {
        stepNumber: 2,
        title: "เปิดใช้ Maximum Render Quality และ Render at Maximum Depth",
        detail: "ในแท็บ Video เลื่อนลงมาติ๊กถูกที่: \n1) 'Render at Maximum Depth' (ประมวลผลความลึกสีระดับ 32-bit ไม่เกิดแถบสีเป็นขั้นบันไดหรือ Color Banding) \n2) 'Use Maximum Render Quality' (ประมวลผลการย่อขยายขนาดภาพที่ดีที่สุด)",
        shortcut: "Video Tab Settings"
      },
      {
        stepNumber: 3,
        title: "ตั้งค่า Bitrate Encoding ให้เหมาะสมกับงาน",
        detail: "VBR 1-Pass เหมาะสำหรับงานส่งด่วนที่ต้องการประหยัดเวลาเรนเดอร์ครึ่งหนึ่ง ส่วน VBR 2-Pass เหมาะสำหรับ Final Master ก่อนขึ้น YouTube เพราะระบบจะสแกนรอบแรกเพื่อวิเคราะห์ฉากที่มีการเคลื่อนไหวเร็วและจัดสรรบิตเรตได้อย่างแม่นยำ",
        shortcut: "Bitrate Settings"
      },
      {
        stepNumber: 4,
        title: "แก้ปัญหาสีซีดบน Mac (QuickTime Gamma Shift Fix)",
        detail: "หากคุณใช้เครื่อง Mac แล้วพบว่าภาพใน Premiere สีสดสวยงาม แต่เมื่อ Export ออกมาเปิดดูใน QuickTime หรือ Safari แล้วสีกลับซีดจืด ให้ใส่ 'Adobe Gamma Compensation LUT' ในหน้าต่าง Export > Effects Tab ภาพที่ออกมาจะสีสดตรงกับหน้าจอตัดต่อ 100%",
        shortcut: "Export > Effects > Lumetri Look/LUT"
      }
    ],
    proTips: [
      "ส่งคิวไปเรนเดอร์ที่ Adobe Media Encoder เสมอด้วยปุ่ม 'Send to Media Encoder' เพื่อให้คุณสามารถทำงานตัดต่อใน Premiere ต่อไปได้โดยไม่ต้องนั่งรอแถบโหลด",
      "ตรวจเช็คการตั้งค่า Audio ให้เป็น AAC คุณภาพเสียง 320 kbps Sample Rate 48,000 Hz เสมอเพื่อมิติเสียงที่โปร่งชัดเจน"
    ],
    mistakesToAvoid: [
      "ตั้งบิตเรตต่ำเกินไป (เช่น ต่ำกว่า 8 Mbps สำหรับ 1080p) ทำให้ฉากที่มีฝุ่น ควัน คลื่นน้ำ หรือใบไม้แตกเป็นโมเสก",
      "ลืมเช็คขอบเขต Range ด้านล่าง พรีวิวเรนเดอร์ถูกตั้งเป็น Entire Source หรือ In to Out ทำให้ไฟล์ออกมาสั้นหรือยาวกว่าที่ต้องการ"
    ],
    content: `ขั้นตอน Export คือขั้นตอนสุดท้ายที่แปรเปลี่ยนหยาดเหงื่อแรงกายในการตัดต่อของคุณให้ออกมาเป็นไฟล์ผลงานจริง

การตั้งค่าที่ไม่ถูกต้องเพียงจุดเดียว เช่น การเลือก Bitrate ต่ำเกินไป หรือการใช้ Color Profile ที่ไม่รองรับ อาจทำลายความสวยงามของภาพที่คุณอุตส่าห์เกรดสีมาหลายชั่วโมงให้สูญเปล่าได้ในทันที

ศึกษาค่า Bitrate มาตรฐาน และบันทึกการตั้งค่าที่ดีที่สุดเป็น **Export Preset** ของตัวเองไว้เสมอ เพื่อให้งานทุกชิ้นมีมาตรฐานความคมชัดระดับพรีเมียมอย่างสม่ำเสมอ`
  },
  {
    id: 8,
    title: "ศาสตร์แห่งการเล่าเรื่องด้วย A-Roll & B-Roll: เทคนิค J-Cut, L-Cut และ Pacing",
    cat: "Premiere Tips",
    readTime: "7 นาที",
    date: "10 มิ.ย. 2569",
    highlight: "การตัดต่อไม่ใช่แค่การนำคลิปมาต่อกัน แต่คือการควบคุมสายตา อารมณ์ และอัตราการเต้นของหัวใจของผู้ชมผ่านจังหวะของภาพและเสียง",
    coverImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=85",
    author: "วรวุฒิ เพ็ชรรัตน์ • Senior Video Editor",
    tags: ["Storytelling", "A-Roll", "B-Roll", "J-Cut", "L-Cut", "Pacing"],
    practicalFormula: [
      { label: "A-Roll (ฟุตเทจหลัก)", value: "ภาพคนพูด บรรยายเรื่อง สัมภาษณ์ หรือเส้นเรื่องหลัก", note: "กระดูกสันหลังของเรื่องราวที่ขับเคลื่อนเนื้อหา" },
      { label: "B-Roll (ฟุตเทจรอง)", value: "ภาพประกอบ อารมณ์ บรรยากาศ แฮนด์อินเทอร์แอคชั่น สิ่งแวดล้อม", note: "กลบรอยต่อการพูดและเพิ่มมิติทางอารมณ์ให้คนดูเห็นภาพตาม" },
      { label: "J-Cut (เสียงมาก่อนภาพ)", value: "เสียงของช็อตถัดไปดังขึ้นมาก่อนที่ภาพจะเปลี่ยนประมาณ 0.5 - 1.5 วินาที", note: "สร้างความอยากรู้อยากเห็นและทำให้รอยต่อเนียนตาเป็นธรรมชาติ" },
      { label: "L-Cut (ภาพเปลี่ยนก่อนเสียง)", value: "ภาพช็อตใหม่ปรากฏขึ้นแล้ว แต่เสียงของช็อตเดิมยังคงดังคลออยู่", note: "สร้างความต่อเนื่องทางอารมณ์และการใคร่ครวญของตัวละคร" }
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: "วางโครงเรื่องด้วย A-Roll (Radio Cut) ให้กระชับก่อน",
        detail: "ตัดเฉพาะเสียงพูดและใจความสำคัญบนไทม์ไลน์โดยยังไม่ต้องสนใจรอยต่อของภาพที่กระตุก (Jump Cut) ลองหลับตาฟังเฉพาะเสียง ถ้าเนื้อเรื่องน่าติดตาม กระชับ และไม่เยิ่นเย้อ แสดงว่าโครงสร้างหลักของเรื่องผ่านแล้ว",
        shortcut: "A-Roll Radio Edit"
      },
      {
        stepNumber: 2,
        title: "แทรก B-Roll เพื่อกลบ Jump Cut และขยายความหมาย",
        detail: "วาง B-Roll บนแทร็ก Video 2 (V2) คลุมรอยต่อระหว่างช็อตพูดที่ตัดกระตุก เช่น เมื่อผู้พูดพูดถึง 'ความกดดันในการทำงาน' ให้ตัดสลับไปเป็นภาพ B-Roll นาฬิกาเดินหรือมือพิมพ์แป้นอย่างรวดเร็ว คนดูจะไม่รู้สึกว่ามีรอยตัดเลย",
        shortcut: "V2 Track Overlay"
      },
      {
        stepNumber: 3,
        title: "ใช้เทคนิค Split Edit: J-Cut และ L-Cut แทน Hard Cut เสมอ",
        detail: "กดปุ่ม Alt (Mac: Option) ค้างไว้เพื่อเลือกเฉพาะเส้นเสียง (Audio Bar) แล้วลากให้เสียงจากช็อตถัดไปเริ่มดังล่วงหน้าก่อนที่ภาพจะเปลี่ยน (J-Cut) หูของมนุษย์มีความอ่อนไหวต่อเสียงล่วงหน้า การทำเช่นนี้จะหลอกให้สมองรู้สึกว่าการเปลี่ยนฉากนั้นสมูทและไร้รอยต่ออย่างสิ้นเชิง",
        shortcut: "Alt + Drag Audio Edge"
      },
      {
        stepNumber: 4,
        title: "กฎ 3 วินาทีของ B-Roll และการตัดตามบีตดนตรี (Cutting on Action)",
        detail: "อย่าแช่ภาพ B-Roll เดียวกันนานเกิน 2.5 - 4.0 วินาที เว้นแต่เป็นซีนอารมณ์ช้าๆ การเปลี่ยนมุมกล้องขณะที่ตัวแบบกำลังเคลื่อนไหว (เช่น กำลังลุกขึ้นยืน หรือเปิดประตู) จะทำให้รอยตัดกลมกลืนไปกับการเคลื่อนไหว",
        shortcut: "Cutting on Action"
      }
    ],
    proTips: [
      "ใส่เสียง Sound Effect (Foley) ควบคู่กับ B-Roll เสมอ เช่น ภาพเทกาแฟต้องมีเสียงรินน้ำ ภาพพิมพ์งานต้องมีเสียงคีย์บอร์ด จะเพิ่มความสมจริงขึ้น 200%",
      "เว้นจังหวะความเงียบ (Silence) ในจุดที่ต้องการให้คนดูซึมซับประโยคทอง (Golden Punchline) อย่ายัดดนตรีดังตลอดเวลาเพราะจะทำให้คนดูล้าหู"
    ],
    mistakesToAvoid: [
      "ใส่ B-Roll ที่ไม่เกี่ยวข้องกับสิ่งที่ผู้พูดกำลังบรรยาย ทำให้ผู้ชมสับสนว่าต้องมองอะไร",
      "ตัดภาพเปลี่ยนตรงกับจังหวะบีตกลองทุกๆ บีตเท่ากันหมดเหมือนหุ่นยนต์ ทำให้วิดีโอน่าเบื่อ ควรมีการสลับจังหวะเร็ว-ช้า-เร็ว (Rhythm Variation)"
    ],
    content: `ผู้กำกับภาพยนตร์ระดับโลกเคยกล่าวไว้ว่า: **"การถ่ายทำคือการเก็บอิฐและปูน แต่การตัดต่อคือการสถาปนาปราสาท"**

คุณสามารถมีฟุตเทจชุดเดียวกัน แต่ตัดออกมาเป็นหนังสยองขวัญ สารคดีที่น่าเบื่อ หรือคลิปไวรัลที่มีคนแชร์หลายล้านครั้งได้ ทั้งหมดนี้ขึ้นอยู่กับ "จังหวะ (Pacing)" และ "ความสัมพันธ์ระหว่างภาพกับเสียง"

การเชี่ยวชาญศาสตร์ของ A-Roll, B-Roll, J-Cut และ L-Cut จะยกระดับคุณจาก 'ช่างตัดคลิป' ให้กลายเป็น **'นักเล่าเรื่องผ่านภาพยนตร์ (Visual Storyteller)'** ที่แท้จริง`
  }
];

export const ACHIEVEMENTS_DATA: AchievementBadge[] = [
  { id: "first-lesson", icon: "BookOpen", name: "ก้าวแรกนักตัดต่อ", desc: "เรียนจบบทเรียนแรกของคอร์ส", condition: "จบบทเรียนอย่างน้อย 1 บท" },
  { id: "five-lessons", icon: "Layers", name: "มือใหม่ตั้งใจเรียน", desc: "เรียนจบครบ 5 บทเรียน", condition: "จบบทเรียนอย่างน้อย 5 บท" },
  { id: "all-lessons", icon: "GraduationCap", name: "จบหลักสูตร Master", desc: "เรียนจบครบทั้ง 15 บทเรียนอย่างสมบูรณ์", condition: "จบบทเรียนครบ 15 บท" },
  { id: "quiz-master", icon: "Medal", name: "เซียนทฤษฎี", desc: "ทำคะแนนแบบทดสอบได้ตั้งแต่ 18/20 ขึ้นไป", condition: "คะแนนสอบอย่างน้อย 18 คะแนน" },
  { id: "gamer", icon: "Gamepad2", name: "นักสะสมคะแนนเกม", desc: "เล่นเกมฝึกทักษะครบ 3 เกมขึ้นไป", condition: "เล่นมินิเกมอย่างน้อย 3 เกม" },
  { id: "speed-demon", icon: "Zap", name: "สายฟ้าแลบ", desc: "ทำคะแนนเกม Speed Rush ได้ตั้งแต่ 100 คะแนนขึ้นไป", condition: "คะแนน Speed Rush >= 100" },
  { id: "daily-streak-3", icon: "Flame", name: "ไฟแรงต่อเนื่อง", desc: "เข้าเรียนติดต่อกัน 3 วันขึ้นไป", condition: "Daily Streak >= 3 วัน" },
  { id: "daily-streak-7", icon: "Sparkles", name: "วินัยสัปดาห์ทอง", desc: "เข้าเรียนติดต่อกันครบ 7 วัน", condition: "Daily Streak >= 7 วัน" }
];

export const SHORTCUTS_DATA: ShortcutItem[] = [
  // Tools
  { id: "tool-v", name: "Selection Tool", description: "เครื่องมือเลือก ย้าย และปรับแต่งคลิปมาตรฐาน", category: "Tools", windowsKey: "V", macKey: "V" },
  { id: "tool-c", name: "Razor Tool", description: "ใบมีดตัดคลิปบนไทม์ไลน์ ณ จุดที่คลิก", category: "Tools", windowsKey: "C", macKey: "C" },
  { id: "tool-b", name: "Ripple Edit Tool", description: "ตัดย่นความยาวคลิปโดยดึงคลิปด้านหลังเข้ามาชนอัตโนมัติ ไม่เกิดช่องว่าง", category: "Tools", windowsKey: "B", macKey: "B" },
  { id: "tool-n", name: "Rolling Edit Tool", description: "ปรับจุดตัดระหว่าง 2 คลิปพร้อมกันโดยความยาวรวมไม่เปลี่ยน", category: "Tools", windowsKey: "N", macKey: "N" },
  { id: "tool-r", name: "Rate Stretch Tool", description: "ยืดหรือหดคลิปเพื่อเปลี่ยนความเร็ว Speed/Duration โดยตรง", category: "Tools", windowsKey: "R", macKey: "R" },
  { id: "tool-y", name: "Slip Tool", description: "เลื่อนเนื้อหาข้างในคลิปโดยจุด In/Out และตำแหน่งบนไทม์ไลน์คงเดิม", category: "Tools", windowsKey: "Y", macKey: "Y" },
  { id: "tool-u", name: "Slide Tool", description: "เลื่อนตำแหน่งคลิปไปทับหรือหดคลิปข้างเคียงโดยเนื้อหาคลิปตัวเองไม่เปลี่ยน", category: "Tools", windowsKey: "U", macKey: "U" },
  { id: "tool-p", name: "Pen Tool", description: "สร้างมาร์กเกอร์ วาด Mask และควบคุม Keyframe บนเส้นคลิป", category: "Tools", windowsKey: "P", macKey: "P" },
  { id: "tool-t", name: "Type Tool", description: "พิมพ์ข้อความกราฟิกและไตเติลลงบนหน้าจอ Program Monitor", category: "Tools", windowsKey: "T", macKey: "T" },
  { id: "tool-a", name: "Track Select Forward", description: "เลือกคลิปทั้งหมดที่อยู่ถัดไปทางขวาในทุก Track", category: "Tools", windowsKey: "A", macKey: "A" },

  // Timeline
  { id: "time-q", name: "Ripple Trim Previous", description: "ตัดคลิปส่วนหัวจนถึงตำแหน่ง Playhead และดึงช่องว่างเข้ามาชนทันที", category: "Timeline", windowsKey: "Q", macKey: "Q" },
  { id: "time-w", name: "Ripple Trim Next", description: "ตัดคลิปส่วนหางจากตำแหน่ง Playhead จนจบคลิปและดึงช่องว่างเข้ามาชน", category: "Timeline", windowsKey: "W", macKey: "W" },
  { id: "time-cut", name: "Add Edit (Cut at Playhead)", description: "ตัดคลิปที่ตำแหน่ง Playhead บนแทร็กที่เลือก", category: "Timeline", windowsKey: "Ctrl + K", macKey: "Cmd + K" },
  { id: "time-ripdel", name: "Ripple Delete", description: "ลบคลิปหรือช่องว่างพร้อมดึงคลิปด้านหลังมาชิดแบบไร้รอยต่อ", category: "Timeline", windowsKey: "Shift + Del", macKey: "Shift + Del" },
  { id: "time-nest", name: "Nest Sequence", description: "รวมกลุ่มหลายคลิปให้กลายเป็นก้อนคลิปเดี่ยว", category: "Timeline", windowsKey: "คลิกขวา > Nest", macKey: "คลิกขวา > Nest" },
  { id: "time-snap", name: "Toggle Snapping", description: "เปิด/ปิดระบบแม่เหล็กดูดติดขอบคลิปบนไทม์ไลน์", category: "Timeline", windowsKey: "S", macKey: "S" },
  { id: "time-unlink", name: "Link / Unlink Selection", description: "ปลดการผูกติดระหว่างภาพและเสียง หรือผูกใหม่", category: "Timeline", windowsKey: "Ctrl + L", macKey: "Cmd + L" },
  { id: "time-zoom-in", name: "Zoom In Timeline", description: "ซูมขยายสเกลเวลาไทม์ไลน์ให้เห็นเฟรมละเอียดขึ้น", category: "Timeline", windowsKey: "=", macKey: "=" },
  { id: "time-zoom-out", name: "Zoom Out Timeline", description: "ซูมย่อสเกลเวลาไทม์ไลน์ให้เห็นภาพรวมทั้งโปรเจกต์", category: "Timeline", windowsKey: "-", macKey: "-" },
  { id: "time-zoom-fit", name: "Zoom to Fit Sequence", description: "ปรับไทม์ไลน์ให้พอดีกับหน้าต่างทำงานทันที", category: "Timeline", windowsKey: "\\", macKey: "\\" },

  // Playback
  { id: "play-space", name: "Play / Stop", description: "เล่นหรือหยุดวิดีโอทันที", category: "Playback", windowsKey: "Spacebar", macKey: "Spacebar" },
  { id: "play-j", name: "Shuttle Left (Rewind)", description: "กรอกลับหลัง (กดซ้ำเพื่อเพิ่มความเร็ว 2x, 4x, 8x)", category: "Playback", windowsKey: "J", macKey: "J" },
  { id: "play-k", name: "Shuttle Stop", description: "หยุดการเล่นหรือกรอ", category: "Playback", windowsKey: "K", macKey: "K" },
  { id: "play-l", name: "Shuttle Right (Forward)", description: "กรอเดินหน้า (กดซ้ำเพื่อเพิ่มความเร็ว 2x, 4x, 8x)", category: "Playback", windowsKey: "L", macKey: "L" },
  { id: "play-in", name: "Mark In", description: "กำหนดจุดเริ่มต้นของช่วงที่จะนำมาใช้หรือเรนเดอร์", category: "Playback", windowsKey: "I", macKey: "I" },
  { id: "play-out", name: "Mark Out", description: "กำหนดจุดสิ้นสุดของช่วงที่จะนำมาใช้หรือเรนเดอร์", category: "Playback", windowsKey: "O", macKey: "O" },
  { id: "play-step-back", name: "Step 1 Frame Back", description: "ถอยหลังทีละ 1 เฟรมภาพ", category: "Playback", windowsKey: "Left Arrow", macKey: "Left Arrow" },
  { id: "play-step-fwd", name: "Step 1 Frame Forward", description: "เดินหน้าทีละ 1 เฟรมภาพ", category: "Playback", windowsKey: "Right Arrow", macKey: "Right Arrow" },

  // Audio & Export
  { id: "aud-gain", name: "Audio Gain", description: "เปิดหน้าต่างปรับความดังเดซิเบล (dB) หรือ Normalize เสียง", category: "Audio", windowsKey: "G", macKey: "G" },
  { id: "aud-render", name: "Render In to Out", description: "พรีเรนเดอร์เอฟเฟกต์และแถบสีแดง/เหลืองให้เล่นได้ไหลลื่น", category: "Audio", windowsKey: "Enter", macKey: "Enter" },
  { id: "exp-media", name: "Export Media", description: "เปิดหน้าต่างเรนเดอร์ส่งออกไฟล์วิดีโอ (Quick Export / Render)", category: "Export", windowsKey: "Ctrl + M", macKey: "Cmd + M" },
  { id: "exp-save", name: "Save Project", description: "บันทึกโปรเจกต์อย่างรวดเร็ว ป้องกันงานหาย", category: "Export", windowsKey: "Ctrl + S", macKey: "Cmd + S" },
  { id: "app-fullscreen", name: "Toggle Fullscreen Web App", description: "เปิด/ปิดโหมดเว็บแอพเต็มหน้าจอ 100% สไตล์แอปพลิเคชันเดสก์ท็อป", category: "Tools", windowsKey: "F หรือ F11", macKey: "F หรือ Control+Cmd+F" }
];

export const FAQS_DATA = [
  {
    id: 1,
    q: "คอมพิวเตอร์สเปกขั้นต่ำสำหรับตัดต่อ Premiere Pro ควรเป็นอย่างไร?",
    a: "สำหรับงาน Full HD ทั่วไป แนะนำ CPU 6-Cores (Intel i5/i7 หรือ AMD Ryzen 5 ขึ้นไป), RAM อย่างน้อย 16 GB, การ์ดจอที่มี VRAM 4 GB (เช่น GTX 1660 หรือ RTX 3050 ขึ้นไป) และติดตั้งโปรแกรมรวมถึงแคชบน SSD NVMe ความเร็วสูง หากต้องการตัดงาน 4K แนะนำ RAM 32 GB ขึ้นไปครับ"
  },
  {
    id: 2,
    q: "เมื่อไหร่ที่ควรใช้ Proxy และมันช่วยอะไรได้บ้าง?",
    a: "ควรใช้เมื่อไฟล์ต้นฉบับเป็น 4K/6K, บันทึกมาแบบ H.264/H.265 บิตเรตสูง, หรือเครื่องพรีวิวแล้วกระตุก Proxy คือการแปลงไฟล์เป็นความละเอียดต่ำ (เช่น ProRes Proxy หรือ DNxHR 720p) เพื่อตัดต่อได้อย่างลื่นไหล จากนั้นเวลา Export โปรแกรมจะดึงไฟล์ 4K แท้มาเรนเดอร์ให้อัตโนมัติ"
  },
  {
    id: 3,
    q: "แก้ปัญหาจอพรีวิวดำ หรือเล่นวิดีโอไม่มีภาพ มีแต่เสียง ได้อย่างไร?",
    a: "มักเกิดจากตัวเร่งฮาร์ดแวร์ขัดข้อง: 1) ไปที่ File > Project Settings > General ตรง Video Rendering and Playback ให้เปลี่ยนจาก 'Mercury Playback Engine GPU Acceleration' เป็น 'Software Only' ชั่วคราว 2) อัปเดตไดรเวอร์การ์ดจอเป็น Studio Driver ล่าสุด 3) เคลียร์ Media Cache ใน Preferences"
  },
  {
    id: 4,
    q: "ทำไม Export วิดีโอแล้วสีจืดลง หรือสีไม่ตรงกับในโปรแกรม?",
    a: "เกิดจากการจัดการ Color Profile ของ QuickTime Player หรือจอบางประเภท แนะนำให้เช็กการตั้งค่า Color Space ใน Sequence ให้ตรงกับ Rec.709 และในหน้า Export แนะนำใช้ Format H.264, Color Space: Rec.709 หรือใช้ Gamma Compensation LUT ช่วยตอนส่งออก"
  },
  {
    id: 5,
    q: "ใบประกาศนียบัตร (Certificate) ได้รับอย่างไร?",
    a: "เมื่อคุณเรียนจบครบทั้ง 15 บทเรียน หรือทำคะแนนแบบทดสอบ Premiere Certification ได้ตั้งแต่ 14/20 คะแนนขึ้นไป ระบบจะปลดล็อกใบประกาศนียบัตรอย่างเป็นทางการทันที โดยสามารถระบุชื่อของคุณ ดาวน์โหลดเป็น PDF หรือสั่งพิมพ์ได้ฟรีตลอดชีพครับ"
  }
];

export const AVATAR_OPTIONS = [
  { id: "editor-pro", label: "Master Editor", icon: "🎬", color: "from-purple-600 to-indigo-600" },
  { id: "director", label: "Film Director", icon: "🎥", color: "from-blue-600 to-cyan-600" },
  { id: "colorist", label: "Senior Colorist", icon: "🎨", color: "from-amber-500 to-rose-500" },
  { id: "sound-designer", label: "Sound Designer", icon: "🎧", color: "from-emerald-500 to-teal-600" },
  { id: "motion-artist", label: "Motion Artist", icon: "⚡", color: "from-pink-500 to-violet-600" },
  { id: "creator", label: "YouTube Creator", icon: "📱", color: "from-red-500 to-orange-500" }
];

export const AI_KNOWLEDGE_BASE = [
  {
    keywords: ["คีย์ลัด", "shortcut", "ปุ่มลัด", "คีย์", "ตัวย่อ"],
    topic: "คีย์ลัดที่จำเป็นที่สุดในการตัดต่อ",
    answer: "คีย์ลัดที่ต้องจำเพื่อตัดต่อเร็วขึ้น 3 เท่า:\n• V = Selection Tool (เลือก/ย้าย)\n• C = Razor Tool (ใบมีดตัด)\n• Q / W = Ripple Trim ซ้าย/ขวา (ตัดแล้วดึงชนอัตโนมัติ)\n• Spacebar = Play / Stop\n• J-K-L = กรอหลัง / หยุด / กรอเดินหน้า\n• \\ = Zoom to fit พอดีหน้าจอ\n• Ctrl/Cmd + M = Export วิดีโอ\n• G = ปรับ Audio Gain"
  },
  {
    keywords: ["กระตุก", "ช้า", "ค้าง", "lag", "preview lag", "เรนเดอร์ช้า"],
    topic: "วิธีแก้ปัญหาไทม์ไลน์พรีวิวกระตุก",
    answer: "วิธีแก้พรีวิวกระตุกแบบเห็นผลทันที:\n1. ลด Playback Resolution ใต้จอพรีวิวจาก Full เป็น 1/2 หรือ 1/4\n2. สร้าง Proxy ไฟล์ความละเอียดต่ำสำหรับตัดต่อ (คลิกขวาที่คลิป > Proxy > Create Proxies เลือก QuickTime ProRes Proxy)\n3. กดปุ่ม Enter เพื่อ Render In to Out ช่วงที่มีแถบสีแดง\n4. ไปที่ Edit > Preferences > Media Cache กด 'Delete' แคชเก่าที่ค้างอยู่"
  },
  {
    keywords: ["จอดำ", "ไม่มีภาพ", "ภาพหาย", "black screen"],
    topic: "แก้ปัญหาหน้าจอพรีวิวดำ หรือภาพไม่ขึ้น",
    answer: "วิธีแก้จอดำ:\n1. ไปที่ File > Project Settings > General\n2. ที่หัวข้อ Renderer ให้สลับระหว่าง 'Mercury Playback GPU Acceleration' และ 'Software Only'\n3. เช็กว่าไม่ได้กดปิดรูปลูกตา (Toggle Track Output) บน Track วิดีโอ\n4. ตรวจสอบว่าคลิปไม่ได้ถูก Disable (กด Shift + E หรือคลิกขวา > Enable)"
  },
  {
    keywords: ["export", "เรนเดอร์", "ส่งออก", "ชัด", "ขนาดไฟล์", "youtube"],
    topic: "ตั้งค่า Export สำหรับ YouTube / TikTok ให้คมชัดที่สุด",
    answer: "การตั้งค่า Export ที่เหมาะสมที่สุด:\n• Format: H.264 (สำหรับลงเว็บและโซเชียล)\n• Preset: YouTube 1080p Full HD หรือ 2160p 4K\n• Frame Rate: ตรงกับฟุตเทจ (ปกติ 24, 25, 30 หรือ 60 fps)\n• Bitrate Encoding: VBR 2 Pass หรือ VBR 1 Pass\n• Target Bitrate:\n   - 1080p แนะนำ 16 - 20 Mbps\n   - 4K แนะนำ 45 - 60 Mbps\n• ติ๊กถูกที่ 'Use Maximum Render Quality'\n• Audio: AAC, 48000 Hz, Stereo, 320 kbps"
  },
  {
    keywords: ["เสียงเบา", "เสียงแตก", "ปรับเสียง", "audio", "mic", "เสียงก้อง", "enhance"],
    topic: "วิธีปรับแต่งเสียงพูดให้ชัดใสสไตล์มืออาชีพ",
    answer: "ขั้นตอนจัดการเสียง:\n1. กด G เพื่อตั้ง Normalize Max Peak เป็น -1 dB ถึง -3 dB เพื่อให้ระดับเสียงพอดี ไม่แตกพร่า\n2. เปิดแถบ Essential Sound > เลือกประเภทเป็น Dialogue\n3. ติ๊ก 'Enhance Speech' (Adobe AI) ปรับ Mix Amount ประมาณ 60-70% เพื่อลบเสียงสะท้อนและลด Noise อัตโนมัติ\n4. ปรับ EQ เป็น Subtle Clarity เพื่อเพิ่มความคมชัดของเสียงพูด"
  },
  {
    keywords: ["ปรับสี", "สี", "lut", "lumetri", "เกรดสี", "color"],
    topic: "ลำดับการปรับสี (Color Correction vs Color Grading)",
    answer: "ลำดับการแต่งสีที่ถูกต้อง:\n1. Color Correction (แก้สีให้ถูกต้องก่อน): ปรับ White Balance ให้ตรง, ดึง Exposure, ดู Scope Waveform คุม Shadow ไม่ให้จม และ Highlight ไม่ให้หลุด\n2. Color Grading (ใส่ Mood & Tone อารมณ์ภาพ): ไปที่แท็บ Creative เลือกใช้ LUT หรือปรับ Curve, ดึงเงาเป็นสี Teal ดึงสกินโทนเป็น Orange สไตล์ภาพยนตร์\n3. ปรับ Saturation สรุปภาพรวมให้ดูเป็นธรรมชาติ"
  },
  {
    keywords: ["ตัดต่อแนวตั้ง", "reels", "tiktok", "shorts", "9:16"],
    topic: "การทำคลิปแนวตั้ง 9:16 สำหรับ TikTok & Reels",
    answer: "ขั้นตอนการสร้าง Sequence 9:16:\n1. File > New > Sequence > Settings\n2. Editing Mode: Custom\n3. Frame Size: 1080 horizontal, 1920 vertical (อัตราส่วน 9:16)\n4. ใส่คลิปแนวนอนลงไป แล้วใช้ฟีเจอร์ Auto Reframe (คลิกขวาที่คลิป > Auto Reframe) AI จะเลื่อนกล้องตามคนให้อัตโนมัติ\n5. ใช้ Auto-Transcribe สร้างคำบรรยาย Captions วางตรงกลางช่วงล่าง ไม่ให้ทับ UI ของแอป"
  }
];
