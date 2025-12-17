'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress Component
 * 
 * A horizontal progress bar at the top of the page that shows scroll progress.
 * Uses Framer Motion for smooth animations.
 * 
 * @example
 * ```tsx
 * // In your layout or page
 * <ScrollProgress />
 * ```
 */

interface ScrollProgressProps {
  /** Color of the progress bar. Default: primary gradient */
  color?: string;
  /** Height of the progress bar in pixels. Default: 3 */
  height?: number;
  /** Position: 'top' or 'bottom'. Default: 'top' */
  position?: 'top' | 'bottom';
  /** Show percentage text. Default: false */
  showPercentage?: boolean;
  /** Z-index. Default: 50 */
  zIndex?: number;
}

export function ScrollProgress({
  color,
  height = 3,
  position = 'top',
  showPercentage = false,
  zIndex = 50,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';
  const defaultGradient = 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500';

  return (
    <>
      <motion.div
        className={`fixed left-0 right-0 ${positionClass} origin-left`}
        style={{
          scaleX,
          height,
          zIndex,
          background: color || undefined,
        }}
      >
        {!color && (
          <div className={`w-full h-full ${defaultGradient}`} />
        )}
      </motion.div>
      
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: percentage > 5 ? 1 : 0 }}
          className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-mono`}
          style={{ zIndex }}
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
}

export default ScrollProgress;
