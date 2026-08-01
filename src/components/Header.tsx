import React, { useState } from 'react';
import { Smile, Bot, ExternalLink, Server, Terminal, Check, Copy } from 'lucide-react';

interface HeaderProps {
  botId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  botId = '1533122353851142224',
}) => {
  const [showRenderModal, setShowRenderModal] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=10737418240&scope=bot%20applications.commands`;

  const copyToClipboard = (text: string, varName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVar(varName);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3 sm:h-16 sm:py-0">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
                  <Smile className="w-6 h-6 text-white" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="font-bold text-lg text-white tracking-tight">
                      Discord Emoji Studio
                    </h1>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                      Database Officielle
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Base de données d'émojis avec recherche par ID Numérique & Noms
                  </p>
                </div>
              </div>
            </div>

            {/* Actions: Héberger sur Render & Inviter le Bot */}
            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowRenderModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm"
              >
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Héberger sur Render</span>
              </button>

              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 border border-indigo-500/50"
              >
                <Bot className="w-4 h-4" />
                <span>Inviter le Bot</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Render Hosting Instructions Modal */}
      {showRenderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Guide d'Hébergement Render.com</h3>
                  <p className="text-xs text-slate-400">Déployer votre bot & serveur en 1 clic</p>
                </div>
              </div>

              <button
                onClick={() => setShowRenderModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            {/* Config details */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>1. Commandes de Build & Démarrage</span>
                </h4>

                <div className="space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block mb-1">Build Command:</span>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                      <code className="text-emerald-400">npm install && npm run build</code>
                      <button
                        onClick={() => copyToClipboard('npm install && npm run build', 'build')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedVar === 'build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Start Command:</span>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                      <code className="text-emerald-400">npm run start</code>
                      <button
                        onClick={() => copyToClipboard('npm run start', 'start')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedVar === 'start' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center space-x-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>2. Variables d'Environnement (Render Dashboard)</span>
                </h4>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-indigo-300">DISCORD_TOKEN</span>
                    <span className="text-slate-400">Votre token bot Discord</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-indigo-300">NODE_ENV</span>
                    <span className="text-slate-400">production</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-indigo-300">PORT</span>
                    <span className="text-slate-400">3000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRenderModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
