import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  coins: number;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenCoins: () => void;
  onOpenVip: () => void;
  isVip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-[#0C0C10] border-b border-white/5">
      {/* Brand logo matching ShortFlix screenshot */}
      <div className="flex items-center">
        <span className="text-xl font-black tracking-tight text-white font-['Bricolage_Grotesque'] select-none">
          Short<span className="text-[#FA4D1E]">Flix</span>
        </span>
      </div>

      {/* Right Search and Notification icons */}
      <div className="flex items-center gap-1 text-slate-300">
        <button
          onClick={onOpenSearch}
          className="p-2 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </button>

        <button
          onClick={onOpenNotifications}
          className="p-2 hover:text-white rounded-full hover:bg-white/5 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#FA4D1E]" />
        </button>
      </div>
    </header>
  );
};
