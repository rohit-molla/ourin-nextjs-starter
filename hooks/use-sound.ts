'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Options for the useSound hook
 */
export interface UseSoundOptions {
  /** Volume level (0-1). Default: 1 */
  volume?: number;
  /** Whether to loop the sound. Default: false */
  loop?: boolean;
  /** Playback rate (0.5-4). Default: 1 */
  playbackRate?: number;
  /** Whether to preload the sound. Default: true */
  preload?: boolean;
  /** Callback when sound finishes playing */
  onEnd?: () => void;
  /** Callback when sound starts playing */
  onPlay?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useSound hook
 */
export interface UseSoundReturn {
  /** Play the sound */
  play: () => void;
  /** Stop the sound */
  stop: () => void;
  /** Pause the sound */
  pause: () => void;
  /** Resume a paused sound */
  resume: () => void;
  /** Whether the sound is currently playing */
  isPlaying: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Set volume (0-1) */
  setVolume: (volume: number) => void;
  /** Set playback rate (0.5-4) */
  setPlaybackRate: (rate: number) => void;
}

/**
 * React hook for playing sounds
 * 
 * @param src - Path to the audio file
 * @param options - Sound options
 * @returns Sound controls and state
 * 
 * @example
 * ```tsx
 * function Button() {
 *   const { play } = useSound('/sounds/click.mp3', { volume: 0.5 });
 *   
 *   return <button onClick={play}>Click me</button>;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function MusicPlayer() {
 *   const { play, pause, isPlaying, duration, currentTime } = useSound('/music.mp3', {
 *     loop: true,
 *     onEnd: () => console.log('Song ended')
 *   });
 *   
 *   return (
 *     <div>
 *       <button onClick={isPlaying ? pause : play}>
 *         {isPlaying ? 'Pause' : 'Play'}
 *       </button>
 *       <span>{currentTime} / {duration}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSound(src: string, options: UseSoundOptions = {}): UseSoundReturn {
  const {
    volume = 1,
    loop = false,
    playbackRate = 1,
    preload = true,
    onEnd,
    onPlay,
    onError,
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.loop = loop;
    audio.playbackRate = playbackRate;
    audio.preload = preload ? 'auto' : 'none';

    // Event handlers
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnd?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsPlaying(false);
      onError?.(new Error(`Failed to load audio: ${src}`));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current = null;
    };
  }, [src, loop, preload]); // Note: not including callbacks to avoid re-creating audio

  // Update volume when option changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Update playback rate when option changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    // Reset to beginning if at end
    if (audioRef.current.ended) {
      audioRef.current.currentTime = 0;
    }
    
    audioRef.current.play().catch((error) => {
      console.warn('Sound playback failed:', error);
    });
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(() => {});
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
  }, []);

  const setPlaybackRateCallback = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = Math.max(0.5, Math.min(4, rate));
  }, []);

  return {
    play,
    stop,
    pause,
    resume,
    isPlaying,
    currentTime,
    duration,
    setVolume,
    setPlaybackRate: setPlaybackRateCallback,
  };
}

/**
 * Simplified hook for quick hover/click sounds
 * Uses Web Audio API - no audio files needed
 * 
 * @example
 * ```tsx
 * function Button() {
 *   const { playHover, playClick } = useSoundEffects();
 *   
 *   return (
 *     <button 
 *       onMouseEnter={playHover}
 *       onClick={playClick}
 *     >
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function useSoundEffects(volume: number = 0.3) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playHover = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);

    gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }, [enabled, getContext, volume]);

  const playClick = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, [enabled, getContext, volume]);

  const playSuccess = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getContext();
    if (!ctx) return;

    [0, 0.1].forEach((delay, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const freq = i === 0 ? 523.25 : 659.25;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15);

      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + 0.15);
    });
  }, [enabled, getContext, volume]);

  return {
    playHover,
    playClick,
    playSuccess,
    enabled,
    setEnabled,
  };
}

export default useSound;
