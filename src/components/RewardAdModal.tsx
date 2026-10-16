import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, CheckCircle2, Play } from 'lucide-react';

interface RewardAdModalProps {
  onComplete: (reward: number) => void;
  onClose: () => void;
}

export const RewardAdModal: React.FC<RewardAdModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClaim(true);
    }
  }, [secondsLeft]);

  const handleClaim = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#FF4500', '#FFD700', '#FFFFFF'],
    });
    onComplete(30);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141420] border border-white/10 shadow-2xl overflow-hidden text-center p-6">
        {/* Countdown badge or close */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-1 rounded-full bg-black/50 text-[11px] font-mono text-amber-300 border border-white/10">
            {canClaim ? 'Reward Ready' : `Ad closing in ${secondsLeft}s`}
          </span>

          {canClaim && (
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sponsor Showcase Banner */}
        <div className="relative h-44 w-full rounded-2xl bg-gradient-to-tr from-[#380e00] via-[#521c04] to-[#1a1a2e] flex flex-col items-center justify-center p-4 border border-[#FF5500]/30 shadow-inner overflow-hidden mb-5">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-widest text-[#FF8540] font-black">
              Featured Drama Sponsor
            </span>
            <h3 className="text-xl font-black text-white mt-1 font-['Bricolage_Grotesque']">
              ShortFlix VIP Originals
            </h3>
            <p className="text-xs text-amber-200/90 mt-1 max-w-[200px] mx-auto">
              Get unlimited access to over 500+ vertical Korean and Asian dramas!
            </p>
          </div>
        </div>

        <h4 className="text-base font-bold text-white">
          {canClaim ? 'Thank You for Supporting Us!' : 'Watching Sponsored Clip...'}
        </h4>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Earn <span className="text-amber-400 font-bold">+30 Free Coins</span> for watching.
        </p>

        {canClaim ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E63900] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5500]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Claim +30 Coins
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 font-semibold text-xs flex items-center justify-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Crediting in {secondsLeft} seconds...
          </div>
        )}
      </div>
    </div>
  );
};
