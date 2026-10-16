import React, { useState } from 'react';
import { X, ArrowLeft, Crown, Check, ShieldCheck, Zap, CreditCard, RefreshCw } from 'lucide-react';

interface SubscriptionModalProps {
  isVip: boolean;
  vipExpiry?: string;
  onUpgradeToVip: (plan: 'daily' | 'monthly', paymentProvider?: string) => Promise<void> | void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isVip,
  vipExpiry,
  onUpgradeToVip,
  onClose,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'monthly'>('monthly');
  const [paymentProvider, setPaymentProvider] = useState<'Credit Card' | 'PayPal (Manual)'>('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await onUpgradeToVip(selectedPlan, paymentProvider);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#12121A] border-t border-white/10 rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl safe-bottom">
        {/* Grab bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Top Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white font-semibold text-sm hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ShortFlix Pass</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Active status banner */}
          {isVip && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300">VIP Subscription Active</div>
                <div className="text-[11px] text-zinc-400">
                  {vipExpiry ? `Valid until ${new Date(vipExpiry).toLocaleDateString()}` : 'Unlimited Access Enabled'}
                </div>
              </div>
            </div>
          )}

          {/* Plan Selector: Daily Pass vs Monthly Pass */}
          <div className="flex items-center p-1 bg-[#1A1A26] rounded-xl">
            <button
              onClick={() => setSelectedPlan('daily')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedPlan === 'daily'
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Pass ($4.99)
            </button>
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Pass ($29.99)
            </button>
          </div>

          {/* Selected Plan Details Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1C2A] to-[#14141E] border border-orange-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FA4D1E] px-2 py-0.5 rounded bg-[#FA4D1E]/20 border border-[#FA4D1E]/40">
                  {selectedPlan === 'daily' ? '24-Hour Binge Pass' : 'Most Popular Plan'}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedPlan === 'daily' ? 'Daily All-Access Pass' : 'Monthly VIP Unlimited Pass'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-white">
                  {selectedPlan === 'daily' ? '$4.99' : '$29.99'}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  {selectedPlan === 'daily' ? '/ 24 hrs' : '/ month'}
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FA4D1E] shrink-0" />
                <span>Unlimited instant access to all locked episodes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FA4D1E] shrink-0" />
                <span>No coin deductions or ad interruptions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FA4D1E] shrink-0" />
                <span>Ultra-high definition vertical streaming</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FA4D1E] shrink-0" />
                <span>Verified transaction recorded in account ledger</span>
              </li>
            </ul>

            {showCheckout ? (
              <div className="pt-3 space-y-3 border-t border-zinc-800">
                <div className="text-xs font-semibold text-zinc-300">Select Payment Method:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('Credit Card')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      paymentProvider === 'Credit Card'
                        ? 'bg-orange-950/40 border-[#FA4D1E] text-white'
                        : 'bg-black/30 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('PayPal (Manual)')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      paymentProvider === 'PayPal (Manual)'
                        ? 'bg-orange-950/40 border-[#FA4D1E] text-white'
                        : 'bg-black/30 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>PayPal</span>
                  </button>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#FA4D1E] to-[#FF8C00] text-white font-bold text-xs shadow-lg shadow-orange-950/50 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>
                    {isProcessing ? 'Verifying Transaction...' : `Confirm & Pay ${selectedPlan === 'daily' ? '$4.99' : '$29.99'}`}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full mt-2 py-3 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white font-bold text-xs shadow-md shadow-[#FA4D1E]/30 active:scale-95 transition-all text-center cursor-pointer"
              >
                Proceed to Checkout
              </button>
            )}
          </div>

          <div className="text-[11px] text-zinc-500 text-center px-4 leading-relaxed">
            Subscriptions are authenticated and activated through the ShortFlix transaction verification gateway. You can review your transaction history at any time.
          </div>
        </div>
      </div>
    </div>
  );
};
