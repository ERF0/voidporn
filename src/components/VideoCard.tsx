import { useState, useRef, type MouseEvent } from 'react';
import type { Video } from '@/types';
import { formatDuration, formatViews, formatTimeAgo, getBadgeStyles } from '@/utils/formatters';
import { PlayIcon, MoreVerticalIcon, HeartIcon, AlertIcon } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoCardProps {
  video: Video;
  index: number;
  onPlay: (video: Video) => void;
  onFavorite?: (videoId: string) => void;
  onReport?: (videoId: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'sponsored';
}

export function VideoCard({
  video,
  index,
  onPlay,
  onFavorite,
  onReport,
  isFavorite = false,
  variant = 'default',
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePlay = () => {
    if (video.status === 'published') {
      onPlay(video);
    }
  };

  const handleFavorite = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onFavorite?.(video.id);
  };

  const handleReport = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onReport?.(video.id);
  };

  // Determine card opacity based on status
  const getCardOpacity = () => {
    switch (video.status) {
      case 'published':
        return 'opacity-100';
      case 'processing':
        return 'opacity-75';
      case 'discovered':
        return 'opacity-60';
      case 'failed':
        return 'opacity-50';
      default:
        return 'opacity-100';
    }
  };

  // Status overlay for non-published videos
  const renderStatusOverlay = () => {
    if (video.status === 'published') return null;

    return (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
        <div className="text-center">
          {video.status === 'processing' && (
            <>
              <div className="w-24 h-1 bg-vp-surface rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-vp-red rounded-full transition-all duration-500"
                  style={{ width: `${video.progress || 0}%` }}
                />
              </div>
              <span className="text-xs text-vp-text-secondary">Processing...</span>
              <span className="text-[10px] text-vp-text-muted block mt-1">
                {video.progress || 0}%
              </span>
            </>
          )}
          {video.status === 'discovered' && (
            <>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-vp-orange rounded-full animate-pulse" />
                <span className="text-xs text-vp-text-secondary">Discovered</span>
              </div>
              {video.eta && (
                <span className="text-[10px] text-vp-orange">
                  Ready in ~{video.eta}m
                </span>
              )}
            </>
          )}
          {video.status === 'failed' && (
            <span className="text-xs text-red-500">Processing Failed</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative group cursor-pointer
        animate-fade-in-up
        transition-all duration-300 ease-smooth
        ${getCardOpacity()}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl
          transition-all duration-300 ease-smooth
          ${isHovered ? 'transform -translate-y-2 shadow-elevated' : 'shadow-card'}
          ${variant === 'sponsored' ? 'ring-1 ring-vp-red/30' : ''}
        `}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-vp-surface">
          {/* Skeleton/Shimmer while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-vp-surface via-vp-surface-light to-vp-surface animate-shimmer" />
          )}
          
          {/* Thumbnail Image */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`
              w-full h-full object-cover
              transition-all duration-400 ease-smooth
              ${isHovered ? 'scale-105' : 'scale-100'}
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Overlay */}
          <div
            className={`
              absolute inset-0 bg-black/30 flex items-center justify-center
              transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <div
              className={`
                w-12 h-12 rounded-full bg-vp-red/90
                flex items-center justify-center
                transition-all duration-200 ease-elastic
                ${isHovered ? 'scale-100' : 'scale-0'}
              `}
            >
              <PlayIcon size={20} className="text-white ml-0.5" />
            </div>
          </div>

          {/* Status Overlay */}
          {renderStatusOverlay()}

          {/* Badge Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-1.5">
              {video.badges.map((badge) => (
                <span key={badge} className={getBadgeStyles(badge)}>
                  {badge}
                </span>
              ))}
              {video.duration > 0 && (
                <span className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-sm ml-auto">
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>
          </div>

          {/* Sponsored Badge */}
          {variant === 'sponsored' && (
            <div className="absolute top-2 right-2">
              <span className="bg-vp-red/90 text-white text-[10px] px-2 py-0.5 rounded-full">
                Sponsored
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-2.5 px-0.5">
        {/* Title */}
        <h3 className="text-sm font-medium text-vp-text leading-tight line-clamp-2 group-hover:text-white transition-colors">
          {video.title}
        </h3>

        {/* Author & Stats Row */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-vp-text-secondary truncate">
            {video.author}
          </span>
          <div className="flex items-center gap-2 text-xs text-vp-text-muted">
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-vp-text-muted uppercase tracking-wide">
            {video.category}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 rounded-full hover:bg-vp-surface transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVerticalIcon size={14} className="text-vp-text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-vp-surface border-vp-surface-light">
              <DropdownMenuItem
                onClick={handleFavorite}
                className="text-vp-text hover:bg-vp-surface-light focus:bg-vp-surface-light"
              >
                <HeartIcon 
                  size={16} 
                  className={`mr-2 ${isFavorite ? 'fill-vp-red text-vp-red' : ''}`} 
                />
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleReport}
                className="text-red-400 hover:bg-vp-surface-light focus:bg-vp-surface-light"
              >
                <AlertIcon size={16} className="mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export function VideoCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-vp-surface">
        <div className="absolute inset-0 bg-gradient-to-r from-vp-surface via-vp-surface-light to-vp-surface animate-shimmer" />
      </div>
      <div className="mt-2.5 space-y-2">
        <div className="h-4 bg-vp-surface rounded w-3/4" />
        <div className="h-3 bg-vp-surface rounded w-1/2" />
        <div className="h-3 bg-vp-surface rounded w-1/3" />
      </div>
    </div>
  );
}
