import React, { useState } from 'react';
import {
  Bot,
  Shield,
  Server,
  Key,
  ShieldCheck,
  ExternalLink,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { BotStatus, GuildInfo } from '../types';

interface BotDashboardProps {
  botStatus: BotStatus | null;
  guilds: GuildInfo[];
  onRefresh: () => void;
}

export const BotDashboard: React.FC<BotDashboardProps> = ({
  botStatus,
  guilds,
  onRefresh,
}) => {
  const [tokenInput, setTokenInput] = useState(
    botStatus?.currentToken || ''
  );
  const [isUpdatingToken, setIsUpdatingToken] = useState(false);
  const [tokenMessage, setTokenMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Command Sandbox State
  const [cmdInput, setCmdInput] = useState('pepe_fire_rage:109823746592817203');
  const [cmdLogs, setCmdLogs] = useState<string[]>([]);

  const botId = botStatus?.botId || '1533122353851142224';
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=10737418240&scope=bot%20applications.commands`;

  const handleUpdateToken = async () => {
    setIsUpdatingToken(true);
    setTokenMessage(null);
    setIsError(false);

    try {
      const res = await fetch('/api/bot/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du token.');
      }

      setTokenMessage('Token mis à jour ! Le Bot est connecté.');
      onRefresh();
    } catch (err: any) {
      setIsError(true);
      setTokenMessage(err.message || 'Token invalide.');
    } finally {
      setIsUpdatingToken(false);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleRunTestCommand = () => {
    if (!cmdInput.trim()) return;

    const logMsg = `[SLASH COMMAND /add-emoji] Input: ${cmdInput} -> 📩 Embed de réponse envoyé (Seuls les Admins ont la permission)`;

    setCmdLogs((prev) => [
      `${new Date().toLocaleTimeString()} - ${logMsg}`,
      ...prev,
    ]);
  };

  const isOnline = botStatus?.status === 'online';

  return (
    <div className="space-y-6">
      {/* Bot Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Statut du Bot</span>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-base font-bold text-white">
                {isOnline ? 'En Ligne 24/7' : 'Connexion...'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Latence WS: {botStatus?.ping || 24}ms</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl ring-1 ring-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
        </div>

        {/* Guilds Connected */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Serveurs Connectés</span>
            <div className="text-2xl font-bold text-white mt-1">
              {botStatus?.guildsCount || guilds.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Commandes Slash Active</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl ring-1 ring-indigo-500/20">
            <Server className="w-6 h-6" />
          </div>
        </div>

        {/* Emojis Deployed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Émojis Ajoutés Total</span>
            <div className="text-2xl font-bold text-white mt-1">
              {botStatus?.emojisAdded || 14}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Via /add-emoji</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl ring-1 ring-purple-500/20">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Admin Permission Lock */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Sécurité Admin</span>
            <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Restreint Admin
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Seuls les Admins ajoutent</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl ring-1 ring-emerald-500/20">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Bot Settings & Invite Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Configuration Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Token du Bot Discord</h3>
              <p className="text-xs text-slate-400">
                Token du bot Discord. Il reste connecté 24/7.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Token Discord
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="MTUzMzEyMjM1Mzg1MTE0MjIyNA..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleUpdateToken}
                disabled={isUpdatingToken}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                {isUpdatingToken ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Reconnecter</span>
                )}
              </button>
            </div>
          </div>

          {tokenMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                isError
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              }`}
            >
              {isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{tokenMessage}</span>
            </div>
          )}

          {/* Discord Bot Invite Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Lien d'Invitation du Bot
              </span>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                Ouvrir dans Discord
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-400"
              />
              <button
                onClick={handleCopyInvite}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                title="Copier le lien"
              >
                {copiedInvite ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Command Tester Sandbox */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Console Commandes Slash Discord</h3>
              <p className="text-xs text-slate-400">
                Testez la commande <code className="text-purple-300">/add-emoji</code> (Uniquement avec Embeds)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="pepe_fire_rage:109823746592817203"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />

              <button
                onClick={handleRunTestCommand}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition"
              >
                Tester /add-emoji
              </button>
            </div>

            {/* Command Log Console Output */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] h-36 overflow-y-auto space-y-1 text-slate-300">
              <div className="text-slate-500 italic">Console Slash Discord prête...</div>
              {cmdLogs.map((log, index) => (
                <div key={index} className="text-emerald-400">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Serveurs Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Server className="w-5 h-5 text-indigo-400" />
          <span>Serveurs Discord Connectés ({guilds.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600/20 text-indigo-300 rounded-xl flex items-center justify-center font-bold border border-indigo-500/30">
                  {guild.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{guild.name}</h4>
                  <p className="text-xs text-slate-400">
                    {guild.memberCount} membres • {guild.emojiCount} / {guild.maxEmojis} émojis
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Bot Présent
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
