import { useState } from 'react';
import { VideoGrid } from '@/components/VideoGrid';
import { HeartIcon, GridIcon, ListIcon } from '@/components/icons';
import { mockVideos } from '@/data/mockVideos';
import type { Video } from '@/types';

export function Favorites() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Video[]>(mockVideos.slice(0, 6));

  const handlePlay = (video: Video) => {
    console.log('Play video:', video);
  };

  const handleRemoveFavorite = (videoId: string) => {
    setFavorites(prev => prev.filter(v => v.id !== videoId));
  };

  return (
    <div className="min-h-screen bg-vp-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-vp-black/90 backdrop-blur-xl border-b border-vp-surface-light">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vp-red/20 flex items-center justify-center">
                <HeartIcon size={20} className="text-vp-red" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-vp-text">Favorites</h1>
                <p className="text-sm text-vp-text-secondary mt-0.5">
                  {favorites.length} saved videos
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${viewMode === 'grid' 
                    ? 'bg-vp-red/20 text-vp-red' 
                    : 'text-vp-text-muted hover:bg-vp-surface'
                  }
                `}
              >
                <GridIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${viewMode === 'list' 
                    ? 'bg-vp-red/20 text-vp-red' 
                    : 'text-vp-text-muted hover:bg-vp-surface'
                  }
                `}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {favorites.length > 0 ? (
          <VideoGrid
            videos={favorites}
            onPlay={handlePlay}
            onFavorite={handleRemoveFavorite}
            hasMore={false}
            variant="feed"
          />
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-vp-surface flex items-center justify-center">
              <HeartIcon size={40} className="text-vp-text-muted" />
            </div>
            <h3 className="text-xl font-medium text-vp-text mb-2">
              No favorites yet
            </h3>
            <p className="text-sm text-vp-text-secondary max-w-xs mx-auto">
              Save videos you love by tapping the heart icon. They'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
