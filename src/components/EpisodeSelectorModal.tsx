import React, { useState } from 'react';
import { X, Lock, Play, Coins, CheckCircle2 } from 'lucide-react';
import { Drama, Episode } from '../types';

interface EpisodeSelectorModalProps {
  drama: Drama;
  currentEpisode: number;
  userCoins: number;
  isVip: boolean;
  onSelectEpisode: (episodeNumber: number) => void;
  onUnlockEpisode: (dramaId: string, episodeNumber: number, cost: number) => boolean;
  onClose: () => void;
  onOpenCoinStore: () => void;
}

export const EpisodeSelectorModal: React.FC<EpisodeSelectorModalProps> = ({
  drama,
  currentEpisode,
  userCoins,
  isVip,
  onSelectEpisode,
  onUnlockEpisode,
  onClose,
  onOpenCoinStore,
}) => {
  const [activeBatch, setActiveBatch] = useState<number>(0);
  const [confirmUnlockEpisode, setConfirmUnlockEpisode] = useState<Episode | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const batchSize = 15;
  const totalBatches = Math.ceil(drama.totalEpisodes / batchSize);
  const batches = Array.from({ length: totalBatches }, (_, i) => {
    const start = i * batchSize + 1;
    const end = Math.min((i + 1) * batchSize, drama.totalEpisodes);
    return { index: i, label: `${start}-${end}`, start, end };
  });

  const currentBatchEpisodes = drama.episodes.slice(
    activeBatch * batchSize,
    (activeBatch + 1) * batchSize
  );

  const handleEpisodeClick = (ep: Episode) => {
    if (ep.isUnlocked || ep.isFree || isVip) {
      onSelectEpisode(ep.number);
      onClose();
    } else {
      setUnlockError(null);
      setConfirmUnlockEpisode(ep);
    }
  };

  const handleConfirmUnlock = () => {
    if (!confirmUnlockEpisode) return;

    if (userCoins < confirmUnlockEpisode.coinPrice) {
      setUnlockError(`You need ${confirmUnlockEpisode.coinPrice} coins.`);
      return;
    }

    const success = onUnlockEpisode(drama.id, confirmUnlockEpisode.number, confirmUnlockEpisode.coinPrice);
    if (success) {
      onSelectEpisode(confirmUnlockEpisode.number);
      setConfirmUnlockEpisode(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12121A] border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl safe-bottom">
        {/* Grab bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Drama Info Header matching Screen 12 */}
        <div className="p-4 border-b border-white/5 flex items-start gap-3">
          <img
            src={drama.poster}
            alt={drama.title}
            className="w-16 h-22 object-cover rounded-xl shrink-0"
            referrerPolicy="no-referrer"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight truncate">
                  {drama.title}
                </h3>
                <p className="text-xs text-[#FA4D1E] font-medium">{drama.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badges matching Screen 12: 10 eps free, 28 Coin */}
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded bg-[#FA4D1E] text-[10px] font-bold text-white">
                {drama.freeEpisodesCount} eps free
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                28 Coin
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {drama.description}
            </p>
          </div>
        </div>

        {/* Range Tabs: 1-15, 16-30, 31-45 matching Screen 12 */}
        <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
          {batches.map((batch) => (
            <button
              key={batch.index}
              onClick={() => setActiveBatch(batch.index)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeBatch === batch.index
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'bg-[#1C1C28] text-slate-400 hover:text-white'
              }`}
            >
              {batch.label}
            </button>
          ))}
        </div>

        {/* Episode Grid (5 columns matching Screen 12) */}
        <div className="p-4 overflow-y-auto max-h-[46vh] no-scrollbar">
          <div className="grid grid-cols-5 gap-2.5">
            {currentBatchEpisodes.map((ep) => {
              const isCurrent = ep.number === currentEpisode;
              const isUnlocked = ep.isUnlocked || ep.isFree || isVip;

              return (
                <button
                  key={ep.id}
                  onClick={() => handleEpisodeClick(ep)}
                  className={`flex flex-col items-center justify-center h-12 rounded-xl transition-all border ${
                    isCurrent
                      ? 'bg-[#FA4D1E] text-white border-[#FA4D1E] shadow-md font-bold'
                      : isUnlocked
                      ? 'bg-[#1C1C28] text-slate-200 border-white/5 hover:border-white/15'
                      : 'bg-[#14141E] text-slate-500 border-white/5'
                  }`}
                >
                  <span className="text-xs font-semibold">{ep.number}</span>

                  <div className="mt-0.5">
                    {isCurrent ? (
                      <Play className="w-2.5 h-2.5 fill-white" />
                    ) : isUnlocked ? (
                      <span className="text-[8px] text-[#FA4D1E] font-medium">Free</span>
                    ) : (
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Lock className="w-2.5 h-2.5" />
                        <span className="text-[8px] font-mono">28</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0E0E16] border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Your Coin Balance:</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              {userCoins}
            </span>
          </div>

          <button
            onClick={onOpenCoinStore}
            className="px-3 py-1 rounded-full bg-[#FA4D1E] text-white text-xs font-bold"
          >
            + Get Coins
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmUnlockEpisode && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1C1C28] border border-white/10 rounded-2xl p-5 max-w-xs w-full text-center">
            <h4 className="text-base font-bold text-white">
              Unlock Episode {confirmUnlockEpisode.number}?
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Cost: <span className="font-bold text-amber-400">{confirmUnlockEpisode.coinPrice} Coins</span>
            </p>

            {unlockError && (
              <p className="text-xs text-red-400 mt-2">{unlockError}</p>
            )}

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setConfirmUnlockEpisode(null)}
                className="py-2 px-3 rounded-full bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnlock}
                className="py-2 px-3 rounded-full bg-[#FA4D1E] text-white text-xs font-bold shadow-md shadow-[#FA4D1E]/40"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
