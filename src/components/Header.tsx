import React from 'react';
import { Smile, Bot, Sparkles, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'explorer' | 'dashboard';
  setActiveTab: (tab: 'explorer' | 'dashboard') => void;
  botId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  botId = '1533122353851142224',
}) => {
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=10737418240&scope=bot%20applications.commands`;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3 sm:h-16 sm:py-0">
          {/* Logo & Main Title */}
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
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider hidden md:inline-block">
                    Officiel
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Recherche d'Émojis par ID & Gestion Serveur Bot
                </p>
              </div>
            </div>

            {/* Mobile Invite Button */}
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-indigo-600/20"
            >
              <span>Inviter</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Navigation Tabs & Actions */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <nav className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('explorer')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'explorer'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Base d'Émojis</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dashboard Bot</span>
              </button>
            </nav>

            {/* Desktop Inviter le Bot Button */}
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 border border-indigo-500/50"
            >
              <Bot className="w-4 h-4" />
              <span>Inviter le Bot</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
