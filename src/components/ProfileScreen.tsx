import React from 'react';
import {
  Settings,
  Crown,
  ChevronRight,
  Sparkles,
  BarChart3,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  favoritesCount: number;
  historyCount: number;
  onOpenSettings: () => void;
  onOpenSubscription: () => void;
  onOpenCoins: () => void;
  onOpenFavorites: () => void;
  onOpenHistory: () => void;
  onSignOut: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onOpenSettings,
  onOpenSubscription,
  onOpenCoins,
  onSignOut,
  onOpenAdmin,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0C0C10] text-slate-100 pb-12">
      {/* Title Header matching Screen 14 */}
      <div className="px-4 py-3 text-center">
        <h1 className="text-base font-bold tracking-tight text-white font-['Bricolage_Grotesque']">
          Profile
        </h1>
      </div>

      <div className="px-4 space-y-4">
        {/* User Card matching Screen 14 */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full p-1 border-2 border-[#FA4D1E] shadow-[0_0_20px_rgba(250,77,30,0.4)]">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FA4D1E] text-white text-[9px] font-bold shadow">
              {user.isVip ? 'VIP' : '+100'}
            </div>
          </div>

          <h2 className="text-base font-bold text-white tracking-tight">
            {user.name}
          </h2>
          <span className="text-[11px] text-slate-400 mt-0.5 font-mono">
            ID: {user.id}
          </span>
          {user.role === 'admin' && (
            <span className="mt-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase tracking-wider">
              Administrator
            </span>
          )}
        </div>

        {/* Big Coin Banner Card matching Screen 14 */}
        <div className="p-4 rounded-2xl bg-[#151520] border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Coin</span>
            <span className="text-xs text-[#FA4D1E] font-bold">({user.coins})</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Watch stories made for vertical viewing and Earn or buy coins to unlock full episodes.
          </p>

          <button
            onClick={onOpenCoins}
            className="w-full py-2.5 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white font-bold text-xs shadow-md shadow-[#FA4D1E]/30 active:scale-95 transition-all text-center cursor-pointer"
          >
            Get Coin
          </button>
        </div>

        {/* Menu list matching Screen 14: Admin, Settings, VIP, Overview */}
        <div className="space-y-2">
          {/* Admin Dashboard Entry Point */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-orange-950/40 to-red-950/30 hover:brightness-110 border border-[#FA4D1E]/30 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FA4D1E]/20 flex items-center justify-center text-[#FA4D1E]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Admin Dashboard</span>
                  <span className="text-[10px] text-zinc-400">Content, Episodes & Platform Control</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#FA4D1E]" />
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#151520] hover:bg-[#1E1E2C] border border-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* VIP */}
          <button
            onClick={onOpenSubscription}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#151520] hover:bg-[#1E1E2C] border border-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">
                {user.isVip ? 'VIP Active Member' : 'VIP Subscriptions'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Overview */}
          <div className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#151520] border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Daily Streak</span>
            </div>
            <span className="text-xs text-[#FA4D1E] font-bold">{user.dailyStreak || 1} Days Active</span>
          </div>

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#151520] hover:bg-red-500/10 border border-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-red-400">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
