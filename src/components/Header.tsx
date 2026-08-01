import React from 'react';
import { Smile } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Title */}
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
                  Base De Données Officielle
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Recherche d'Émojis par ID & Noms similaires • Base de données synchronisée
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-300">Base de données active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
