import { useState, useCallback } from 'react';
import { VideoGrid } from '@/components/VideoGrid';
import { VideoPlayer } from '@/components/VideoPlayer';
import { usePlayer } from '@/hooks/usePlayer';
import { mockVideos } from '@/data/mockVideos';
import type { Video } from '@/types';

export function Home() {
  const {
    currentVideo,
    playerState,
    queue,
    showPlayer,
    playVideo,
    closePlayer,
    togglePlay,
    toggleMiniPlayer,
    setVolume,
    toggleMute,
    setPlaybackRate,
    seek,
    playNext,
    addToQueue,
  } = usePlayer();

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // In a real app, you'd fetch more videos here
    // For now, we'll just stop after simulating a few pages
    if (Math.random() > 0.7) {
      setHasMore(false);
    }
  }, []);

  const handlePlay = (video: Video) => {
    // Set up queue with related videos
    const relatedVideos = mockVideos.filter(v => 
      v.id !== video.id && v.category === video.category
    ).slice(0, 5);
    
    playVideo(video);
    relatedVideos.forEach(v => addToQueue(v));
  };

  return (
    <div className="min-h-screen bg-vp-black">
      {/* Main Content */}
      <main className="pb-24 md:pb-8">
        {/* Section Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-vp-text">Trending Now</h1>
              <p className="text-sm text-vp-text-secondary mt-0.5">
                What's hot in the void
              </p>
            </div>
            
            {/* Filter chips */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text hover:bg-vp-surface-light transition-colors">
                All
              </button>
              <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
                New
              </button>
              <button className="px-3 py-1.5 rounded-full bg-vp-surface text-sm text-vp-text-secondary hover:bg-vp-surface-light hover:text-vp-text transition-colors">
                Hot
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="px-4">
          <VideoGrid
            onPlay={handlePlay}
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            variant="feed"
          />
        </div>
      </main>

      {/* Video Player Modal */}
      <VideoPlayer
        video={currentVideo}
        isOpen={showPlayer}
        isPlaying={playerState.isPlaying}
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        volume={playerState.volume}
        isMuted={playerState.isMuted}
        playbackRate={playerState.playbackRate}
        isMiniPlayer={playerState.isMiniPlayer}
        queue={queue}
        onClose={closePlayer}
        onTogglePlay={togglePlay}
        onToggleMiniPlayer={toggleMiniPlayer}
        onSeek={seek}
        onSetVolume={setVolume}
        onToggleMute={toggleMute}
        onSetPlaybackRate={setPlaybackRate}
        onPlayNext={playNext}
        onAddToQueue={addToQueue}
      />
    </div>
  );
}
