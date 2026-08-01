import React from 'react';
import { Header } from './components/Header';
import { EmojiExplorer } from './components/EmojiExplorer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header Navigation with Invite Bot Button & Render Host Guide */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmojiExplorer />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Discord Emoji Studio • Catalogue Officiel & Base d'Émojis</span>
          <span className="font-mono text-slate-400">ID Numériques enregistrés sur GitHub</span>
        </div>
      </footer>
    </div>
  );
}
