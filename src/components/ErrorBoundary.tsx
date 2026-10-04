import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0D16] text-[#EDEDF4] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#111524] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                เกิดข้อผิดพลาดในการแสดงผล
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                ระบบตรวจพบข้อผิดพลาดที่ไม่คาดคิด เพื่อป้องกันหน้าจอขาว คุณสามารถโหลดหน้าเว็บใหม่ หรือรีเซ็ตข้อมูลแคชชั่วคราวเพื่อเริ่มใช้งานต่อได้ทันที
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left overflow-hidden">
                <p className="text-[11px] font-mono text-red-300 truncate">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>โหลดหน้าเว็บใหม่</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-amber-400" />
                <span>ล้างแคชและเริ่มใหม่</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[#64748B]">
              Premiere Pro Masterclass • Self-Healing Architecture
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
