import { useState, useCallback, useEffect } from 'react';
import type { Video } from '@/types';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isMiniPlayer: boolean;
}

export function usePlayer() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
    isFullscreen: false,
    isMiniPlayer: false,
  });
  const [queue, setQueue] = useState<Video[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);

  const playVideo = useCallback((video: Video, autoPlay = true) => {
    setCurrentVideo(video);
    setPlayerState(prev => ({
      ...prev,
      isPlaying: autoPlay,
      currentTime: 0,
    }));
    setShowPlayer(true);
  }, []);

  const closePlayer = useCallback(() => {
    setShowPlayer(false);
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const toggleMiniPlayer = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isMiniPlayer: !prev.isMiniPlayer }));
  }, []);

  const updateTime = useCallback((time: number) => {
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setPlayerState(prev => ({ 
      ...prev, 
      volume: Math.max(0, Math.min(1, volume)),
      isMuted: volume === 0 
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlayerState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  const seek = useCallback((time: number) => {
    setPlayerState(prev => ({ 
      ...prev, 
      currentTime: Math.max(0, Math.min(prev.duration, time)) 
    }));
  }, []);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const nextVideo = queue[0];
      setQueue(prev => prev.slice(1));
      playVideo(nextVideo);
    }
  }, [queue, playVideo]);

  const addToQueue = useCallback((video: Video) => {
    setQueue(prev => [...prev, video]);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showPlayer) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          seek(playerState.currentTime - 10);
          break;
        case 'ArrowRight':
          seek(playerState.currentTime + 10);
          break;
        case 'ArrowUp':
          setVolume(playerState.volume + 0.1);
          break;
        case 'ArrowDown':
          setVolume(playerState.volume - 0.1);
          break;
        case 'm':
          toggleMute();
          break;
        case 'Escape':
          if (playerState.isMiniPlayer) {
            toggleMiniPlayer();
          } else {
            closePlayer();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showPlayer, playerState, togglePlay, seek, setVolume, toggleMute, closePlayer, toggleMiniPlayer]);

  return {
    currentVideo,
    playerState,
    queue,
    showPlayer,
    playVideo,
    closePlayer,
    togglePlay,
    toggleMiniPlayer,
    updateTime,
    setVolume,
    toggleMute,
    setPlaybackRate,
    seek,
    playNext,
    addToQueue,
  };
}
