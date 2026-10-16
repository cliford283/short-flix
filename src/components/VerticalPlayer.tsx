import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Search,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import { Drama, Episode } from '../types';
import { actressVagabond, actorVagabond } from '../data/dramas';

interface VerticalPlayerProps {
  drama: Drama;
  currentEpisodeNumber: number;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onOpenEpisodes: () => void;
  onOpenComments: () => void;
  onNextEpisode: () => void;
  onPrevEpisode: () => void;
  onBack?: () => void;
  onOpenVip: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  isVip: boolean;
}

export const VerticalPlayer: React.FC<VerticalPlayerProps> = ({
  drama,
  currentEpisodeNumber,
  isFavorited,
  onToggleFavorite,
  onOpenEpisodes,
  onOpenComments,
  onNextEpisode,
  onPrevEpisode,
  onBack,
  onOpenVip,
  onOpenSearch,
  onOpenNotifications,
  isVip,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const totalDuration = 105; // 1:45
  const [likesCount, setLikesCount] = useState<number>(124800);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);

  // Derive progress percentage directly from currentTime and totalDuration
  const progress = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  const episodes = Array.isArray(drama?.episodes) ? drama.episodes : [];
  const currentEp: Episode =
    episodes.find((e) => e.number === currentEpisodeNumber) ||
    episodes[0] || {
      id: 1,
      number: currentEpisodeNumber || 1,
      title: `Episode ${currentEpisodeNumber || 1}`,
      duration: '1:45',
      isFree: true,
      coinPrice: 0,
      isUnlocked: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    };

  // Alternates between the actress still and the actor still based on pause or episode
  const activeBackdrop = !isPlaying && drama?.id === 'vagabond'
    ? actorVagabond
    : drama?.id === 'vagabond'
    ? actressVagabond
    : drama?.backdrop || drama?.poster || actressVagabond;

  // Reset time when drama or episode changes
  useEffect(() => {
    setCurrentTime(0);
  }, [drama?.id, currentEpisodeNumber]);

  // Safely keep a ref to the latest onNextEpisode to prevent calling stale or inline functions
  const onNextEpisodeRef = useRef(onNextEpisode);
  useEffect(() => {
    onNextEpisodeRef.current = onNextEpisode;
  }, [onNextEpisode]);

  // Main playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1 * playbackSpeed;
        if (next >= totalDuration) {
          // Defer calling the parent's next episode handler outside the state updater
          setTimeout(() => {
            onNextEpisodeRef.current();
          }, 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setCurrentTime((newPercent / 100) * totalDuration);
  };

  return (
    <div
      onClick={togglePlayPause}
      onDoubleClick={handleDoubleTap}
      className="relative w-full h-full bg-[#050508] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Background Poster/Still matching Screen 11 & 13 */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeBackdrop}
          alt={drama.title}
          className={`w-full h-full object-cover object-top transition-transform duration-700 ${
            isPlaying ? 'scale-105' : 'scale-100 filter brightness-90'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Clean subtle top and bottom gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95 pointer-events-none" />
      </div>

      {/* Visual Progress Bar at the Top Showing Playback Duration */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleSeek(e);
        }}
        className="absolute top-0 left-0 right-0 z-40 px-3.5 pt-2 pb-1 bg-gradient-to-b from-black/90 to-transparent cursor-pointer group"
      >
        <div className="flex items-center justify-between text-[10px] font-mono font-medium text-slate-300 mb-1 px-0.5">
          <span className="tabular-nums font-semibold text-white drop-shadow">
            {formatTime(currentTime)}
          </span>
          <span className="text-[9px] font-bold text-[#FA4D1E] tracking-wider uppercase px-1.5 py-0.5 rounded bg-black/50 border border-white/10">
            Episode {currentEp.number}
          </span>
          <span className="tabular-nums font-semibold text-slate-300 drop-shadow">
            {formatTime(totalDuration)}
          </span>
        </div>

        {/* Visual Progress Line */}
        <div className="relative h-1 w-full bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FA4D1E] to-[#FF7A1A] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(250,77,30,0.9)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Heart Burst Animation */}
      {showHeartBurst && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-ping">
          <Heart className="w-24 h-24 text-[#FA4D1E] fill-[#FA4D1E] filter drop-shadow-[0_0_25px_rgba(250,77,30,0.9)]" />
        </div>
      )}

      {/* Share Toast */}
      {shareToast && (
        <div className="absolute top-18 z-40 px-4 py-2 rounded-full bg-[#FA4D1E] text-xs font-bold text-white shadow-xl animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      {/* Center Orange Pause Button (Matching Screen 13 in user image) */}
      {!isPlaying && (
        <div className="absolute z-20 w-16 h-16 rounded-full bg-[#FA4D1E] flex items-center justify-center text-white shadow-[0_0_30px_rgba(250,77,30,0.6)] animate-scale-in">
          <Pause className="w-7 h-7 fill-white stroke-white" />
        </div>
      )}

      {/* Top Header matching Screen 11 & 13 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-7 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5"
      >
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-1 rounded-full text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold text-white tracking-tight">
                {drama.title} - {drama.subtitle}
              </span>
            </button>
          ) : (
            <span className="text-lg font-extrabold text-white font-['Bricolage_Grotesque'] tracking-tight">
              Short<span className="text-[#FA4D1E]">Flix</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FA4D1E]" />
            </button>
          )}
        </div>
      </div>

      {/* Right Vertical Action Rail matching Screen 11 & 13 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-3.5 bottom-28 z-30 flex flex-col items-center gap-4 text-white"
      >
        {/* Heart / Like */}
        <button
          onClick={handleLikeClick}
          className="flex flex-col items-center gap-0.5 group"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform active:scale-90">
            <Heart
              className={`w-6 h-6 transition-colors ${
                hasLiked
                  ? 'fill-[#FA4D1E] text-[#FA4D1E]'
                  : 'text-white stroke-[2]'
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">
            {(likesCount / 1000).toFixed(1)}k
          </span>
        </button>

        {/* Favorite / Bookmark */}
        <button
          onClick={onToggleFavorite}
          className="flex flex-col items-center gap-0.5 group"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform active:scale-90">
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                isFavorited
                  ? 'fill-[#FA4D1E] text-[#FA4D1E]'
                  : 'text-white stroke-[2]'
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">
            {isFavorited ? 'Saved' : 'Save'}
          </span>
        </button>

        {/* Speed */}
        <button
          onClick={cycleSpeed}
          className="flex flex-col items-center gap-0.5 group"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <span className="text-xs font-bold text-white tracking-tight">
              {playbackSpeed}x
            </span>
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">
            Speed
          </span>
        </button>

        {/* Comments */}
        <button
          onClick={onOpenComments}
          className="flex flex-col items-center gap-0.5 group"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white stroke-[2]" />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">
            456
          </span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5 group"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white stroke-[2]" />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">
            Share
          </span>
        </button>
      </div>

      {/* Bottom Metadata Overlay matching Screen 11 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-3 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent"
      >
        {/* Title */}
        <div className="max-w-[80%]">
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {drama.title} - {drama.subtitle}
          </h2>

          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {drama.description}
          </p>

          {!isDescriptionExpanded ? (
            <button
              onClick={() => setIsDescriptionExpanded(true)}
              className="text-[#FA4D1E] text-[11px] font-semibold mt-0.5 hover:underline"
            >
              See more
            </button>
          ) : (
            <button
              onClick={() => setIsDescriptionExpanded(false)}
              className="text-[#FA4D1E] text-[11px] font-semibold mt-0.5 hover:underline"
            >
              See less
            </button>
          )}
        </div>

        {/* Solid Bright Orange Button: "Watch 9 episodes free" (Screen 11) */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onOpenEpisodes}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#FA4D1E] hover:bg-[#E53D12] text-white text-xs font-bold text-center shadow-lg shadow-[#FA4D1E]/40 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Watch {drama?.freeEpisodesCount ?? 9} episodes free</span>
          </button>
        </div>

        {/* Bottom Orange Progress Scrubber Bar */}
        <div className="mt-3">
          <div
            onClick={handleSeek}
            className="relative h-1 w-full bg-white/20 rounded-full cursor-pointer"
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-[#FA4D1E] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
