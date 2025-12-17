'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Animation variant types for theme transition
 */
export type AnimationVariant = 'circle' | 'rectangle' | 'gif' | 'polygon' | 'circle-blur';

/**
 * Animation start position types
 */
export type AnimationStart =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'top-center'
  | 'bottom-center'
  | 'bottom-up'
  | 'top-down'
  | 'left-right'
  | 'right-left';

interface AnimatedThemeToggleProps {
  /** Animation variant. Default: 'rectangle' */
  variant?: AnimationVariant;
  /** Animation start position. Default: 'bottom-up' */
  start?: AnimationStart;
  /** Enable blur effect. Default: false */
  blur?: boolean;
  /** Custom GIF URL for 'gif' variant */
  gifUrl?: string;
  /** Additional className */
  className?: string;
  /** Button size - width. Default: 56 */
  width?: number;
  /** Button size - height. Default: 32 */
  height?: number;
}

/**
 * Custom hook for animated theme toggle with View Transitions API
 */
export function useAnimatedThemeToggle({
  variant = 'rectangle',
  start = 'bottom-up',
  blur = false,
  gifUrl = '',
}: Omit<AnimatedThemeToggleProps, 'className' | 'width' | 'height'> = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const styleId = 'theme-transition-styles';

  const updateStyles = useCallback((css: string) => {
    if (typeof window === 'undefined') return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    const animation = createAnimation(variant, start, blur, gifUrl);
    updateStyles(animation.css);

    if (typeof window === 'undefined') return;

    const switchTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Use View Transitions API if available
    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme, variant, start, blur, gifUrl, updateStyles]);

  return { isDark, mounted, toggleTheme };
}

/**
 * Animated Theme Toggle - Smooth Slide Toggle
 * 
 * A beautiful theme toggle button with View Transitions API support
 * and smooth slide animation between light/dark mode.
 * 
 * @example
 * ```tsx
 * <AnimatedThemeToggle variant="rectangle" start="bottom-up" />
 * ```
 */
export const AnimatedThemeToggle = memo(function AnimatedThemeToggle({
  variant = 'rectangle',
  start = 'bottom-up',
  blur = false,
  gifUrl = '',
  className = '',
  width = 56,
  height = 32,
}: AnimatedThemeToggleProps) {
  const { isDark, mounted, toggleTheme } = useAnimatedThemeToggle({
    variant,
    start,
    blur,
    gifUrl,
  });

  if (!mounted) {
    return (
      <div 
        className="rounded-full bg-muted animate-pulse" 
        style={{ width, height }}
      />
    );
  }

  const knobSize = height - 8; // 4px padding on each side

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative rounded-full p-1 transition-colors duration-300',
        'bg-gradient-to-r',
        isDark 
          ? 'from-slate-700 to-slate-800' 
          : 'from-amber-100 to-orange-200',
        'hover:opacity-90 active:scale-95 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      style={{ width, height }}
      aria-label="Toggle theme"
    >
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className={cn(
          'w-3.5 h-3.5 transition-opacity duration-300',
          isDark ? 'opacity-30 text-yellow-500' : 'opacity-0'
        )} />
        <Moon className={cn(
          'w-3.5 h-3.5 transition-opacity duration-300',
          isDark ? 'opacity-0' : 'opacity-30 text-slate-400'
        )} />
      </div>

      {/* Sliding knob */}
      <motion.div
        className={cn(
          'absolute top-1 rounded-full shadow-md flex items-center justify-center',
          isDark 
            ? 'bg-slate-900' 
            : 'bg-white'
        )}
        style={{ width: knobSize, height: knobSize }}
        initial={false}
        animate={{
          x: isDark ? width - knobSize - 8 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-violet-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </motion.div>
    </button>
  );
});

// ========== Animation Utilities ==========

interface Animation {
  name: string;
  css: string;
}

const getPositionCoords = (position: AnimationStart) => {
  const positions: Record<AnimationStart, { cx: string; cy: string }> = {
    'top-left': { cx: '0', cy: '0' },
    'top-right': { cx: '40', cy: '0' },
    'bottom-left': { cx: '0', cy: '40' },
    'bottom-right': { cx: '40', cy: '40' },
    'top-center': { cx: '20', cy: '0' },
    'bottom-center': { cx: '20', cy: '40' },
    'center': { cx: '20', cy: '20' },
    'bottom-up': { cx: '20', cy: '20' },
    'top-down': { cx: '20', cy: '20' },
    'left-right': { cx: '20', cy: '20' },
    'right-left': { cx: '20', cy: '20' },
  };
  return positions[position];
};

const getTransformOrigin = (start: AnimationStart) => {
  const origins: Record<AnimationStart, string> = {
    'top-left': 'top left',
    'top-right': 'top right',
    'bottom-left': 'bottom left',
    'bottom-right': 'bottom right',
    'top-center': 'top center',
    'bottom-center': 'bottom center',
    'center': 'center',
    'bottom-up': 'center bottom',
    'top-down': 'center top',
    'left-right': 'left center',
    'right-left': 'right center',
  };
  return origins[start];
};

const generateSVG = (variant: AnimationVariant, start: AnimationStart) => {
  const { cx, cy } = getPositionCoords(start);

  if (variant === 'circle-blur') {
    if (start === 'center') {
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>`;
    }
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;
  }

  if (variant === 'circle') {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="20" fill="white"/></svg>`;
  }

  return '';
};

const getClipPath = (direction: AnimationStart) => {
  const clips: Record<string, { from: string; to: string }> = {
    'bottom-up': {
      from: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    'top-down': {
      from: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    'left-right': {
      from: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
    'right-left': {
      from: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    },
  };
  return clips[direction] || clips['bottom-up'];
};

export function createAnimation(
  variant: AnimationVariant,
  start: AnimationStart = 'center',
  blur = false,
  url?: string
): Animation {
  const svg = generateSVG(variant, start);
  const transformOrigin = getTransformOrigin(start);

  // Rectangle variant uses clip-path
  if (variant === 'rectangle') {
    const clipPath = getClipPath(start);
    return {
      name: 'rectangle-transition',
      css: `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-new(root) {
          clip-path: ${clipPath.from};
          animation: rectangle-reveal 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes rectangle-reveal {
          from { clip-path: ${clipPath.from}; }
          to { clip-path: ${clipPath.to}; }
        }
      `,
    };
  }

  // GIF variant
  if (variant === 'gif' && url) {
    return {
      name: 'gif-transition',
      css: `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-new(root) {
          mask-image: url('${url}');
          mask-size: cover;
          mask-position: center;
          animation: gif-reveal 1s ease-out forwards;
        }
        @keyframes gif-reveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
    };
  }

  // Circle and polygon variants use mask-image
  const blurFilter = blur ? 'filter: blur(4px);' : '';
  
  return {
    name: `${variant}-transition`,
    css: `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        mask-image: url('${svg}');
        mask-repeat: no-repeat;
        mask-position: ${transformOrigin};
        transform-origin: ${transformOrigin};
        animation: scale-reveal 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        ${blurFilter}
      }
      @keyframes scale-reveal {
        from { mask-size: 0% 0%; }
        to { mask-size: 300% 300%; }
      }
    `,
  };
}

export default AnimatedThemeToggle;
