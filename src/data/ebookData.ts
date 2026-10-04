import { EbookChapter } from '../types';

export const EBOOK_METADATA = {
  title: "Premiere Pro Masterclass: The Definitive Editing Guide",
  thaiTitle: "คัมภีร์ตัดต่อวิดีโอมืออาชีพ Premiere Pro ฉบับสมบูรณ์",
  subtitle: "คู่มือฉบับพรีเมียม ถ่ายทอดเทคนิคการตัดต่อ เกรดสี มิกซ์เสียง และคีย์ลัดระดับสตูดิโอฮอลลีวูด",
  edition: "2026 Studio Edition",
  pagesCount: "148 หน้า (Digital Interactive)",
  author: "Premiere Masterclass Editorial Team",
  coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  rating: 4.98,
  totalReaders: "14,850+ นักเรียน"
};

export const EBOOK_CHAPTERS: EbookChapter[] = [
  {
    id: "chapter-1",
    chapterNumber: 1,
    title: "The Master Workspace & Performance Architecture",
    subtitle: "การจัดพื้นที่ทำงาน สถาปัตยกรรมแคช และการสร้าง Sequence ระดับมืออาชีพ",
    readTime: "8 นาที",
    coverImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    summary: "รากฐานที่สำคัญที่สุดของนักตัดต่อมืออาชีพไม่ใช่แค่การใช้เครื่องมือ แต่คือการวางโครงสร้างระบบไฟล์ แคช และ Sequence ให้เครื่องคอมพิวเตอร์ประมวลผลได้เร็วที่สุดโดยไม่เกิดอาการกระตุกหรือโปรแกรมปิดตัวกะทันหัน",
    keyTakeaways: [
      "การจัด Window Workspace สำหรับ Single และ Dual Monitor",
      "การตั้งค่า Scratch Disks และการล้าง Media Cache Database อย่างสม่ำเสมอ",
      "การเลือกความละเอียดและเฟรมเรต Sequence: 24fps (Cinematic), 30/60fps (Social/Sports), 9:16 (TikTok/Reels)",
      "สูตรการสร้าง Proxy (ProRes Proxy / CineForm) ตัดงาน 4K 10-bit ได้ลื่นไหลบนทุกสเปกคอมพิวเตอร์"
    ],
    tags: ["Workspace", "Sequence", "Proxy", "Media Cache", "Hardware"],
    shortcuts: [
      { key: "` (Backtick)", action: "ขยายหน้าต่างที่เคอร์เซอร์ชี้อยู่ให้เต็มจอ (Maximize Panel)" },
      { key: "Ctrl / Cmd + N", action: "สร้าง Sequence ใหม่" },
      { key: "Ctrl / Cmd + Alt + K", action: "เปิดหน้าต่างตั้งค่า Keyboard Shortcuts" }
    ],
    sections: [
      {
        title: "1.1 การปรับแต่ง Workspace เพื่อโฟกัสและตัดได้ไวขึ้น 3 เท่า",
        body: "พื้นที่การทำงาน (Workspace) ใน Premiere Pro สามารถปรับเปลี่ยนให้เหมาะสมกับแต่ละขั้นตอนของงาน ตั้งแต่ Assembly, Editing, Color ไปจนถึง Audio การตรึงหน้าต่าง (Docking) ให้ Source Monitor และ Program Monitor อยู่ในระนาบสายตา พร้อมขยาย Timeline ให้เห็นระดับแทร็กเสียงอย่างชัดเจน จะช่วยลดการขยับสายตาและลดความเมื่อยล้าในการทำงานติดต่อกันหลายชั่วโมง",
        image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "ภาพบรรยากาศการจัดระเบียบหน้าต่าง Timeline และ Dual Monitors ในห้องตัดต่อระดับโปรดักชัน",
        proTip: "กดปุ่ม ` (Tilde/Backtick) บนคีย์บอร์ดเหนือแท็บ เพื่อขยาย Panel ใดก็ตามที่คุณกำลังโฟกัสอยู่ให้เต็มจอทันที เหมาะมากเวลาตรวจดูรายละเอียดใน Timeline หรือดูภาพใหญ่ใน Program Monitor",
        diagramData: [
          { label: "Timeline Width", value: "65%", desc: "พื้นที่สำหรับเรียงฟุตเทจและดู Waveform เสียง" },
          { label: "Monitors", value: "35%", desc: "แบ่งระหว่าง Source Preview และ Program Output" },
          { label: "Audio Meters", value: "Pinned", desc: "เปิดแถบวัดระดับเสียงไว้ด้านขวาสุดเสมอ" }
        ]
      },
      {
        title: "1.2 สถาปัตยกรรมแคชและ Scratch Disks ที่ถูกต้อง",
        body: "ปัญหาใหญ่ที่ทำให้ Premiere Pro ค้างหรือเครื่องหน่วง มักเกิดจากการปล่อยให้ไฟล์ Media Cache บวมสะสมในไดรฟ์ C (System Drive) จนเต็ม วิธีแก้ไขที่ดีที่สุดคือการแยก Scratch Disks ไปไว้ที่ SSD ไดรฟ์ที่สองที่มีความเร็วอ่านเขียนสูง และตั้งค่าล้างไฟล์แคชอัตโนมัติทุก 30 วันใน Preferences > Media Cache",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "การจัดเก็บข้อมูลผ่าน SSD ความเร็วสูงช่วยให้การอ่านเขียนข้อมูลขนาดใหญ่เป็นไปอย่างราบรื่น",
        proTip: "หากพบว่าเส้น Timeline กลายเป็นสีแดงและเล่นสะดุด ให้ไปที่ Preferences > Playback และปรับ Memory ให้แบ่งแรมให้กับ Premiere Pro ไม่น้อยกว่า 80% ของแรมทั้งหมดในเครื่อง"
      },
      {
        title: "1.3 เคล็ดลับการใช้ Proxies: ตัด 4K/8K ได้ลื่นไหลราวกับน้ำ",
        body: "Proxy คือการสร้างไฟล์วิดีโอคู่ขนานที่มีความละเอียดต่ำลง เช่น 720p หรือ 1080p ในฟอร์แมต ProRes Proxy หรือ CineForm เพื่อใช้ในการตัดต่อ พรีวิว และใส่เสียง จากนั้นเมื่อถึงขั้นตอน Export โปรแกรมจะดึงไฟล์ 4K/8K ต้นฉบับมาเรนเดอร์โดยอัตโนมัติ ทำให้ได้งานคุณภาพสูงสุดโดยไม่ต้องทนกระตุกขณะตัดต่อแม้แต่วินาทีเดียว",
        proTip: "เพิ่มปุ่ม 'Toggle Proxies' เข้ามาใน Tool Bar ใต้ Program Monitor เพื่อให้สามารถคลิกสลับระหว่างภาพความละเอียดต่ำกับภาพจริงได้ด้วยคลิกเดียวเพื่อตรวจสอบความคมชัด"
      }
    ]
  },
  {
    id: "chapter-2",
    chapterNumber: 2,
    title: "The Art of Seamless Cutting & Film Pacing",
    subtitle: "ศาสตร์การเล่าเรื่อง จังหวะ Pace และเทคนิคการตัดต่อ J-Cut, L-Cut ระดับภาพยนตร์",
    readTime: "10 นาที",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    summary: "การตัดต่อไม่ใช่แค่การนำคลิปมาต่อกัน แต่คือการบงการความรู้สึกและสมาธิของผู้ชมผ่านจังหวะของภาพและเสียง การเข้าใจเทคนิค J-Cut, L-Cut และการเลือกจุดตัดตามการเคลื่อนไหว (Cut on Action) จะเปลี่ยนงานตัดต่อธรรมดาให้ดูมีชั้นเชิงแบบภาพยนตร์",
    keyTakeaways: [
      "เข้าใจความแตกต่างระหว่าง J-Cut (เสียงมาก่อนภาพ) และ L-Cut (ภาพเปลี่ยนแต่เสียงเดิมยังคงอยู่)",
      "Cut on Action: เทคนิคการเปลี่ยนมุมกล้องขณะตัวละครเริ่มขยับเพื่อซ่อนรอยต่อ",
      "การควบคุม Pacing: เมื่อไรควรตัดถี่เร่งจังหวะ และเมื่อไรควรแช่ภาพให้ผู้ชมซึมซับอารมณ์",
      "เครื่องมือตัดด่วน: Ripple Edit (B), Rolling Edit (N), Slip Tool (Y) และ Slide Tool (U)"
    ],
    tags: ["J-Cut", "L-Cut", "Cut on Action", "Pacing", "Slip & Slide"],
    shortcuts: [
      { key: "Q", action: "Ripple Trim หัวคลิปถึงหัวอ่าน (ตัดส่วนหน้าทิ้งแล้วดึงคลิปชน)" },
      { key: "W", action: "Ripple Trim ท้ายคลิปถึงหัวอ่าน (ตัดส่วนหลังทิ้งแล้วดึงคลิปชน)" },
      { key: "B", action: "Ripple Edit Tool (ยืด/หดคลิปพร้อมขยับคลิปอื่นตามอัตโนมัติ)" },
      { key: "N", action: "Rolling Edit Tool (ปรับจุดรอยต่อระหว่าง 2 คลิปโดยความยาวรวมไม่เปลี่ยน)" }
    ],
    sections: [
      {
        title: "2.1 เจาะลึก J-Cut & L-Cut: อาวุธลับของนักเล่าเรื่อง",
        body: "เมื่อผู้ชมดูวิดีโอ สมองจะรับรู้เสียงได้เร็วกว่าภาพ การตัดตรงๆ แบบภาพและเสียงเปลี่ยนพร้อมกัน (Hard Cut) จะทำให้รู้สึกเหมือนถูกกระชากอารมณ์ แต่หากเราใช้ J-Cut ให้เสียงสนทนาหรือเสียงสิ่งแวดล้อมของฉากต่อไปดังขึ้นมาก่อน 1-2 วินาที ผู้ชมจะถูกนำสายตาไปยังภาพใหม่อย่างเป็นธรรมชาติ ในทางกลับกัน L-Cut ให้ภาพตัวละคร B กำลังแสดงสีหน้าตอบรับขณะที่เสียงของตัวละคร A ยังพูดไม่จบ ช่วยเสริมมิติความสัมพันธ์ของตัวละครได้อย่างทรงพลัง",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "การตัดต่อที่ประณีตใช้การเหลื่อมเสียงเพื่อสร้างอารมณ์ร่วมที่ลึกซึ้งให้กับผู้ชม",
        proTip: "กด Alt + ลากขอบคลิปเสียงหรือคลิปภาพแยกกันบน Timeline เพื่อยืดเฉพาะแทร็กเสียงหรือภาพ ให้เกิด J-Cut หรือ L-Cut ได้ทันทีโดยไม่ต้อง Unlink คลิปให้เสียเวลา",
        diagramData: [
          { label: "J-Cut", value: "Audio First", desc: "เสียงฉากใหม่เริ่มก่อนภาพฉากใหม่ 1.5 - 2 วินาที" },
          { label: "L-Cut", value: "Audio Hang", desc: "เสียงฉากเดิมยังเล่นต่อเนื่องแม้ภาพจะเปลี่ยนไปแล้ว" },
          { label: "Hard Cut", value: "Direct", desc: "ภาพและเสียงตัดพร้อมกัน เหมาะกับฉากระทึกขวัญ" }
        ]
      },
      {
        title: "2.2 Slip Tool (Y) และ Slide Tool (U): ทริกที่คนตัดต่อ 90% มองข้าม",
        body: "เมื่อวางคลิปบน Timeline แล้วจังหวะความยาวของคลิปนั้นลงตัวพอดี แต่ภาพด้านในยังไม่ได้วินาทีที่ตัวละครยิ้มสวยที่สุด แทนที่จะตัดใหม่ ให้ใช้ 'Slip Tool' (กด Y) แล้วคลิกลากบนคลิป คุณจะสามารถเปลี่ยนช่วงเวลาอินเนอร์ของคลิปนั้นได้ทันทีโดยไม่กระทบต่อความยาวและตำแหน่งบนไทม์ไลน์เลยแม้แต่เฟรมเดียว",
        proTip: "ใช้ Slide Tool (กด U) เมื่อต้องการเลื่อนคลิปตรงกลางไปซ้ายหรือขวา โดยให้คลิปข้างเคียงทั้งสองฝั่งยืดและหดตัวเองตามโดยอัตโนมัติ"
      }
    ]
  },
  {
    id: "chapter-3",
    chapterNumber: 3,
    title: "Cinema-Grade Lumetri Color Science",
    subtitle: "การอ่าน Scopes, การแก้สีผิวให้แม่นยำ และการสร้างโทนภาพยนตร์ด้วย Lumetri Color",
    readTime: "12 นาที",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    summary: "สายตามนุษย์ถูกหลอกได้ง่ายด้วยแสงไฟรอบตัวและจอภาพที่ไม่ได้คาลิเบรต ดังนั้นมืออาชีพจึงไม่อาศัยเพียงการมองด้วยตาเปล่า แต่ใช้ Scopes ทางคณิตศาสตร์ (Waveform, Vectorscope, Parade) เพื่อควบคุมความสว่างและสีสันให้ตรงตามมาตรฐานสากล",
    keyTakeaways: [
      "ขั้นตอนการทำงาน 5 สเต็ปของ Lumetri Color: Correct > Match > Creative > Skin Tone > Final Polish",
      "การอ่านค่า Waveform เพื่อป้องกันไฮไลท์ไหม้ (Clip Whites) และชาโดว์จม (Crushed Blacks)",
      "กฎ Skin Tone Line บน Vectorscope: สีผิวของมนุษย์ทุกเชื้อชาติจะตกอยู่บนแกนองศาเดียวกัน",
      "การใช้ Curves (Hue vs Sat, Hue vs Hue, Luma vs Sat) และ HSL Secondary เพื่อแยกปรับสีเฉพาะจุด"
    ],
    tags: ["Lumetri Color", "Vectorscope", "Waveform", "LUTs", "Skin Tone"],
    shortcuts: [
      { key: "F", action: "Match Frame (ดึงฟุตเทจจาก Timeline กลับมาเทียบใน Source Monitor)" },
      { key: "Shift + 7", action: "เปิดหน้าต่าง Effects เพื่อค้นหา Lumetri Color หรือฟิลเตอร์อื่นๆ" }
    ],
    sections: [
      {
        title: "3.1 โครงสร้างการทำงานของ Lumetri Scopes ที่แท้จริง",
        body: "Waveform RGB จะแสดงระดับความสว่างตั้งแต่ 0 (สีดำสนิท) ไปจนถึง 100 (สีขาวบริสุทธิ์) หลักการทองคือไม่ควรให้ข้อมูลภาพพุ่งเกิน 100 เว้นแต่เป็นแหล่งกำเนิดแสงตรงๆ เช่น หลอดไฟหรือพระอาทิตย์ และไม่ควรให้ข้อมูลจมใต้ 0 เพราะรายละเอียดในเงามืดจะหายไปถาวร ส่วน Vectorscope ใช้สำหรับตรวจเช็กความอิ่มตัวของสี (Saturation) และทิศทางของเฉดสี (Hue)",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "หน้าต่าง Lumetri Color พร้อมเครื่องมือ Vectorscope สำหรับปรับแต่งสีผิวและสมดุลแสง",
        proTip: "เมื่อเปิด Vectorscope สังเกตเส้น Skin Tone Line ที่ทำมุมประมาณ 10 นาฬิกา สีผิวของคนทุกเชื้อชาติในโลกเมื่อดรอปสีรอบตัวออก จะต้องตกอยู่บนเส้นนี้เสมอ หากเบี่ยงไปทางซ้ายจะดูติดแดงเกินไป หากเบี่ยงไปทางขวาจะดูเหลืองซีด",
        diagramData: [
          { label: "Highlights", value: "85 - 95 IRE", desc: "พื้นที่รับแสงสว่างสูงสุด ไม่ควรเกิน 100" },
          { label: "Skin Tones", value: "60 - 70 IRE", desc: "ความสว่างที่สมบูรณ์ของใบหน้าตัวละคร" },
          { label: "Shadows", value: "5 - 15 IRE", desc: "เงามืดที่มีรายละเอียด ไม่จมดำมืดเป็นบล็อก" }
        ]
      },
      {
        title: "3.2 เทคนิค Teal & Orange โทนสียอดนิยมระดับภาพยนตร์",
        body: "คู่สีตรงข้ามระหว่างสีฟ้าอมเขียว (Teal) ในเงามืด และสีส้มอุ่น (Orange) ในส่วนสว่าง คือคู่สีที่ช่วยขับให้ใบหน้าของตัวละครโดดเด่นออกจากฉากหลังอย่างมีพลังที่สุด คุณสามารถทำโทนนี้ได้ง่ายๆ ใน Color Wheels & Match โดยดัน Shadows ไปทางโทน Cyan-Teal เล็กน้อย และดึง Midtones กับ Highlights ไปทางโทน Peach-Orange",
        proTip: "อย่าใส่ Creative LUT ลงในแท็บ Basic Correction โดยตรง เพราะหากภาพตั้งต้นยังไม่ได้แก้ Exposure จะทำให้ภาพแตก ให้แก้ไข White Balance และ Exposure ให้ถูกต้องก่อน แล้วจึงใส่ LUT ในแท็บ Creative"
      }
    ]
  },
  {
    id: "chapter-4",
    chapterNumber: 4,
    title: "Studio-Quality Sound & Audio Engineering",
    subtitle: "การมิกซ์เสียง ดีไซน์ Sound FX และการควบคุมระดับเสียงตามมาตรฐานสากล",
    readTime: "9 นาที",
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    summary: "ผู้ชมยอมทนดูวิดีโอที่ภาพไม่ชัดได้ แต่จะกดปิดทันทีหากเสียงแย่ แตก หรือฟังไม่รู้เรื่อง เสียงคือ 50% ของประสบการณ์ภาพยนตร์ การเข้าใจระบบ Essential Sound และค่า Loudness จะทำให้งานของคุณมีมาตรฐานเดียวกับรายการโทรทัศน์และสตรีมมิ่งชั้นนำ",
    keyTakeaways: [
      "การจัดหมวดหมู่เสียง 4 แทร็กหลัก: Dialogue (บทสนทนา), Music (ดนตรี), SFX (เอฟเฟกต์), Ambience (บรรยากาศ)",
      "Auto-Ducking: เทคโนโลยีลดเสียงดนตรีประกอบลงอัตโนมัติเมื่อมีเสียงคนพูดอย่างเป็นธรรมชาติ",
      "การลบเสียงพัดลม แอร์ และเสียงก้องด้วย De-noise และ De-reverb",
      "มาตรฐานความดัง: YouTube ต้องการ -14 LUFS, เสียงพูดควรอยู่ที่ -6dB ถึง -12dB เสมอ"
    ],
    tags: ["Audio", "Essential Sound", "Auto-Ducking", "Loudness", "LUFS"],
    shortcuts: [
      { key: "[", action: "ลดระดับเสียงของคลิปที่เลือก 1 dB" },
      { key: "]", action: "เพิ่มระดับเสียงของคลิปที่เลือก 1 dB" },
      { key: "G", action: "เปิดหน้าต่าง Audio Gain เพื่อปรับระดับเสียงและตั้ง Peak" }
    ],
    sections: [
      {
        title: "4.1 ระบบ Essential Sound: ปรับเสียงครบสูตรในไม่กี่คลิก",
        body: "ในพาเนล Essential Sound เพียงแค่คลิกกำหนดแทร็กเสียงพูดเป็น 'Dialogue' โปรแกรมจะมีเครื่องมือ Clarity, De-Hum, De-Esser (ลดเสียงสระเสียงซี่ฟัน) และ Dynamics ช่วยปรับระดับเสียงพูดของคนที่พูดเบาและดังให้สม่ำเสมอเท่ากันโดยอัตโนมัติ",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "การมิกซ์เสียงและควบคุมแถบความถี่ในห้องตัดต่อเสียงระดับมืออาชีพ",
        proTip: "เลือกแทร็กดนตรีแล้วติ๊กเปิดฟังก์ชัน 'Ducking' จากนั้นเลือก Duck against 'Dialogue clips' ทุกครั้งที่มีเสียงพูด ดนตรีจะค่อยๆ เฟดเบาลงอย่างนุ่มนวล และจะค่อยๆ ลอยขึ้นมาใหม่เมื่อประโยคจบ ไม่ต้องมานั่งใส่คีย์เฟรมด้วยมืออีกต่อไป",
        diagramData: [
          { label: "Dialogue Peak", value: "-6 to -12 dB", desc: "ระดับเสียงพูดหลักที่ชัดเจนและไม่แตกพร่า" },
          { label: "Background Music", value: "-18 to -24 dB", desc: "เสียงเพลงคลอเบื้องหลังไม่แย่งความเด่น" },
          { label: "Hard Limiter", value: "-1.0 dB True Peak", desc: "เพดานสูงสุดเพื่อป้องกันเสียงแตกบนมือถือ" }
        ]
      },
      {
        title: "4.2 กฎความดังสากล LUFS ป้องกันโดน YouTube ลดเสียง",
        body: "เมื่ออัปโหลดวิดีโอขึ้น YouTube หากเสียงของคุณดังเกิน -14 LUFS ทางระบบจะลดระดับเสียงวิดีโอของคุณลงแบบดิจิทัล (Normalization) ซึ่งอาจทำให้คุณภาพเสียงเปลี่ยนไป ให้ใช้เอฟเฟกต์ 'Loudness Radar' หรือใส่ 'Loudness Meter' บน Master Track เพื่อตรวจเช็กค่า Integrated Loudness ก่อนกด Export เสมอ",
        proTip: "กดปุ่ม G บนคีย์บอร์ดเพื่อเปิดหน้าต่าง Audio Gain แล้วเลือก 'Normalize Max Peak to' ตั้งไว้ที่ -1.0 dB เพื่อความปลอดภัยสูงสุด"
      }
    ]
  },
  {
    id: "chapter-5",
    chapterNumber: 5,
    title: "Motion Graphics, Masking & Kinetic Effects",
    subtitle: "การคุม Keyframe Velocity, Essential Graphics (MOGRT) และ Speed Ramping",
    readTime: "11 นาที",
    coverImage: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80",
    summary: "ความแตกต่างระหว่างงานตัดต่อมือสมัครเล่นกับงานระดับสตูดิโออยู่ที่ความลื่นไหลของการเคลื่อนไหว (Kinetic Motion) คีย์เฟรมแบบ Linear ทื่อๆ จะถูกแทนที่ด้วย Bezier Curve ที่มีการเร่งและผ่อนความเร็วอย่างเป็นธรรมชาติ",
    keyTakeaways: [
      "เข้าใจความแตกต่างของ Keyframe: Linear, Hold, Ease In, Ease Out, Continuous Bezier",
      "การใช้ Velocity Graph Editor ในการทำกราฟิกสไลด์แบบ Snap & Slow",
      "Essential Graphics: การนำเข้าเทมเพลต .MOGRT และปรับเปลี่ยนฟอนต์/ข้อความ",
      "Speed Ramping: การเร่งความเร็วและชะลอภาพแบบ Smooth ร่วมกับ Optical Flow"
    ],
    tags: ["Keyframe", "Graph Editor", "Speed Ramp", "MOGRT", "Optical Flow"],
    shortcuts: [
      { key: "Ctrl / Cmd + T", action: "ใส่ Default Transition (Cross Dissolve) ให้คลิปภาพทันที" },
      { key: "Ctrl / Cmd + Shift + D", action: "ใส่ Default Audio Transition (Constant Power) ให้คลิปเสียง" }
    ],
    sections: [
      {
        title: "5.1 กฎเหล็กของ Keyframe Velocity Curve",
        body: "ในโลกแห่งความเป็นจริง ไม่มีวัตถุใดที่เคลื่อนที่ด้วยความเร็วคงที่ทันทีตั้งแต่จุดเริ่มต้น ทุกสิ่งต้องมีอัตราเร่งและแรงเสียดทาน ใน Effect Controls ให้คลิกขวาที่ Keyframe แล้วเลือก 'Ease Out' เมื่อเริ่มออกตัว และ 'Ease In' เมื่อกำลังจะหยุด จากนั้นเปิดเส้นกราฟความเร็ว (Velocity Graph) แล้วดึงแขน Bezier ให้ชันขึ้น กราฟิกของคุณจะวิ่งเข้ามาอย่างกระฉับกระเฉงและชะลอลงอย่างนุ่มนวลแบบภาพยนตร์ฮอลลีวูด",
        image: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "การปรับแต่งกราฟิกและการเคลื่อนไหวแบบคิเนติกเพื่อความน่าตื่นตาตื่นใจของภาพ",
        proTip: "หากต้องการทำภาพสโลว์โมชั่นจากฟุตเทจ 24fps หรือ 30fps ให้คลิกขวาที่คลิป เลือก Time Interpolation > 'Optical Flow' โปรแกรมจะใช้ระบบ AI คำนวณสร้างเฟรมใหม่แทรกระหว่างเฟรมเดิม ทำให้ภาพสโลว์ดูเนียนตาไม่สะดุดเป็นเฟรมซ้ำ",
        diagramData: [
          { label: "Linear", value: "Mechanical", desc: "เคลื่อนไหวทื่อๆ แข็งกระด้าง ไม่เป็นธรรมชาติ" },
          { label: "Ease In / Out", value: "Smooth", desc: "ออกตัวนิ่มและหยุดนิ่ม สบายสายตา" },
          { label: "Dynamic Curve", value: "Punchy", desc: "ออกตัวเร็วมากแล้วเบรกสโลว์ สไตล์โมเดิร์น" }
        ]
      },
      {
        title: "5.2 Masking & Auto-Tracking สำหรับเนื้องานพรีเมียม",
        body: "ในพาเนล Effect Controls ใต้หมวด Opacity จะมีเครื่องมือ Pen Tool และ Shape Mask ให้คุณสามารถเจาะเน้นเฉพาะจุด เช่น การใส่แสงสว่างเฉพาะใบหน้าตัวละคร การเบลอป้ายทะเบียนรถ หรือการทำข้อความซ่อนอยู่หลังคนเดินผ่าน เพียงคลิกปุ่ม 'Play' ข้าง Mask Path ระบบจะทำการแทร็กกิ้งตามวัตถุไปทีละเฟรมอย่างแม่นยำ",
        proTip: "ตั้งค่า Mask Feather ให้มีค่าอย่างน้อย 20 - 40 pixels เสมอ เพื่อให้ขอบของการเจาะนุ่มนวลและกลืนไปกับฉากหลังอย่างไร้รอยต่อ"
      }
    ]
  },
  {
    id: "chapter-6",
    chapterNumber: 6,
    title: "Power Shortcuts & Pre-Flight Delivery Checklist",
    subtitle: "25 คีย์ลัดเร่งสปีดชีวิต 80% และเช็กลิสต์ส่งมอบงานคุณภาพสูงสุด",
    readTime: "7 นาที",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    summary: "นักตัดต่อระดับแนวหน้าไม่ได้ตัดงานเก่งกว่าเพราะความคิดสร้างสรรค์อย่างเดียว แต่เพราะพวกเขาสามารถแปลงความคิดลงสู่ซอฟต์แวร์ได้เร็วในระดับ Reflex โดยไม่ต้องละมือจากแป้นพิมพ์ไปหากระดานเมนู บทนี้รวบรวมคีย์ลัดและเช็กลิสต์ก่อนส่งงานจริง",
    keyTakeaways: [
      "เทคนิคการตัดต่อโดยใช้มือซ้ายอยู่บนแป้น Q, W, E, D, F, C, V และมือขวาคุมเมาส์",
      "ระบบ Shuttle Playback (J-K-L) ในการกรอไปข้างหน้า ย้อนหลัง และเล่นเฟรมต่อเฟรม",
      "การตั้งค่า Export Preset: H.264 / H.265 (HEVC), Bitrate Encoding, Color Profile",
      "Pre-flight Checklist: 8 จุดตายที่ต้องตรวจก่อนเรนเดอร์ส่งลูกค้าหรืออัปโหลดสู่สาธารณะ"
    ],
    tags: ["Shortcuts", "Export", "Bitrate", "Checklist", "Workflow"],
    shortcuts: [
      { key: "J / K / L", action: "J = เล่นถอยหลัง, K = หยุด, L = เล่นไปข้างหน้า (กดซ้ำเพื่อเพิ่มความเร็ว 2x, 4x)" },
      { key: "Alt + Drag", action: "คัดลอกคลิปทันทีบน Timeline (Duplicate Clip)" },
      { key: "Ctrl / Cmd + M", action: "เปิดหน้าต่าง Export Settings พร้อมส่งออกไฟล์" },
      { key: "\ (Backslash)", action: "ซูมให้เห็นคลิปทั้งหมดใน Timeline พอดีกับหน้าจอทันที" }
    ],
    sections: [
      {
        title: "6.1 ปรัชญาการตัดต่อแบบแป้นพิมพ์สองมือ (No-Menu Workflow)",
        body: "หากคุณยังต้องใช้เมาส์คลิกเครื่องมือ Razor Tool (ใบมีด) แล้วเลื่อนไปตัดคลิป จากนั้นคลิกขวาเลือก Ripple Delete คุณกำลังเสียเวลามากกว่า 70% ของชีวิตไปกับสิ่งที่ไม่จำเป็น การใช้คีย์ Q (ตัดส่วนหัวทิ้งแล้วดึงคลิปชน) และ W (ตัดส่วนท้ายทิ้งแล้วดึงคลิปชน) จะช่วยให้คุณตัดคัดเลือกฟุตเทจ 1 ชั่วโมงเสร็จได้ภายใน 20 นาที",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        imageCaption: "การฝึกใช้คีย์ลัดบนคีย์บอร์ดอย่างคล่องแคล่วช่วยประหยัดเวลาการทำงานได้อย่างมหาศาล",
        proTip: "ปุ่ม \\ (Backslash) เหนือปุ่ม Enter คือปุ่มวิเศษ กดหนึ่งครั้ง ไทม์ไลน์จะซูมเข้าหรือออกให้ฟุตเทจทั้งหมดพอดีกับหน้าต่างทำงานทันที ไม่ต้องเลื่อนสกอร์บาร์หาอีกต่อไป",
        diagramData: [
          { label: "Q Key", value: "Ripple Cut In", desc: "ลบช่วงหัวคลิปตั้งแต่จุด Playhead ถึงรอยต่อหน้า" },
          { label: "W Key", value: "Ripple Cut Out", desc: "ลบช่วงท้ายคลิปตั้งแต่จุด Playhead ถึงรอยต่อหลัง" },
          { label: "Spacebar / K", value: "Play / Pause", desc: "สั่งเล่นและหยุดในทันที" }
        ]
      },
      {
        title: "6.2 Pre-Flight Checklist: ตรวจ 8 จุดตายก่อนกด Export",
        body: "ก่อนส่งงานให้ลูกค้าหรืออัปโหลดลงยูทูบ จงตรวจเช็กสิ่งเหล่านี้เสมอ:\n1. ตรวจสอบว่าไม่มี Gap สีดำว่างหลงเหลืออยู่ใน Timeline (Sequence > Close Gap)\n2. ตรวจสอบว่าแทร็กเสียงทุกแทร็กไม่มีคลิปใดที่ Peak เกิน 0 dB (เกิดเสียงแตกพร่า)\n3. ตรวจสอบการสะกดชื่อบุคคลและหัวเรื่องใน Lower Thirds ทุกจุด\n4. ตรวจสอบว่าได้ปิดการทำงานของเลเยอร์ Adjustment Layer ชั่วคราวแล้วหรือยัง\n5. ตรวจสอบว่าขอบภาพไม่เกิน Action Safe / Title Safe บนหน้าจอทีวี\n6. ตรวจสอบว่าตั้งค่า Bitrate เหมาะสม (1080p ควรอยู่ที่ 15-20 Mbps, 4K ควรอยู่ที่ 45-60 Mbps)\n7. ตรวจสอบว่าติ๊ก 'Render at Maximum Depth' และ 'Use Maximum Render Quality'\n8. ตรวจเช็กเฟรมแรกและเฟรมสุดท้ายว่าเสียงไม่ถูกตัดขาดอย่างกะทันหัน",
        proTip: "หากต้องส่งงานหลายคลิปพร้อมกัน อย่ากด Export จาก Premiere Pro โดยตรง ให้กดปุ่ม 'Send to Media Encoder' เพื่อให้เครื่องเรนเดอร์ในฉากหลัง และคุณยังสามารถตัดต่อโปรเจกต์ต่อไปได้ทันทีโดยไม่ต้องนั่งรอ"
      }
    ]
  }
];
