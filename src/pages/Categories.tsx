import { useState } from 'react';
import { VideoGrid } from '@/components/VideoGrid';
import { categories } from '@/data/mockVideos';
import { GridIcon, ListIcon, FilterIcon } from '@/components/icons';
import { mockVideos } from '@/data/mockVideos';
import type { Video } from '@/types';

export function Categories() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handlePlay = (video: Video) => {
    console.log('Play video:', video);
  };

  // Get videos for selected category
  const getFilteredVideos = () => {
    if (!selectedCategory) return [];
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return [];
    return mockVideos.filter(video => video.category === category.name);
  };

  return (
    <div className="min-h-screen bg-vp-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-vp-black/90 backdrop-blur-xl border-b border-vp-surface-light">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-vp-text">Categories</h1>
              <p className="text-sm text-vp-text-secondary mt-0.5">
                Explore by genre
              </p>
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

          {/* Filter Chips */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vp-red/20 text-vp-red text-sm font-medium whitespace-nowrap">
              <FilterIcon size={14} />
              All Categories
            </button>
            <button className="px-3 py-1.5 rounded-full bg-vp-surface text-vp-text-secondary text-sm whitespace-nowrap hover:bg-vp-surface-light transition-colors">
              Cinematic
            </button>
            <button className="px-3 py-1.5 rounded-full bg-vp-surface text-vp-text-secondary text-sm whitespace-nowrap hover:bg-vp-surface-light transition-colors">
              Nature
            </button>
            <button className="px-3 py-1.5 rounded-full bg-vp-surface text-vp-text-secondary text-sm whitespace-nowrap hover:bg-vp-surface-light transition-colors">
              Urban
            </button>
            <button className="px-3 py-1.5 rounded-full bg-vp-surface text-vp-text-secondary text-sm whitespace-nowrap hover:bg-vp-surface-light transition-colors">
              Abstract
            </button>
            <button className="px-3 py-1.5 rounded-full bg-vp-surface text-vp-text-secondary text-sm whitespace-nowrap hover:bg-vp-surface-light transition-colors">
              Sci-Fi
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {!selectedCategory && (
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="
                  group relative aspect-[4/3] rounded-xl overflow-hidden
                  bg-vp-surface
                  transition-all duration-300 ease-smooth
                  hover:scale-[1.02] hover:shadow-elevated
                  animate-fade-in-up
                "
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Image */}
                <img
                  src={category.thumbnail}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <h3 className="text-sm font-semibold text-white text-left">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5 text-left">
                    {category.videoCount} videos
                  </p>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-vp-red/10" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Category Videos */}
      {selectedCategory && (
        <div className="px-4 py-6">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-8 h-8 rounded-full bg-vp-surface flex items-center justify-center hover:bg-vp-surface-light transition-colors"
              >
                ←
              </button>
              <div>
                <h2 className="text-lg font-semibold text-vp-text">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-vp-text-secondary">
                  {getFilteredVideos().length} videos
                </p>
              </div>
            </div>
          </div>

          <VideoGrid
            videos={getFilteredVideos()}
            onPlay={handlePlay}
            hasMore={false}
            variant="category"
          />
        </div>
      )}
    </div>
  );
}
