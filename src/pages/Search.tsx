import { useState, useRef, useEffect } from 'react';
import { VideoGrid } from '@/components/VideoGrid';
import { SearchIcon, XIcon, TrendingIcon, ClockIcon, TagIcon } from '@/components/icons';
import { searchSuggestions } from '@/data/mockVideos';
import { Input } from '@/components/ui/input';
import type { Video } from '@/types';

interface SearchSuggestion {
  type: 'recent' | 'trending' | 'category';
  label: string;
  value: string;
  count?: number;
}

export function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async () => {
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results
    const mockResults: Video[] = [
      // This would be replaced with actual search results
    ];
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.value);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handlePlay = (video: Video) => {
    // This would integrate with the player
    console.log('Play video:', video);
  };

  // Group suggestions by type
  const groupedSuggestions = searchSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  return (
    <div className="min-h-screen bg-vp-black">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-vp-black/90 backdrop-blur-xl border-b border-vp-surface-light">
        <div className="px-4 py-3">
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-vp-text-muted">
              <SearchIcon size={20} />
            </div>

            {/* Search Input */}
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search the void..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                w-full pl-10 pr-10 py-3
                bg-vp-surface border-vp-surface-light
                text-vp-text placeholder:text-vp-text-muted
                rounded-xl focus:ring-2 focus:ring-vp-red/50
                text-base
              "
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={handleClear}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  w-6 h-6 rounded-full bg-vp-surface-light
                  flex items-center justify-center
                  text-vp-text-muted hover:text-vp-text
                  transition-colors
                "
              >
                <XIcon size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button className="px-4 py-1.5 rounded-full bg-vp-red/20 text-vp-red text-sm font-medium whitespace-nowrap">
            All
          </button>
          <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
            Videos
          </button>
          <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
            Categories
          </button>
          <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
            Tags
          </button>
          <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
            Duration
          </button>
          <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
            Quality
          </button>
        </div>
      </div>

      {/* Suggestions or Results */}
      <div className="px-4 py-4">
        {query.length < 2 ? (
          /* Suggestions View */
          <div className="space-y-6">
            {Object.entries(groupedSuggestions).map(([type, suggestions]) => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  {type === 'recent' && <ClockIcon size={16} className="text-vp-text-muted" />}
                  {type === 'trending' && <TrendingIcon size={16} className="text-vp-red" />}
                  {type === 'category' && <TagIcon size={16} className="text-vp-blue" />}
                  <h3 className="text-sm font-medium text-vp-text capitalize">
                    {type === 'recent' ? 'Recent Searches' : type}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.value}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="
                        px-4 py-2 rounded-full
                        bg-vp-surface text-vp-text
                        hover:bg-vp-surface-light hover:text-vp-red
                        transition-all duration-200
                        text-sm
                      "
                    >
                      {suggestion.label}
                      {suggestion.count && (
                        <span className="ml-1.5 text-xs text-vp-text-muted">
                          ({suggestion.count.toLocaleString()})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Search Results View */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-vp-text">
                Results for "{query}"
              </h2>
              {isSearching && (
                <div className="flex items-center gap-2 text-vp-text-secondary">
                  <div className="w-4 h-4 border-2 border-vp-red border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Searching...</span>
                </div>
              )}
            </div>

            <VideoGrid
              videos={searchResults}
              onPlay={handlePlay}
              hasMore={false}
              variant="search"
            />

            {searchResults.length === 0 && !isSearching && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vp-surface flex items-center justify-center">
                  <SearchIcon size={32} className="text-vp-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-vp-text">No results found</h3>
                <p className="text-sm text-vp-text-secondary mt-1">
                  Try a different search term or explore trending content
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
