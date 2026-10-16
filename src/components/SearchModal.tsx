import React, { useState } from 'react';
import { Search, X, Play, Star, ChevronRight, TrendingUp } from 'lucide-react';
import { Drama } from '../types';

interface SearchModalProps {
  dramas: Drama[];
  onSelectDrama: (dramaId: string, episodeNumber?: number) => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  dramas,
  onSelectDrama,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const trendingKeywords = ['Vagabond', 'Love Story', 'The Glory', 'Billionaire CEO', 'Squid Game', 'Revenge'];

  const results = query.trim()
    ? dramas.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
        d.cast?.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0B10] animate-fade-in safe-bottom safe-top">
      {/* Search Bar Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 bg-[#12121A]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dramas, actors, genres..."
            className="w-full bg-[#1A1A28] border border-white/10 rounded-full pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white font-semibold"
        >
          Cancel
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {!query.trim() ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF4500]" />
              Popular Searches
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {trendingKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="px-3 py-1.5 rounded-full bg-[#151522] hover:bg-[#1E1E2E] text-slate-300 hover:text-white text-xs border border-white/5 transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Top Ranked Series
            </h3>
            <div className="space-y-3">
              {dramas.slice(0, 4).map((drama, idx) => (
                <div
                  key={drama.id}
                  onClick={() => {
                    onSelectDrama(drama.id, 1);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <span className="w-5 text-center font-black text-sm text-[#FF6520] font-mono">
                    {idx + 1}
                  </span>
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-12 h-16 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {drama.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {drama.category} · {drama.freeEpisodesCount} eps free
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <p>No dramas found matching &quot;{query}&quot;</p>
            <p className="mt-1 text-slate-500">Try searching &quot;Vagabond&quot; or &quot;Love&quot;</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-2 font-semibold">
              Results ({results.length})
            </p>
            {results.map((drama) => (
              <div
                key={drama.id}
                onClick={() => {
                  onSelectDrama(drama.id, 1);
                  onClose();
                }}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#14141E] hover:bg-[#1C1C2A] border border-white/5 transition-all cursor-pointer"
              >
                <img
                  src={drama.poster}
                  alt={drama.title}
                  className="w-14 h-18 rounded-xl object-cover border border-white/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {drama.title}
                  </h4>
                  <p className="text-xs text-[#FF6520] truncate">{drama.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span className="bg-white/10 px-1.5 py-0.5 rounded">
                      {drama.category}
                    </span>
                    <span>{drama.totalEpisodes} episodes</span>
                  </div>
                </div>
                <button className="p-2.5 rounded-full bg-[#FF4500] text-white">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
