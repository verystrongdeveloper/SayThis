
import React, { useState } from 'react';
import { Phrase } from '../types';
import { CopyIcon, CheckIcon } from './icons';

interface PhraseCardProps {
  phrase: Phrase;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = phrase.original || phrase.korean;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-amber-500/50 hover:bg-slate-800 hover:-translate-y-0.5">
      <div className="space-y-1 flex-grow mr-4">
        {phrase.original && <p className="text-lg font-semibold text-slate-100 font-sans">{phrase.original}</p>}
        {phrase.pronunciation && <p className="text-sm text-slate-400 font-sans">[{phrase.pronunciation}]</p>}
        <p className="text-base font-medium text-amber-400">{phrase.korean}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`ml-4 p-2 rounded-full flex-shrink-0 transition-colors ${
          copied 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-slate-700 text-slate-400 hover:bg-amber-500/20 hover:text-amber-400'
        }`}
        aria-label="Copy phrase"
      >
        {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PhraseCard;