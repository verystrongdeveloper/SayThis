import React from 'react';
import { InfoIcon, ExternalLinkIcon } from './icons';

interface WelcomeNoticeProps {
  show: boolean;
  onClose: () => void;
}

const WelcomeNotice: React.FC<WelcomeNoticeProps> = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4 animate-fade-in-down" role="alert">
      <div className="container mx-auto flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5 sm:pt-0">
            <InfoIcon className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-slate-100">앱 사용 안내</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              이 앱은 사용자의 Gemini API 키를 사용하여 브라우저에서 직접 Google AI와 통신하는 <strong>도구</strong>입니다. 입력하신 API 키는 서버에 저장되지 않으며, 이 브라우저에서만 사용됩니다.
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline font-medium inline-flex items-center ml-2 whitespace-nowrap">
                키 발급받기 <ExternalLinkIcon className="w-3.5 h-3.5 ml-1" />
              </a>
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 self-end sm:self-center">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500"
          >
            확인했습니다
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeNotice;
