import React, { useState } from 'react';
import { Play, Trash2, Film } from 'lucide-react';
import { Drama, WatchHistoryItem } from '../types';

interface FavoritesScreenProps {
  favoriteDramas: Drama[];
  watchHistory: WatchHistoryItem[];
  allDramas: Drama[];
  onSelectDrama: (dramaId: string, episodeNumber?: number) => void;
  onRemoveFavorite: (dramaId: string) => void;
  onClearHistory: () => void;
  onExploreGallery: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favoriteDramas,
  watchHistory,
  allDramas,
  onSelectDrama,
  onRemoveFavorite,
  onClearHistory,
  onExploreGallery,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'favorites' | 'history'>('favorites');

  const historyWithDetails = watchHistory
    .map((item) => {
      const drama = allDramas.find((d) => d.id === item.dramaId);
      return drama ? { ...item, drama } : null;
    })
    .filter(Boolean) as (WatchHistoryItem & { drama: Drama })[];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0C0C10] text-slate-100 pb-12">
      {/* Title Header matching Screen 9 & 10 */}
      <div className="px-4 py-3">
        <h1 className="text-base font-bold tracking-tight text-white font-['Bricolage_Grotesque']">
          Favorites
        </h1>

        {/* Top Segmented Control matching Screen 9 & 10 */}
        <div className="mt-3 p-1 bg-[#161622] rounded-xl flex items-center">
          <button
            onClick={() => setActiveSubTab('favorites')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'favorites'
                ? 'bg-[#FA4D1E] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'history'
                ? 'bg-[#FA4D1E] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Watch History
          </button>
        </div>
      </div>

      {/* SubTab 1: Favorites */}
      {activeSubTab === 'favorites' && (
        <div className="p-4">
          {favoriteDramas.length === 0 ? (
            /* Empty State matching Screen 9 in user image */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="relative w-20 h-20 rounded-2xl bg-[#1A1A26] border border-white/10 flex items-center justify-center mb-6">
                {/* Reel icon with + */}
                <Film className="w-10 h-10 text-slate-500 stroke-[1.5]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FA4D1E] text-white font-black text-sm flex items-center justify-center shadow-lg">
                  +
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white mb-6">
                You can add shows from the Gallery
              </h3>

              <button
                onClick={onExploreGallery}
                className="w-full max-w-xs py-3 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white font-bold text-xs shadow-lg shadow-[#FA4D1E]/40 active:scale-95 transition-all"
              >
                Watch the Series
              </button>
            </div>
          ) : (
            /* Populated Favorites List matching Screen 10 */
            <div className="space-y-2.5">
              {favoriteDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => onSelectDrama(drama.id, 1)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-[#14141E] border border-white/5 hover:bg-[#1C1C28] transition-all cursor-pointer group"
                >
                  <img
                    src={drama.poster}
                    alt={drama.title}
                    className="w-14 h-18 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-[#FA4D1E] transition-colors">
                      {drama.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {drama.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-semibold text-[#FA4D1E] bg-[#FA4D1E]/15 px-1.5 py-0.5 rounded">
                        {drama.freeEpisodesCount} eps free
                      </span>
                      <span className="text-[9px] text-slate-400">
                        All {drama.totalEpisodes} episodes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectDrama(drama.id, 1)}
                      className="w-8 h-8 rounded-full bg-[#FA4D1E] text-white flex items-center justify-center shadow-md shadow-[#FA4D1E]/30"
                      title="Play"
                    >
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(drama.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-full"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Watch History */}
      {activeSubTab === 'history' && (
        <div className="p-4">
          {historyWithDetails.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <p>No watch history recorded yet.</p>
              <button
                onClick={onExploreGallery}
                className="mt-4 px-4 py-2 rounded-full bg-[#FA4D1E] text-white font-bold text-xs"
              >
                Start Watching
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-400">Recently Viewed</span>
                <button
                  onClick={onClearHistory}
                  className="text-red-400 hover:text-red-300 font-medium text-[11px]"
                >
                  Clear History
                </button>
              </div>

              {/* Exact items matching Screen 10 in screenshot */}
              <div className="space-y-2.5">
                {historyWithDetails.map((item) => (
                  <div
                    key={item.dramaId}
                    onClick={() => onSelectDrama(item.dramaId, item.episodeNumber)}
                    className="flex items-center gap-3 p-2 rounded-xl bg-[#14141E] border border-white/5 hover:bg-[#1C1C28] transition-all cursor-pointer group"
                  >
                    <img
                      src={item.drama.poster}
                      alt={item.drama.title}
                      className="w-14 h-18 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.drama.title}
                      </h4>
                      <p className="text-[10px] text-[#FA4D1E] font-medium mt-0.5">
                        {item.drama.freeEpisodesCount} eps free · All {item.drama.totalEpisodes} episodes
                      </p>

                      <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-[#FA4D1E] rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="w-8 h-8 rounded-full bg-[#FA4D1E] text-white flex items-center justify-center shrink-0 shadow-md"
                      title="Continue"
                    >
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
