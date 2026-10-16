import React from 'react';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, Tv, Share2 } from 'lucide-react';
import { UserProfile } from '../types';

interface CoinRewardCenterProps {
  user: UserProfile;
  onClaimDailyStreak: (coins: number) => void;
  onClaimWatchReward: (milestoneMinutes: number, rewardCoins: number) => void;
  onWatchAd: () => void;
  onBuyCoins: (coins: number, price: string) => void;
  onWatchMore: () => void;
}

export const CoinRewardCenter: React.FC<CoinRewardCenterProps> = ({
  user,
  onClaimDailyStreak,
  onWatchAd,
  onWatchMore,
}) => {
  const streakRewards = [
    { day: 1, reward: 10, label: '1 Day' },
    { day: 2, reward: 20, label: '2 Day' },
    { day: 3, reward: 30, label: '3 Day' },
    { day: 4, reward: 40, label: '4 Day' },
    { day: 5, reward: 50, label: '5 Day' },
    { day: 6, reward: 70, label: '6 Day' },
  ];

  const handleClaimDaily = () => {
    const currentDayReward = streakRewards[Math.min(user.dailyStreak, streakRewards.length - 1)].reward;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FA4D1E', '#FFD700', '#FFA500', '#FFFFFF'],
    });
    onClaimDailyStreak(currentDayReward);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0C0C10] text-slate-100 pb-12">
      {/* Title Header matching Screen 18 */}
      <div className="px-4 py-3 text-center">
        <h1 className="text-base font-bold tracking-tight text-white font-['Bricolage_Grotesque']">
          Get Coins for Free
        </h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Golden Orange Balance Card matching Screen 18 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#F97316] p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-100 font-medium">
                Your Coin Balance
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white font-['Bricolage_Grotesque']">
                  {user.coins}
                </span>
                <span className="text-xs font-bold text-amber-100">Coin</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-amber-200">
              <Crown className="w-6 h-6 fill-current" />
            </div>
          </div>
        </div>

        {/* Daily Streak Check-in matching Screen 18 */}
        <div className="bg-[#14141E] border border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white">Daily Check-in</h3>
            <span className="text-[10px] text-slate-400">Streak: {user.dailyStreak} Days</span>
          </div>

          {/* Row of 6 cards matching Screen 18 */}
          <div className="grid grid-cols-6 gap-1.5">
            {streakRewards.map((item, idx) => {
              const isClaimed = idx < user.dailyStreak;
              const isToday = idx === user.dailyStreak;

              return (
                <div
                  key={item.day}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center ${
                    isClaimed
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                      : isToday
                      ? 'bg-[#FA4D1E]/20 border-[#FA4D1E] text-white'
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}
                >
                  <span className="text-[9px] text-slate-400">{item.label}</span>
                  <span className="text-[10px] font-bold text-amber-300 mt-0.5">
                    +{item.reward}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Orange button: Get Free Coins matching Screen 18 */}
          <button
            onClick={handleClaimDaily}
            className="w-full py-2.5 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white font-bold text-xs shadow-md shadow-[#FA4D1E]/30 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Free Coins</span>
          </button>
        </div>

        {/* Content Watch Time Meter matching Screen 18 */}
        <div className="bg-[#14141E] border border-white/5 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-white">
            Fill up the content time & get coins
          </h3>

          {/* Timeline bar with 10 mins, 20 mins, 40 mins, 1 hr */}
          <div className="pt-2">
            <div className="relative h-1.5 w-full bg-white/10 rounded-full">
              <div
                className="h-full bg-[#FA4D1E] rounded-full"
                style={{ width: `${Math.min(100, (user.watchTimeMinutes / 60) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-1 text-center pt-2 text-[10px] text-slate-400">
              <div>10 mins</div>
              <div>20 mins</div>
              <div>40 mins</div>
              <div>1 hr</div>
            </div>
          </div>

          {/* Orange button: Watch More matching Screen 18 */}
          <button
            onClick={onWatchMore}
            className="w-full py-2.5 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white font-bold text-xs shadow-md shadow-[#FA4D1E]/30 active:scale-95 transition-all text-center"
          >
            Watch More
          </button>
        </div>

        {/* Task Center */}
        <div className="bg-[#14141E] border border-white/5 rounded-2xl p-4 space-y-2.5">
          <h3 className="text-xs font-bold text-white">Extra Coin Tasks</h3>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5">
              <Tv className="w-4 h-4 text-[#FA4D1E]" />
              <div>
                <p className="text-xs font-semibold text-white">Watch Sponsor Video</p>
                <p className="text-[10px] text-slate-400">+30 Coins</p>
              </div>
            </div>
            <button
              onClick={onWatchAd}
              className="px-3 py-1 rounded-full bg-[#FA4D1E] text-white text-[11px] font-bold"
            >
              Watch
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-white">Invite Friends</p>
                <p className="text-[10px] text-slate-400">+100 Coins</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'ShortFlix', text: 'Watch vertical dramas on ShortFlix!' });
                }
              }}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold"
            >
              Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
