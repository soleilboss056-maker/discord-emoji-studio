import React, { useState } from 'react';
import { Copy, Check, Zap, Hash } from 'lucide-react';
import { EmojiItem } from '../types';

interface EmojiCardProps {
  emoji: EmojiItem;
}

export const EmojiCard: React.FC<EmojiCardProps> = ({ emoji }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCustomId = () => {
    navigator.clipboard.writeText(emoji.customId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10 select-none">
      {/* Top Header Badge: Custom ID & Animated Tag */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono font-bold border border-indigo-500/20 text-[11px] flex items-center gap-1">
          <Hash className="w-3 h-3 text-indigo-400" />
          <span>{emoji.customId}</span>
        </span>

        {emoji.isAnimated && (
          <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-purple-400 fill-purple-400" />
            GIF
          </span>
        )}
      </div>

      {/* Protected Emoji Image Container (Non-downloadable / Non-saveable) */}
      <div 
        onContextMenu={(e) => e.preventDefault()}
        className="my-2 py-4 px-2 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/30 transition select-none touch-none"
      >
        <img
          src={emoji.imageUrl}
          alt={emoji.title}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className="w-16 h-16 object-contain transform group-hover:scale-110 transition duration-300 drop-shadow-md pointer-events-none select-none unselectable"
          loading="lazy"
        />
      </div>

      {/* Emoji Title & Category */}
      <div className="mt-1 mb-3 text-center">
        <h3 className="font-bold text-white text-sm truncate" title={emoji.title}>
          :{emoji.title}:
        </h3>
        <p className="text-[10px] text-slate-400 truncate mt-0.5">
          Catégorie: <span className="text-slate-300 font-medium">{emoji.category}</span>
        </p>
      </div>

      {/* Unique Single Action Button: Copier ID uniquement */}
      <div>
        <button
          onClick={handleCopyCustomId}
          className={`w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50 shadow-md shadow-indigo-600/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>ID Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copier ID : {emoji.customId}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
