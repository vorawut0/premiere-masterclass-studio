# Premiere Pro Masterclass Studio 🎬

เว็บแอปพลิเคชันสำหรับการเรียนรู้การตัดต่อวิดีโอระดับมืออาชีพด้วย **Adobe Premiere Pro** พัฒนาด้วย **React 19, TypeScript, Tailwind CSS, Express** และเชื่อมต่อ **Firebase Firestore / Google Gemini AI**

---

## ✨ ฟีเจอร์หลัก (Key Features)

- **Interactive Program Monitor:**
  - เครื่องเล่นวิดีโอจำลองหน้าจอตัดต่อ Adobe Premiere Pro เสมือนจริง
  - ซิงค์ Timecode ระบบ SMPTE 24fps แบบเรียลไทม์ และมาตรวัดเสียง Live VU Meter
  - **ระบบ Auto-Play Next Lesson:** ตรวจจับเมื่อวิดีโอเล่นจบแล้วนับถอยหลังเพื่อเล่นบทเรียนถัดไปอัตโนมัติ พร้อมปุ่มเปิด/ปิดได้ทันที
- **Comprehensive Video Curriculum (15 บทเรียน):**
  - จัดหมวดหมู่ตามขั้นตอนการทำงานจริง (Basic, Assets, Timeline, Cutting, Transition, Effects, Color, Audio, Motion, Export)
  - ระบบบันทึกสรุปย่อ (Note-taking) และคั่นหน้าบทเรียน (Bookmark)
  - ระบบสะสมแต้ม XP และติดตามความคืบหน้าแบบเปอร์เซ็นต์
- **Real-time Notifications & Cloud Database:**
  - ระบบแจ้งเตือนจากระบบจริง เชื่อมต่อกับ Firebase Firestore แบบเรียลไทม์ พร้อมไฟจุดสีแดง (Red Dot indicator) เมื่อมีประกาศใหม่
  - แดชบอร์ดผู้สอน (Instructor Announcement Hub) สำหรับส่งข้อความบรอดแคสต์
- **Certificate Guarantee (100% มีใบประกาศ):**
  - ระบบประเมินและออกใบประกาศนียบัตรเมื่อเรียนจบตามเกณฑ์
- **AI Assistant:**
  - ผู้ช่วยสอนอัจฉริยะตอบคำถามเกี่ยวกับการตัดต่อ Premiere Pro คีย์ลัด และเทคนิคพิเศษ

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend:** Node.js, Express, tsx, esbuild
- **Database & Services:** Firebase Firestore, Google Gen AI SDK
- **Build Tool:** Vite 6

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

### 1. โคลน Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env` แล้วระบุค่า API Key ตามต้องการ:
```bash
cp .env.example .env
```

### 4. รันโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### 5. Build สำหรับ Production
```bash
npm run build
npm start
```

---

## 📄 License
MIT License
