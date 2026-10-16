import React from 'react';
import { Home, PlaySquare, Film, Coins, User } from 'lucide-react';

export type NavTab = 'home' | 'foryou' | 'favorites' | 'coins' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount?: number;
  hasUnclaimedCoins?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'foryou' as NavTab, label: 'For You', icon: PlaySquare },
    { id: 'favorites' as NavTab, label: 'Favorites', icon: Film, badge: favoritesCount > 0 ? favoritesCount : undefined },
    { id: 'coins' as NavTab, label: 'Get Coins', icon: Coins },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#0F0F15] border-t border-white/5 px-2 py-1.5 flex items-center justify-around safe-bottom select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[58px] py-1 transition-all ${
              isActive ? 'text-[#FA4D1E]' : 'text-[#6F6F80] hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.4] scale-105' : 'stroke-[1.8]'
                }`}
              />
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-2 px-1 text-[8px] font-bold rounded-full bg-[#FA4D1E] text-white tabular-nums">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 tracking-tight font-medium ${
                isActive ? 'text-[#FA4D1E] font-semibold' : 'text-[#6F6F80]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
