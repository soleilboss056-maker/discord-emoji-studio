import React, { useState } from 'react';
import { Copy, Check, Download, Zap, Hash } from 'lucide-react';
import { EmojiItem } from '../types';

interface EmojiCardProps {
  emoji: EmojiItem;
}

export const EmojiCard: React.FC<EmojiCardProps> = ({ emoji }) => {
  const [copiedType, setCopiedType] = useState<'id' | 'code' | null>(null);

  const handleCopyCustomId = () => {
    navigator.clipboard.writeText(emoji.customId);
    setCopiedType('id');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`:${emoji.title}:`);
    setCopiedType('code');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(emoji.imageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const isGif = emoji.imageUrl.endsWith('.gif') || emoji.isAnimated;
      const extension = isGif ? 'gif' : 'png';

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${emoji.title}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(emoji.imageUrl, '_blank');
    }
  };

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10">
      {/* Top Header Badge: Custom ID only */}
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

      {/* Emoji Image Container */}
      <div className="my-2 py-4 px-2 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/30 transition">
        <img
          src={emoji.imageUrl}
          alt={emoji.title}
          className="w-16 h-16 object-contain transform group-hover:scale-110 transition duration-300 drop-shadow-md"
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

      {/* Action Buttons: Copier ID, Copier Code, Télécharger */}
      <div className="space-y-1.5">
        <button
          onClick={handleCopyCustomId}
          className={`w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition border ${
            copiedType === 'id'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50 shadow-md shadow-indigo-600/20'
          }`}
        >
          {copiedType === 'id' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>ID Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier ID : {emoji.customId}</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition"
            title="Copier le nom Discord"
          >
            {copiedType === 'code' ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-indigo-400" />
            )}
            <span>Copier Code</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition"
            title="Télécharger l'image de l'émoji"
          >
            <Download className="w-3 h-3 text-purple-400" />
            <span>Télécharger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
