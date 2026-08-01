import React, { useState } from 'react';
import {
  Flame,
  Upload,
  Copy,
  Check,
  Zap,
  Download,
  Palette,
  Smile,
  Type,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { convertSvgToPngDataUrl } from '../utils/imageUtils';

const PRESET_SYMBOLS = [
  '🔥', '🗿', '🐸', '🚽', '💀', '📮', '✨', '🤡', '👽', '😈',
  '🤩', '🥺', '🤣', '🤯', '🤬', '😎', '👑', '💎', '🍿', '⚡',
  '🚀', '👾', '💖', '⚔️', '🤖', '🦊', '🐲', '🥑', '🌮', '🍩',
  '🧠', '🔮', '🧿', '🌀', '💯', '🤠', '🕶️', '🥳', '👻', '🏆'
];

const BADGE_PRESETS = [
  'AUCUN', 'VIP', 'SUS', 'AFK', 'NOOB', 'PRO', 'WTF', 'LOL',
  'MEMBER', 'NITRO', 'FIRE', 'GG', 'RIP', 'CHAD', 'SIGMA', 'GIF'
];

const PRESET_THEMES = [
  { name: 'Cyberpunk', bg: '#1e1b4b', fg: '#f43f5e', border: '#818cf8' },
  { name: 'Emerald Vibe', bg: '#064e3b', fg: '#34d399', border: '#6ee7b7' },
  { name: 'Neon Purple', bg: '#4c1d95', fg: '#c084fc', border: '#e879f9' },
  { name: 'Solar Gold', bg: '#713f12', fg: '#fde047', border: '#fef08a' },
  { name: 'Midnight Cyan', bg: '#134e4a', fg: '#2dd4bf', border: '#99f6e4' },
  { name: 'Velvet Rose', bg: '#881337', fg: '#fb7185', border: '#fecdd3' },
  { name: 'Toxic Lime', bg: '#14532d', fg: '#84cc16', border: '#a3e635' },
  { name: 'Dark Shadow', bg: '#0f172a', fg: '#e2e8f0', border: '#94a3b8' },
  { name: 'Sunset Lava', bg: '#7c2d12', fg: '#fb923c', border: '#fdba74' },
];

export const EmojiCreator: React.FC = () => {
  const [emojiName, setEmojiName] = useState('mon_emoji_perso');
  const [selectedSymbol, setSelectedSymbol] = useState('🔥');
  const [selectedTheme, setSelectedTheme] = useState(PRESET_THEMES[0]);
  const [selectedBadge, setSelectedBadge] = useState('VIP');
  const [isAnimated, setIsAnimated] = useState(true);
  const [animationStyle, setAnimationStyle] = useState<'bounce' | 'pulse' | 'spin' | 'none'>('bounce');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Build rendered SVG vector
  const animCss = isAnimated && animationStyle !== 'none'
    ? `<style>
        @keyframes animGlow { 0%, 100% { transform: scale(1); opacity: 0.95; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes animSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes animBounce { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-7px); } }
        .anim-element { animation: ${
          animationStyle === 'spin'
            ? 'animSpin 5s linear infinite'
            : animationStyle === 'pulse'
            ? 'animGlow 2s ease-in-out infinite'
            : 'animBounce 1.4s ease-in-out infinite'
        }; transform-origin: center; }
       </style>`
    : '';

  const badgeXml = selectedBadge !== 'AUCUN'
    ? `<g transform="translate(74, 8)">
        <rect width="46" height="20" rx="10" fill="${selectedTheme.border}" />
        <text x="23" y="14" font-size="10" font-weight="bold" fill="#000000" text-anchor="middle" font-family="sans-serif">${selectedBadge}</text>
       </g>`
    : '';

  const generatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${selectedTheme.bg}" />
        <stop offset="100%" stop-color="${selectedTheme.bg}dd" />
      </linearGradient>
      <filter id="glowEffect">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    ${animCss}
    <rect width="128" height="128" rx="28" fill="url(#bgGrad)"/>
    <rect x="6" y="6" width="116" height="116" rx="23" fill="none" stroke="${selectedTheme.border}" stroke-opacity="0.4" stroke-width="2.5" class="${animationStyle === 'spin' ? 'anim-element' : ''}"/>
    <g class="${animationStyle !== 'spin' && isAnimated ? 'anim-element' : ''}">
      <text x="64" y="82" font-size="58" text-anchor="middle" font-family="sans-serif, Apple Color Emoji, Segoe UI Emoji" fill="${selectedTheme.fg}" filter="url(#glowEffect)">
        ${selectedSymbol}
      </text>
    </g>
    ${badgeXml}
  </svg>`;

  const renderedSvgUrl = uploadedImage
    ? uploadedImage
    : `data:image/svg+xml;utf8,${encodeURIComponent(generatedSvg)}`;

  const cleanName = emojiName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() || 'custom_emoji';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`:${cleanName}:`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = async () => {
    const pngUrl = await convertSvgToPngDataUrl(renderedSvgUrl);
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${cleanName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Studio Header Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-6">
          <div className="p-3 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-rose-500/20">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Studio de Création d'Émoji</h2>
            <p className="text-xs text-slate-400">
              Créez et personnalisez vos propres émojis avec symboles, animations et thèmes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Emoji Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                Nom de l'émoji
              </label>
              <input
                type="text"
                value={emojiName}
                onChange={(e) => setEmojiName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="ex: pepe_fire_ultra"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Upload Custom Image OR Studio Design */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  Source : Importer une Image ou Utiliser le Studio
                </label>
                {uploadedImage && (
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser
                  </button>
                )}
              </div>

              <label className="flex items-center justify-center space-x-2 p-3 bg-slate-950 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition text-xs text-slate-300 hover:text-white">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>
                  {uploadedImage ? 'Changer l\'image importée' : 'Uploader une image (PNG, GIF, JPG, SVG)'}
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {!uploadedImage && (
              <>
                {/* Symbol Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-400" />
                    Symbole & Expression
                  </label>
                  <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 max-h-36 overflow-y-auto">
                    {PRESET_SYMBOLS.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setSelectedSymbol(sym)}
                        className={`p-1.5 rounded-lg text-lg flex items-center justify-center transition border ${
                          selectedSymbol === sym
                            ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/40 scale-110'
                            : 'border-slate-800/80 hover:bg-slate-800'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    Thème Visuel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_THEMES.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-2 border transition ${
                          selectedTheme.name === theme.name
                            ? 'border-indigo-500 bg-slate-800 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: theme.fg, border: `2px solid ${theme.border}` }}
                        />
                        <span className="truncate text-[11px]">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Overlay */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Badge Textuel
                  </label>
                  <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    {BADGE_PRESETS.map((badge) => (
                      <button
                        key={badge}
                        onClick={() => setSelectedBadge(badge)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                          selectedBadge === badge
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Animation Controls */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isAnimated}
                  onChange={(e) => setIsAnimated(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />
                <span className="font-semibold">Activer l'Animation</span>
              </label>

              {isAnimated && !uploadedImage && (
                <div className="flex space-x-2 pt-1 text-xs">
                  <button
                    onClick={() => setAnimationStyle('bounce')}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-medium ${
                      animationStyle === 'bounce'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Rebond
                  </button>
                  <button
                    onClick={() => setAnimationStyle('pulse')}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-medium ${
                      animationStyle === 'pulse'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Pulsation
                  </button>
                  <button
                    onClick={() => setAnimationStyle('spin')}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-medium ${
                      animationStyle === 'spin'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Rotation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between space-y-6">
            <div className="text-center w-full">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Aperçu de votre Émoji
              </span>
            </div>

            {/* Display Box */}
            <div className="w-32 h-32 bg-slate-900 rounded-2xl border-2 border-indigo-500/40 flex items-center justify-center shadow-2xl p-3 relative group">
              <img
                src={renderedSvgUrl}
                alt={cleanName}
                className="w-24 h-24 object-contain drop-shadow-xl"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2">
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Code Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier Code :{cleanName}:</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadPng}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Télécharger l'émoji (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
