import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-gray-100 min-w-[280px] max-w-md">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-5 w-5 text-[#4A90E2]" />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

