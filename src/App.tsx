import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmojiExplorer } from './components/EmojiExplorer';
import { BotDashboard } from './components/BotDashboard';
import { BotStatus, GuildInfo } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'dashboard'>('explorer');
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);

  const fetchBotInfo = async () => {
    try {
      const [statusRes, guildsRes] = await Promise.all([
        fetch('/api/bot/status'),
        fetch('/api/bot/guilds'),
      ]);

      if (statusRes.ok) {
        const data = await statusRes.json();
        setBotStatus(data);
      }

      if (guildsRes.ok) {
        const data = await guildsRes.json();
        setGuilds(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données du Bot:', err);
    }
  };

  useEffect(() => {
    fetchBotInfo();
    const interval = setInterval(fetchBotInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header Navigation with Invite Bot Button */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        botId={botStatus?.botId}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explorer' ? (
          <EmojiExplorer />
        ) : (
          <BotDashboard
            botStatus={botStatus}
            guilds={guilds}
            onRefresh={fetchBotInfo}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Discord Emoji Studio • Catalogue Officiel & Gestion Bot</span>
          <span className="font-mono text-slate-400">Base de données synchronisée</span>
        </div>
      </footer>
    </div>
  );
}
