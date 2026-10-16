import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface SubscriptionModalProps {
  isVip: boolean;
  onUpgradeToVip: (plan: 'monthly' | 'yearly') => void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isVip,
  onUpgradeToVip,
  onClose,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (plan: 'free' | 'premium') => {
    if (plan === 'free') {
      onClose();
    } else {
      onUpgradeToVip(billingPeriod);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#12121A] border-t border-white/10 rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl safe-bottom">
        {/* Grab bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Top Header matching Screen 17 */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white font-semibold text-sm hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Monthly / Yearly Switcher matching Screen 17 */}
          <div className="flex items-center p-1 bg-[#1A1A26] rounded-xl">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Card 1: Free Plan (Ad + Limited) matching Screen 17 */}
          <div className="p-4 rounded-2xl bg-[#1A1A26] border border-white/5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white">Free Plan (Ad + Limited)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Price: Free</p>
            </div>

            <button
              onClick={() => handleSelectPlan('free')}
              className="w-full py-2.5 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white text-xs font-bold shadow-md shadow-[#FA4D1E]/30 active:scale-95 transition-all text-center"
            >
              Get Started
            </button>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Conditions:
              </span>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  Watch limited episodes per day
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  Ads between videos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  30 mins episodes locked
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  Standard video quality
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Premium Plan (Unlimited) matching Screen 17 */}
          <div className="p-4 rounded-2xl bg-[#1A1A26] border border-white/5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Premium Plan (Unlimited)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Price: {billingPeriod === 'monthly' ? '$30' : '$199'}
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan('premium')}
              className="w-full py-2.5 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white text-xs font-bold shadow-md shadow-[#FA4D1E]/30 active:scale-95 transition-all text-center"
            >
              Get Started
            </button>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Conditions:
              </span>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FA4D1E]" />
                  Watch unlimited episodes per day
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FA4D1E]" />
                  Ads-free videos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FA4D1E]" />
                  All locked episodes free to watch
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FA4D1E]" />
                  Ultra HD & 4K video quality
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FA4D1E]" />
                  Offline download enabled
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
