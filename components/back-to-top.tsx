'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSoundEffects } from '@/hooks/use-sound';

/**
 * BackToTop Component
 * 
 * A floating button that appears when user scrolls down and scrolls back to top when clicked.
 * Features smooth animation and sound effects.
 * 
 * @example
 * ```tsx
 * // In your layout or page
 * <BackToTop />
 * ```
 */

interface BackToTopProps {
  /** Scroll threshold to show the button (in pixels). Default: 400 */
  threshold?: number;
  /** Position of the button. Default: 'bottom-right' */
  position?: 'bottom-left' | 'bottom-right';
  /** Smooth scroll behavior. Default: true */
  smooth?: boolean;
  /** Show progress ring. Default: true */
  showProgress?: boolean;
}

export function BackToTop({
  threshold = 400,
  position = 'bottom-right',
  smooth = true,
  showProgress = true,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { playHover, playClick } = useSoundEffects(0.15);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      
      setIsVisible(scrollY > threshold);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    playClick();
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [smooth, playClick]);

  const positionClasses = position === 'bottom-left' 
    ? 'left-6 bottom-24' // Above Spotify button
    : 'right-6 bottom-6';

  // SVG circle properties for progress ring
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={scrollToTop}
          onMouseEnter={playHover}
          className={`fixed ${positionClasses} z-40 w-12 h-12 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center transition-all duration-200 hover:scale-110 group`}
          aria-label="Back to top"
        >
          {/* Progress ring */}
          {showProgress && (
            <svg
              className="absolute inset-0 -rotate-90"
              width={size}
              height={size}
            >
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="opacity-20"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
            </svg>
          )}
          
          {/* Arrow icon */}
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
