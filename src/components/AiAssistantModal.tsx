import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  Key, 
  Flame, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { AI_KNOWLEDGE_BASE } from '../data/masterclassData';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  topic?: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'สวัสดีครับ! ผมคือ Premiere AI Copilot ผู้ช่วยที่ปรึกษาด้านการตัดต่อวิดีโอ มีข้อสงสัยเรื่องคีย์ลัด ปัญหาจอดำ เรนเดอร์ช้า ไทม์ไลน์กระตุก หรือเทคนิคปรับสีเสียง สามารถพิมพ์ถามหรือกดเลือกหัวข้อด้านล่างได้เลยครับ!',
      timestamp: 'เมื่อสักครู่'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'คีย์ลัดตัดต่อที่ต้องรู้',
    'ไทม์ไลน์พรีวิวกระตุก แก้อย่างไร',
    'แก้ปัญหาจอดำ หรือภาพไม่ขึ้น',
    'ตั้งค่า Export YouTube ให้ชัดที่สุด',
    'วิธีปรับเสียงพูดให้ชัดใส',
    'ทำคลิปแนวตั้ง 9:16 TikTok'
  ];

  const handleSendQuestion = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      // 1. First attempt: Real Google Gemini 2.5/3.8 AI via server endpoint
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          const aiMsg: Message = {
            id: String(Date.now() + 1),
            sender: 'ai',
            text: data.reply,
            topic: data.provider === 'gemini' ? 'Gemini AI Assistant' : 'คำแนะนำจากผู้ช่วย Masterclass',
            timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiMsg]);
          setIsThinking(false);
          return;
        }
      }
    } catch {
      // Graceful local fallback handled below
      // 2. Resilient Fallback: Built-in Premiere Pro Masterclass Knowledge Base
      const queryLower = q.toLowerCase();
      let matched = AI_KNOWLEDGE_BASE.find(item => 
        item.keywords.some(k => queryLower.includes(k.toLowerCase())) ||
        item.topic.toLowerCase().includes(queryLower)
      );

      let responseText = '';
      let matchedTopic = '';

      if (matched) {
        responseText = matched.answer;
        matchedTopic = matched.topic;
      } else {
        responseText = `สำหรับคำถาม "${q}":\n\nคำแนะนำทั่วไปในการตัดต่อ Premiere Pro:\n1. ตรวจสอบ Sequence Settings ให้ตรงกับคลิปต้นฉบับ\n2. หากเครื่องช้า แนะนำสร้าง Proxy (ProRes Proxy หรือ DNxHR)\n3. เช็กว่าไดรเวอร์การ์ดจออัปเดตเป็น Studio Driver เวอร์ชันล่าสุดแล้ว\n4. อย่าลืมเคลียร์ Media Cache ใน Preferences สม่ำเสมอเพื่อคืนพื้นที่และลดอาการเออเร่อ\n\nคุณสามารถลองเลือกหัวข้อแนะนำ หรือถามเจาะจงเรื่อง 'คีย์ลัด', 'จอดำ', 'พรีวิวกระตุก', 'export', 'ปรับสี', 'แต่งเสียง' ได้เลยครับ!`;
        matchedTopic = 'คำแนะนำทั่วไป';
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: responseText,
        topic: matchedTopic,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: 'ประวัติการสนทนาถูกรีเซ็ตแล้วครับ ถามคำถามใหม่ได้เลย!',
        timestamp: 'เมื่อสักครู่'
      }
    ]);
  };

  return (
    <div 
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-[3000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div 
        id="ai-assistant-window"
        className="w-full max-w-3xl glass-panel-strong border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col h-[85vh] max-h-[750px]"
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-white shadow-lg relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#34D399] ring-2 ring-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-[#EDEDF4]">
                  Premiere Pro AI Copilot
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#B794F6] text-[10px] font-mono border border-[#8B5CF6]/30">
                  AI ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-[#9A9AB0]">
                ที่ปรึกษาแก้ปัญหาและเทคนิคตัดต่อ ตอบทันที 24 ชม.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              title="ล้างการสนทนา"
              className="p-1.5 rounded-lg text-[#9A9AB0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9A9AB0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Chips Bar */}
        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-mono text-[#B794F6] whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> แนะนำ:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(prompt)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/20 text-[#EDEDF4] hover:text-[#B794F6] border border-white/10 text-[11px] whitespace-nowrap transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-tr-none'
                    : 'glass-panel-strong border border-white/10 text-[#EDEDF4] rounded-tl-none space-y-2'
                }`}
              >
                {msg.topic && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-[#B794F6] font-mono text-[10px] uppercase font-bold border border-purple-500/30 mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{msg.topic}</span>
                  </div>
                )}

                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                <div className="text-[10px] font-mono text-white/50 text-right pt-1">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1 font-bold text-xs">
                  ME
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-[#9A9AB0]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl glass-panel border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] font-mono text-[#9A9AB0] ml-2">กำลังค้นหาคำตอบ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white/5 border-t border-white/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์คำถาม เช่น 'คีย์ลัดตัดต่อ', 'วิธีเรนเดอร์', 'แก้จอดำ'..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs sm:text-sm text-[#EDEDF4] placeholder-[#6B6B85] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="gradient-btn px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">ส่งคำถาม</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
