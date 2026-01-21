import { useState, useEffect, useRef, useCallback } from 'react';
import type { Video } from '@/types';
import { formatDuration } from '@/utils/formatters';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
  VolumeMuteIcon,
  MaximizeIcon,
  MinimizeIcon,
  SettingsIcon,
  ShareIcon,
  XIcon,
  HeartIcon,
} from '@/components/icons';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isMiniPlayer: boolean;
  queue: Video[];
  onClose: () => void;
  onTogglePlay: () => void;
  onToggleMiniPlayer: () => void;
  onSeek: (time: number) => void;
  onSetVolume: (volume: number) => void;
  onToggleMute: () => void;
  onSetPlaybackRate: (rate: number) => void;
  onPlayNext: () => void;
  onAddToQueue: (video: Video) => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const AUTOPLAY_DELAY = 5; // seconds

export function VideoPlayer({
  video,
  isOpen,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  isMiniPlayer,
  queue,
  onClose,
  onTogglePlay,
  onToggleMiniPlayer,
  onSeek,
  onSetVolume,
  onToggleMute,
  onSetPlaybackRate,
  onPlayNext,
  onAddToQueue,
}: VideoPlayerProps) {
  const [showControls, setShowControls] = useState(true);
  const [autoplayCountdown, setAutoplayCountdown] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Autoplay countdown
  useEffect(() => {
    if (queue.length > 0 && currentTime >= duration - 1 && duration > 0) {
      setAutoplayCountdown(AUTOPLAY_DELAY);
    }
  }, [currentTime, duration, queue.length]);

  useEffect(() => {
    if (autoplayCountdown !== null && autoplayCountdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setAutoplayCountdown(prev => {
          if (prev === null || prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            onPlayNext();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [autoplayCountdown, onPlayNext]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    onSetVolume(value[0] / 100);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (e) {
        console.error('Fullscreen not supported');
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (e) {
        console.error('Exit fullscreen failed');
      }
    }
  };

  if (!isOpen || !video) return null;

  // Mini player mode
  if (isMiniPlayer) {
    return (
      <div
        className="
          fixed bottom-20 right-4 z-50
          w-40 sm:w-48 aspect-video
          rounded-lg overflow-hidden
          bg-vp-surface shadow-mini-player
          border border-vp-surface-light
          animate-scale-in
        "
        onClick={onToggleMiniPlayer}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="
            absolute top-1 right-1 z-10
            w-6 h-6 rounded-full bg-black/60
            flex items-center justify-center
            hover:bg-black/80 transition-colors
          "
        >
          <XIcon size={14} className="text-white" />
        </button>

        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="w-10 h-10 rounded-full bg-vp-red/90 flex items-center justify-center"
          >
            {isPlaying ? (
              <PauseIcon size={16} className="text-white" />
            ) : (
              <PlayIcon size={16} className="text-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-xs text-white truncate">{video.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        bg-black/95 backdrop-blur-sm
        flex items-center justify-center
        animate-fade-in-up
      "
      onMouseMove={handleMouseMove}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Main Player Container */}
      <div
        className="
          relative w-full max-w-5xl mx-4
          bg-vp-surface rounded-2xl overflow-hidden
          shadow-modal
          animate-scale-in
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-20
            w-10 h-10 rounded-full bg-black/60
            flex items-center justify-center
            hover:bg-black/80 transition-colors
          "
        >
          <XIcon size={20} className="text-white" />
        </button>

        {/* Mini player toggle */}
        <button
          onClick={onToggleMiniPlayer}
          className="
            absolute top-4 right-16 z-20
            w-10 h-10 rounded-full bg-black/60
            flex items-center justify-center
            hover:bg-black/80 transition-colors
          "
        >
          <MinimizeIcon size={18} className="text-white" />
        </button>

        {/* Video Area */}
        <div className="relative aspect-video bg-black">
          {/* Placeholder for actual video */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />

          {/* Processing overlay */}
          {video.status === 'processing' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border-2 border-vp-blue border-t-transparent rounded-full animate-spin" />
                  <span className="text-lg font-medium">Processing</span>
                </div>
                <div className="w-48 h-2 bg-vp-surface rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-vp-red rounded-full transition-all duration-500"
                    style={{ width: `${video.progress || 0}%` }}
                  />
                </div>
                <p className="text-sm text-vp-text-secondary">
                  {video.progress || 0}% complete
                </p>
              </div>
            </div>
          )}

          {/* Discovered overlay */}
          {video.status === 'discovered' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-vp-orange rounded-full animate-pulse" />
                  <span className="text-lg font-medium">Discovered</span>
                </div>
                <p className="text-sm text-vp-text-secondary">
                  {video.eta ? `Ready in ~${video.eta} minutes` : 'Coming soon'}
                </p>
              </div>
            </div>
          )}

          {/* Big Play Button (center) */}
          {video.status === 'published' && !isPlaying && (
            <button
              onClick={onTogglePlay}
              className="
                absolute inset-0 flex items-center justify-center
                group
              "
            >
              <div
                className="
                  w-20 h-20 rounded-full bg-vp-red/80
                  flex items-center justify-center
                  transition-all duration-200 ease-elastic
                  group-hover:scale-110 group-hover:bg-vp-red
                "
              >
                <PlayIcon size={40} className="text-white ml-1" />
              </div>
            </button>
          )}

          {/* Controls Overlay */}
          <div
            className={`
              absolute bottom-0 left-0 right-0
              bg-gradient-to-t from-black/80 via-black/40 to-transparent
              p-4 transition-opacity duration-300
              ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {/* Progress Bar */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-xs text-vp-text-muted">
                <span>{formatDuration(Math.floor(currentTime))}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={onTogglePlay}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <PauseIcon size={20} className="text-white" />
                  ) : (
                    <PlayIcon size={20} className="text-white ml-0.5" />
                  )}
                </button>

                {/* Skip Back */}
                <button
                  onClick={() => onSeek(currentTime - 10)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <SkipBackIcon size={16} className="text-white" />
                </button>

                {/* Skip Forward */}
                <button
                  onClick={() => onSeek(currentTime + 10)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <SkipForwardIcon size={16} className="text-white" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                  <button
                    onClick={onToggleMute}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeMuteIcon size={16} className="text-white" />
                    ) : (
                      <VolumeIcon size={16} className="text-white" />
                    )}
                  </button>
                  <div className="w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Playback Rate */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2 py-1 text-xs font-medium bg-white/10 rounded hover:bg-white/20 transition-colors">
                      {playbackRate}x
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-vp-surface border-vp-surface-light">
                    {PLAYBACK_RATES.map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => onSetPlaybackRate(rate)}
                        className={`
                          text-vp-text hover:bg-vp-surface-light
                          ${rate === playbackRate ? 'bg-vp-red/20 text-vp-red' : ''}
                        `}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Settings */}
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <SettingsIcon size={16} className="text-white" />
                </button>

                {/* Share */}
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ShareIcon size={16} className="text-white" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <MaximizeIcon size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & Actions */}
        <div className="p-4 bg-vp-surface">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-vp-text truncate">
                {video.title}
              </h2>
              <p className="text-sm text-vp-text-secondary mt-1">
                {video.author} • {video.views.toLocaleString()} views
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  transition-all duration-200
                  ${isFavorite 
                    ? 'bg-vp-red text-white' 
                    : 'bg-vp-surface-light text-vp-text hover:bg-vp-surface'
                  }
                `}
              >
                <HeartIcon 
                  size={16} 
                  className={isFavorite ? 'fill-current' : ''} 
                />
                <span className="text-sm">Favorite</span>
              </button>
              
              <button
                onClick={() => onAddToQueue(video)}
                className="px-3 py-1.5 rounded-full bg-vp-surface-light text-vp-text hover:bg-vp-surface transition-colors text-sm"
              >
                Add to Queue
              </button>
            </div>
          </div>
        </div>

        {/* Next Up Section */}
        {queue.length > 0 && (
          <div className="p-4 border-t border-vp-surface-light">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-vp-text">Next Up</h3>
              <button
                onClick={() => setShowQueue(!showQueue)}
                className="text-xs text-vp-text-secondary hover:text-vp-text"
              >
                {showQueue ? 'Hide' : 'Show'} queue ({queue.length})
              </button>
            </div>
            
            {/* Autoplay countdown */}
            {autoplayCountdown !== null && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-vp-surface-light rounded-lg">
                <span className="text-xs text-vp-text-secondary">
                  Playing next in
                </span>
                <span className="text-sm font-medium text-vp-red">
                  {autoplayCountdown}s
                </span>
                <button
                  onClick={() => {
                    setAutoplayCountdown(null);
                    if (countdownIntervalRef.current) {
                      clearInterval(countdownIntervalRef.current);
                    }
                  }}
                  className="ml-auto text-xs text-vp-text hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Queue preview */}
            {showQueue && (
              <div className="grid grid-cols-3 gap-2">
                {queue.slice(0, 3).map((nextVideo, index) => (
                  <button
                    key={nextVideo.id}
                    onClick={() => {
                      if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                      }
                      setAutoplayCountdown(null);
                      // This would trigger playing the next video
                    }}
                    className="group relative aspect-video rounded-lg overflow-hidden"
                  >
                    <img
                      src={nextVideo.thumbnail}
                      alt={nextVideo.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-1 left-1 right-1">
                      <p className="text-[10px] text-white truncate">
                        {nextVideo.title}
                      </p>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-vp-red flex items-center justify-center">
                        <span className="text-[10px] font-medium text-white">
                          {autoplayCountdown || AUTOPLAY_DELAY}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
