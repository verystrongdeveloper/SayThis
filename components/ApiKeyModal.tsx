
import React, { useEffect } from 'react';
import { XIcon, ShieldCheckIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apiKeyModalTitle"
      style={{ animation: 'fade-in-fast 0.2s ease-out forwards' }}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
            <h2 id="apiKeyModalTitle" className="text-lg font-bold text-slate-100">API 키 보안 안내</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Close modal">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-slate-300">
          <p>
            입력하신 Gemini API 키는 <strong className="text-amber-400">어디에도 저장되지 않습니다.</strong>
          </p>
          <p>
            API 키는 현재 웹페이지가 열려있는 동안에만 일시적으로 사용되며, 페이지를 새로고침하거나 탭을 닫으면 즉시 사라집니다.
          </p>
          <p>
            모든 API 요청은 사용자의 브라우저에서 Google 서버로 직접 전송되며, 저희 서버를 거치지 않습니다. 안심하고 사용하세요.
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-800/50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500"
          >
            확인
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;
