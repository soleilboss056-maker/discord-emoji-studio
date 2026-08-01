import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Hash,
} from 'lucide-react';
import { CATEGORIES } from '../data/emojisData';
import { EmojiCard } from './EmojiCard';
import { EmojiItem } from '../types';

export const EmojiExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmojis = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        category: selectedCategory,
        page: currentPage.toString(),
        pageSize: '28',
      });

      const res = await fetch(`/api/emojis?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEmojis(data.items || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des émojis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEmojis();
    }, 150);
    return () => clearTimeout(handler);
  }, [query, selectedCategory, currentPage]);

  return (
    <div className="space-y-6">
      {/* Search Bar & Filters Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Helper Tip */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              Recherche par ID personnalisé (ex: EGG-6188, DIS-101) ou par Nom similaire (ex: pepe, cat, anime)
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
            {totalCount.toLocaleString()} Émojis Disponibles
          </span>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher par ID (ex: EGG-6188, DIS-101) ou mot-clé (ex: pepe, chill, cat, anime)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-24 py-3.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition shadow-inner"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition font-medium"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800/90 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Sub-header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-slate-300">
            {totalCount.toLocaleString()} Émojis au total
          </span>
          {selectedCategory !== 'Tous' && (
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-md border border-indigo-500/20 font-semibold">
              Catégorie: {selectedCategory}
            </span>
          )}
          {query && (
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-md border border-amber-500/20 font-semibold">
              Filtre: "{query}"
            </span>
          )}
        </div>

        <span>
          Page {currentPage} sur {totalPages}
        </span>
      </div>

      {/* Emoji Catalog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 min-h-[300px]">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 h-52 animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 bg-slate-800 rounded w-1/2" />
              <div className="h-16 w-16 bg-slate-800 rounded-xl mx-auto" />
              <div className="h-8 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : emojis.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {emojis.map((emoji) => (
            <EmojiCard key={emoji.id} emoji={emoji} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Aucun émoji trouvé</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Essayez un autre mot-clé (ex: "pepe", "cat", "anime") ou entrez un ID spécifique comme "EGG-6188".
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('Tous');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
            <span>Page</span>
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold font-mono">
              {currentPage}
            </span>
            <span>sur {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
