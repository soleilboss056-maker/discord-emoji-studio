import React, { useState } from 'react';
import { Send, X, CheckCircle2, AlertCircle, Server, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import { EmojiItem, GuildInfo } from '../types';
import { convertSvgToPngDataUrl } from '../utils/imageUtils';

interface DeployEmojiModalProps {
  emoji: EmojiItem | null;
  guilds: GuildInfo[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeployEmojiModal: React.FC<DeployEmojiModalProps> = ({
  emoji,
  guilds,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedGuildId, setSelectedGuildId] = useState<string>(
    guilds.length > 0 ? guilds[0].id : ''
  );
  const [customName, setCustomName] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (emoji) {
      setCustomName(emoji.name);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [emoji]);

  if (!isOpen || !emoji) return null;

  const handleDeploy = async () => {
    if (!selectedGuildId) {
      setErrorMessage('Veuillez sélectionner un serveur Discord.');
      return;
    }

    setIsDeploying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Ensure image is valid PNG for Discord API
      const pngImageUrl = await convertSvgToPngDataUrl(emoji.imageUrl);

      const res = await fetch('/api/bot/deploy-emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: selectedGuildId,
          name: customName || emoji.name,
          imageUrl: pngImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'émoji sur le serveur Discord.');
      }

      setSuccessMessage(
        `🎉 Émoji :${data.name}: ajouté avec succès sur ${data.guildName || 'le serveur'} ! (ID: ${data.formattedId})`
      );
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Permissions manquantes ou erreur réseau.');
    } finally {
      setIsDeploying(false);
    }
  };

  const selectedGuild = guilds.find((g) => g.id === selectedGuildId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 ring-1 ring-indigo-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Ajouter l'Émoji sur Discord</h2>
              <p className="text-xs text-slate-400">
                Déploiement direct sur votre serveur via le Bot Discord
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {/* Emoji Preview Card */}
          <div className="flex items-center space-x-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="w-16 h-16 bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center">
              <img src={emoji.imageUrl} alt={emoji.name} className="w-12 h-12 object-contain" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">:{customName || emoji.name}:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {emoji.category}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">ID: {emoji.formattedId}</p>
            </div>
          </div>

          {/* Target Guild Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              Sélectionner le Serveur Discord
            </label>

            {guilds.length === 0 ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Le Bot n'est connecté à aucun serveur. Invitez-le sur votre serveur d'abord !
                </span>
              </div>
            ) : (
              <select
                value={selectedGuildId}
                onChange={(e) => setSelectedGuildId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {guilds.map((guild) => (
                  <option key={guild.id} value={guild.id}>
                    {guild.name} ({guild.emojiCount}/50 émojis)
                  </option>
                ))}
              </select>
            )}

            {selectedGuild && (
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between px-1">
                <span>Membres: {selectedGuild.memberCount}</span>
                <span>Slots Émojis: {selectedGuild.emojiCount} / {selectedGuild.maxEmojis}</span>
              </div>
            )}
          </div>

          {/* Name Override Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nom de l'émoji dans le serveur (a-z, 0-9, _)
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="ex: pepe_chill"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Annuler
          </button>

          <button
            onClick={handleDeploy}
            disabled={isDeploying || guilds.length === 0}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ajouter à {selectedGuild?.name || 'Discord'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
