'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Volume2, VolumeX } from 'lucide-react';
import { useSoundEffects } from '@/hooks/use-sound';

/**
 * SpotifyModal Component
 * 
 * A floating music button that opens a modal with an embedded Spotify player.
 * Supports playlists, albums, tracks, and podcasts.
 * 
 * @example
 * ```tsx
 * // In your page component
 * <SpotifyModal 
 *   playlistId="37i9dQZF1DXcBWIGoYBM5M" 
 *   theme="dark"
 * />
 * ```
 */

interface SpotifyModalProps {
  /** Spotify playlist ID (from playlist URL) */
  playlistId?: string;
  /** Spotify track ID (from track URL) */
  trackId?: string;
  /** Spotify album ID (from album URL) */
  albumId?: string;
  /** Theme: 'dark' or 'light' */
  theme?: 'dark' | 'light';
  /** Height of the embed (default: 380) */
  height?: number;
  /** Position of the floating button */
  position?: 'bottom-left' | 'bottom-right';
  /** Custom Spotify embed URL (overrides other props) */
  customUrl?: string;
}

/**
 * Build Spotify embed URL from different content types
 */
function buildSpotifyUrl(props: SpotifyModalProps): string {
  const { playlistId, trackId, albumId, theme = 'dark', customUrl } = props;
  
  if (customUrl) return customUrl;
  
  const baseUrl = 'https://open.spotify.com/embed';
  const themeParam = theme === 'dark' ? '?theme=0' : '';
  
  if (trackId) {
    return `${baseUrl}/track/${trackId}${themeParam}`;
  }
  
  if (albumId) {
    return `${baseUrl}/album/${albumId}${themeParam}`;
  }
  
  if (playlistId) {
    return `${baseUrl}/playlist/${playlistId}${themeParam}`;
  }
  
  // Default: Today's Top Hits
  return `${baseUrl}/playlist/37i9dQZF1DXcBWIGoYBM5M${themeParam}`;
}

export function SpotifyModal({
  playlistId,
  trackId,
  albumId,
  theme = 'dark',
  height = 380,
  position = 'bottom-left',
  customUrl,
}: SpotifyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { playClick, playHover, enabled, setEnabled } = useSoundEffects(0.2);

  const embedUrl = buildSpotifyUrl({ playlistId, trackId, albumId, theme, customUrl });

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    playClick();
    setIsOpen(true);
  }, [playClick]);

  const handleClose = useCallback(() => {
    playClick();
    setIsOpen(false);
    setIsLoaded(false);
  }, [playClick]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    setEnabled(!enabled);
  }, [isMuted, enabled, setEnabled]);

  const positionClasses = position === 'bottom-left' 
    ? 'left-6 bottom-6' 
    : 'right-6 bottom-6';

  return (
    <>
      {/* Floating Music Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={handleOpen}
        onMouseEnter={playHover}
        className={`fixed ${positionClasses} z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1ed760] shadow-lg shadow-[#1DB954]/30 flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 group`}
        aria-label="Open Spotify Player"
      >
        <Music className="w-6 h-6 group-hover:animate-pulse" />
        
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#1DB954] animate-ping opacity-20" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg">Spotify Player</h3>
                      <p className="text-xs text-muted-foreground">Listen while you explore</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Sound Toggle */}
                    <button
                      onClick={toggleMute}
                      onMouseEnter={playHover}
                      className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    
                    {/* Close Button */}
                    <button
                      onClick={handleClose}
                      onMouseEnter={playHover}
                      className="w-9 h-9 rounded-full bg-muted/50 hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Close player"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Spotify Embed */}
                <div className="relative" style={{ height }}>
                  {/* Loading skeleton */}
                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-[#1DB954] border-t-transparent animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading Spotify...</span>
                      </div>
                    </div>
                  )}
                  
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height={height}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    title="Spotify Player"
                  />
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border/50 bg-muted/20">
                  <p className="text-xs text-center text-muted-foreground">
                    Powered by{' '}
                    <a 
                      href="https://spotify.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1DB954] hover:underline"
                    >
                      Spotify
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default SpotifyModal;
