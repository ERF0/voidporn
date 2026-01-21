import { useState, useCallback, useEffect } from 'react';
import type { Video } from '@/types';
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { mockVideos, processingVideos } from '@/data/mockVideos';
import { SearchIcon } from '@/components/icons';

interface VideoGridProps {
  videos?: Video[];
  onPlay: (video: Video) => void;
  onFavorite?: (videoId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  variant?: 'feed' | 'category' | 'search';
}

const AD_FREQUENCY = 10; // Show ad every N videos

export function VideoGrid({
  videos = [],
  onPlay,
  onFavorite,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  variant = 'feed',
}: VideoGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>(videos);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize with mock data if no videos provided
  useEffect(() => {
    if (videos.length === 0) {
      const allVideos = [...mockVideos, ...processingVideos];
      setDisplayedVideos(allVideos.slice(0, 12));
    } else {
      setDisplayedVideos(videos);
    }
  }, [videos]);

  const handleLoadMore = useCallback(async () => {
    if (onLoadMore) {
      onLoadMore();
    } else {
      // Simulate loading more videos
      const allVideos = [...mockVideos, ...processingVideos];
      const startIndex = currentPage * 12;
      const endIndex = startIndex + 12;
      const moreVideos = allVideos.slice(startIndex % allVideos.length, endIndex % allVideos.length);
      
      // Add some delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setDisplayedVideos(prev => [...prev, ...moreVideos]);
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, onLoadMore]);

  const { sentinelRef, isLoading: loadingMore } = useInfiniteScroll({
    hasMore,
    onLoadMore: handleLoadMore,
    threshold: 0.1,
    rootMargin: '100px',
  });

  const handleFavorite = (videoId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
    onFavorite?.(videoId);
  };

  // Insert sponsored cards
  const getVideosWithAds = () => {
    const videosWithAds: (Video & { isAd?: boolean })[] = [];
    
    displayedVideos.forEach((video, index) => {
      videosWithAds.push(video);
      
      // Insert sponsored card every N videos
      if ((index + 1) % AD_FREQUENCY === 0 && variant === 'feed') {
        const adVideo: Video & { isAd?: boolean } = {
          ...mockVideos[index % mockVideos.length],
          id: `ad-${index}`,
          title: 'Featured Content - Discover More',
          isAd: true,
        };
        videosWithAds.push(adVideo);
      }
    });
    
    return videosWithAds;
  };

  const videosToDisplay = getVideosWithAds();

  return (
    <div className="w-full">
      {/* Video Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {videosToDisplay.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onPlay={onPlay}
            onFavorite={handleFavorite}
            isFavorite={favorites.has(video.id)}
            variant={video.isAd ? 'sponsored' : 'default'}
          />
        ))}
        
        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <VideoCardSkeleton key={`skeleton-${index}`} index={index} />
          ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-20 flex items-center justify-center"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-vp-text-secondary">
              <div className="w-5 h-5 border-2 border-vp-red border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* End of content indicator */}
      {!hasMore && displayedVideos.length > 0 && (
        <div className="h-20 flex items-center justify-center">
          <span className="text-sm text-vp-text-muted">
            You've reached the void's end
          </span>
        </div>
      )}

      {/* Empty state */}
      {displayedVideos.length === 0 && !isLoading && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vp-surface flex items-center justify-center">
            <SearchIcon size={32} className="text-vp-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-vp-text">No videos found</h3>
          <p className="text-sm text-vp-text-secondary mt-1">
            Try adjusting your search or explore different categories
          </p>
        </div>
      )}
    </div>
  );
}
