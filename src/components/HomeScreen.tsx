import React, { useState } from 'react';
import { Play, ChevronRight, Star, Sparkles, Clock, Flame } from 'lucide-react';
import { Drama, WatchHistoryItem } from '../types';

interface HomeScreenProps {
  dramas: Drama[];
  watchHistory: WatchHistoryItem[];
  onSelectDrama: (dramaId: string, episodeNumber?: number) => void;
  onOpenEpisodes: (drama: Drama) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  dramas,
  watchHistory,
  onSelectDrama,
  onOpenEpisodes,
}) => {
  // Horizontal list of genre chips to filter dramas by category
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Romance', 'Thriller', 'Action', 'Comedy', 'Suspense', 'Drama'];

  // Filter dramas based on selected genre chip
  const filteredDramas = selectedGenre === 'All'
    ? dramas
    : dramas.filter((d) =>
        d.category.toLowerCase().includes(selectedGenre.toLowerCase()) ||
        d.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(selectedGenre.toLowerCase()))
      );

  // Recently Added dramas with new badge
  const recentlyAddedDramas = dramas.filter((d) => d.isRecentlyAdded);

  const featuredDrama = dramas[0]; // Vagabond

  const loveStoryDramas = dramas.filter((d) => d.category === 'Love Story');
  const thrillerDramas = dramas.filter((d) => d.category === 'Thriller');
  const actionDramas = dramas.filter((d) => d.category === 'Action');

  // Enriched history
  const historyWithDetails = watchHistory
    .map((item) => {
      const drama = dramas.find((d) => d.id === item.dramaId);
      return drama ? { ...item, drama } : null;
    })
    .filter(Boolean) as (WatchHistoryItem & { drama: Drama })[];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0C0C10] text-slate-100 pb-10">
      {/* 1. Horizontal List of Genre Chips at the Top */}
      <div className="px-3.5 pt-2 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {genres.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none ${
                isActive
                  ? 'bg-[#FA4D1E] text-white shadow-md shadow-[#FA4D1E]/30 scale-105'
                  : 'bg-[#181824] hover:bg-[#222232] text-slate-300 border border-white/5'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Featured Hero Banner (Matching Screen 6) */}
      <div className="relative mx-3.5 mt-2 mb-4 rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
        <div className="aspect-[16/10] w-full relative">
          <img
            src={featuredDrama.poster}
            alt={featuredDrama.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-bold text-white bg-[#FA4D1E] px-2 py-0.5 rounded-full">
                Action Series
              </span>
              <span className="text-[10px] font-medium text-slate-300">
                Exclusive 1 Episode Free
              </span>
            </div>

            <h2 className="text-lg font-black text-white tracking-tight font-['Bricolage_Grotesque'] leading-tight drop-shadow">
              {featuredDrama.title} - {featuredDrama.subtitle}
            </h2>

            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={() => onSelectDrama(featuredDrama.id, 1)}
                className="px-4 py-2 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white font-bold text-xs shadow-md shadow-[#FA4D1E]/40 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Play Now
              </button>

              <button
                onClick={() => onOpenEpisodes(featuredDrama)}
                className="px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-semibold text-xs border border-white/15 transition-colors"
              >
                Episodes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 'Recently Added' Section with NEW badge */}
      {selectedGenre === 'All' && (
        <div className="mb-5">
          <div className="px-4 flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FA4D1E]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Recently Added
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FA4D1E]/20 text-[#FA4D1E] text-[9px] font-black uppercase">
                Fresh
              </span>
            </div>
            <button
              onClick={() => onSelectDrama(recentlyAddedDramas[0]?.id || 'love-translated', 1)}
              className="text-[11px] text-[#FA4D1E] font-medium flex items-center"
            >
              See all <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
            {recentlyAddedDramas.map((drama) => (
              <div
                key={`recent-${drama.id}`}
                onClick={() => onSelectDrama(drama.id, 1)}
                className="flex-none w-28 cursor-pointer group"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Prominent Small Badge Indicating It is NEW */}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500 text-white font-black text-[8px] uppercase tracking-wider shadow-md">
                    NEW
                  </span>

                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-slate-200 font-bold text-[8px]">
                    {drama.freeEpisodesCount} Free
                  </span>

                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <span className="text-[9px] text-amber-300 font-bold flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                      {drama.rating}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white mt-1.5 truncate group-hover:text-[#FA4D1E] transition-colors">
                  {drama.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  All {drama.totalEpisodes} episodes
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtered Drama Grid if Genre Filter is Active */}
      {selectedGenre !== 'All' ? (
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              {selectedGenre} Shows ({filteredDramas.length})
            </h3>
            <button
              onClick={() => setSelectedGenre('All')}
              className="text-xs text-[#FA4D1E] hover:underline"
            >
              Reset filter
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {filteredDramas.map((drama) => (
              <div
                key={drama.id}
                onClick={() => onSelectDrama(drama.id, 1)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {drama.isRecentlyAdded && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500 text-white font-black text-[8px] uppercase">
                      NEW
                    </span>
                  )}
                  <span className="absolute bottom-1.5 left-1.5 text-[8px] font-bold text-amber-300 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                    {drama.rating}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1 truncate group-hover:text-[#FA4D1E] transition-colors">
                  {drama.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {drama.freeEpisodesCount} eps free
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Trending Now Section (Matching Screen 6) */}
          <div className="mb-5">
            <div className="px-4 flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Trending Now
              </h3>
              <button
                onClick={() => onSelectDrama(dramas[1].id, 1)}
                className="text-[11px] text-[#FA4D1E] font-medium flex items-center"
              >
                See all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
              {dramas.slice(0, 5).map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => onSelectDrama(drama.id, 1)}
                  className="flex-none w-28 cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                    <img
                      src={drama.poster}
                      alt={drama.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Free badge */}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#FA4D1E] text-white font-bold text-[8px]">
                      {drama.freeEpisodesCount} eps free
                    </span>

                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <span className="text-[9px] text-amber-300 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-300" />
                        {drama.rating}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5 truncate group-hover:text-[#FA4D1E] transition-colors">
                    {drama.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    All {drama.totalEpisodes} episodes
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Watch History Section (Matching Screen 6) */}
          {historyWithDetails.length > 0 && (
            <div className="mb-5">
              <div className="px-4 flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Watch History
                </h3>
                <button
                  onClick={() => onSelectDrama(historyWithDetails[0].dramaId, historyWithDetails[0].episodeNumber)}
                  className="text-[11px] text-[#FA4D1E] font-medium flex items-center"
                >
                  See all <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
                {historyWithDetails.map((item) => (
                  <div
                    key={item.dramaId}
                    onClick={() => onSelectDrama(item.dramaId, item.episodeNumber)}
                    className="flex-none w-36 p-2 rounded-xl bg-[#16161F] border border-white/5 cursor-pointer hover:bg-[#1E1E2A] transition-all"
                  >
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-1.5">
                      <img
                        src={item.drama.backdrop || item.drama.poster}
                        alt={item.drama.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#FA4D1E] flex items-center justify-center text-white">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white truncate">
                      {item.drama.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Episode {item.episodeNumber}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#FA4D1E] rounded-full"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Love Story Category (Matching Screen 7) */}
          <div className="mb-5">
            <div className="px-4 flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Love Story
              </h3>
              <button
                onClick={() => onSelectDrama(loveStoryDramas[0]?.id || 'love-translated', 1)}
                className="text-[11px] text-[#FA4D1E] font-medium flex items-center"
              >
                See all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
              {loveStoryDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => onSelectDrama(drama.id, 1)}
                  className="flex-none w-28 cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                    <img
                      src={drama.poster}
                      alt={drama.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#FA4D1E] text-white font-bold text-[8px]">
                      {drama.freeEpisodesCount} eps free
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 truncate group-hover:text-[#FA4D1E] transition-colors">
                    {drama.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {drama.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Thriller Category (Matching Screen 7) */}
          <div className="mb-5">
            <div className="px-4 flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Thriller
              </h3>
              <button
                onClick={() => onSelectDrama(thrillerDramas[0]?.id || 'the-glory', 1)}
                className="text-[11px] text-[#FA4D1E] font-medium flex items-center"
              >
                See all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
              {thrillerDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => onSelectDrama(drama.id, 1)}
                  className="flex-none w-28 cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                    <img
                      src={drama.poster}
                      alt={drama.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#FA4D1E] text-white font-bold text-[8px]">
                      {drama.freeEpisodesCount} eps free
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 truncate group-hover:text-[#FA4D1E] transition-colors">
                    {drama.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {drama.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Category (Matching Screen 7) */}
          <div className="mb-5">
            <div className="px-4 flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Action
              </h3>
              <button
                onClick={() => onSelectDrama(actionDramas[0]?.id || 'vagabond', 1)}
                className="text-[11px] text-[#FA4D1E] font-medium flex items-center"
              >
                See all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar">
              {actionDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => onSelectDrama(drama.id, 1)}
                  className="flex-none w-28 cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                    <img
                      src={drama.poster}
                      alt={drama.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#FA4D1E] text-white font-bold text-[8px]">
                      {drama.freeEpisodesCount} eps free
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 truncate group-hover:text-[#FA4D1E] transition-colors">
                    {drama.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {drama.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
