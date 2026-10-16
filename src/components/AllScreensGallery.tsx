import React from 'react';
import { Play, Sparkles, ExternalLink, Heart, Bookmark, MessageCircle, Share2, Pause, Film } from 'lucide-react';
import { Drama, UserProfile } from '../types';
import { actressVagabond, actorVagabond } from '../data/dramas';

interface AllScreensGalleryProps {
  dramas: Drama[];
  user: UserProfile;
  onNavigateToScreen: (screenId: string) => void;
}

export const AllScreensGallery: React.FC<AllScreensGalleryProps> = ({
  dramas,
  user,
  onNavigateToScreen,
}) => {
  const featured = dramas[0];
  const romance = dramas[1];
  const thriller = dramas[2];

  const screenRows = [
    {
      rowTitle: 'Row 1: Splash, Onboarding & Authentication Flow',
      screens: [
        {
          id: 'splash',
          title: '01. Splash Screen',
          desc: 'Brand reveal on radial glow',
          action: () => onNavigateToScreen('splash'),
          preview: (
            <div className="w-full h-full bg-radial-gradient from-[#4d1600] via-[#12121A] to-[#08080C] flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xl font-black text-white tracking-tight font-['Bricolage_Grotesque']">
                Short<span className="text-[#FA4D1E]">Flix</span>
              </span>
            </div>
          ),
        },
        {
          id: 'onboarding',
          title: '02. Onboarding',
          desc: '3D Fanned cards & CTA',
          action: () => onNavigateToScreen('onboarding'),
          preview: (
            <div className="w-full h-full bg-[#0D0D14] flex flex-col justify-between p-3 text-center">
              <div className="relative h-28 flex items-center justify-center pt-2">
                <div className="absolute w-14 h-20 rounded-lg overflow-hidden -rotate-12 -translate-x-6 opacity-60">
                  <img src={romance.poster} className="w-full h-full object-cover" alt="fan" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute w-14 h-20 rounded-lg overflow-hidden rotate-12 translate-x-6 opacity-60">
                  <img src={thriller.poster} className="w-full h-full object-cover" alt="fan" referrerPolicy="no-referrer" />
                </div>
                <div className="relative z-10 w-16 h-22 rounded-lg overflow-hidden border border-[#FA4D1E] shadow-xl">
                  <img src={featured.poster} className="w-full h-full object-cover" alt="fan" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-[8px] font-bold text-white leading-tight">Swipe up to explore short drama episodes</p>
                <p className="text-[6px] text-slate-400 mt-0.5 line-clamp-1">Watch stories made for vertical viewing</p>
                <div className="mt-2 w-full py-1.5 bg-[#FA4D1E] text-[8px] font-bold rounded-full text-white">Start Watching →</div>
              </div>
            </div>
          ),
        },
        {
          id: 'signin',
          title: '03. Sign In',
          desc: 'Credentials & Social Login',
          action: () => onNavigateToScreen('signin'),
          preview: (
            <div className="w-full h-full bg-[#11111A] p-2.5 flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] font-bold text-white">Short<span className="text-[#FA4D1E]">Flix</span></span>
                <p className="text-[11px] font-bold text-white mt-1">Sign In</p>
                <p className="text-[6px] text-slate-400">Welcome back, you&apos;ve been missed</p>
                <div className="mt-2 space-y-1">
                  <div className="h-4 bg-white/5 rounded border border-white/10" />
                  <div className="h-4 bg-white/5 rounded border border-white/10" />
                  <span className="text-[6px] text-[#FA4D1E] block text-right">Forgot Password?</span>
                </div>
              </div>
              <div>
                <div className="w-full py-1 bg-[#FA4D1E] text-center text-[7px] font-bold rounded-full text-white">Sign In</div>
                <div className="flex justify-center gap-1.5 mt-1.5">
                  <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[7px] text-white">G</span>
                  <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[7px] text-white"></span>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'signup',
          title: '04. Sign Up',
          desc: 'Registration & Terms',
          action: () => onNavigateToScreen('signup'),
          preview: (
            <div className="w-full h-full bg-[#11111A] p-2.5 flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] font-bold text-white">Short<span className="text-[#FA4D1E]">Flix</span></span>
                <p className="text-[11px] font-bold text-white mt-1">Sign Up</p>
                <div className="mt-1.5 space-y-1">
                  <div className="h-3.5 bg-white/5 rounded border border-white/10" />
                  <div className="h-3.5 bg-white/5 rounded border border-white/10" />
                  <div className="h-3.5 bg-white/5 rounded border border-white/10" />
                </div>
              </div>
              <div>
                <div className="w-full py-1 bg-[#FA4D1E] text-center text-[7px] font-bold rounded-full text-white">Sign Up</div>
                <div className="flex justify-center gap-1 mt-1 text-[6px] text-slate-400">
                  <span>Already have an account?</span> <span className="text-[#FA4D1E]">Sign In</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'verify',
          title: '05. Verify Code',
          desc: '4-digit OTP Code',
          action: () => onNavigateToScreen('verify'),
          preview: (
            <div className="w-full h-full bg-[#11111A] p-3 flex flex-col justify-between text-center">
              <div>
                <p className="text-[9px] font-bold text-white">Verify Code</p>
                <p className="text-[6px] text-slate-400 mt-0.5">Please enter the code we just sent</p>
                <div className="flex justify-center gap-1.5 mt-4">
                  {['8', '7', '•', '•'].map((n, i) => (
                    <div key={i} className="w-5 h-6 rounded bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-bold text-white">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full py-1.5 bg-[#FA4D1E] text-center text-[7px] font-bold rounded-full text-white">Verify</div>
            </div>
          ),
        },
      ],
    },
    {
      rowTitle: 'Row 2: Home Feed, Category Browse & Favorites',
      screens: [
        {
          id: 'home',
          title: '06. Home Feed',
          desc: 'Hero banner & trending carousels',
          action: () => onNavigateToScreen('home'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 flex flex-col">
              <div className="flex justify-between items-center text-[8px] font-bold text-white mb-1">
                <span>Short<span className="text-[#FA4D1E]">Flix</span></span>
                <span className="text-slate-400">🔍 🔔</span>
              </div>
              <div className="h-16 rounded-xl relative overflow-hidden mb-1.5">
                <img src={featured.poster} className="w-full h-full object-cover" alt="hero" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-1 left-1.5">
                  <span className="px-1 bg-[#FA4D1E] text-white text-[6px] font-bold rounded">Play Now</span>
                  <p className="text-[7px] font-bold text-white mt-0.5">Vagabond</p>
                </div>
              </div>
              <p className="text-[7px] font-bold text-white">Trending Now</p>
              <div className="flex gap-1 mt-0.5">
                {dramas.slice(0, 3).map((d) => (
                  <img key={d.id} src={d.poster} className="w-8 h-11 rounded object-cover" alt="poster" referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'category-love',
          title: '07. Categories (Love)',
          desc: 'Love Story & Thriller rows',
          action: () => onNavigateToScreen('category-love'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 text-left">
              <p className="text-[8px] font-bold text-white mb-1">Love Story</p>
              <div className="flex gap-1 mb-2">
                {dramas.filter(d => d.category === 'Love Story').slice(0, 2).map((d) => (
                  <div key={d.id} className="w-12">
                    <img src={d.poster} className="w-12 h-14 rounded object-cover" alt="poster" referrerPolicy="no-referrer" />
                    <p className="text-[6px] text-white truncate mt-0.5">{d.title}</p>
                  </div>
                ))}
              </div>
              <p className="text-[8px] font-bold text-white mb-1">Thriller</p>
              <div className="flex gap-1">
                {dramas.filter(d => d.category === 'Thriller').slice(0, 2).map((d) => (
                  <img key={d.id} src={d.poster} className="w-12 h-12 rounded object-cover" alt="poster" referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'category-thriller',
          title: '08. Categories (Thriller)',
          desc: 'Genre shelves & badges',
          action: () => onNavigateToScreen('category-thriller'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 text-left">
              <div className="flex gap-1 mb-1.5">
                <span className="px-1.5 py-0.5 rounded bg-[#FA4D1E] text-white text-[6px] font-bold">Love Story</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 text-[6px]">Thriller</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {dramas.slice(2, 6).map((d) => (
                  <div key={d.id} className="relative">
                    <img src={d.poster} className="w-full h-11 rounded object-cover" alt="poster" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-0.5 left-0.5 text-[5px] bg-[#FA4D1E] text-white px-0.5 rounded">Free</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'favorites-empty',
          title: '09. Favorites (Empty)',
          desc: 'Film reel + illustration',
          action: () => onNavigateToScreen('favorites-empty'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2.5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A26] border border-white/10 flex items-center justify-center relative mb-2">
                <Film className="w-5 h-5 text-slate-500" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FA4D1E] text-white text-[8px] font-bold flex items-center justify-center">+</div>
              </div>
              <p className="text-[7px] font-bold text-white">You can add shows from the Gallery</p>
              <div className="mt-2 w-full py-1 bg-[#FA4D1E] text-white text-[7px] font-bold rounded-full">
                Watch the Series
              </div>
            </div>
          ),
        },
        {
          id: 'favorites-list',
          title: '10. Favorites (Saved)',
          desc: 'Bookmarked series list',
          action: () => onNavigateToScreen('favorites'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 text-left">
              <div className="flex gap-1 mb-1 bg-[#161622] p-0.5 rounded">
                <span className="flex-1 py-0.5 bg-[#FA4D1E] text-white text-[6px] font-bold text-center rounded">Favorites</span>
                <span className="flex-1 py-0.5 text-slate-400 text-[6px] text-center">Watch History</span>
              </div>
              <div className="space-y-1">
                {dramas.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center gap-1 p-1 bg-white/5 rounded">
                    <img src={d.poster} className="w-5 h-7 rounded object-cover" alt="poster" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[6px] font-bold text-white truncate">{d.title}</p>
                      <p className="text-[5px] text-[#FA4D1E]">{d.freeEpisodesCount} eps free</p>
                    </div>
                    <span className="w-4 h-4 rounded-full bg-[#FA4D1E] text-white text-[6px] flex items-center justify-center">▶</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ],
    },
    {
      rowTitle: 'Row 3: Vertical Drama Player, Episode Picker & Profile',
      screens: [
        {
          id: 'foryou-play',
          title: '11. Vertical Player (Feed)',
          desc: 'Actress still & action rail',
          action: () => onNavigateToScreen('foryou'),
          preview: (
            <div className="w-full h-full relative overflow-hidden bg-black flex flex-col justify-between p-2">
              <img src={actressVagabond} className="absolute inset-0 w-full h-full object-cover" alt="player" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
              <div className="relative z-10 text-[8px] font-bold text-white">Short<span className="text-[#FA4D1E]">Flix</span></div>
              <div className="relative z-10 flex justify-between items-end">
                <div className="max-w-[70%]">
                  <p className="text-[7px] font-bold text-white">Vagabond - Thrilling Series</p>
                  <div className="mt-1 py-0.5 px-2 bg-[#FA4D1E] text-white text-[6px] font-bold rounded-full text-center">
                    Watch 9 episodes free
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-[7px] text-white items-center">
                  <span>❤️</span>
                  <span>📑</span>
                  <span>💬</span>
                  <span>↗️</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'episodes-drawer',
          title: '12. Episode Selector',
          desc: 'Episode bottom sheet (Screen 12)',
          action: () => onNavigateToScreen('episodes'),
          preview: (
            <div className="w-full h-full bg-[#12121A] p-2 flex flex-col justify-between text-left">
              <div>
                <div className="flex gap-1 mb-1">
                  <img src={featured.poster} className="w-5 h-7 rounded object-cover" alt="thumb" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-[7px] font-bold text-white">True Beauty</p>
                    <span className="text-[5px] bg-[#FA4D1E] text-white px-1 rounded">10 eps free</span>
                  </div>
                </div>
                <div className="flex gap-0.5 my-1">
                  <span className="px-1 py-0.5 bg-[#FA4D1E] text-white text-[5px] rounded">1-15</span>
                  <span className="px-1 py-0.5 bg-white/10 text-slate-400 text-[5px] rounded">16-30</span>
                </div>
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={`h-3.5 rounded flex items-center justify-center text-[6px] font-bold ${i < 5 ? 'bg-[#FA4D1E] text-white' : 'bg-white/10 text-slate-400'}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[6px] text-amber-300">28 Coin</div>
            </div>
          ),
        },
        {
          id: 'player-paused',
          title: '13. Paused State',
          desc: 'Actor still & orange pause button',
          action: () => onNavigateToScreen('foryou'),
          preview: (
            <div className="w-full h-full relative bg-black flex flex-col justify-between p-2">
              <img src={actorVagabond} className="absolute inset-0 w-full h-full object-cover" alt="bg" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 text-[7px] font-bold text-white">&lt; Vagabond - Thrilling Series</div>
              <div className="relative z-10 self-center w-8 h-8 rounded-full bg-[#FA4D1E] flex items-center justify-center text-white shadow-lg">
                <Pause className="w-3.5 h-3.5 fill-white stroke-white" />
              </div>
              <div className="relative z-10 w-full h-0.5 bg-[#FA4D1E]" />
            </div>
          ),
        },
        {
          id: 'profile',
          title: '14. Profile View',
          desc: 'Avatar, coin card & menu',
          action: () => onNavigateToScreen('profile'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 flex flex-col justify-between text-left">
              <div className="flex flex-col items-center text-center">
                <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-[#FA4D1E]" alt="avatar" referrerPolicy="no-referrer" />
                <p className="text-[7px] font-bold text-white mt-1">{user.name}</p>
              </div>
              <div className="p-1 rounded bg-[#151520] border border-white/5 text-[6px] text-white">
                <p className="font-bold">Coin (270)</p>
                <div className="mt-1 py-0.5 bg-[#FA4D1E] text-center rounded font-bold">Get Coin</div>
              </div>
              <div className="space-y-0.5 text-[6px] text-slate-300">
                <div className="p-1 bg-white/5 rounded">Settings &gt;</div>
                <div className="p-1 bg-white/5 rounded">VIP &gt;</div>
              </div>
            </div>
          ),
        },
        {
          id: 'settings',
          title: '15. Settings',
          desc: 'Options list matching Screen 15',
          action: () => onNavigateToScreen('settings'),
          preview: (
            <div className="w-full h-full bg-[#12121A] p-2 text-left space-y-1">
              <p className="text-[8px] font-bold text-white mb-1">&lt; Settings</p>
              <div className="p-1 bg-[#1A1A26] rounded text-[6px] text-slate-300">Subscriptions &amp; plans &gt;</div>
              <div className="p-1 bg-[#1A1A26] rounded text-[6px] text-slate-300">App icon &gt;</div>
              <div className="p-1 bg-[#1A1A26] rounded text-[6px] text-slate-300">Invitation code &gt;</div>
              <div className="p-1 bg-[#1A1A26] rounded text-[6px] text-slate-300">Clear cache &gt;</div>
              <div className="p-1 bg-[#1A1A26] rounded text-[6px] text-slate-300">Language: English &gt;</div>
            </div>
          ),
        },
      ],
    },
    {
      rowTitle: 'Row 4: Subscriptions, Coin Store & Brand Outro',
      screens: [
        {
          id: 'favorites-alt',
          title: '16. History View',
          desc: 'Session resumption tracking',
          action: () => onNavigateToScreen('history'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 text-left">
              <p className="text-[7px] font-bold text-slate-300 mb-1">Watch History</p>
              <div className="p-1 bg-white/5 rounded flex gap-1 items-center">
                <img src={featured.poster} className="w-5 h-7 rounded object-cover" alt="poster" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <p className="text-[6px] font-bold text-white truncate">Love Translated</p>
                  <p className="text-[5px] text-[#FA4D1E]">9 eps free</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'subscription',
          title: '17. Subscription Plans',
          desc: 'Free vs Premium Unlimited ($30)',
          action: () => onNavigateToScreen('subscription'),
          preview: (
            <div className="w-full h-full bg-[#12121A] p-2 text-left flex flex-col justify-between">
              <div>
                <p className="text-[8px] font-bold text-white mb-1">&lt; Settings</p>
                <div className="flex gap-0.5 bg-[#1A1A26] p-0.5 rounded mb-1">
                  <span className="flex-1 py-0.5 bg-[#FA4D1E] text-white text-[5px] font-bold text-center rounded">Monthly</span>
                  <span className="flex-1 py-0.5 text-slate-400 text-[5px] text-center">Yearly</span>
                </div>
                <div className="p-1 bg-[#1A1A26] rounded mb-1">
                  <p className="text-[6px] font-bold text-white">Free Plan</p>
                  <div className="w-full py-0.5 bg-[#FA4D1E] text-center text-[5px] font-bold rounded-full text-white mt-0.5">Get Started</div>
                </div>
                <div className="p-1 bg-[#1A1A26] rounded">
                  <p className="text-[6px] font-bold text-white">Premium Plan ($30)</p>
                  <div className="w-full py-0.5 bg-[#FA4D1E] text-center text-[5px] font-bold rounded-full text-white mt-0.5">Get Started</div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'coins',
          title: '18. Get Coins for Free',
          desc: 'Balance, streaks & watch time',
          action: () => onNavigateToScreen('coins'),
          preview: (
            <div className="w-full h-full bg-[#0C0C10] p-2 text-left flex flex-col justify-between">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#C2410C] to-[#F97316] text-white">
                <p className="text-[5px]">Your Coin Balance</p>
                <p className="text-[9px] font-black">270 Coin</p>
              </div>
              <div className="flex gap-0.5">
                {[10, 20, 30, 40, 50, 70].map((n, i) => (
                  <div key={i} className="flex-1 py-0.5 rounded bg-white/5 text-center text-[5px] text-amber-300">
                    +{n}
                  </div>
                ))}
              </div>
              <div className="w-full py-1 bg-[#FA4D1E] text-center text-[6px] font-bold rounded-full text-white">
                Get Free Coins
              </div>
            </div>
          ),
        },
        {
          id: 'foryou-vertical',
          title: '19. Video Player Stream',
          desc: 'Vertical drama episode view',
          action: () => onNavigateToScreen('foryou'),
          preview: (
            <div className="w-full h-full relative overflow-hidden bg-black flex flex-col justify-end p-2">
              <img src={actressVagabond} className="absolute inset-0 w-full h-full object-cover" alt="bg" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="relative z-10">
                <p className="text-[7px] font-bold text-white">Vagabond</p>
                <div className="w-full h-0.5 bg-[#FA4D1E] mt-0.5" />
              </div>
            </div>
          ),
        },
        {
          id: 'brand-splash',
          title: '20. Brand Outro',
          desc: 'ShortFlix signature styling',
          action: () => onNavigateToScreen('splash'),
          preview: (
            <div className="w-full h-full bg-gradient-to-b from-[#1C0D00] to-black flex items-center justify-center p-3">
              <span className="text-lg font-black text-white font-['Bricolage_Grotesque']">
                Short<span className="text-[#FA4D1E]">Flix</span>
              </span>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FA4D1E]/20 text-[#FA4D1E] text-xs font-bold">
              Final UI Design N. 11
            </span>
            <span className="text-xs text-slate-400">· 20 Mobile Screens (4 × 5 Grid)</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 font-['Bricolage_Grotesque']">
            ShortFlix UI Design System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Exact match to the provided Figma artboard. Tap any screen to test its live functional state.
          </p>
        </div>

        <button
          onClick={() => onNavigateToScreen('home')}
          className="px-4 py-2 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white text-xs font-bold shadow-md shadow-[#FA4D1E]/40 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Test Interactive App
        </button>
      </div>

      {screenRows.map((row, rIdx) => (
        <div key={rIdx} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FA4D1E]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              {row.rowTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {row.screens.map((screen) => (
              <div
                key={screen.id}
                onClick={screen.action}
                className="group relative bg-[#12121A] hover:bg-[#181824] border border-white/10 hover:border-[#FA4D1E] rounded-2xl p-2.5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#FA4D1E]/20 flex flex-col"
              >
                {/* Phone mockup container */}
                <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black mb-2">
                  {/* Speaker Notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full z-20" />

                  {/* Screen Content Preview */}
                  {screen.preview}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold backdrop-blur-[2px]">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Open</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">
                      {screen.title}
                    </h4>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {screen.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
