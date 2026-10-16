import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  CreditCard,
  Smartphone,
  Gift,
  Trash2,
  Globe,
  Mail,
  FileText,
  ChevronRight,
  Check,
  Copy,
} from 'lucide-react';

interface SettingsModalProps {
  onOpenSubscription: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onOpenSubscription,
  onClose,
}) => {
  const [cacheCleared, setCacheCleared] = useState(false);
  const [cacheSize, setCacheSize] = useState('142.6 MB');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const inviteCode = 'SHORTFLIX-9842';

  const handleClearCache = () => {
    setCacheCleared(true);
    setCacheSize('0.0 MB');
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141420] border-t border-white/10 rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl safe-bottom">
        {/* Grab bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Top Header matching screenshot row 3 screen 15 */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-white tracking-tight">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-4 overflow-y-auto space-y-2 no-scrollbar">
          {cacheCleared && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold text-center">
              ✓ Cache cleared successfully! 142.6 MB freed.
            </div>
          )}

          {/* Subscriptions & plans */}
          <button
            onClick={onOpenSubscription}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] hover:bg-[#222234] border border-white/5 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF4500]/15 text-[#FF5500] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">
                Subscriptions & plans
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* App Icon */}
          <div className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] border border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white">App icon</span>
                <p className="text-[10px] text-slate-400">Default Crimson Glow</p>
              </div>
            </div>
            <span className="text-xs text-[#FF6520] font-semibold">Active</span>
          </div>

          {/* Invitation Code */}
          <div className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] border border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Invitation code</span>
                <p className="text-[10px] text-slate-400">{inviteCode}</p>
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] font-semibold flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedCode ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Clear Cache */}
          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] hover:bg-[#222234] border border-white/5 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Clear cache</span>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">{cacheSize}</span>
          </button>

          {/* Language */}
          <button
            onClick={() => setShowLanguagePicker((prev) => !prev)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] hover:bg-[#222234] border border-white/5 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Language</span>
            </div>
            <span className="text-xs text-[#FF6520] font-semibold flex items-center gap-1">
              {selectedLanguage} <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </span>
          </button>

          {/* Language dropdown options */}
          {showLanguagePicker && (
            <div className="p-2 bg-[#12121A] rounded-xl border border-white/5 space-y-1 animate-fade-in">
              {['English', '한국어 (Korean)', '日本語 (Japanese)', 'Español', 'Français'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang.split(' ')[0]);
                    setShowLanguagePicker(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedLanguage === lang.split(' ')[0]
                      ? 'bg-[#FF4500] text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {/* Contact us */}
          <button
            onClick={() => setShowContact(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] hover:bg-[#222234] border border-white/5 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Contact us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Terms of service */}
          <button
            onClick={() => setShowTerms(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A28] hover:bg-[#222234] border border-white/5 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Terms of service</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Modals for Terms & Contact */}
        {showContact && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1C28] p-5 rounded-2xl max-w-xs w-full text-center">
              <h4 className="text-sm font-bold text-white mb-2">Contact ShortFlix Team</h4>
              <p className="text-xs text-slate-400 mb-4">
                Have questions or feedback? Email us at <br />
                <span className="text-[#FF6520] font-mono">support@shortflix.app</span>
              </p>
              <button
                onClick={() => setShowContact(false)}
                className="w-full py-2 bg-[#FF4500] text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showTerms && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#1C1C28] p-5 rounded-2xl max-w-sm w-full">
              <h4 className="text-sm font-bold text-white mb-2">Terms of Service</h4>
              <p className="text-xs text-slate-300 space-y-2 leading-relaxed max-h-48 overflow-y-auto">
                By using ShortFlix, you agree to access licensed vertical short drama series, manage virtual coins in accordance with platform policies, and respect community standards. All digital content is protected under copyright.
              </p>
              <button
                onClick={() => setShowTerms(false)}
                className="w-full mt-4 py-2 bg-[#FF4500] text-white text-xs font-bold rounded-xl"
              >
                Accept & Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
