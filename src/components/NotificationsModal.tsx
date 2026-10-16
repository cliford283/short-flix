import React from 'react';
import { X, Bell, Flame, Gift, Sparkles, Check } from 'lucide-react';

interface NotificationsModalProps {
  onClose: () => void;
  onOpenDrama: (dramaId: string) => void;
  onOpenCoins: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
  onOpenDrama,
  onOpenCoins,
}) => {
  const notifications = [
    {
      id: 'n1',
      title: 'New Episode Drop: Vagabond Ep. 10!',
      desc: 'Cha Dal-gun faces a deadly ambush in the docks. Watch now!',
      time: '10m ago',
      unread: true,
      type: 'episode',
      dramaId: 'vagabond',
    },
    {
      id: 'n2',
      title: 'Daily Streak Bonus Ready!',
      desc: 'Claim your Day 3 bonus (+30 Coins) before midnight.',
      time: '2h ago',
      unread: true,
      type: 'coin',
    },
    {
      id: 'n3',
      title: 'Trending Alert: Love Translated',
      desc: 'Ranked #1 romance in 14 countries this week.',
      time: '1d ago',
      unread: false,
      type: 'trending',
      dramaId: 'love-translated',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141420] border-t border-white/10 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl safe-bottom">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1" />

        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF4500]" />
            <h3 className="text-sm font-bold text-white">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 overflow-y-auto no-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.dramaId) {
                  onOpenDrama(n.dramaId);
                  onClose();
                } else if (n.type === 'coin') {
                  onOpenCoins();
                  onClose();
                }
              }}
              className="p-3 rounded-2xl bg-[#1A1A28] hover:bg-[#222234] border border-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {n.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500]" />
                  )}
                  {n.title}
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {n.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
