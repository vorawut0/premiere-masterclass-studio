import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      id="custom-toast"
      className="fixed top-20 right-4 sm:right-6 z-[3000] max-w-sm glass-panel-strong border border-purple-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm text-[#EDEDF4] animate-in slide-in-from-right-4 duration-300"
    >
      <div className="w-8 h-8 rounded-xl bg-[#34D399]/20 text-[#34D399] flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 font-medium">{message}</div>
      <button 
        onClick={onClose}
        className="text-[#9A9AB0] hover:text-white text-xs cursor-pointer ml-1"
      >
        ✕
      </button>
    </div>
  );
};
